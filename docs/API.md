# API Documentation - Teens Payslip Generator

Complete reference for all REST API endpoints and Supabase integration.

## Overview

The API is built using **Next.js API Routes** with full **Supabase** integration for database operations and file storage. All endpoints are serverless functions.

**Base URL:** `http://localhost:3000/api` (development)
**Production:** `https://your-domain.com/api`

---

## Authentication & Security

### Security Model
- **Frontend**: Supabase anonymous key with Row Level Security (RLS)
- **Backend**: Supabase service role key for admin operations
- **Storage**: Public read, authenticated write policies

### Environment Variables (Server-Side Only)
```
SUPABASE_SERVICE_ROLE_KEY  # Server-side only - NEVER expose to client
```

### Public Keys (Client-Side Safe)
```
NEXT_PUBLIC_SUPABASE_URL      # Public - safe to expose
NEXT_PUBLIC_SUPABASE_ANON_KEY  # Public - safe to expose
```

---

## Endpoint Reference

### 1. Create Payslip

**Creates a new payslip and stores all data in Supabase**

#### Request
```http
POST /api/payslips HTTP/1.1
Content-Type: application/json
Host: localhost:3000

{
  "company": {
    "name": "Tech Company Ltd",
    "address": "123 Business Street",
    "city": "New Delhi",
    "pincode": "110001",
    "country": "India",
    "logo": "https://cdn.example.com/logo.png",
    "email": "hr@company.com",
    "phone": "+919876543210",
    "gstNumber": "18AABCT1234K1Z0",
    "panNumber": "AAACR0055K"
  },
  "employee": {
    "name": "John Doe",
    "employeeId": "EMP001",
    "designation": "Senior Developer",
    "department": "Engineering",
    "dateOfJoining": "2022-01-15",
    "email": "john@company.com",
    "phone": "+919123456789"
  },
  "payPeriod": {
    "year": 2024,
    "month": 3,
    "paidDays": 30,
    "lossOfPayDays": 0,
    "payDate": "2024-03-31"
  },
  "earnings": [
    {
      "id": "basic-salary",
      "name": "Basic Salary",
      "amount": 50000
    },
    {
      "id": "hra",
      "name": "House Rent Allowance",
      "amount": 10000
    },
    {
      "id": "special-allowance",
      "name": "Special Allowance",
      "amount": 5000
    }
  ],
  "deductions": [
    {
      "id": "income-tax",
      "name": "Income Tax",
      "amount": 5000
    },
    {
      "id": "pf",
      "name": "Provident Fund",
      "amount": 1800
    },
    {
      "id": "esi",
      "name": "ESI",
      "amount": 500
    }
  ],
  "bankDetails": {
    "bankName": "HDFC Bank",
    "accountNumber": "12345678901234",
    "ifscCode": "HDFC0001234",
    "uanNumber": "AB12345678901",
    "esiNumber": "35AP0000001234",
    "panNumber": "BHPPA1234K"
  }
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "payslipId": "PSL-EMP001-1711876800000",
    "calculations": {
      "grossEarnings": 65000,
      "totalDeductions": 7300,
      "netSalary": 57700,
      "netSalaryInWords": "Fifty Seven Thousand Seven Hundred Rupees Only"
    }
  },
  "message": "Payslip created successfully"
}
```

#### Supabase Operations

**1. Insert into payslips table:**
```sql
INSERT INTO payslips (
  payslip_id,
  company_info,
  employee_info,
  bank_details,
  pay_period_year,
  pay_period_month,
  paid_days,
  loss_of_pay_days,
  pay_date,
  gross_earnings,
  total_deductions,
  net_salary,
  net_salary_in_words
) VALUES (...)
```

**2. Insert into earnings table (linked via payslip_id):**
```sql
INSERT INTO earnings (payslip_id, name, amount)
VALUES
  (uuid, 'Basic Salary', 50000),
  (uuid, 'HRA', 10000),
  (uuid, 'Special Allowance', 5000)
```

**3. Insert into deductions table (linked via payslip_id):**
```sql
INSERT INTO deductions (payslip_id, name, amount)
VALUES
  (uuid, 'Income Tax', 5000),
  (uuid, 'PF', 1800),
  (uuid, 'ESI', 500)
```

#### Error Responses

**400 Bad Request** - Missing required fields
```json
{
  "success": false,
  "error": "Missing required fields: company, employee, or payPeriod"
}
```

**500 Server Error** - Database insertion failed
```json
{
  "success": false,
  "error": "Failed to create payslip"
}
```

#### Implementation Details
- **Auto-transaction**: All tables updated or all rolled back
- **Validation**: Company, employee, payPeriod required
- **Calculation**: Performed before storage
- **Storage**: Supabase with service role key

---

### 2. Get All Payslips

**Retrieves all payslips from database**

