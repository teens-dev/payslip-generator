// TypeScript type definitions for the Payslip Generator application
// These types define the structure of data throughout the application

// Company Information
export interface CompanyInfo {
  id?: string;
  name: string;
  address: string;
  city: string;
  pincode: string;
  country: string;
  logo?: string; // URL to company logo stored in Supabase
  logoBucket?: string; // Supabase storage bucket path
  email?: string;
  phone?: string;
  gstNumber?: string;
  panNumber?: string;
  registrationNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Employee Information
export interface EmployeeInfo {
  id?: string;
  name: string;
  employeeId: string;
  designation: string;
  department: string;
  dateOfJoining: string; // YYYY-MM-DD format
  email?: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Bank Details (Optional)
export interface BankDetails {
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  uanNumber?: string;
  esiNumber?: string;
  panNumber?: string;
}

// Earnings Component
export interface EarningItem {
  id: string;
  name: string;
  amount: number;
}

// Deduction Component
export interface DeductionItem {
  id: string;
  name: string;
  amount: number;
}

// Pay Period Information
export interface PayPeriod {
  year: number;
  month: number; // 1-12
  paidDays: number;
  lossOfPayDays: number;
  payDate: string; // YYYY-MM-DD format
}

// Complete Payslip Data
export interface PayslipData {
  id?: string;
  payslipId?: string;
  companyId?: string;
  employeeId?: string;
  company: CompanyInfo;
  employee: EmployeeInfo;
  bankDetails?: BankDetails;
  payPeriod: PayPeriod;
  earnings: EarningItem[];
  deductions: DeductionItem[];
  calculations?: PayslipCalculations;
  createdAt?: string;
  updatedAt?: string;
}

// Payslip Calculations
export interface PayslipCalculations {
  grossEarnings: number;
  totalDeductions: number;
  netSalary: number;
  netSalaryInWords: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Payslip Template Data for PDF Generation
export interface PayslipTemplate extends PayslipData {
  calculations: PayslipCalculations;
}

// Default Earnings and Deductions
export interface DefaultEarningsDeductions {
  earnings: { name: string; amount: number }[];
  deductions: { name: string; amount: number }[];
}

// File Upload Response from Supabase
export interface FileUploadResponse {
  url: string;
  path: string;
  bucket: string;
}

// Database schemas for Supabase
// These represent the table structures in Supabase

export interface CompaniesTable {
  id: string;
  name: string;
  address: string;
  city: string;
  pincode: string;
  country: string;
  logo_url?: string;
  email?: string;
  phone?: string;
  gst_number?: string;
  pan_number?: string;
  registration_number?: string;
  created_at: string;
  updated_at: string;
}

export interface EmployeesTable {
  id: string;
  name: string;
  employee_id: string;
  designation: string;
  department: string;
  date_of_joining: string;
  company_id: string;
  email?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface PayslipsTable {
  id: string;
  payslip_id: string;
  company_id: string;
  employee_id: string;
  pay_period_year: number;
  pay_period_month: number;
  paid_days: number;
  loss_of_pay_days: number;
  pay_date: string;
  gross_earnings: number;
  total_deductions: number;
  net_salary: number;
  net_salary_in_words: string;
  bank_details?: BankDetails;
  created_at: string;
  updated_at: string;
}

export interface EarningsTable {
  id: string;
  payslip_id: string;
  name: string;
  amount: number;
  created_at: string;
}

export interface DeductionsTable {
  id: string;
  payslip_id: string;
  name: string;
  amount: number;
  created_at: string;
}
