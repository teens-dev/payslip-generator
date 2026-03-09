// // Main Page: Payslip Generator
// // Complete form interface for generating payslips
// // Integrates all components and handles form submission

// 'use client';

// import React, { useState, useRef } from 'react';
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';
// import CompanyForm from '@/components/CompanyForm';
// import EmployeeForm from '@/components/EmployeeForm';
// import PayPeriodForm from '@/components/PayPeriodForm';
// import EarningsDeductionsForm from '@/components/EarningsDeductionsForm';
// import BankDetailsForm from '@/components/BankDetailsForm';
// import Button from '@/components/Button';
// import PayslipPreview from '@/components/PayslipPreview';
// import { getHtml2CanvasOnCloneCallback, stripUnsupportedColors } from '@/lib/colorUtils';
// import {
//   CompanyInfo,
//   EmployeeInfo,
//   PayPeriod,
//   EarningItem,
//   DeductionItem,
//   BankDetails,
//   PayslipTemplate,
// } from '@/types';

// export default function Home() {
//   const payslipPreviewRef = useRef<HTMLDivElement>(null);


//   const [currentStep, setCurrentStep] = useState<
//     'form' | 'preview' | 'success'
//   >('form');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [successMessage, setSuccessMessage] = useState<string | null>(null);

//   // Form state
//   const [company, setCompany] = useState<CompanyInfo>({
//     name: '',
//     address: '',
//     city: '',
//     pincode: '',
//     country: 'India',
//   });

//   const [employee, setEmployee] = useState<EmployeeInfo>({
//     name: '',
//     employeeId: '',
//     designation: '',
//     department: '',
//     dateOfJoining: '',
//   });

//   const [payPeriod, setPayPeriod] = useState<PayPeriod>({
//     year: new Date().getFullYear(),
//     month: new Date().getMonth() + 1,
//     paidDays: 30,
//     lossOfPayDays: 0,
//     payDate: new Date().toISOString().split('T')[0],
//   });

//   const [earnings, setEarnings] = useState<EarningItem[]>([]);
//   const [deductions, setDeductions] = useState<DeductionItem[]>([]);
//   const [bankDetails, setBankDetails] = useState<BankDetails>({});
//   const [payslipData, setPayslipData] = useState<PayslipTemplate | null>(null);

//   // Handle form submission and preview
//   const handleGeneratePayslip = async () => {
//     setError(null);

//     // Validate required fields
//     if (!company.name || !employee.name || !employee.employeeId) {
//       setError('Please fill in all required company and employee information');
//       return;
//     }

//     if (earnings.length === 0 || deductions.length === 0) {
//       setError('Please add at least one earning and one deduction');
//       return;
//     }

//     setLoading(true);

//     try {
//       // Calculate totals
//       const response = await fetch('/api/calculate', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           earnings,
//           deductions,
//         }),
//       });

//       const result = await response.json();

//       if (!result.success) {
//         throw new Error(result.error || 'Calculation failed');
//       }

//       // Create payslip template
//       const template: PayslipTemplate = {
//         payslipId: `PSL-${employee.employeeId}-${Date.now()}`,
//         company,
//         employee,
//         payPeriod,
//         earnings,
//         deductions,
//         bankDetails: Object.keys(bankDetails).some(k => bankDetails[k as keyof BankDetails]) ? bankDetails : undefined,
//         calculations: result.data,
//       };

//       setPayslipData(template);
//       setCurrentStep('preview');
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to generate payslip');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Save payslip to database
//   const handleSavePayslip = async () => {
//     if (!payslipData) return;

//     setLoading(true);
//     setError(null);

//     try {
//       const response = await fetch('/api/payslips', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           company,
//           employee,
//           payPeriod,
//           earnings,
//           deductions,
//           bankDetails: Object.keys(bankDetails).some(k => bankDetails[k as keyof BankDetails]) ? bankDetails : undefined,
//         }),
//       });

//       const result = await response.json();

