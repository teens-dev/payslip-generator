
'use client';

import React from 'react';
import { PayslipTemplate } from '@/types';
import { formatDate, formatIndianCurrency } from '@/lib/utils';

interface PayslipPreviewProps {
  payslip: PayslipTemplate;
  consoleLog?: boolean;
}

export default function PayslipPreview({ payslip, consoleLog }: PayslipPreviewProps) {
  if (consoleLog) console.log(payslip);

  const fields = [
    { label: "Name", value: payslip.employee.name },
    { label: "Employee ID", value: payslip.employee.employeeId },
    { label: "Designation", value: payslip.employee.designation },
    { label: "Department", value: payslip.employee.department },
    { label: "Date of Joining", value: formatDate(payslip.employee.dateOfJoining) },

    { label: "Month", value: new Date(payslip.payPeriod.year, payslip.payPeriod.month - 1)
        .toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) },
    { label: "Paid Days", value: payslip.payPeriod.paidDays },
    { label: "Loss of Pay", value: payslip.payPeriod.lossOfPayDays },
    { label: "Pay Date", value: formatDate(payslip.payPeriod.payDate) },

    { label: "Bank Name", value: payslip.bankDetails?.bankName },
    { label: "Account Number", value: payslip.bankDetails?.accountNumber },
    { label: "IFSC Code", value: payslip.bankDetails?.ifscCode },
    { label: "UAN Number", value: payslip.bankDetails?.uanNumber },
    { label: "ESI Number", value: payslip.bankDetails?.esiNumber },
    { label: "PAN Number", value: payslip.bankDetails?.panNumber },
  ].filter(f => f.value);

  const half = Math.ceil(fields.length / 2);
  const left = fields.slice(0, half);
  const right = fields.slice(half);

  const renderColumn = (items: typeof fields) => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '150px 1fr',
        rowGap: '4px',
        columnGap: '8px',
        fontSize: '13px'
      }}
    >
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <div><strong>{item.label}</strong></div>
          <div style={{ wordBreak: "break-word" }}>{item.value}</div>
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div
      id="payslip-print"
      style={{
        backgroundColor: '#ffffff',
        padding: '24px 28px',
        color: '#1f2937',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        width: '794px',
        boxSizing: 'border-box',
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
        lineHeight: '1.5',
      }}
    >

      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '15px',
          paddingBottom: '16px',
          borderBottom: '1px solid #d1d5db',
        }}
      >
        {payslip.company.logo && (
          <img
            src={payslip.company.logo}
            alt="Company Logo"
            style={{ height: '80px', width: '80px', objectFit: 'contain' }}
          />
        )}

        <div style={{ textAlign: 'center', flex: 1, margin: '0 16px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: '0 0 4px 0' }}>
            {payslip.company.name}
          </h1>
        </div>

        <div style={{ textAlign: 'right' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 2px 0' }}>
            PAYSLIP
          </h2>
          <p style={{ fontSize: '14px', fontWeight: '600', margin: '0', color: '#374151' }}>
            {new Date(
              payslip.payPeriod.year,
              payslip.payPeriod.month - 1
            ).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Employee Info */}
      <h3
        style={{
          fontSize: '13px',
          fontWeight: 'bold',
          marginBottom: '15px',
          textTransform: 'uppercase',
          color: '#010a18',
          textAlign: 'center',
        }}
      >
        Employee Information
      </h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '32px',
          marginBottom: '32px',
        }}
      >
        {renderColumn(left)}
        {renderColumn(right)}
      </div>

      {/* Earnings & Deductions */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '32px',
          marginBottom: '32px',
        }}
      >

        {/* Earnings */}
        <div>
          <h3 style={{
            fontSize: '12px',
            fontWeight: 'bold',
            marginBottom: '8px',
            textTransform: 'uppercase',
            color: '#374151',
          }}>
            Earnings
          </h3>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f3f4f6' }}>
                <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'left' }}>
                  Component
                </th>
                <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>
                  Amount
                </th>
              </tr>
            </thead>

            <tbody>
              {payslip.earnings.map((item) => (
                <tr key={item.id}>
                  <td style={{ border: '1px solid #e5e7eb', padding: '8px' }}>
                    {item.name}
                  </td>
                  <td style={{ border: '1px solid #e5e7eb', padding: '8px', textAlign: 'right' }}>
                    ₹ {formatIndianCurrency(item.amount)}
                  </td>
                </tr>
              ))}

              <tr style={{ fontWeight: 'bold', backgroundColor: '#ecfdf5' }}>
                <td style={{ border: '1px solid #d1d5db', padding: '8px' }}>
                  Gross Earnings
                </td>
                <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>
                  ₹ {formatIndianCurrency(payslip.calculations.grossEarnings)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Deductions */}
        <div>
          <h3 style={{
            fontSize: '12px',
            fontWeight: 'bold',
            marginBottom: '8px',
            textTransform: 'uppercase',
            color: '#374151',
          }}>
            Deductions
          </h3>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f3f4f6' }}>
                <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'left' }}>
                  Component
                </th>
                <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>
                  Amount
                </th>
              </tr>
            </thead>

            <tbody>
              {payslip.deductions.map((item) => (
                <tr key={item.id}>
                  <td style={{ border: '1px solid #e5e7eb', padding: '8px' }}>
                    {item.name}
                  </td>
                  <td style={{ border: '1px solid #e5e7eb', padding: '8px', textAlign: 'right' }}>
                    ₹ {formatIndianCurrency(item.amount)}
                  </td>
                </tr>
              ))}

              <tr style={{ fontWeight: 'bold', backgroundColor: '#fef2f2' }}>
                <td style={{ border: '1px solid #d1d5db', padding: '8px' }}>
                  Total Deductions
                </td>
                <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>
                  ₹ {formatIndianCurrency(payslip.calculations.totalDeductions)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

      {/* Net Salary */}
      <div
        style={{
          backgroundColor: '#eff6ff',
          border: '2px solid #93c5fd',
          padding: '16px',
          marginBottom: '32px',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '16px' }}>

          <div>
            <p style={{ fontSize: '11px', fontWeight: '600', margin: 0 }}>
              Gross Earnings
            </p>
            <p style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>
              ₹ {formatIndianCurrency(payslip.calculations.grossEarnings)}
            </p>
          </div>

          <div>
            <p style={{ fontSize: '11px', fontWeight: '600', margin: 0 }}>
              Total Deductions
            </p>
            <p style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>
              ₹ {formatIndianCurrency(payslip.calculations.totalDeductions)}
            </p>
          </div>

          <div>
            <p style={{ fontSize: '11px', fontWeight: '600', margin: 0 }}>
              Net Salary
            </p>
            <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#15803d', margin: 0 }}>
              ₹ {formatIndianCurrency(payslip.calculations.netSalary)}
            </p>
          </div>

        </div>
      </div>

      {/* Amount in Words */}
      <div style={{ backgroundColor: '#fef9c3', padding: '16px', marginBottom: '32px' }}>
        <p style={{ fontSize: '12px', fontWeight: '600', margin: '0 0 4px 0' }}>
          Amount in Words:
        </p>
        <p style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>
          {payslip.calculations.netSalaryInWords}
        </p>
      </div>

      {/* Footer */}
      <div
        style={{
          borderTop: '2px solid #1f2937',
          paddingTop: '12px',
          textAlign: 'center',
          fontSize: '12px',
          color: '#374151',
        }}
      >
        <p style={{ margin: '0 0 2px 0', fontWeight: '500' }}>
          Teens Software Solutions LLP, 3rd Floor, 303, Plot no. 56, Newmark House,
          Patrika Nagar, HITEC City, Hyderabad, Telangana 500081
        </p>

        <p style={{ margin: 0, fontWeight: '500' }}>
          Contact: +91 81255 24545; Mail: info@teensss.com, info@teensitsolutions.com
        </p>

        <p style={{ margin: '6px 0 0 0', fontSize: '11px', color: '#9ca3af' }}>
          This is a system-generated payslip. No signature required. |
          Generated on {new Date().toLocaleDateString('en-IN')}
        </p>
      </div>

    </div>
  );
}