#### Request
```http
GET /api/payslips HTTP/1.1
Host: localhost:3000
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "payslip_id": "PSL-EMP001-1711876800000",
      "company_info": {
        "name": "Tech Company Ltd",
        "address": "123 Business Street",
        "city": "New Delhi",
        "pincode": "110001",
        "country": "India"
      },
      "employee_info": {
        "name": "John Doe",
        "employeeId": "EMP001",
        "designation": "Senior Developer",
        "department": "Engineering"
      },
      "pay_period_year": 2024,
      "pay_period_month": 3,
      "paid_days": 30,
      "loss_of_pay_days": 0,
      "gross_earnings": 65000,
      "total_deductions": 7300,
      "net_salary": 57700,
      "net_salary_in_words": "Fifty Seven Thousand Seven Hundred Rupees Only",
      "created_at": "2024-03-31T10:00:00Z",
      "updated_at": "2024-03-31T10:00:00Z"
    }
  ]
}
```

#### Supabase Query
```sql
SELECT * FROM payslips
ORDER BY created_at DESC
```

#### Pagination (Future Enhancement)
Currently returns all records. For production, add:
- `limit` parameter: Records per page
- `offset` parameter: Starting position
- `page` parameter: Page number

---

### 3. Calculate Salary

**Performs real-time salary calculations without database interaction**

#### Request
```http
POST /api/calculate HTTP/1.1
Content-Type: application/json
Host: localhost:3000

{
  "earnings": [
    { "name": "Basic Salary", "amount": 50000 },
    { "name": "HRA", "amount": 10000 },
    { "name": "Special Allowance", "amount": 5000 }
  ],
  "deductions": [
    { "name": "Income Tax", "amount": 5000 },
    { "name": "PF", "amount": 1800 },
    { "name": "ESI", "amount": 500 }
  ]
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "grossEarnings": 65000,
    "totalDeductions": 7300,
    "netSalary": 57700,
    "netSalaryInWords": "Fifty Seven Thousand Seven Hundred Rupees Only"
  },
  "message": "Calculations completed successfully"
}
```

#### Calculation Formula
```
Gross Earnings = SUM(earning.amount for all earnings)
Total Deductions = SUM(deduction.amount for all deductions)
Net Salary = Gross Earnings - Total Deductions
Net Salary in Words = numberToWords(Net Salary)
```

#### Special Features
- **Number to Words**: Converts to Indian format
- **Decimal Support**: Supports paise (decimals)
- **Large Numbers**: Handles Crores and Lakhs

#### Error Responses

**400 Bad Request** - Missing earnings or deductions
```json
{
  "success": false,
  "error": "Missing earnings or deductions"
}
```

#### Implementation Details
- **No Supabase**: Pure calculation logic
- **No Database**: All in-memory processing
- **Real-time**: Used for form preview
- **Validation**: Handles null/zero values

---

### 4. Upload Company Logo

**Uploads image file to Supabase Storage**

#### Request
```http
POST /api/upload HTTP/1.1
Content-Type: multipart/form-data
Host: localhost:3000

Form Data:
- file: [JPEG/PNG/GIF/WebP Image File]
- companyId: "company-123" (optional)
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "url": "https://project.supabase.co/storage/v1/object/public/company-logos/company-123-1711876800-logo.png",
    "path": "company-logos/company-123-1711876800-logo.png",
    "bucket": "company-logos"
  },
  "message": "File uploaded successfully"
}
```

#### Supabase Storage Operations

**1. Upload file to bucket:**
```javascript
const { data, error } = await supabaseAdmin.storage
  .from('company-logos')
  .upload(fileName, buffer, {
    contentType: file.type,
    upsert: false
  });
```

**2. Get public URL:**
```javascript
const { data: publicUrlData } = supabaseAdmin.storage
  .from('company-logos')
  .getPublicUrl(fileName);
```

#### Validation Rules
- **File Types**: JPEG, PNG, GIF, WebP only
- **Max Size**: 5MB (5,242,880 bytes)
- **Bucket**: Public `company-logos`
- **Path Format**: `company-logos/{companyId}-{timestamp}-{filename}`

#### Error Responses

**400 Bad Request** - File validation failed
```json
{
  "success": false,
  "error": "File size exceeds 5MB limit"
}
```

**400 Bad Request** - Invalid file type
```json
{
  "success": false,
  "error": "Only image files are allowed"
}
```

**500 Server Error** - Upload failed
```json
{
  "success": false,
  "error": "File upload failed"
}
```

#### Implementation Details
- **Multipart**: Handles `FormData` with file
- **Validation**: Type and size checked
- **Public URL**: Immediate URL return
- **Storage**: Supabase Storage bucket
- **Error Handling**: Detailed error messages

---

### 5. Get Payslip for PDF

**Retrieves complete payslip data for PDF generation**

