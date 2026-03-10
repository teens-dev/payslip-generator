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
      style={{
        backgroundColor: '#ffffff',
        padding: '24px 28px',
        color: '#1f2937',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        width: '794px',
        boxSizing: 'border-box' as const,
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
          marginBottom: '32px',
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
          <p
            style={{
              fontSize: '12px',
              margin: '0',
              wordBreak: 'break-word',
              overflowWrap: 'break-word'
            }}
          >
            {payslip.company.address}, {payslip.company.city} - {payslip.company.pincode}
          </p>
          <p style={{ fontSize: '12px', margin: '0' }}>{payslip.company.country}</p>
          {payslip.company.email && (
            <p style={{ fontSize: '12px', margin: '0' }}>{payslip.company.email}</p>
          )}
        </div>

        <div style={{ textAlign: 'right' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 2px 0' }}>PAYSLIP</h2>
          <p style={{ fontSize: '13px', fontWeight: '600', margin: '0 0 2px 0', color: '#374151' }}>
            {new Date(payslip.payPeriod.year, payslip.payPeriod.month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
          {/* <p style={{ fontSize: '11px', margin: '0', color: '#6b7280' }}>{payslip.payslipId}</p> */}
        </div>
      </div>

      {/* Employee Info */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '32px',
          marginBottom: '32px',
        }}
      >
        <div>
          <h3
            style={{
              fontSize: '12px',
              fontWeight: 'bold',
              marginBottom: '8px',
              textTransform: 'uppercase',
              color: '#010a18',
            }}
          >
            Employee Information
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '150px 1fr',
              rowGap: '4px',
              columnGap: '8px',
              fontSize: '13px'
            }}
          >
            <div><strong>Name</strong></div>
            <div style={{ wordBreak: "break-word" }}>{payslip.employee.name}</div>

            <div><strong>ID</strong></div>
            <div>{payslip.employee.employeeId}</div>

            <div><strong>Designation</strong></div>
            <div style={{ wordBreak: "break-word" }}>{payslip.employee.designation}</div>

            <div><strong>Department</strong></div>
            <div style={{ wordBreak: "break-word" }}>{payslip.employee.department}</div>

            <div><strong>Date of Joining</strong></div>
            <div>{formatDate(payslip.employee.dateOfJoining)}</div>
          </div>
        </div>

        <div>
          <h3
            style={{
              fontSize: '12px',
              fontWeight: 'bold',
              marginBottom: '8px',
              textTransform: 'uppercase',
              color: '#00040a',
            }}
          >
            Pay Period
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '150px 1fr',
              rowGap: '4px',
              columnGap: '8px',
              fontSize: '13px'
            }}
          >
            <div><strong>Month</strong></div>
            <div style={{ wordBreak: "break-word" }}>
              {new Date(
                payslip.payPeriod.year,
                payslip.payPeriod.month - 1
              ).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
            <div><strong>Paid Days</strong></div>
            <div>{payslip.payPeriod.paidDays}</div>

            <div><strong>Loss of Pay</strong></div>
            <div>{payslip.payPeriod.lossOfPayDays}</div>

            <div><strong>Pay Date</strong></div>
            <div>{formatDate(payslip.payPeriod.payDate)}</div>
          </div>
        </div>
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
          <h3
            style={{
              fontSize: '12px',
              fontWeight: 'bold',
              marginBottom: '8px',
              textTransform: 'uppercase',
              color: '#374151',
            }}
          >
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
                <tr key={item.id} style={{ backgroundColor: '#ffffff' }}>
                  <td style={{ border: '1px solid #e5e7eb', padding: '8px', color: '#1f2937' }}>
                    {item.name}
                  </td>
                  <td style={{ border: '1px solid #e5e7eb', padding: '8px', textAlign: 'right', color: '#1f2937' }}>
                    ₹ {formatIndianCurrency(item.amount)}
                  </td>
                </tr>
              ))}
              <tr style={{ fontWeight: 'bold', backgroundColor: '#ecfdf5' }}>
                <td style={{ border: '1px solid #d1d5db', padding: '8px', color: '#1f2937' }}>
                  Gross Earnings
                </td>
                <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right', color: '#1f2937' }}>
                  ₹ {formatIndianCurrency(payslip.calculations.grossEarnings)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Deductions */}
        <div>
          <h3
            style={{
              fontSize: '12px',
              fontWeight: 'bold',
              marginBottom: '8px',
              textTransform: 'uppercase',
              color: '#374151',
            }}
          >
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
                <tr key={item.id} style={{ backgroundColor: '#ffffff' }}>
                  <td style={{ border: '1px solid #e5e7eb', padding: '8px', color: '#1f2937' }}>
                    {item.name}
                  </td>
                  <td style={{ border: '1px solid #e5e7eb', padding: '8px', textAlign: 'right', color: '#1f2937' }}>
                    ₹ {formatIndianCurrency(item.amount)}
                  </td>
                </tr>
              ))}
              <tr style={{ fontWeight: 'bold', backgroundColor: '#fef2f2' }}>
                <td style={{ border: '1px solid #d1d5db', padding: '8px', color: '#1f2937' }}>
                  Total Deductions
                </td>
                <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right', color: '#1f2937' }}>
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
            <p style={{ fontSize: '11px', fontWeight: '600', margin: '0 0 4px 0', color: '#374151' }}>
              Gross Earnings
            </p>
            <p style={{ fontSize: '16px', fontWeight: 'bold', margin: '0', color: '#1f2937' }}>
              ₹ {formatIndianCurrency(payslip.calculations.grossEarnings)}
            </p>
          </div>

          <div>
            <p style={{ fontSize: '11px', fontWeight: '600', margin: '0 0 4px 0', color: '#374151' }}>
              Total Deductions
            </p>
            <p style={{ fontSize: '16px', fontWeight: 'bold', margin: '0', color: '#1f2937' }}>
              ₹ {formatIndianCurrency(payslip.calculations.totalDeductions)}
            </p>
          </div>

          <div>
            <p style={{ fontSize: '11px', fontWeight: '600', margin: '0 0 4px 0', color: '#374151' }}>
              Net Salary
            </p>
            <p style={{ fontSize: '20px', fontWeight: 'bold', margin: '0', color: '#15803d' }}>
              ₹ {formatIndianCurrency(payslip.calculations.netSalary)}
            </p>
          </div>
        </div>
      </div>

      {/* Amount in words */}
      <div style={{ backgroundColor: '#fef9c3', padding: '16px', marginBottom: '32px' }}>
        <p style={{ fontSize: '12px', fontWeight: '600', margin: '0 0 4px 0', color: '#374151' }}>
          Amount in Words:
        </p>
        <p style={{ fontSize: '16px', fontWeight: 'bold', margin: '0', color: '#1f2937' }}>
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
          marginTop: '16px',
        }}
      >
        <p style={{ margin: '0 0 2px 0', fontWeight: '500' }}>
          Teens Software Solutions LLP, 3<sup>rd</sup> Floor, 303, Plot no. 56, Newmark House, Patrika Nagar, HITEC City, Hyderabad, Telangana 500081
        </p>
        <p style={{ margin: '0', fontWeight: '500' }}>
          Contact: +91 81255 24545; Mail: info@teensss.com
        </p>
        <p style={{ margin: '6px 0 0 0', fontSize: '11px', color: '#9ca3af' }}>
          This is a system-generated payslip. No signature required. &nbsp;|&nbsp; Generated on {new Date().toLocaleDateString('en-IN')}
        </p>
      </div>
    </div>
  );
}