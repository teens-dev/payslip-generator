'use client';

import React from 'react';
import { PayslipTemplate } from '@/types';
import { formatDate, formatIndianCurrency } from '@/lib/utils';

interface PayslipPreviewProps {
  payslip: PayslipTemplate;
}

export default function PayslipPreview({ payslip }: PayslipPreviewProps) {
  return (
    <div
      id="payslip-print"
      className="bg-white p-8 text-gray-800 shadow"
      style={{ width: '794px', margin: '0 auto' }} // A4 width fix
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-300">
        {payslip.company.logo && (
          <img
            src={payslip.company.logo}
            alt="Company Logo"
            style={{ height: '80px', width: '80px', objectFit: 'contain' }}
          />
        )}

        <div style={{ textAlign: 'center', flex: 1, margin: '0 16px' }}>
          <h1 className="text-2xl font-bold">{payslip.company.name}</h1>
          <p className="text-sm">
            {payslip.company.address}, {payslip.company.city} - {payslip.company.pincode}
          </p>
          <p className="text-sm">{payslip.company.country}</p>
          {payslip.company.email && (
            <p className="text-sm">{payslip.company.email}</p>
          )}
        </div>

        <div style={{ textAlign: 'right' }}>
          <h2 className="text-xl font-bold">PAYSLIP</h2>
          <p className="text-sm">{payslip.payslipId}</p>
        </div>
      </div>

      {/* Employee Info */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
        <div>
          <h3 className="text-sm font-bold mb-2 uppercase">Employee Information</h3>
          <p><strong>Name:</strong> {payslip.employee.name}</p>
          <p><strong>ID:</strong> {payslip.employee.employeeId}</p>
          <p><strong>Designation:</strong> {payslip.employee.designation}</p>
          <p><strong>Department:</strong> {payslip.employee.department}</p>
          <p><strong>Date of Joining:</strong> {formatDate(payslip.employee.dateOfJoining)}</p>
        </div>

        <div>
          <h3 className="text-sm font-bold mb-2 uppercase">Pay Period</h3>
          <p>
            <strong>Month:</strong>{' '}
            {new Date(payslip.payPeriod.year, payslip.payPeriod.month - 1).toLocaleDateString(
              'en-US',
              { month: 'long', year: 'numeric' }
            )}
          </p>
          <p><strong>Paid Days:</strong> {payslip.payPeriod.paidDays}</p>
          <p><strong>Loss of Pay:</strong> {payslip.payPeriod.lossOfPayDays}</p>
          <p><strong>Pay Date:</strong> {formatDate(payslip.payPeriod.payDate)}</p>
        </div>
      </div>

      {/* Earnings & Deductions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
        {/* Earnings */}
        <div>
          <h3 className="text-sm font-bold mb-2 uppercase">Earnings</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: '#f3f4f6' }}>
                <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'left' }}>Component</th>
                <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {payslip.earnings.map((item) => (
                <tr key={item.id}>
                  <td style={{ border: '1px solid #e5e7eb', padding: '8px' }}>{item.name}</td>
                  <td style={{ border: '1px solid #e5e7eb', padding: '8px', textAlign: 'right' }}>
                    ₹ {formatIndianCurrency(item.amount)}
                  </td>
                </tr>
              ))}
              <tr style={{ fontWeight: 'bold', background: '#ecfdf5' }}>
                <td style={{ border: '1px solid #d1d5db', padding: '8px' }}>Gross Earnings</td>
                <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>
                  ₹ {formatIndianCurrency(payslip.calculations.grossEarnings)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Deductions */}
        <div>
          <h3 className="text-sm font-bold mb-2 uppercase">Deductions</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: '#f3f4f6' }}>
                <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'left' }}>Component</th>
                <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {payslip.deductions.map((item) => (
                <tr key={item.id}>
                  <td style={{ border: '1px solid #e5e7eb', padding: '8px' }}>{item.name}</td>
                  <td style={{ border: '1px solid #e5e7eb', padding: '8px', textAlign: 'right' }}>
                    ₹ {formatIndianCurrency(item.amount)}
                  </td>
                </tr>
              ))}
              <tr style={{ fontWeight: 'bold', background: '#fef2f2' }}>
                <td style={{ border: '1px solid #d1d5db', padding: '8px' }}>Total Deductions</td>
                <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>
                  ₹ {formatIndianCurrency(payslip.calculations.totalDeductions)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Net Salary */}
      <div style={{ background: '#eff6ff', border: '2px solid #93c5fd', padding: '16px', marginBottom: '32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '16px' }}>
          <div>
            <p className="text-xs font-semibold">Gross Earnings</p>
            <p className="text-lg font-bold">
              ₹ {formatIndianCurrency(payslip.calculations.grossEarnings)}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold">Total Deductions</p>
            <p className="text-lg font-bold">
              ₹ {formatIndianCurrency(payslip.calculations.totalDeductions)}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold">Net Salary</p>
            <p className="text-xl font-bold text-green-700">
              ₹ {formatIndianCurrency(payslip.calculations.netSalary)}
            </p>
          </div>
        </div>
      </div>

      {/* Amount in words */}
      <div style={{ background: '#fef9c3', padding: '16px', marginBottom: '32px' }}>
        <p className="text-sm font-semibold">Amount in Words:</p>
        <p className="text-lg font-bold">{payslip.calculations.netSalaryInWords}</p>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid #d1d5db', paddingTop: '24px', textAlign: 'center', fontSize: '12px' }}>
        <p>This is a system-generated payslip. No signature required.</p>
        <p>Generated on {new Date().toLocaleDateString('en-IN')}</p>
      </div>
    </div>
  );
}