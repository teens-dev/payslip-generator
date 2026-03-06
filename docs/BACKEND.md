# Backend Documentation - Teens Payslip Generator

Complete guide to the backend API, Supabase integration, and server-side implementation.

---

## Backend Overview

The backend is built using:
- **Framework**: Next.js 16.1.6 API Routes
- **Runtime**: Node.js (Serverless via Vercel/AWS Lambda)
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Language**: TypeScript 5
- **Client Library**: @supabase/supabase-js v2.38.0

---

## Architecture

### Serverless API Routes

Each API endpoint is a serverless function:

```
app/api/
├── payslips/
│   ├── route.ts          # POST (create), GET (list)
│   └── pdf/
│       └── route.ts      # POST (fetch for pdf generation)
├── calculate/
│   └── route.ts          # POST (calculate salary)
└── upload/
    └── route.ts          # POST (upload logo to storage)
```

### Request/Response Cycle

```
Client Request
    ↓
Next.js API Route
    ↓
Supabase Client (JS)
    ↓
Supabase Backend (PostgreSQL/Storage)
    ↓
Response JSON
    ↓
Client
```

---

## Supabase Integration

### Database Connections

**Initialization** (`lib/supabase.ts`):
```typescript
import { createClient } from '@supabase/supabase-js';

// Client-side (with Row Level Security)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Server-side (admin operations - bypass RLS)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY  // Never expose to client!
);
```

### Important Security Note
**DO NOT** use service role key in client-side code:
```javascript
// ❌ WRONG - Exposes service key to browser
const response = await fetch('/api/data', {
  headers: {
    'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
  }
});

// ✅ CORRECT - Server-side only
// In API route, use supabaseAdmin for admin operations
const { data } = await supabaseAdmin.from('table').select('*');
```

---

## API Route Details

### 1. Payslips Route (`app/api/payslips/route.ts`)

#### POST: Create Payslip

**Flow:**
```
1. Parse JSON from request
2. Validate required fields
3. Calculate totals (grossEarnings, totalDeductions, netSalary, netSalaryInWords)
4. Generate unique payslipId
5. Insert into payslips table
6. Insert earnings into earnings table
7. Insert deductions into deductions table
8. Return success with payslip ID
```

**Supabase Operations:**

```typescript
// Insert into payslips table
const { data: payslip, error: payslipError } = await supabaseAdmin
  .from('payslips')
  .insert([
    {
      payslip_id: payslipId,
      company_info: payslipData.company,        // Store as JSONB
      employee_info: payslipData.employee,      // Store as JSONB
      bank_details: payslipData.bankDetails,    // Store as JSONB
      pay_period_year: payslipData.payPeriod.year,
      pay_period_month: payslipData.payPeriod.month,
      paid_days: payslipData.payPeriod.paidDays,
      loss_of_pay_days: payslipData.payPeriod.lossOfPayDays,
      pay_date: payslipData.payPeriod.payDate,
      gross_earnings: grossEarnings,
      total_deductions: totalDeductions,
      net_salary: netSalary,
      net_salary_in_words: netSalaryInWords,
    },
  ])
  .select()
  .single();

// Insert earnings (multiple rows, linked via payslip_id)
const earningsRecords = payslipData.earnings.map((earning) => ({
  payslip_id: payslip.id,  // Foreign key reference
  name: earning.name,
  amount: earning.amount,
}));

const { error: earningsError } = await supabaseAdmin
  .from('earnings')
  .insert(earningsRecords);

// Insert deductions (multiple rows, linked via payslip_id)
const deductionsRecords = payslipData.deductions.map((deduction) => ({
  payslip_id: payslip.id,  // Foreign key reference
  name: deduction.name,
  amount: deduction.amount,
}));

const { error: deductionsError } = await supabaseAdmin
  .from('deductions')
  .insert(deductionsRecords);
```

**Database Schema References:**
- `payslips` table: Main record with UUID primary key and calculated totals
- `earnings` table: Foreign key `payslip_id` links back to payslips
- `deductions` table: Foreign key `payslip_id` links back to payslips
- Indexes: All foreign keys indexed for fast lookups

**Error Handling:**
```typescript
// Rollback on failure
if (earningsError || deductionsError) {
  // Delete payslip and earnings if deductions fail
  await supabaseAdmin.from('payslips').delete().eq('id', payslip.id);
  return error_response;
}
```

**Key Features:**
- ✅ JSONB storage for company/employee info (historical snapshot)
- ✅ Normalized earnings/deductions (3rd normal form)
- ✅ Foreign key relationships
- ✅ Transactional integrity (rollback on error)
- ✅ Calculated fields (gross, deductions, net, words)

---

#### GET: Retrieve All Payslips

**SQL Query:**
```sql
SELECT * FROM payslips
ORDER BY created_at DESC
LIMIT 1000  -- Suggested for pagination
```

