// Main Page: Payslip Generator
// Complete form interface for generating payslips
// Integrates all components and handles form submission

'use client';

import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import CompanyForm from '@/components/CompanyForm';
import EmployeeForm from '@/components/EmployeeForm';
import PayPeriodForm from '@/components/PayPeriodForm';
import EarningsDeductionsForm from '@/components/EarningsDeductionsForm';
import BankDetailsForm from '@/components/BankDetailsForm';
import Button from '@/components/Button';
import PayslipPreview from '@/components/PayslipPreview';
import {
  CompanyInfo,
  EmployeeInfo,
  PayPeriod,
  EarningItem,
  DeductionItem,
  BankDetails,
  PayslipTemplate,
} from '@/types';

export default function Home() {
  const payslipPreviewRef = useRef<HTMLDivElement>(null);

  const [currentStep, setCurrentStep] = useState<
    'form' | 'preview' | 'success'
  >('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form state
  const [company, setCompany] = useState<CompanyInfo>({
    name: '',
    address: '',
    city: '',
    pincode: '',
    country: 'India',
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

  const [earnings, setEarnings] = useState<EarningItem[]>([]);
  const [deductions, setDeductions] = useState<DeductionItem[]>([]);
  const [bankDetails, setBankDetails] = useState<BankDetails>({});
  const [payslipData, setPayslipData] = useState<PayslipTemplate | null>(null);

  // Handle form submission and preview
  const handleGeneratePayslip = async () => {
    setError(null);

    // Validate required fields
    if (!company.name || !employee.name || !employee.employeeId) {
      setError('Please fill in all required company and employee information');
      return;
    }

    if (earnings.length === 0 || deductions.length === 0) {
      setError('Please add at least one earning and one deduction');
      return;
    }

    setLoading(true);

    try {
      // Calculate totals
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          earnings,
          deductions,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Calculation failed');
      }

      // Create payslip template
      const template: PayslipTemplate = {
        payslipId: `PSL-${employee.employeeId}-${Date.now()}`,
        company,
        employee,
        payPeriod,
        earnings,
        deductions,
        bankDetails: Object.keys(bankDetails).some(k => bankDetails[k as keyof BankDetails]) ? bankDetails : undefined,
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

  // Save payslip to database
  const handleSavePayslip = async () => {
    if (!payslipData) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/payslips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company,
          employee,
          payPeriod,
          earnings,
          deductions,
          bankDetails: Object.keys(bankDetails).some(k => bankDetails[k as keyof BankDetails]) ? bankDetails : undefined,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to save payslip');
      }

      setSuccessMessage('Payslip saved successfully!');
      setCurrentStep('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save payslip');
    } finally {
      setLoading(false);
    }
  };

  // Generate and download PDF
  const handleDownloadPDF = async () => {
    if (!payslipPreviewRef.current) return;

    setLoading(true);
    setError(null);

    try {
      const canvas = await html2canvas(payslipPreviewRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`payslip-${employee.employeeId}-${payslipData?.payslipId}.pdf`);

      setSuccessMessage('PDF downloaded successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download PDF');
    } finally {
      setLoading(false);
    }
  };

  // Print payslip
  const handlePrint = () => {
    if (payslipPreviewRef.current) {
      const printWindow = window.open('', '', 'width=800,height=600');
      if (printWindow) {
        printWindow.document.write(payslipPreviewRef.current.innerHTML);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  // Reset form
  const handleResetForm = () => {
    setCompany({ name: '', address: '', city: '', pincode: '', country: 'India' });
    setEmployee({ name: '', employeeId: '', designation: '', department: '', dateOfJoining: '' });
    setPayPeriod({
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      paidDays: 30,
      lossOfPayDays: 0,
      payDate: new Date().toISOString().split('T')[0],
    });
    setEarnings([]);
    setDeductions([]);
    setBankDetails({});
    setPayslipData(null);
    setCurrentStep('form');
    setError(null);
    setSuccessMessage(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Teens Payslip Generator
          </h1>
          <p className="text-lg text-gray-600">
            Professional payslip generation and management system
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            <p className="font-semibold">Success:</p>
            <p>{successMessage}</p>
          </div>
        )}

        {/* Form Step */}
        {currentStep === 'form' && (
          <div className="space-y-6">
            <CompanyForm data={company} onChange={setCompany} />
            <EmployeeForm data={employee} onChange={setEmployee} />
            <PayPeriodForm data={payPeriod} onChange={setPayPeriod} />
            <EarningsDeductionsForm
              earnings={earnings}
              deductions={deductions}
              onEarningsChange={setEarnings}
              onDeductionsChange={setDeductions}
            />
            <BankDetailsForm data={bankDetails} onChange={setBankDetails} />

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center pt-8">
              <Button
                label="Reset Form"
                onClick={handleResetForm}
                variant="secondary"
              />
              <Button
                label="Generate Payslip Preview"
                onClick={handleGeneratePayslip}
                variant="primary"
                loading={loading}
              />
            </div>
          </div>
        )}

        {/* Preview Step */}
        {currentStep === 'preview' && payslipData && (
          <div>
            <div ref={payslipPreviewRef} className="mb-8">
              <PayslipPreview payslip={payslipData} />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center pb-8 flex-wrap">
              <Button
                label="Back to Form"
                onClick={() => setCurrentStep('form')}
                variant="secondary"
              />
              <Button
                label="Save Payslip"
                onClick={handleSavePayslip}
                variant="primary"
                loading={loading}
              />
              <Button
                label="Download PDF"
                onClick={handleDownloadPDF}
                variant="primary"
                loading={loading}
              />
              <Button
                label="Print"
                onClick={handlePrint}
                variant="primary"
              />
            </div>
          </div>
        )}

        {/* Success Step */}
        {currentStep === 'success' && (
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg text-center">
            <div className="text-5xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              Payslip Generated Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Your payslip has been saved to the database.
            </p>
            <Button
              label="Generate Another Payslip"
              onClick={handleResetForm}
              variant="primary"
              className="w-full"
            />
          </div>
        )}
      </div>
    </main>
  );
}