//       if (!result.success) {
//         throw new Error(result.error || 'Failed to save payslip');
//       }

//       setSuccessMessage('Payslip saved successfully!');
//       setCurrentStep('success');
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to save payslip');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Generate and download PDF
//  // Generate and download PDF
//   // Generate and download PDF
//   const handleDownloadPDF = async () => {
//     if (!payslipPreviewRef.current) return;

//     setLoading(true);
//     setError(null);

//     try {
//       const element = payslipPreviewRef.current;

//       // Bake computed rgb() inline so html2canvas never parses stylesheets
//       stripUnsupportedColors(element);

//       const canvas = await html2canvas(element, {
//         scale: 2,
//         useCORS: true,
//         backgroundColor: '#ffffff',
//         logging: false,
//         allowTaint: true,
//         // Do NOT set width — let html2canvas measure the element naturally
//         scrollX: 0,
//         scrollY: -window.scrollY,
//         windowWidth: 1200, // wide enough so nothing wraps or clips
//         onclone: getHtml2CanvasOnCloneCallback(),
//       });

//       const imgData = canvas.toDataURL('image/png');

//       const pdf = new jsPDF({
//         orientation: 'portrait',
//         unit: 'mm',
//         format: 'a4',
//       });

//       const pageWidth = 210;  // A4 width mm
//       const pageHeight = 297; // A4 height mm

//       const imgWidth = pageWidth;
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;

//       let heightLeft = imgHeight;
//       let position = 0;

//       pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
//       heightLeft -= pageHeight;

//       while (heightLeft > 0) {
//         position = heightLeft - imgHeight;
//         pdf.addPage();
//         pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
//         heightLeft -= pageHeight;
//       }

//       pdf.save(`payslip-${employee.employeeId}-${payslipData?.payslipId}.pdf`);
//       setSuccessMessage('PDF downloaded successfully!');
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to download PDF');
//     } finally {
//       setLoading(false);
//     }
//   };
//   // Reset form
//   const handleResetForm = () => {
//     setCompany({ name: '', address: '', city: '', pincode: '', country: 'India' });
//     setEmployee({ name: '', employeeId: '', designation: '', department: '', dateOfJoining: '' });
//     setPayPeriod({
//       year: new Date().getFullYear(),
//       month: new Date().getMonth() + 1,
//       paidDays: 30,
//       lossOfPayDays: 0,
//       payDate: new Date().toISOString().split('T')[0],
//     });
//     setEarnings([]);
//     setDeductions([]);
//     setBankDetails({});
//     setPayslipData(null);
//     setCurrentStep('form');
//     setError(null);
//     setSuccessMessage(null);
//   };

//   function handlePrint(): void {
//     throw new Error('Function not implemented.');
//   }

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold text-gray-900 mb-2">
//             Teens Payslip Generator
//           </h1>
//           <p className="text-lg text-gray-600">
//             Professional payslip generation and management system
//           </p>
//         </div>

//         {/* Error Alert */}
//         {error && (
//           <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
//             <p className="font-semibold">Error:</p>
//             <p>{error}</p>
//           </div>
//         )}

//         {/* Success Alert */}
//         {successMessage && (
//           <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
//             <p className="font-semibold">Success:</p>
//             <p>{successMessage}</p>
//           </div>
//         )}

//         {/* Form Step */}
//         {currentStep === 'form' && (
//           <div className="space-y-6">
//             <CompanyForm data={company} onChange={setCompany} />
//             <EmployeeForm data={employee} onChange={setEmployee} />
//             <PayPeriodForm data={payPeriod} onChange={setPayPeriod} />
//             <EarningsDeductionsForm
//               earnings={earnings}
//               deductions={deductions}
//               onEarningsChange={setEarnings}
//               onDeductionsChange={setDeductions}
//             />
//             <BankDetailsForm data={bankDetails} onChange={setBankDetails} />