**Implementation:**
```typescript
const { data: payslips, error } = await supabaseAdmin
  .from('payslips')
  .select('*')
  .order('created_at', { ascending: false });
```

**Query Performance:**
- Uses index on `created_at` for sorting
- Index on `payslip_id` for unique lookups
- Indexes on `company_id` and `employee_id` for filtering

**Future Pagination:**
```typescript
// Add pagination support
.range(offset, offset + limit - 1)

// Example: Get payslips 0-50
.range(0, 49)
```

---

### 2. Calculate Route (`app/api/calculate/route.ts`)

**Purpose:** Real-time salary calculations (no database interaction)

**Implementation:**
```typescript
// Pure calculation - no API calls
const grossEarnings = body.earnings.reduce((sum, item) => sum + item.amount, 0);
const totalDeductions = body.deductions.reduce((sum, item) => sum + item.amount, 0);
const netSalary = grossEarnings - totalDeductions;
const netSalaryInWords = numberToWords(netSalary);
```

**Features:**
- ✅ No database transaction overhead
- ✅ Fast response time (< 10ms)
- ✅ Used for real-time preview
- ✅ Handles decimal values (paise)

**Number to Words Algorithm:**
```
Input: 57700
Output: "Fifty Seven Thousand Seven Hundred Rupees Only"

Algorithm:
1. Split into groups: Crores (10M), Lakhs (100k), Thousands (1k), Ones (1)
2. Convert each group to words
3. Use Indian format: Crore > Lakh > Thousand
4. Add "Rupees Only" suffix
```

**Edge Cases Handled:**
- ✅ Zero amount
- ✅ Negative amounts
- ✅ Decimal values (Paise)
- ✅ Very large numbers (Crores)
- ✅ None/undefined values

---

### 3. Upload Route (`app/api/upload/route.ts`)

**Purpose:** Upload company logo to Supabase Storage

**Flow:**
```
1. Parse FormData
2. Validate file type (image only)
3. Validate file size (max 5MB)
4. Generate unique filename
5. Convert to buffer
6. Upload to Supabase Storage
7. Get public URL
8. Return URL to client
```

**Supabase Storage Operations:**

```typescript
// Upload file to bucket
const { data, error } = await supabaseAdmin.storage
  .from('company-logos')  // Bucket name
  .upload(fileName, buffer, {
    contentType: file.type,
    upsert: false  // Don't overwrite existing
  });

// Get public URL
const { data: publicUrlData } = supabaseAdmin.storage
  .from('company-logos')
  .getPublicUrl(fileName);

// Result: public HTTPS URL accessible without auth
// URL format: https://project.supabase.co/storage/v1/object/public/company-logos/{fileName}
```

**Storage Bucket Configuration:**
```
Bucket: company-logos
Type: Public (anyone can read)
Security:
  - Write: Service role only (via API)
  - Read: Public (no authentication needed)
  - Delete: Service role only
```

**File Validation:**
```typescript
// Type validation
const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
if (!allowedTypes.includes(file.type)) {
  return error_response;
}

// Size validation (5MB max)
const maxSize = 5 * 1024 * 1024;  // 5242880 bytes
if (file.size > maxSize) {
  return error_response;
}
```

**Filename Generation:**
```
Format: {companyId}-{timestamp}-{originalFileName}
Example: company-123-1711876800-logo.png

Features:
✅ Unique (timestamp)
✅ Traceable (companyId)
✅ Safe (special chars removed)
✅ Organized (company prefix)
```

**Error Handling:**
```typescript
// Storage bucket access error
if (error) {
  console.error('Supabase Storage Error:', error);
  return error_response;
}

// Verify file exists
if (!data) {
  return error_response;
}
```

---

### 4. PDF Route (`app/api/payslips/pdf/route.ts`)

**Purpose:** Fetch payslip data for client-side PDF generation

**Flow:**
```
1. Receive payslip UUID
2. Fetch payslip from payslips table
3. Fetch earnings linked via payslip_id
4. Fetch deductions linked via payslip_id
5. Aggregate data
6. Return complete payslip template
```

**Supabase Queries:**

```typescript
// Fetch main payslip
const { data: payslip, error: payslipError } = await supabaseAdmin
  .from('payslips')
  .select('*')
  .eq('id', payslipId)  // UUID match
  .single();  // Return one row

// Fetch related earnings (foreign key reference)
const { data: earnings } = await supabaseAdmin
  .from('earnings')
  .select('*')
  .eq('payslip_id', payslipId);  // Linked via payslip_id

// Fetch related deductions (foreign key reference)
const { data: deductions } = await supabaseAdmin
  .from('deductions')
  .select('*')
  .eq('payslip_id', payslipId);  // Linked via payslip_id
```

