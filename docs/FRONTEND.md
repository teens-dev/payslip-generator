# Frontend Documentation - Teens Payslip Generator

Complete guide to the frontend components, UI architecture, and user interface.

---

## Frontend Overview

The frontend is built with:
- **Framework**: Next.js 16.1.6 (React 19.2.3)
- **Styling**: Tailwind CSS 4
- **Form Handling**: React Hooks (useState, useRef)
- **PDF Generation**: html2canvas + jsPDF (client-side)
- **Type Safety**: TypeScript 5

---

##  Component Architecture

### Component Tree

```
App (page.tsx)
├── CompanyForm
│   └── InputField x 8
├── EmployeeForm
│   └── InputField x 4
├── PayPeriodForm
│   ├── InputField x 3
│   └── Select (month)
├── EarningsDeductionsForm
│   ├── EarningRow (multiple)
│   │   ├── InputField (amount)
│   │   └── Button (remove)
│   ├── Button (add earning)
│   ├── DeductionRow (multiple)
│   │   ├── InputField (amount)
│   │   └── Button (remove)
│   └── Button (add deduction)
├── BankDetailsForm (collapsible)
│   └── InputField x 6
├── PayslipPreview
│   ├── Company Logo & Header
│   ├── Employee Info
│   ├── Earnings Table
│   ├── Deductions Table
│   └── Summary & Bank Details
└── Button x 4 (actions)
```

---

## Core Components

### 1. InputField Component

**File:** `components/InputField.tsx`

Reusable text input with label, validation, and error display.

#### Props
```typescript
interface InputFieldProps {
  label: string;           // Field label
  name: string;           // Input name
  type?: string;          // HTML input type (default: 'text')
  value: string;          // Current value
  onChange: (e) => void;  // Change handler
  placeholder?: string;   // Placeholder text
  error?: string;         // Error message
  required?: boolean;     // Show required indicator
  disabled?: boolean;     // Disable input
}
```

#### Usage
```jsx
<InputField
  label="Company Name"
  name="companyName"
  value={company.name}
  onChange={(e) => setCompany({ ...company, name: e.target.value })}
  placeholder="Enter company name"
  error={errors.name}
  required
/>
```

#### Styling
- Responsive width
- Tailwind classes for borders, focus states
- Red border for errors
- Disabled state styling

---

### 2. Button Component

**File:** `components/Button.tsx`

Reusable button with multiple variants and loading state.

#### Props
```typescript
interface ButtonProps {
  label: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}
```

#### Variants
- **primary**: Blue background, white text (main actions)
- **secondary**: Gray background, dark text (secondary actions)
- **danger**: Red background, white text (delete/destructive)

#### Loading State
- Shows spinner animation
- Disables button
- Text changes to "Loading..."

#### Usage
```jsx
<Button
  label="Generate Payslip"
  onClick={handleGenerate}
  variant="primary"
  loading={isLoading}
/>
```

---

### 3. CompanyForm Component

**File:** `components/CompanyForm.tsx`

Form section for company information including logo upload.

#### Features
- Logo upload to Supabase Storage
- Logo preview thumbnail
- Input validation
- Error handling
- Optional fields (email, phone, GST, PAN)

#### Props
```typescript
interface CompanyFormProps {
  data: CompanyInfo;
  onChange: (data: CompanyInfo) => void;
  onLogoUpload?: (url: string) => void;
}
```

#### File Upload Handling
```javascript
// Supabase Integration
const formData = new FormData();
formData.append('file', file);
formData.append('companyId', data.id || '');

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData,
});

const result = await response.json();
// result.data.url contains public Supabase URL
```

#### Validation
- Required: name, address, city, pincode, country
- Optional: email, phone, GST, PAN, logo
- File type: JPEG, PNG, GIF, WebP
- File size: Max 5MB

#### Styling
- Grid layout (1 col mobile, 2 col desktop)
- White card background
- Button for logo upload
- Image preview thumbnail

---

### 4. EmployeeForm Component

**File:** `components/EmployeeForm.tsx`

