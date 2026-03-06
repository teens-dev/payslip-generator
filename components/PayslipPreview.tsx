// Component: Payslip Preview
// Displays payslip in a professional format for preview and PDF generation
// Uses HTML structure optimized for PDF export via html2canvas

'use client';

import React from 'react';
import { PayslipTemplate } from '@/types';
import { formatDate, formatIndianCurrency } from '@/lib/utils';

interface PayslipPreviewProps {
  payslip: PayslipTemplate;
}

export default function PayslipPreview({ payslip }: PayslipPreviewProps) {
  return (
    <div id="payslip-print" className="w-full max-w-4xl mx-auto bg-white p-8 text-gray-800">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 pb-4 border-b-2 border-gray-300">
        {/* Company Logo */}
        {payslip.company.logo && (
          <img
            src={payslip.company.logo}
            alt="Company Logo"
            className="h-20 w-20 object-contain"
          />
        )}

        {/* Company Info */}
        <div className="text-center flex-1 mx-4">
          <h1 className="text-3xl font-bold text-gray-900">{payslip.company.name}</h1>
          <p className="text-sm text-gray-600 mt-1">
            {payslip.company.address}, {payslip.company.city} - {payslip.company.pincode}
          </p>
          <p className="text-sm text-gray-600">{payslip.company.country}</p>
          {payslip.company.email && (
            <p className="text-sm text-gray-600">{payslip.company.email}</p>
          )}
        </div>

        {/* Payslip Title */}
        <div className="text-right">
          <h2 className="text-2xl font-bold text-blue-600">PAYSLIP</h2>
          <p className="text-sm text-gray-600 mt-2">{payslip.payslipId}</p>
        </div>
      </div>

      {/* Employee Information */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase">Employee Information</h3>
          <div className="space-y-1 text-sm">
            <p>
              <span className="font-semibold">Name:</span> {payslip.employee.name}
            </p>
            <p>
              <span className="font-semibold">ID:</span> {payslip.employee.employeeId}
            </p>
            <p>
              <span className="font-semibold">Designation:</span> {payslip.employee.designation}
            </p>
            <p>
              <span className="font-semibold">Department:</span> {payslip.employee.department}
            </p>
            <p>
              <span className="font-semibold">Date of Joining:</span>{' '}
              {formatDate(payslip.employee.dateOfJoining)}
            </p>
          </div>
        </div>

        {/* Pay Period Information */}
        <div>
          <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase">Pay Period</h3>
          <div className="space-y-1 text-sm">
            <p>
              <span className="font-semibold">Month:</span>{' '}
              {new Date(payslip.payPeriod.year, payslip.payPeriod.month - 1).toLocaleDateString(
                'en-US',
                { month: 'long', year: 'numeric' }
              )}
            </p>
            <p>
              <span className="font-semibold">Paid Days:</span> {payslip.payPeriod.paidDays}
            </p>
            <p>
              <span className="font-semibold">Loss of Pay:</span> {payslip.payPeriod.lossOfPayDays}
            </p>
            <p>
              <span className="font-semibold">Pay Date:</span> {formatDate(payslip.payPeriod.payDate)}
            </p>
          </div>
        </div>
      </div>

      {/* Earnings and Deductions Tables */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* Earnings Table */}
        <div>
          <h3 className="text-sm font-bold text-gray-700 mb-2 uppercase">Earnings</h3>
          <table className="w-full text-sm border border-gray-300">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                <th className="px-3 py-2 text-left font-semibold">Component</th>
                <th className="px-3 py-2 text-right font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {payslip.earnings.map((item) => (
                <tr key={item.id} className="border-b border-gray-200">
                  <td className="px-3 py-2">{item.name}</td>
                  <td className="px-3 py-2 text-right">₹ {formatIndianCurrency(item.amount)}</td>
                </tr>
              ))}
              <tr className="bg-green-50 font-semibold border-t-2 border-gray-300">
                <td className="px-3 py-2">Gross Earnings</td>
                <td className="px-3 py-2 text-right">
                  ₹ {formatIndianCurrency(payslip.calculations.grossEarnings)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Deductions Table */}
        <div>
          <h3 className="text-sm font-bold text-gray-700 mb-2 uppercase">Deductions</h3>
          <table className="w-full text-sm border border-gray-300">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                <th className="px-3 py-2 text-left font-semibold">Component</th>
                <th className="px-3 py-2 text-right font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {payslip.deductions.map((item) => (
                <tr key={item.id} className="border-b border-gray-200">
                  <td className="px-3 py-2">{item.name}</td>
                  <td className="px-3 py-2 text-right">₹ {formatIndianCurrency(item.amount)}</td>
                </tr>
              ))}
              <tr className="bg-red-50 font-semibold border-t-2 border-gray-300">
                <td className="px-3 py-2">Total Deductions</td>
                <td className="px-3 py-2 text-right">
                  ₹ {formatIndianCurrency(payslip.calculations.totalDeductions)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Net Salary Summary */}
      <div className="mb-8 p-4 bg-blue-50 border-2 border-blue-300 rounded">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-600 uppercase font-semibold">Gross Earnings</p>
            <p className="text-lg font-bold text-gray-900">
              ₹ {formatIndianCurrency(payslip.calculations.grossEarnings)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 uppercase font-semibold">Total Deductions</p>
            <p className="text-lg font-bold text-gray-900">
              ₹ {formatIndianCurrency(payslip.calculations.totalDeductions)}
            </p>
          </div>
          <div className="md:col-span-2">
            <p className="text-xs text-gray-600 uppercase font-semibold">Net Salary</p>
            <p className="text-xl font-bold text-green-600">
              ₹ {formatIndianCurrency(payslip.calculations.netSalary)}
            </p>
          </div>
        </div>
      </div>

      {/* Amount in Words */}
      <div className="mb-8 p-4 bg-yellow-50 border border-yellow-300 rounded">
        <p className="text-sm font-semibold text-gray-700 mb-2">Amount in Words:</p>
        <p className="text-lg font-bold text-gray-900">{payslip.calculations.netSalaryInWords}</p>
      </div>

      {/* Bank Details (if available) */}
      {payslip.bankDetails && Object.values(payslip.bankDetails).some(v => v) && (
        <div className="mb-8">
          <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase">Bank Details</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            {payslip.bankDetails.bankName && (
              <p>
                <span className="font-semibold">Bank:</span> {payslip.bankDetails.bankName}
              </p>
            )}
            {payslip.bankDetails.accountNumber && (
              <p>
                <span className="font-semibold">Account:</span> {payslip.bankDetails.accountNumber}
              </p>
            )}
            {payslip.bankDetails.ifscCode && (
              <p>
                <span className="font-semibold">IFSC:</span> {payslip.bankDetails.ifscCode}
              </p>
            )}
            {payslip.bankDetails.uanNumber && (
              <p>
                <span className="font-semibold">UAN:</span> {payslip.bankDetails.uanNumber}
              </p>
            )}
            {payslip.bankDetails.esiNumber && (
              <p>
                <span className="font-semibold">ESI:</span> {payslip.bankDetails.esiNumber}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-12 pt-8 border-t-2 border-gray-300 text-center text-xs text-gray-600">
        <p>This is a system-generated payslip. No signature is required.</p>
        <p className="mt-2">Generated on {new Date().toLocaleDateString('en-IN')}</p>
      </div>
    </div>
  );
}