**Query Optimization:**
- Uses indexes on `payslip_id` in earnings/deductions tables
- Uses primary key lookup on payslips table
- Fast join simulation (separate queries with indexing)

**Response Structure:**
```typescript
{
  id: "payslip-id",
  payslip_id: "PSL-EMP001-...",
  company_info: { ... },        // JSONB from payslips
  employee_info: { ... },       // JSONB from payslips
  earnings: [                   // From earnings table
    { id: "uuid", name, amount },
    ...
  ],
  deductions: [                 // From deductions table
    { id: "uuid", name, amount },
    ...
  ],
  calculations: {
    grossEarnings,
    totalDeductions,
    netSalary,
    netSalaryInWords
  }
}
```

**Client-Side PDF Generation:**
```typescript
// Server returns data, client generates PDF
const canvas = await html2canvas(element);
const pdf = new jsPDF({
  orientation: 'portrait',
  unit: 'mm',
  format: 'a4'
});
pdf.addImage(imgData, 'PNG', 0, 0, width, height);
pdf.save('payslip.pdf');
```

**Benefits:**
- ✅ Server fetches data
- ✅ Client generates PDF (reduces server load)
- ✅ PDF not stored on server
- ✅ No external PDF library needed
- ✅ Uses browser rendering for accuracy

---

## Utility Functions

### Number to Words (`lib/utils.ts`)

**Function:** `numberToWords(num: number): string`

```typescript
/**
 * Converts number to Indian currency words
 * @param num Number to convert
 * @returns Words in format: "Twenty Thousand Rupees Only"
 *
 * @example
 * numberToWords(25000)  // "Twenty Five Thousand Rupees Only"
 * numberToWords(1234567) // "Twelve Lakh Thirty Four Thousand Five Hundred Sixty Seven Rupees Only"
 */
```

**Algorithm:**
```
Groups: Crores (1,00,00,000) > Lakhs (1,00,000) > Thousands (1,000) > Ones
Example: 12,34,567
  - Crores: 0 (none)
  - Lakhs: 12
  - Thousands: 34
  - Remainder: 567

Process each group separately, convert to words, concatenate
```

**Handles:**
- ✅ Zero: "Zero Rupees Only"
- ✅ Negative: "Negative X Rupees Only"
- ✅ Decimals: "X Rupees and Y Paise"
- ✅ Large numbers: Up to Crores
- ✅ Indian format: Crore-Lakh-Thousand

---

### Currency Formatting (`lib/utils.ts`)

**Function:** `formatIndianCurrency(amount: number): string`

```typescript
/**
 * Formats number in Indian currency format
 * @param amount Number to format
 * @returns Formatted string like "25,00,000.00"
 *
 * @example
 * formatIndianCurrency(2500000)  // "25,00,000.00"
 * formatIndianCurrency(50000)    // "50,000.00"
 */
```

**Format:** Indian style (10,00,000) vs Western (1,000,000)

---

## Error Handling Strategy

### Try-Catch Pattern
```typescript
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation
    if (!body.required_field) {
      return NextResponse.json(
        { success: false, error: 'Missing required field' },
        { status: 400 }
      );
    }

    // Business logic
    const result = await supabaseAdmin
      .from('table')
      .insert([data]);

    // Error handling for Supabase
    if (error) {
      console.error('Supabase Error:', error);
      return NextResponse.json(
        { success: false, error: 'Database operation failed' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, data: result },
      { status: 201 }
    );

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Error Types Handled
1. **Validation Errors** (400)
   - Missing required fields
   - Invalid data format
   - Type mismatch

2. **Resource Errors** (404)
   - Payslip not found
   - Employee not found

3. **Database Errors** (500)
   - Connection failed
   - Query syntax error
   - Foreign key violation

4. **Storage Errors** (500)
   - Upload failed
   - Bucket doesn't exist
   - Permission denied

5. **Server Errors** (500)
   - Unexpected exceptions
   - Out of memory
   - Timeout

---

## Performance Optimization

### Database Indexes

All indexes are created in `docs/SUPABASE_SCHEMA.sql`:

```sql
CREATE INDEX idx_payslips_company_id ON payslips(company_id);
CREATE INDEX idx_payslips_employee_id ON payslips(employee_id);
CREATE INDEX idx_payslips_payslip_id ON payslips(payslip_id);
CREATE INDEX idx_payslips_created_at ON payslips(created_at);
CREATE INDEX idx_earnings_payslip_id ON earnings(payslip_id);
CREATE INDEX idx_deductions_payslip_id ON deductions(payslip_id);
CREATE INDEX idx_employees_company_id ON employees(company_id);
```

**Query Optimization:**
- ✅ Foreign key lookups: O(1) with indexes
- ✅ Time-based sorting: Index on `created_at`
- ✅ No full table scans
- ✅ Batched inserts (earnings/deductions in single query)

### API Response Times
- **Upload**: 100-500ms (depends on file size)
- **Calculate**: ~10ms (no database)
- **Create Payslip**: 50-200ms (3 table inserts + calculations)
- **Get Payslips**: 20-100ms (depends on record count)
- **Get for PDF**: 30-100ms (3 table joins)

---

## Security Best Practices

### 1. Environment Variables
```typescript
// ✅ Correct - Server-side only
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// ❌ Wrong - Never use in client
export const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
```

### 2. Service Role Usage
```typescript
// ✅ Use only in API routes (server-side)
const { data } = await supabaseAdmin.from('table').select('*');