Form section for employee information.

#### Props
```typescript
interface EmployeeFormProps {
  data: EmployeeInfo;
  onChange: (data: EmployeeInfo) => void;
}
```

#### Fields
- Employee Name (required)
- Employee ID (required, unique within company)
- Designation (required)
- Department (required)
- Date of Joining (required)
- Email (optional)
- Phone (optional)

#### Validation
- Required fields must have values
- Date picker for date of joining
- Email format validation (optional)

#### Styling
- Grid layout (1 col mobile, 2 col desktop)
- Consistent with CompanyForm styling

---

### 5. PayPeriodForm Component

**File:** `components/PayPeriodForm.tsx`

Form section for salary period information.

#### Features
- Month/year selection
- Paid days and loss of pay calculation
- Summary card with period overview
- Date picker for payment date

#### Props
```typescript
interface PayPeriodFormProps {
  data: PayPeriod;
  onChange: (data: PayPeriod) => void;
}
```

#### Summary Card
Shows:
- Pay period (Month/Year)
- Paid days
- Loss of pay days
- Total days calculation

#### Styling
- Blue background for summary
- Month selector dropdown
- Number inputs for days

---

### 6. EarningsDeductionsForm Component

**File:** `components/EarningsDeductionsForm.tsx`

Dynamic form for earnings and deduction components.

#### Features
- Default components pre-filled
- Add custom components
- Remove components
- Real-time amount input
- Two-column layout

#### Default Earnings
- Basic Salary
- House Rent Allowance (HRA)
- Special Allowance
- Bonus
- Overtime Pay

#### Default Deductions
- Income Tax
- Provident Fund (PF)
- ESI

#### Props
```typescript
interface EarningsDeductionsProps {
  earnings: EarningItem[];
  deductions: DeductionItem[];
  onEarningsChange: (earnings: EarningItem[]) => void;
  onDeductionsChange: (deductions: DeductionItem[]) => void;
}
```

#### Adding Items
```javascript
const handleAddEarning = () => {
  const newEarning: EarningItem = {
    id: Date.now().toString(),
    name: newEarningName,
    amount: 0,
  };
  onEarningsChange([...earnings, newEarning]);
};
```

#### Styling
- Two-column grid
- Gray background for items
- Remove button for each item
- Green text for earnings, red for deductions

---

### 7. BankDetailsForm Component

**File:** `components/BankDetailsForm.tsx`

Optional/collapsible form for bank and statutory details.

#### Features
- Collapsible section
- Optional: All fields are optional
- UAN, ESI, PAN, IFSC validation

#### Props
```typescript
interface BankDetailsFormProps {
  data?: BankDetails;
  onChange: (data: BankDetails) => void;
}
```

#### Fields
- Bank Name
- Account Number
- IFSC Code
- UAN Number
- ESI Number
- PAN Number

#### Styling
- Expandable/collapsible with +/- button
- Blue background when expanded
- Optional label on heading

---

### 8. PayslipPreview Component

**File:** `components/PayslipPreview.tsx`

Professional payslip display optimized for PDF/Print.

#### Features
- Company logo display
- Employee information section
- Earnings table with breakdown
- Deductions table with breakdown
- Net salary summary
- Amount in words display
- Bank details (if provided)
- Print-optimized styling

#### Props
```typescript
interface PayslipPreviewProps {
  payslip: PayslipTemplate;
}
```

#### Payslip Structure
```
┌─ Header (Company Logo, Name, "PAYSLIP") ────┐
├─ Employee Info | Pay Period Info ────────────┤
├─ Earnings Table | Deductions Table ──────────┤
├─ Gross Earnings | Total Deductions | Net ────┤
├─ Amount in Words ─────────────────────────────┤
├─ Bank Details (if available) ────────────────┤
└─ Footer (Generated date, "System-generated") ┤
```

#### Styling (Print-Ready)
- A4 paper format
- Black on white (print-friendly)
- Fixed widths and padding
- No shadows or gradients
- Color-coded sections:
  - Green for earnings
  - Red for deductions
  - Blue for summary

