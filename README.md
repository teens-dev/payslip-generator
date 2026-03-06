# Teens Payslip Generator

A full-stack, production-ready web application for generating professional payslips with automatic salary calculations, PDF export, and database integration.

**Project Name:** Teens Payslip Generator
**Version:** 1.0.0
**Status:** Production Ready
**Last Updated:** 2024

---

## 📋 Quick Links

- **Main Usage Guide**: See [Usage Guide](#usage-guide) below
- **API Documentation**: See [API Endpoints](#api-endpoints)
- **Database Schema**: See [Database Schema](#database-schema)
- **Setup Instructions**: See [Installation & Setup](#installation--setup)
- **Supabase Integration**: See [Supabase Setup](#supabase-setup)
- **Deployment**: See [Deployment](#deployment)

---

## 🎯 Overview

Teens Payslip Generator is a comprehensive payroll management system designed for HR departments to:

- **Input Company Details**: Logo, name, address, GST/PAN numbers
- **Enter Employee Information**: Name, ID, designation, department, joining date
- **Manage Earnings & Deductions**: Dynamic components (Basic Salary, HRA, Special Allowance, Bonus, OT Pay, Income Tax, PF, ESI)
- **Automatic Calculations**: Gross Earnings, Total Deductions, Net Salary with amount-in-words
- **Professional Payslips**: PDF-ready format with company logo and all details
- **Database Storage**: Persistent storage in Supabase with relational schema
- **PDF & Print**: Download as PDF or print directly

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 16.1.6 (App Router)
- **UI**: React 19.2.3 + Tailwind CSS 4
- **Language**: TypeScript 5
- **PDF**: html2canvas 1.4.1 + jsPDF 2.5.1
- **Forms**: React Hook Form 7.48.0
- **Validation**: Zod 3.22.0

### Backend
- **API**: Next.js API Routes (Serverless)
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Client**: Supabase JS Client v2.38.0

---

## ✨ Features

1. ✅ Multi-step form with validation
2. ✅ Company logo upload to Supabase Storage
3. ✅ Dynamic earnings and deductions management
4. ✅ Real-time salary calculations
5. ✅ Amount-in-words conversion (Indian format)
6. ✅ Professional payslip preview
7. ✅ PDF download (A4 format)
8. ✅ Print functionality
9. ✅ Database persistence in Supabase
10. ✅ Complete payroll history tracking
11. ✅ Responsive design
12. ✅ Error handling and validation

---

## 📁 Project Structure

See full structure in [Project Structure Section](#project-structure) below.

Key directories:
- `app/api/` - Backend API routes with Supabase integration
- `components/` - Reusable React components
- `lib/` - Utilities and Supabase client
- `types/` - TypeScript definitions
- `docs/` - API, Frontend, Backend documentation

---

## 🗄️ Database Schema

### Core Tables (Supabase Integration)

**Companies Table** - Stores company information
```
id (UUID) | name | address | city | pincode | country | logo_url |
email | phone | gst_number | pan_number | created_at | updated_at
```

**Employees Table** - Links to companies
```
id (UUID) | company_id (FK) | name | employee_id | designation |
department | date_of_joining | email | phone | created_at | updated_at
```

**Payslips Table** - Main payslip records
```
id (UUID) | payslip_id (UNIQUE) | company_id (FK) | employee_id (FK) |
pay_period_year | pay_period_month | paid_days | loss_of_pay_days |
 gross_earnings | total_deductions | net_salary | net_salary_in_words |
bank_details (JSONB) | created_at | updated_at
```

**Earnings Table** - Individual earning components
```
id (UUID) | payslip_id (FK) | name | amount | created_at
```

**Deductions Table** - Individual deduction components
```
id (UUID) | payslip_id (FK) | name | amount | created_at
```

**Supabase Storage Bucket**
```
Bucket: company-logos
Purpose: Store company logo images
Access: Public read, authenticated write
```

See [Full Database Schema](#-database-schema) for complete details.

---

## 🔌 API Endpoints

All endpoints documented in [API Endpoints Section](#-api-endpoints).

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/payslips` | Create payslip (stores in all related tables) |
| GET | `/api/payslips` | Retrieve all payslips from database |
| POST | `/api/calculate` | Calculate salary totals |
| POST | `/api/upload` | Upload logo to Supabase Storage |
| POST | `/api/payslips/pdf` | Fetch payslip data for PDF generation |

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (free tier OK)
- Git

### Quick Start

```bash
# 1. Clone repository
git clone https://github.com/yourusername/teens-payslip-generator.git
cd teens-payslip-generator

# 2. Install dependencies
npm install

# 3. Copy environment template
cp .env.example .env.local

# 4. Add Supabase credentials to .env.local (see below)

# 5. Run development server
npm run dev

# 6. Open http://localhost:3000
```

See [Installation & Setup](#installation--setup) for detailed steps.

---

## 🔑 Environment Configuration

Create `.env.local` with these variables:

```bash
# Supabase (Required - get from Supabase dashboard)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...

# Application
NEXT_PUBLIC_APP_NAME=Teens Payslip Generator
NEXT_PUBLIC_APP_URL=http://localhost:3000

# File Upload
MAX_LOGO_SIZE=5242880
ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/gif,image/webp
```

See [Environment Configuration](#-environment-configuration) for details.

---

## 🗃️ Supabase Setup

### 1. Create Project
1. Visit [supabase.com](https://supabase.com)
2. Create new project
3. Wait for initialization

### 2. Get Keys
- Settings → API
- Copy Project URL and keys
- Add to `.env.local`

### 3. Create Database
1. SQL Editor
2. Copy `docs/SUPABASE_SCHEMA.sql`
3. Run query
4. Verify tables created

### 4. Create Storage
1. Storage → New bucket
2. Name: `company-logos`
3. Make Public

See [Supabase Setup](#-supabase-setup) for complete guide.

---

## 👥 Usage Guide

### For HR Users

**Step 1:** Fill company information
- Company name, address, city, pincode
- Upload logo (optional)
- Add GST/PAN numbers (optional)

**Step 2:** Enter employee details
- Name, ID, designation, department
- Date of joining

**Step 3:** Set pay period
- Month and year
- Paid days and loss of pay days
- Payment date

**Step 4:** Add earnings
- Enter amounts for salary components
- Modify defaults or add custom items

**Step 5:** Add deductions
- Enter amounts for deduction components
- Modify defaults or add custom items

**Step 6:** Bank details (optional)
- Bank name, account number, IFSC
- UAN, ESI, PAN numbers

**Step 7:** Generate preview
- Click "Generate Payslip Preview"
- Review the formatted payslip

**Step 8:** Save or export
- **Save**: Store in database
- **Download PDF**: A4 format file
- **Print**: Print directly from browser

See [Usage Guide](#-usage-guide) for detailed walkthrough.

---

## 📄 PDF Generation

### How It Works
1. Converts DOM to canvas image (html2canvas)
2. Creates A4 PDF from image (jsPDF)
3. Downloads as `payslip-{EmployeeID}-{PayslipID}.pdf`

### PDF Contents
- Company logo and header
- Employee information
- Earnings table
- Deductions table
- Net salary calculation
- Amount in words
- Bank details
- Generation timestamp

---

## 🌐 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy automatically

### Docker
```bash
docker build -t teens-payslip .
docker run -p 3000:3000 -e NEXT_PUBLIC_SUPABASE_URL=... teens-payslip
```

See [Deployment](#-deployment) for full instructions.

---

## 🏗️ Architecture

### Frontend
- Form components for data input
- Preview component for payslip rendering
- PDF generation using html2canvas + jsPDF
- React hooks for state management

### Backend
- Next.js API routes (serverless)
- Supabase for database and file storage
- Row-level security for data protection
- Service role for API operations

### Data Flow
```
User Input → Components → API Routes → Supabase Database/Storage
                                           ↓
                                    Database Tables
```

---

## 📚 Documentation

### In This README
- **Overview** - Project description and features
- **Technology Stack** - Libraries and frameworks used
- **Project Structure** - File organization
- **Database Schema** - Table definitions
- **API Endpoints** - REST API reference
- **Installation** - Setup instructions
- **Environment** - Configuration guide
- **Supabase** - Database setup
- **Usage Guide** - HR user walkthrough
- **PDF Generation** - Export documentation
- **Deployment** - Production deployment
- **Architecture** - System design

### In Separate Files
- **docs/API.md** - Detailed API documentation
- **docs/FRONTEND.md** - Frontend architecture
- **docs/BACKEND.md** - Backend implementation
- **docs/SUPABASE_SCHEMA.sql** - SQL schema

---

## 🔐 Security

- ✅ Supabase Row Level Security (RLS)
- ✅ Service role key only serverside
- ✅ Input validation with Zod
- ✅ File type and size validation
- ✅ CORS protection via Supabase
- ✅ No secrets in client code

---

## 🚀 Performance

- ✅ Serverless API routes
- ✅ Database indexing on common queries
- ✅ Client-side form validation
- ✅ Image optimization for logos
- ✅ Efficient PDF generation

---

## 🐛 Troubleshooting

**Logo upload fails**
- Check file type (JPEG, PNG, GIF, WebP)
- Verify file < 5MB
- Ensure bucket exists in Supabase

**Can't calculate salary**
- Verify earnings/deductions have values
- Check browser console
- Test `/api/calculate` endpoint

**Payslip won't save**
- Verify Supabase connection
- Check environment variables
- Run schema SQL in Supabase

**PDF download fails**
- Try different browser
- Check console errors
- Verify html2canvas is loaded

---

## 📞 Support

- Check documentation files in `docs/`
- Review code comments for details
- Check GitHub Issues
- See troubleshooting section

---

## 🤝 Contributing

```bash
# Fork, create feature branch, commit, push, open PR
git checkout -b feature/your-feature
git commit -m "Add your feature"
git push origin feature/your-feature
```

---

## 📄 License

MIT License - See LICENSE file

---

## 🙏 Credits

Built with Next.js, Supabase, and Tailwind CSS.

---

## 📊 Supabase Integration Highlights

This application extensively uses **Supabase** for:

1. **Database Tables** (PostgreSQL)
   - companies, employees, payslips, earnings, deductions tables
   - Foreign key relationships for data integrity
   - Indexes for query performance

2. **File Storage**
   - company-logos bucket for image uploads
   - Public URL generation
   - File validation and security

3. **Row Level Security (RLS)**
   - Optional data isolation policies
   - Secure multi-tenant support
   - Fine-grained access control

4. **API Integration**
   - Supabase JS Client in `lib/supabase.ts`
   - Service role for server-side operations
   - Anon key for client-side queries

All code integrating with Supabase has detailed comments explaining:
- Table structure
- Foreign key relationships
- Query operations
- Error handling

See `lib/supabase.ts`, `app/api/payslips/route.ts`, and other API files for examples.

---

**Made with ❤️ for HR Teams | Production Ready | © 2024**
