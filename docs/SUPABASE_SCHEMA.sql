-- Supabase Database Schema Setup for Teens Payslip Generator
-- Execute these SQL commands in your Supabase project's SQL editor
-- This creates all necessary tables for storing payslip data

-- 1. Create companies table
-- Stores company information including name, address, and logo reference
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  pincode VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL DEFAULT 'India',
  logo_url TEXT,
  logo_bucket_path TEXT,
  email VARCHAR(255),
  phone VARCHAR(20),
  gst_number VARCHAR(50),
  pan_number VARCHAR(50),
  registration_number VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create employees table
-- Stores employee information linked to company
CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  employee_id VARCHAR(50) NOT NULL,
  designation VARCHAR(100) NOT NULL,
  department VARCHAR(100) NOT NULL,
  date_of_joining DATE NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(company_id, employee_id)
);

-- 3. Create payslips table
-- Stores payslip records with calculations and payment period details
-- Supabase Integration: Main table that stores core payslip data
CREATE TABLE IF NOT EXISTS payslips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payslip_id VARCHAR(100) NOT NULL UNIQUE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  company_info JSONB NOT NULL,
  employee_info JSONB NOT NULL,
  bank_details JSONB,
  pay_period_year INTEGER NOT NULL,
  pay_period_month INTEGER NOT NULL,
  paid_days DECIMAL(5, 2) NOT NULL,
  loss_of_pay_days DECIMAL(5, 2) NOT NULL,
  pay_date DATE NOT NULL,
  gross_earnings DECIMAL(15, 2) NOT NULL,
  total_deductions DECIMAL(15, 2) NOT NULL,
  net_salary DECIMAL(15, 2) NOT NULL,
  net_salary_in_words TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create earnings table
-- Stores individual earning components for each payslip
-- Supabase Integration: Related table linked to payslips via payslip_id
CREATE TABLE IF NOT EXISTS earnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payslip_id UUID NOT NULL REFERENCES payslips(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create deductions table
-- Stores individual deduction components for each payslip
-- Supabase Integration: Related table linked to payslips via payslip_id
CREATE TABLE IF NOT EXISTS deductions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payslip_id UUID NOT NULL REFERENCES payslips(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_payslips_company_id ON payslips(company_id);
CREATE INDEX IF NOT EXISTS idx_payslips_employee_id ON payslips(employee_id);
CREATE INDEX IF NOT EXISTS idx_payslips_payslip_id ON payslips(payslip_id);
CREATE INDEX IF NOT EXISTS idx_payslips_created_at ON payslips(created_at);
CREATE INDEX IF NOT EXISTS idx_earnings_payslip_id ON earnings(payslip_id);
CREATE INDEX IF NOT EXISTS idx_deductions_payslip_id ON deductions(payslip_id);
CREATE INDEX IF NOT EXISTS idx_employees_company_id ON employees(company_id);

-- 7. Create Supabase Storage bucket for company logos
-- Note: This is done through the Supabase UI or CLI
-- Run in Supabase: CREATE STORAGE BUCKET company-logos;
-- Or use: supabase storage create company-logos

-- 8. Enable Row Level Security (RLS) for security
-- Uncomment and configure based on your auth setup
-- ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE payslips ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE earnings ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE deductions ENABLE ROW LEVEL SECURITY;

-- 9. Create sample data for testing (optional)
-- Insert test company
-- INSERT INTO companies (name, address, city, pincode, country)
-- VALUES ('Teens Ltd', '123 Business Street', 'New Delhi', '110001', 'India');

-- Trigger for updated_at timestamps (optional - add to all tables)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payslips_updated_at BEFORE UPDATE ON payslips
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