#### Request
```http
POST /api/payslips/pdf HTTP/1.1
Content-Type: application/json
Host: localhost:3000

{
  "payslipId": "550e8400-e29b-41d4-a716-446655440000"
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "payslipId": "PSL-EMP001-1711876800000",
    "company_info": { ... },
    "employee_info": { ... },
    "earnings": [
      { "id": "uuid", "name": "Basic Salary", "amount": 50000 }, ...
    ],
    "deductions": [
      { "id": "uuid", "name": "Income Tax", "amount": 5000 }, ...
    ],
    "calculations": {
      "grossEarnings": 65000,
      "totalDeductions": 7300,
      "netSalary": 57700,
      "netSalaryInWords": "Fifty Seven Thousand Seven Hundred Rupees Only"
    }
  },
  "message": "Payslip data retrieved for PDF generation"
}
```

#### Supabase Queries

**1. Fetch payslip:**
```sql
SELECT * FROM payslips WHERE id = 'uuid'
```

**2. Fetch earnings (linked via payslip_id):**
```sql
SELECT * FROM earnings WHERE payslip_id = 'uuid'
```

**3. Fetch deductions (linked via payslip_id):**
```sql
SELECT * FROM deductions WHERE payslip_id = 'uuid'
```

#### PDF Generation (Client-Side)
```javascript
// Server returns data, client generates PDF
const canvas = await html2canvas(element);
const pdf = new jsPDF('portrait', 'mm', 'a4');
pdf.addImage(imgData, 'PNG', 0, 0, width, height);
pdf.save('payslip.pdf');
```

#### Error Responses

**400 Bad Request** - Missing payslipId
```json
{
  "success": false,
  "error": "Payslip ID is required"
}
```

**404 Not Found** - Payslip not found
```json
{
  "success": false,
  "error": "Payslip not found"
}
```

#### Implementation Details
- **Data Aggregation**: Joins payslips + earnings + deductions
- **Foreign Keys**: Uses payslip_id relationships
- **Client Rendering**: PDF generated in browser
- **No File Storage**: PDF not stored on server

---

## Data Models

### Request/Response Objects

#### CompanyInfo
```typescript
{
  id?: string;
  name: string;
  address: string;
  city: string;
  pincode: string;
  country: string;
  logo?: string;  // Public URL from Supabase
  logoBucket?: string;
  email?: string;
  phone?: string;
  gstNumber?: string;
  panNumber?: string;
  registrationNumber?: string;
}
```

#### EmployeeInfo
```typescript
{
  id?: string;
  name: string;
  employeeId: string;
  designation: string;
  department: string;
  dateOfJoining: string;  // YYYY-MM-DD
  email?: string;
  phone?: string;
}
```

#### PayPeriod
```typescript
{
  year: number;
  month: number;  // 1-12
  paidDays: number;
  lossOfPayDays: number;
  payDate: string;  // YYYY-MM-DD
}
```

#### EarningItem / DeductionItem
```typescript
{
  id: string;
  name: string;
  amount: number;
}
```

#### PayslipCalculations
```typescript
{
  grossEarnings: number;
  totalDeductions: number;
  netSalary: number;
  netSalaryInWords: string;
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Meaning | Scenario |
|------|---------|----------|
| 200 | OK | GET/POST successful |
| 201 | Created | New payslip created |
| 400 | Bad Request | Validation failed, missing fields |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Database error, upload error |

### Error Response Format
```json
{
  "success": false,
  "error": "Description of what went wrong"
}
```

### Common Errors

1. **Validation Error**
   - Missing required fields
   - Invalid data format
   - Both earnings and deductions must have at least 1 item

2. **Database Error**
   - Supabase connection failed
   - Foreign key violation
   - Concurrent modification

3. **Storage Error**
   - File upload failed
   - Invalid file type
   - Bucket doesn't exist

---

## Rate Limiting & Quotas

Current implementation has no built-in rate limiting. For production:

```javascript
// Example: Redis-based rate limiting
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100  // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## CORS Configuration

Supabase handles CORS automatically. Origins allowed:
- Development: `http://localhost:3000`
- Production: Your domain in Supabase settings

---

## Testing the API

### Using cURL

**Create Payslip:**
```bash
curl -X POST http://localhost:3000/api/payslips \
  -H "Content-Type: application/json" \
  -d '{...payslip json...}'
```

**Get Payslips:**
```bash
curl http://localhost:3000/api/payslips
```

**Calculate:**
```bash
curl -X POST http://localhost:3000/api/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "earnings": [{"name":"Basic","amount":50000}],
    "deductions": [{"name":"Tax","amount":5000}]
  }'
```

### Using Postman

1. Import collection from repository
2. Set environment variables
3. Run requests with pre-configured payloads

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-03-31 | Initial API release |

---

**API Documentation © 2024 | Teens Payslip Generator**