#### PDF Export
```javascript
const canvas = await html2canvas(payslipPreviewRef.current, {
  scale: 2,
  useCORS: true,
  allowTaint: true,
});

const pdf = new jsPDF({
  orientation: 'portrait',
  unit: 'mm',
  format: 'a4',
});

pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
pdf.save('payslip.pdf');
```

---

## Main Page Component

**File:** `app/page.tsx`

The main orchestrator component that manages the entire application flow.

### State Variables
```typescript
const [currentStep, setCurrentStep] = useState<'form' | 'preview' | 'success'>('form');
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [successMessage, setSuccessMessage] = useState<string | null>(null);
const [company, setCompany] = useState<CompanyInfo>({...});
const [employee, setEmployee] = useState<EmployeeInfo>({...});
const [payPeriod, setPayPeriod] = useState<PayPeriod>({...});
const [earnings, setEarnings] = useState<EarningItem[]>([]);
const [deductions, setDeductions] = useState<DeductionItem[]>([]);
const [bankDetails, setBankDetails] = useState<BankDetails>({});
const [payslipData, setPayslipData] = useState<PayslipTemplate | null>(null);
```

### Three-Step Flow

#### Step 1: Form Entry
- User fills all form sections
- Real-time validation
- Earnings/deductions management
- Logo upload

#### Step 2: Preview
- Display professional payslip
- Review all calculated data
- Show amount in words
- Preview before saving

#### Step 3: Success
- Show success message
- Offer "Generate Another" button
- Saved to Supabase

### Action Handlers

**handleGeneratePayslip**
```javascript
1. Validate required fields
2. Call /api/calculate endpoint
3. Create PayslipTemplate with calculations
4. Move to preview step
```

**handleSavePayslip**
```javascript
1. Call /api/payslips POST endpoint
2. Send complete data to API
3. API inserts into Supabase tables
4. Show success message
5. Move to success step
```

**handleDownloadPDF**
```javascript
1. Use html2canvas to convert DOM to image
2. Create jsPDF A4 document
3. Add image scaled to page width
4. Download with filename: payslip-{empId}-{payslipId}.pdf
```

**handlePrint**
```javascript
1. Open new window
2. Copy payslip HTML to window
3. Call window.print()
4. User selects printer
```

**handleResetForm**
- Clear all state to initial values
- Return to form step
- Clear errors/messages

---

## Styling & Tailwind Classes

