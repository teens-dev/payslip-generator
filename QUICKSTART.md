# QUICK START GUIDE - Teens Payslip Generator

**⏱️ 5 Minutes to Running App | ⚡ Production Ready | 🚀 Ready to Deploy**

---

## 🎯 What You Have

A complete, full-stack payslip generation application with:
- ✅ Frontend form UI with 8 components
- ✅ 5 API endpoints (create, get, calculate, upload, pdf)
- ✅ Supabase database with 5 tables
- ✅ PDF download + Print functionality
- ✅ Complete documentation (API, Frontend, Backend, Database)
- ✅ Production-ready code with TypeScript

---

## ⚡ Quick Start (2 Steps)

### Step 1: Setup Supabase (2 minutes)
```bash
1. Go to https://supabase.com
2. Create new project (free tier OK)
3. Wait 2-3 minutes for initialization
4. Go to Settings → API
5. Copy these values:
   - Project URL → NEXT_PUBLIC_SUPABASE_URL
   - anon key → NEXT_PUBLIC_SUPABASE_ANON_KEY
   - service_role key → SUPABASE_SERVICE_ROLE_KEY
```

### Step 2: Configure & Run (3 minutes)
```bash
# Create environment file
cp .env.example .env.local

# Edit .env.local and paste the 3 values from Step 1

# Install & run
npm install
npm run dev

# Open http://localhost:3000
```

---

## 🗃️ Setup Database (1 minute)

1. In Supabase, go to **SQL Editor**
2. Click **New Query**
3. Copy entire contents of `docs/SUPABASE_SCHEMA.sql`
4. Paste into SQL editor
5. Click **Run**
6. Done! ✅

---

## 💾 Create Storage Bucket (30 seconds)

1. In Supabase, go to **Storage**
2. Click **Create a new bucket**
3. Name: `company-logos`
4. Make it **Public**
5. Click **Create bucket**
6. Done! ✅

---

## 🎨 Test the App (2 minutes)

```
1. Company Info:
   - Name: "Teens Ltd"
   - Address: "123 Street"
   - City: "New Delhi"
   - Pincode: "110001"
   - Country: "India"
   - (Upload logo optional)

2. Employee Info:
   - Name: "John Doe"
   - ID: "EMP001"
   - Designation: "Developer"
   - Department: "Engineering"
   - Joining Date: "2022-01-15"

3. Pay Period:
   - Month: March
   - Year: 2024
   - Paid Days: 30
   - Loss of Pay: 0
   - Pay Date: 2024-03-31

4. Earnings:
   - Basic Salary: 50000
   - HRA: 10000
   - (Others come pre-filled)

5. Deductions:
   - Income Tax: 5000
   - PF: 1800
   - (Others come pre-filled)

6. Click "Generate Payslip Preview"
7. See beautiful payslip!
8. Click "Download PDF" or "Print"
9. Click "Save Payslip" to save to database
```

---

## 📁 Project Files Overview

```
Quick Navigation:

🎨 UI Components:
  - app/page.tsx (Main form)
  - components/* (All UI components)

🔌 API Endpoints:
  - app/api/payslips/route.ts (Create/Get)
  - app/api/calculate/route.ts (Calculate salary)
  - app/api/upload/route.ts (Upload logo)
  - app/api/payslips/pdf/route.ts (PDF data)

🗄️ Database:
  - docs/SUPABASE_SCHEMA.sql (SQL schema)
  - lib/supabase.ts (Supabase client)

📚 Documentation:
  - README.md (Main documentation)
  - docs/API.md (API reference)
  - docs/FRONTEND.md (Component guide)
  - docs/BACKEND.md (Server-side guide)
  - DELIVERY.md (What was built)
```

---

## 🔑 Environment Variables