//             {/* Action Buttons */}
//             <div className="flex gap-4 justify-center pt-8">
//               <Button
//                 label="Reset Form"
//                 onClick={handleResetForm}
//                 variant="secondary"
//               />
//               <Button
//                 label="Generate Payslip Preview"
//                 onClick={handleGeneratePayslip}
//                 variant="primary"
//                 loading={loading}
//               />
//             </div>
//           </div>
//         )}

//         {/* Preview Step */}
//         {currentStep === 'preview' && payslipData && (
//           <div>
//             <div ref={payslipPreviewRef} className="mb-8">
//               <PayslipPreview payslip={payslipData} />
//             </div>


//             {/* Action Buttons */}
//             <div className="flex gap-4 justify-center pb-8 flex-wrap">
//               <Button
//                 label="Back to Form"
//                 onClick={() => setCurrentStep('form')}
//                 variant="secondary"
//               />
//               <Button
//                 label="Save Payslip"
//                 onClick={handleSavePayslip}
//                 variant="primary"
//                 loading={loading}
//               />
//               <Button
//                 label="Download PDF"
//                 onClick={handleDownloadPDF}
//                 variant="primary"
//                 loading={loading}
//               />
//               <Button
//                 label="Print"
//                 onClick={handlePrint}
//                 variant="primary"
//               />
//             </div>
//           </div>
//         )}

//         {/* Success Step */}
//         {currentStep === 'success' && (
//           <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg text-center">
//             <div className="text-5xl mb-4">✓</div>
//             <h2 className="text-2xl font-bold text-green-600 mb-2">
//               Payslip Generated Successfully!
//             </h2>
//             <p className="text-gray-600 mb-6">
//               Your payslip has been saved to the database.
//             </p>
//             <Button
//               label="Generate Another Payslip"
//               onClick={handleResetForm}
//               variant="primary"
//               className="w-full"
//             />
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }


'use client';

import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import PayslipPreview from '@/components/PayslipPreview';
import { getHtml2CanvasOnCloneCallback, stripUnsupportedColors } from '@/lib/colorUtils';
import {
  CompanyInfo,
  EmployeeInfo,
  PayPeriod,
  EarningItem,
  DeductionItem,
  BankDetails,
  PayslipTemplate,
} from '@/types';

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

