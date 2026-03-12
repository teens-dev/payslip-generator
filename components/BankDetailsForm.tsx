'use client';

import React from 'react';
import { BankDetails } from '@/types';

interface BankDetailsFormProps {
  data: BankDetails;
  onChange: (data: BankDetails) => void;
}

export default function BankDetailsForm({ data, onChange }: BankDetailsFormProps) {

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
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const handleChange = (field: keyof BankDetails, value: string) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <div style={{ padding: '20px 24px', borderBottom: '1px solid #e5e7eb' }}>
      
      <p style={sectionTitleStyle}>Bank Details (Optional)</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>

        <div>
          <label style={labelStyle}>Bank Name</label>
          <input
            style={inputStyle}
            placeholder="Eg. HDFC Bank"
            value={data.bankName || ''}
            onChange={(e) => handleChange('bankName', e.target.value)}
          />
        </div>

        <div>
          <label style={labelStyle}>Account Number</label>
          <input
            style={inputStyle}
            placeholder="Eg. 1234567890"
            value={data.accountNumber || ''}
            onChange={(e) => handleChange('accountNumber', e.target.value)}
          />
        </div>

        <div>
          <label style={labelStyle}>IFSC Code</label>
          <input
            style={inputStyle}
            placeholder="Eg. HDFC0001234"
            value={data.ifscCode || ''}
            onChange={(e) => handleChange('ifscCode', e.target.value)}
          />
        </div>

        <div>
          <label style={labelStyle}>UAN Number</label>
          <input
            style={inputStyle}
            placeholder="Eg. 100200300400"
            value={data.uanNumber || ''}
            onChange={(e) => handleChange('uanNumber', e.target.value)}
          />
        </div>

        <div>
          <label style={labelStyle}>ESI Number</label>
          <input
            style={inputStyle}
            placeholder="Eg. ESIC123456"
            value={data.esiNumber || ''}
            onChange={(e) => handleChange('esiNumber', e.target.value)}
          />
        </div>

        <div>
          <label style={labelStyle}>PAN Number</label>
          <input
            style={inputStyle}
            placeholder="Eg. ABCDE1234F"
            value={data.panNumber || ''}
            onChange={(e) => handleChange('panNumber', e.target.value)}
          />
        </div>

      </div>
    </div>
  );
}