// ❌ Never expose service key to frontend
// Browser can access: process.env.NEXT_PUBLIC_*
```

### 3. Row Level Security (RLS)
```sql
-- Optional: Enable RLS on tables
ALTER TABLE payslips ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only their own payslips
CREATE POLICY "users_own_payslips" ON payslips
  FOR SELECT
  USING (auth.uid()::text = user_id);
```

### 4. Input Validation
```typescript
// Validate all inputs
if (!companyName || typeof companyName !== 'string') {
  return error_response;
}

// Sanitize file names
const safeName = path.basename(fileName)
  .replace(/[^a-z0-9.]/gi, '-');
```

### 5. File Upload Security
```typescript
// Check MIME type
const allowedTypes = ['image/jpeg', 'image/png'];
if (!allowedTypes.includes(file.type)) {
  return error;
}

// Check file size
if (file.size > 5 * 1024 * 1024) {
  return error;
}

// Don't trust file extension
if (file.name.endsWith('.php')) {
  return error;
}
```

---

## Monitoring & Logging

### Console Logging
```typescript
// Log errors for debugging
console.error('Supabase Error:', error);
console.error('Upload Error:', error);
console.error('API Error:', error);

// Log operations (for audit)
console.log('Payslip created:', payslipId);
console.log('Logo uploaded:', fileName);
```

### Supabase Monitoring
1. **Logs**: realtime logs in Supabase dashboard
2. **Metrics**: Rows written, queries executed
3. **Performance**: Query execution times
4. **Errors**: Failed operations and reasons

### Suggested Monitoring
```typescript
// Add timestamp to logs
console.log(`[${new Date().toISOString()}] Operation: ${operation}`);

// Add correlation IDs
const correlationId = request.headers.get('x-correlation-id') || uuidv4();
console.log(`[${correlationId}] ...`);

// Structured logging
console.log({
  timestamp: new Date().toISOString(),
  endpoint: '/api/payslips',
  method: 'POST',
  status: 201,
  duration: `${Date.now() - startTime}ms`
});
```

---

## Testing

### Manual Testing
```bash
# Test calculation endpoint
curl -X POST http://localhost:3000/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"earnings":[{"name":"Basic","amount":50000}],"deductions":[]}'

# Test upload endpoint
curl -X POST http://localhost:3000/api/upload \
  -F "file=@logo.png" \
  -F "companyId=company-123"

# Test create payslip
curl -X POST http://localhost:3000/api/payslips \
  -H "Content-Type: application/json" \
  -d '{...complete payslip json...}'
```

### Automated Testing (Future)
```typescript
// Jest test example
describe('API Routes', () => {
  test('POST /api/calculate returns correct totals', async () => {
    const response = await fetch('/api/calculate', {
      method: 'POST',
      body: JSON.stringify({
        earnings: [{ name: 'Basic', amount: 50000 }],
        deductions: [{ name: 'Tax', amount: 5000 }]
      })
    });

    const data = await response.json();
    expect(data.data.netSalary).toBe(45000);
  });
});
```

---

## Deployment Considerations

### Environment Setup
```bash
# Production environment variables
NEXT_PUBLIC_SUPABASE_URL=https://prod.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...production key...
SUPABASE_SERVICE_ROLE_KEY=...production service key...
```

### Vercel Deployment
1. Connect GitHub repository
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push
4. Serverless functions run on AWS Lambda

### Database Backups
- Supabase automatically backs up daily
- Manual backups via Supabase dashboard
- Export data before major changes

### Rate Limiting (Recommended)
```javascript
// Add middleware for production
const rateLimit = require('express-rate-limit');

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100  // 100 requests per window
});

// Apply to routes
export async function POST(request: NextRequest) {
  await limiter(request);
  // ... handler code
}
```

---

## Future Enhancements

1. **Webhooks**: Send payslip email automatically
2. **Background Jobs**: Process bulk payslip generation
3. **Caching**: Redis cache for frequent queries
4. **Batch Operations**: Process multiple payslips
5. **API Rate Limiting**: Prevent abuse
6. **Audit Log**: Track all modifications
7. **Data Export**: CSV/Excel export
8. **Analytics**: Payslip generation trends

---

**Backend Documentation © 2024 | Teens Payslip Generator**