```bash
# .env.local (required)

# Get these from Supabase Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Optional
NEXT_PUBLIC_APP_NAME=Teens Payslip Generator
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## ✨ Key Features

1. **Multi-Step Form**
   - Company info with logo upload
   - Employee details
   - Pay period
   - Dynamic earnings/deductions
   - Optional bank details

2. **Automatic Calculations**
   - Gross Earnings
   - Total Deductions
   - Net Salary
   - **Amount in Words** (e.g., "Fifty Thousand Rupees Only")

3. **Professional Payslip**
   - Company logo
   - Employee info
   - Earnings table
   - Deductions table
   - Bank details
   - Amount in words

4. **Export Options**
   - **PDF Download** (A4 format)
   - **Print** (direct from browser)
   - **Save** (store in Supabase)

5. **Database**
   - Saves to Supabase
   - Retrieve history
   - Complete audit trail

---

## 📊 API Endpoints

| Endpoint | Purpose |
|----------|---------|
| `POST /api/payslips` | Create payslip + save to DB |
| `GET /api/payslips` | Get all payslips from DB |
| `POST /api/calculate` | Calculate salary (real-time) |
| `POST /api/upload` | Upload logo to Storage |
| `POST /api/payslips/pdf` | Fetch for PDF generation |

---

## 🐛 Troubleshooting

**Logo upload fails?**
- ✅ Check file size < 5MB
- ✅ Check file type (JPEG, PNG, GIF, WebP)
- ✅ Verify bucket exists in Supabase

**Can't calculate salary?**
- ✅ Makes sure earnings/deductions have values
- ✅ Check browser console (F12)

**Payslip won't save?**
- ✅ Check `.env.local` has Supabase credentials
- ✅ Verify tables created from SUPABASE_SCHEMA.sql
- ✅ Check network tab (F12) for API errors

**PDF download fails?**
- ✅ Try different browser
- ✅ Check console for errors
- ✅ Enable pop-ups for browser

---

## 🚀 Deploy to Production

### Option 1: Vercel (Easiest)
```bash
1. Push code to GitHub
2. Go to vercel.com
3. Import GitHub repository
4. Add environment variables
5. Deploy!
```

### Option 2: Docker
```bash
docker build -t payslip .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=... \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=... \
  -e SUPABASE_SERVICE_ROLE_KEY=... \
  payslip
```

---

## 📚 Deep Dive Documentation

Read these for more details:

**Main README.md** - Everything about the project
**docs/API.md** - All API endpoints with examples
**docs/FRONTEND.md** - UI components breakdown
**docs/BACKEND.md** - Server-side implementation
**DELIVERY.md** - What was built

---

## 💡 Common Tasks

### Add a New Earning Component
```javascript
// In EarningsDeductionsForm.tsx
DEFAULT_EARNINGS.push({
  id: 'traveling-allowance',
  name: 'Traveling Allowance',
  amount: 0
});
```

### Change Payslip Design
Edit `components/PayslipPreview.tsx` - It's already styled for PDF!

### Customize Validation
Edit `lib/utils.ts` - Email, phone, UAN, ESI validators

### Change Colors
Edit `tailwind.config.js` and component files

---

## 🆚 Architecture at a Glance

```
Browser (React Components)
    ↓
Next.js Page (React Component + State)
    ↓
API Routes (Serverless Functions)
    ↓
Supabase (PostgreSQL + Storage)
```

Everything is **fully commented** for understanding!

---

## ✅ Checklist Before Closing

- [ ] Supabase project created
- [ ] Environment variables set in `.env.local`
- [ ] Database schema executed (SUPABASE_SCHEMA.sql)
- [ ] Storage bucket `company-logos` created
- [ ] `npm install` completed
- [ ] `npm run dev` running at http://localhost:3000
- [ ] Test payslip generated successfully
- [ ] PDF downloaded successfully
- [ ] Payslip saved to database successfully

---

## 📞 Help & Support

1. **Setup Issues**: Check README.md section "Troubleshooting"
2. **API Questions**: See docs/API.md
3. **Component Questions**: See docs/FRONTEND.md
4. **Database Questions**: See docs/BACKEND.md
5. **Code Comments**: All Supabase code is commented
6. **TypeScript**: Full type coverage prevents errors

---

## 🎓 Next Steps

1. ✅ Get it running locally
2. ✅ Create test payslips
3. ✅ Explore the code
4. ✅ Read the documentation
5. ✅ Customize as needed
6. ✅ Deploy to production
7. ✅ Share with your team!

---

## 🎉 You're Ready!

This is a **production-ready**, **fully documented**, **fully typed** application.

**Everything you need is included:**
- ✅ Complete source code
- ✅ Supabase database schema
- ✅ API documentation
- ✅ Component guides
- ✅ Backend implementation details
- ✅ Deployment instructions
- ✅ Troubleshooting guide
- ✅ Example payslips

**Start building! 🚀**

---

**Questions?** Read the docs in `docs/` folder - everything is documented!

**Made with ❤️ | Ready for Production | © 2024**