export default function Home() {
  const payslipPreviewRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentStep, setCurrentStep] = useState<'form' | 'preview'>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [company, setCompany] = useState<CompanyInfo>({
    name: '',
    address: '',
    city: '',
    pincode: '',
    country: 'India',
    email: '',
  });

  const [employee, setEmployee] = useState<EmployeeInfo>({
    name: '',
    employeeId: '',
    designation: '',
    department: '',
    dateOfJoining: '',
  });

  const [payPeriod, setPayPeriod] = useState<PayPeriod>({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    paidDays: 30,
    lossOfPayDays: 0,
    payDate: new Date().toISOString().split('T')[0],
  });

  const [earnings, setEarnings] = useState<EarningItem[]>([
    { id: '1', name: 'Basic Salary', amount: 0 },
    { id: '2', name: 'House Rent Allowance', amount: 0 },
  ]);
  const [deductions, setDeductions] = useState<DeductionItem[]>([
    { id: '1', name: 'Income Tax', amount: 0 },
    { id: '2', name: 'Provident Fund', amount: 0 },
  ]);

  const [payslipData, setPayslipData] = useState<PayslipTemplate | null>(null);

  const grossEarnings = earnings.reduce((s, e) => s + (Number(e.amount) || 0), 0);
  const totalDeductions = deductions.reduce((s, d) => s + (Number(d.amount) || 0), 0);
  const netPay = grossEarnings - totalDeductions;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setLogoPreview(result);
      setCompany(c => ({ ...c, logo: result }));
    };
    reader.readAsDataURL(file);
  };

  const addEarning = () => {
    setEarnings(prev => [...prev, { id: Date.now().toString(), name: '', amount: 0 }]);
  };

  const addDeduction = () => {
    setDeductions(prev => [...prev, { id: Date.now().toString(), name: '', amount: 0 }]);
  };

  const removeEarning = (id: string) => setEarnings(prev => prev.filter(e => e.id !== id));
  const removeDeduction = (id: string) => setDeductions(prev => prev.filter(d => d.id !== id));

  const updateEarning = (id: string, field: 'name' | 'amount', value: string | number) => {
    setEarnings(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const updateDeduction = (id: string, field: 'name' | 'amount', value: string | number) => {
    setDeductions(prev => prev.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  const handleGenerate = async () => {
    setError(null);
    if (!company.name) { setError('Company name is required'); return; }
    if (!employee.name || !employee.employeeId) { setError('Employee name and ID are required'); return; }

    setLoading(true);
    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ earnings, deductions }),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Calculation failed');

      const template: PayslipTemplate = {
        payslipId: `PSL-${employee.employeeId}-${Date.now()}`,
        company,
        employee,
        payPeriod,
        earnings,
        deductions,
        calculations: result.data,
      };

      setPayslipData(template);
      setCurrentStep('preview');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate payslip');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!payslipData) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/payslips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company, employee, payPeriod, earnings, deductions }),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Failed to save');
      setSuccessMessage('Payslip saved successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save payslip');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!payslipPreviewRef.current) return;
    setLoading(true);
    setError(null);
    try {
      const element = payslipPreviewRef.current;
      stripUnsupportedColors(element);
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        allowTaint: true,
        scrollX: 0,
        scrollY: -window.scrollY,
        windowWidth: 1200,
        onclone: getHtml2CanvasOnCloneCallback(),
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = 210, pageHeight = 297;
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight, position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(`payslip-${employee.employeeId}-${payslipData?.payslipId}.pdf`);
      setSuccessMessage('PDF downloaded!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download PDF');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCompany({ name: '', address: '', city: '', pincode: '', country: 'India', email: '' });
    setEmployee({ name: '', employeeId: '', designation: '', department: '', dateOfJoining: '' });
    setPayPeriod({ year: currentYear, month: new Date().getMonth() + 1, paidDays: 30, lossOfPayDays: 0, payDate: new Date().toISOString().split('T')[0] });
    setEarnings([{ id: '1', name: 'Basic Salary', amount: 0 }, { id: '2', name: 'House Rent Allowance', amount: 0 }]);
    setDeductions([{ id: '1', name: 'Income Tax', amount: 0 }, { id: '2', name: 'Provident Fund', amount: 0 }]);
    setLogoPreview(null);
    setPayslipData(null);
    setCurrentStep('form');
    setError(null);
    setSuccessMessage(null);
  };

  const handlePrint = () => window.print();

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '7px 10px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '13px',
    color: '#1f2937',
    backgroundColor: '#fff',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '12px',
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: '4px',
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '14px',
    paddingBottom: '8px',
    borderBottom: '1px solid #e5e7eb',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  };

  const payMonth = MONTHS[payPeriod.month - 1] + ' ' + payPeriod.year;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Top Bar */}
      <div style={{ backgroundColor: '#1e3a5f', padding: '12px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '28px', height: '28px', backgroundColor: '#f97316', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>T</span>
          </div>
          <span style={{ color: '#fff', fontWeight: '600', fontSize: '16px' }}>Teens Payslip Generator</span>
        </div>
        <span style={{ color: '#93c5fd', fontSize: '13px' }}>Professional Payroll System</span>
      </div>

      <div style={{ maxWidth: '900px', margin: '24px auto', padding: '0 16px' }}>
        {/* Error / Success */}
        {error && (
          <div style={{ marginBottom: '12px', padding: '10px 16px', backgroundColor: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '6px', color: '#dc2626', fontSize: '13px' }}>
            ⚠️ {error}
          </div>
        )}
        {successMessage && (
          <div style={{ marginBottom: '12px', padding: '10px 16px', backgroundColor: '#f0fdf4', border: '1px solid #86efac', borderRadius: '6px', color: '#16a34a', fontSize: '13px' }}>
            ✓ {successMessage}
          </div>
        )}

        {currentStep === 'form' && (
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>

            {/* Form Header Row: Logo + Month Selector */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0', borderBottom: '1px solid #e5e7eb' }}>
              {/* Logo Upload */}
              <div style={{ padding: '20px 24px', borderRight: '1px solid #e5e7eb' }}>
                <p style={{ ...labelStyle, marginBottom: '8px' }}>Company Logo</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      width: '72px', height: '72px', border: '2px dashed #d1d5db', borderRadius: '8px',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', backgroundColor: '#f9fafb', overflow: 'hidden',
                    }}
                  >
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    ) : (
                      <>
                        <span style={{ fontSize: '20px', color: '#9ca3af' }}>↑</span>
                        <span style={{ fontSize: '10px', color: '#9ca3af', marginTop: '2px' }}>Upload</span>
                      </>
                    )}
                  </div>
                  <div style={{ fontSize: '11px', color: '#9ca3af', lineHeight: '1.6' }}>
                    300 × 300 pixels at 72DPI.<br />
                    Maximum size of 1MB.<br />
                    Format: JPG or PNG
                  </div>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
              </div>

              {/* Month Selector */}
              <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <p style={{ ...labelStyle, marginBottom: '8px' }}>Payslip for Month</p>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <select
                    value={payPeriod.month}
                    onChange={e => setPayPeriod(p => ({ ...p, month: Number(e.target.value) }))}
                    style={{ ...inputStyle, width: 'auto', flex: 1 }}
                  >
                    {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                  </select>
                  <select
                    value={payPeriod.year}
                    onChange={e => setPayPeriod(p => ({ ...p, year: Number(e.target.value) }))}
                    style={{ ...inputStyle, width: 'auto', flex: 1 }}
                  >
                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <p style={{ marginTop: '8px', fontSize: '18px', fontWeight: '700', color: '#1e3a5f' }}>{payMonth}</p>
              </div>
            </div>

            {/* Company Details */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e5e7eb' }}>
              <p style={sectionTitleStyle}>Company Details</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Company Name *</label>
                  <input style={inputStyle} placeholder="Eg. Teens Software Solutions LLP" value={company.name} onChange={e => setCompany(c => ({ ...c, name: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input style={inputStyle} placeholder="Eg. info@company.com" value={company.email || ''} onChange={e => setCompany(c => ({ ...c, email: e.target.value }))} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Company Address</label>
                  <input style={inputStyle} placeholder="Street address" value={company.address} onChange={e => setCompany(c => ({ ...c, address: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>City</label>
                  <input style={inputStyle} placeholder="City" value={company.city} onChange={e => setCompany(c => ({ ...c, city: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Pincode</label>
                  <input style={inputStyle} placeholder="Pincode" value={company.pincode} onChange={e => setCompany(c => ({ ...c, pincode: e.target.value }))} />
                </div>
              </div>
            </div>

            {/* Employee Pay Summary */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e5e7eb' }}>
              <p style={sectionTitleStyle}>Employee Pay Summary</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Employee Name *</label>
                  <input style={inputStyle} placeholder="Eg. Minerva Kaufman" value={employee.name} onChange={e => setEmployee(emp => ({ ...emp, name: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Employee ID *</label>
                  <input style={inputStyle} placeholder="Eg. 1234" value={employee.employeeId} onChange={e => setEmployee(emp => ({ ...emp, employeeId: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Date of Joining</label>
                  <input type="date" style={inputStyle} value={employee.dateOfJoining} onChange={e => setEmployee(emp => ({ ...emp, dateOfJoining: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Designation</label>
                  <input style={inputStyle} placeholder="Eg. Software Engineer" value={employee.designation} onChange={e => setEmployee(emp => ({ ...emp, designation: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Department</label>
                  <input style={inputStyle} placeholder="Eg. Engineering" value={employee.department} onChange={e => setEmployee(emp => ({ ...emp, department: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Pay Date</label>
                  <input type="date" style={inputStyle} value={payPeriod.payDate} onChange={e => setPayPeriod(p => ({ ...p, payDate: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Paid Days</label>
                  <input type="number" style={inputStyle} placeholder="Eg. 30" value={payPeriod.paidDays} onChange={e => setPayPeriod(p => ({ ...p, paidDays: Number(e.target.value) }))} />
                </div>
                <div>
                  <label style={labelStyle}>Loss of Pay Days</label>
                  <input type="number" style={inputStyle} placeholder="0" value={payPeriod.lossOfPayDays} onChange={e => setPayPeriod(p => ({ ...p, lossOfPayDays: Number(e.target.value) }))} />
                </div>
              </div>
            </div>

            {/* Income Details */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e5e7eb' }}>
              <p style={sectionTitleStyle}>Income Details</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {/* Earnings */}
                <div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f9fafb' }}>
                        <th style={{ padding: '8px 10px', textAlign: 'left', border: '1px solid #e5e7eb', color: '#374151', fontWeight: '600' }}>Earnings</th>
                        <th style={{ padding: '8px 10px', textAlign: 'right', border: '1px solid #e5e7eb', color: '#374151', fontWeight: '600', width: '110px' }}>Amount (₹)</th>
                        <th style={{ width: '32px', border: '1px solid #e5e7eb' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {earnings.map((item) => (
                        <tr key={item.id}>
                          <td style={{ border: '1px solid #e5e7eb', padding: '4px 6px' }}>
                            <input
                              style={{ ...inputStyle, border: 'none', padding: '4px 4px', fontSize: '13px' }}
                              value={item.name}
                              onChange={e => updateEarning(item.id, 'name', e.target.value)}
                              placeholder="Component name"
                            />
                          </td>
                          <td style={{ border: '1px solid #e5e7eb', padding: '4px 6px' }}>
                            <input
                              type="number"
                              style={{ ...inputStyle, border: 'none', padding: '4px 4px', textAlign: 'right', fontSize: '13px' }}
                              value={item.amount}
                              onChange={e => updateEarning(item.id, 'amount', parseFloat(e.target.value) || 0)}
                            />
                          </td>
                          <td style={{ border: '1px solid #e5e7eb', textAlign: 'center', padding: '4px' }}>
                            <button onClick={() => removeEarning(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '15px', lineHeight: 1 }}>×</button>
                          </td>
                        </tr>
                      ))}
                      <tr style={{ backgroundColor: '#f0fdf4' }}>
                        <td style={{ border: '1px solid #e5e7eb', padding: '8px 10px', fontWeight: '600', color: '#15803d' }}>Gross Earnings</td>
                        <td style={{ border: '1px solid #e5e7eb', padding: '8px 10px', textAlign: 'right', fontWeight: '600', color: '#15803d' }}>₹ {grossEarnings.toLocaleString('en-IN')}</td>
                        <td style={{ border: '1px solid #e5e7eb' }}></td>
                      </tr>
                    </tbody>
                  </table>
                  <button onClick={addEarning} style={{ marginTop: '8px', background: 'none', border: 'none', color: '#2563eb', fontSize: '13px', cursor: 'pointer', padding: '0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    + Add Earning
                  </button>
                </div>

                {/* Deductions */}
                <div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f9fafb' }}>
                        <th style={{ padding: '8px 10px', textAlign: 'left', border: '1px solid #e5e7eb', color: '#374151', fontWeight: '600' }}>Deductions</th>
                        <th style={{ padding: '8px 10px', textAlign: 'right', border: '1px solid #e5e7eb', color: '#374151', fontWeight: '600', width: '110px' }}>Amount (₹)</th>
                        <th style={{ width: '32px', border: '1px solid #e5e7eb' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {deductions.map((item) => (
                        <tr key={item.id}>
                          <td style={{ border: '1px solid #e5e7eb', padding: '4px 6px' }}>
                            <input
                              style={{ ...inputStyle, border: 'none', padding: '4px 4px', fontSize: '13px' }}
                              value={item.name}
                              onChange={e => updateDeduction(item.id, 'name', e.target.value)}
                              placeholder="Component name"
                            />
                          </td>
                          <td style={{ border: '1px solid #e5e7eb', padding: '4px 6px' }}>
                            <input
                              type="number"
                              style={{ ...inputStyle, border: 'none', padding: '4px 4px', textAlign: 'right', fontSize: '13px' }}
                              value={item.amount}
                              onChange={e => updateDeduction(item.id, 'amount', parseFloat(e.target.value) || 0)}
                            />
                          </td>
                          <td style={{ border: '1px solid #e5e7eb', textAlign: 'center', padding: '4px' }}>
                            <button onClick={() => removeDeduction(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '15px', lineHeight: 1 }}>×</button>
                          </td>
                        </tr>
                      ))}
                      <tr style={{ backgroundColor: '#fef2f2' }}>
                        <td style={{ border: '1px solid #e5e7eb', padding: '8px 10px', fontWeight: '600', color: '#dc2626' }}>Total Deductions</td>
                        <td style={{ border: '1px solid #e5e7eb', padding: '8px 10px', textAlign: 'right', fontWeight: '600', color: '#dc2626' }}>₹ {totalDeductions.toLocaleString('en-IN')}</td>
                        <td style={{ border: '1px solid #e5e7eb' }}></td>
                      </tr>
                    </tbody>
                  </table>
                  <button onClick={addDeduction} style={{ marginTop: '8px', background: 'none', border: 'none', color: '#2563eb', fontSize: '13px', cursor: 'pointer', padding: '0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    + Add Deduction
                  </button>
                </div>
              </div>

              {/* Net Pay Summary */}
              <div style={{ marginTop: '20px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>Total Net Payable</p>
                  <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#9ca3af' }}>Gross Earnings - Total Deductions</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontSize: '22px', fontWeight: '700', color: '#1e3a5f' }}>₹ {netPay.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'flex-end', gap: '12px', backgroundColor: '#f9fafb' }}>
              <button
                onClick={handleReset}
                style={{ padding: '9px 20px', border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: '#fff', color: '#374151', fontSize: '13px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                ↺ Reset
              </button>
              <button
                onClick={handleGenerate}
                disabled={loading}
                style={{ padding: '9px 24px', border: 'none', borderRadius: '6px', backgroundColor: loading ? '#9ca3af' : '#f97316', color: '#fff', fontSize: '13px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer' }}
              >
                {loading ? 'Generating...' : 'Generate Payslip'}
              </button>
            </div>
          </div>
        )}

        {/* Preview Step */}
        {currentStep === 'preview' && payslipData && (
          <div>
            {/* Preview Action Bar */}
            <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '14px 20px', marginBottom: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => setCurrentStep('form')}
                  style={{ padding: '7px 14px', border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: '#fff', color: '#374151', fontSize: '13px', cursor: 'pointer' }}
                >
                  ← Back to Form
                </button>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e3a5f' }}>Payslip Preview — {payMonth}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={handleSave} disabled={loading} style={{ padding: '7px 16px', border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: '#fff', color: '#374151', fontSize: '13px', cursor: 'pointer' }}>
                  💾 Save
                </button>
                <button onClick={handlePrint} style={{ padding: '7px 16px', border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: '#fff', color: '#374151', fontSize: '13px', cursor: 'pointer' }}>
                  🖨 Print
                </button>
                <button onClick={handleDownloadPDF} disabled={loading} style={{ padding: '7px 16px', border: 'none', borderRadius: '6px', backgroundColor: '#f97316', color: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                  {loading ? 'Downloading...' : '↓ Download PDF'}
                </button>
              </div>
            </div>

            <div ref={payslipPreviewRef}>
              <PayslipPreview payslip={payslipData} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}