### Color Scheme
- Primary: Blue (#3B82F6)
- Success: Green (#10B981)
- Danger: Red (#EF4444)
- Background: Light Blue (#F0F9FF)
- Text: Dark Gray (#1F2937)

### Responsive Breakpoints
- Mobile: Default (< 640px)
- SM: 640px (small devices)
- MD: 768px (tablets)
- LG: 1024px (desktops)
- XL: 1280px (large screens)

### Common Classes
```css
.bg-gradient-to-br from-blue-50 to-indigo-100  /* Main background */
.max-w-7xl mx-auto                             /* Container */
.grid grid-cols-1 md:grid-cols-2                /* Two-column layout */
.border border-gray-300 rounded-lg               /* Cards */
.focus:ring-2 focus:ring-blue-500                /* Focus state */
.hover:bg-blue-700                              /* Hover state */
```

---

## Form Validation

### Client-Side Validation
```javascript
// Required field validation
if (!company.name.trim()) {
  setErrors({ ...errors, name: 'Company name is required' });
}

// Pattern validation
if (!isValidEmail(email)) {
  setErrors({ ...errors, email: 'Invalid email format' });
}

// Range validation
if (amount < 0) {
  setErrors({ ...errors, amount: 'Amount must be positive' });
}
```

### Validation Functions (lib/utils.ts)
- `isValidEmail(email)` - RFC 5322 simplified
- `isValidPhone(phone)` - 10 digits for India
- `isValidUAN(uan)` - UAN format validation
- `isValidESI(esi)` - ESI format validation

---

## State Management

### Lift State Up Pattern
```javascript
// Parent manages state
const [company, setCompany] = useState<CompanyInfo>(...);

// Pass to child
<CompanyForm data={company} onChange={setCompany} />

// Child updates parent
const handleInputChange = (field, value) => {
  onChange({ ...data, [field]: value });
};
```

### Benefits
- Single source of truth
- Easier to manage complex state
- Easier to save/send complete data

---

## Error Handling

### Error Display
```jsx
{error && (
  <div className="mb-6 p-4 bg-red-100 border border-red-400 rounded">
    <p className="font-semibold">Error:</p>
    <p>{error}</p>
  </div>
)}
```

### Common User Errors
- Missing required fields
- Invalid email/phone format
- No earnings/deductions added
- File upload failed
- Network error

### Error Recovery
1. Display error message
2. Keep form data intact
3. Allow user to fix and retry
4. No automatic redirects

---

## Performance Optimization

### Techniques Used
1. **Code Splitting**: Next.js automatic code splitting
2. **Image Optimization**: Tailwind handles styling
3. **Form Optimization**: useRef for PDF preview element
4. **Memoization**: Can add useMemo/useCallback if needed
5. **Lazy Loading**: Canvas generation done on demand

### Future Improvements
```javascript
// Memoize component to prevent re-renders
const InputField = React.memo(InputFieldComponent);

// Lazy load PDF library
const jsPDF = dynamic(() => import('jspdf'), { ssr: false });

// Debounce form input
const debouncedCalculate = debounce(handleCalculate, 500);
```

---

## Accessibility

### Features
- Proper `<label>` elements for inputs
- ARIA labels on buttons
- Focus indicators (ring-blue-500)
- Color contrast meets WCAG AA
- Keyboard navigation support

#### Improvements Needed
```javascript
// Add ARIA labels
<label htmlFor="companyName" aria-required="true">
  Company Name
</label>

// Add ARIA descriptions
<input aria-describedby="nameError" />
<span id="nameError" role="alert">{error}</span>

// Add skip links
<a href="#main" className="sr-only">Skip to main content</a>
```

---

## Browser Support

Tested on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Features Used
- ES6+ JavaScript
- CSS Grid & Flexbox
- File API
- Canvas API
- Fetch API

---

## Development Workflow

### Adding a New Field
1. Add to TypeScript type in `types/index.ts`
2. Add state variable in component
3. Add InputField in form component
4. Add to onChange handler
5. Add validation
6. Add to API payload

### Adding a New Component
1. Create in `components/` directory
2. Define TypeScript props interface
3. Use Tailwind for styling
4. Add to parent component
5. Import and integrate

### Testing Components
```bash
# Run development server
npm run dev

# Test in browser at http://localhost:3000
# Use React DevTools for debugging
# Check console for errors
```

---

## Debugging Tips

### Browser DevTools
1. Inspect element for Tailwind classes
2. Elements tab to check DOM structure
3. Network tab to verify API calls
4. Console for JavaScript errors
5. React DevTools for component state

### Common Issues
- **Form not updating**: Check onChange handler
- **Styles not applied**: Check Tailwind class names
- **Upload failing**: Check file size and type
- **PDF blank**: Check html2canvas CORS settings

### Debugging Code
```javascript
// Debug state changes
console.log('Company updated:', company);

// Debug API calls
console.log('Request payload:', {company, employee, ...});

// Debug calculations
console.log('Gross earnings:', grossEarnings);
console.log('Net salary:', netSalary);
```

---

## Future Enhancements

1. **Dark Mode**: Toggle theme preference
2. **Multi-language**: i18n support for multiple languages
3. **Advanced Filters**: Search/filter payslip history
4. **Bulk Operations**: Generate multiple payslips
5. **Email Integration**: Send payslips via email
6. **Analytics**: Payslip generation analytics
7. **Custom Templates**: Multiple payslip designs
8. **Audit Log**: Track all changes

---

**Frontend Documentation © 2024 | Teens Payslip Generator**
