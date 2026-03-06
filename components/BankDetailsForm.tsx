// Component: Bank Details Form
// Optional form for collecting bank account and statutory number information

'use client';

import React, { useState } from 'react';
import { BankDetails } from '@/types';
import InputField from './InputField';

interface BankDetailsFormProps {
  data?: BankDetails;
  onChange: (data: BankDetails) => void;
}

export default function BankDetailsForm({ data = {}, onChange }: BankDetailsFormProps) {
  const [expanded, setExpanded] = useState(false);

  const handleInputChange = (field: keyof BankDetails, value: string) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between mb-4"
      >
        <h2 className="text-2xl font-bold text-gray-800">Bank & Statutory Details (Optional)</h2>
        <span className="text-2xl text-gray-400">{expanded ? '−' : '+'}</span>
      </button>

      {expanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Bank Name"
            name="bankName"
            value={data.bankName || ''}
            onChange={(e) => handleInputChange('bankName', e.target.value)}
            placeholder="Enter bank name"
          />

          <InputField
            label="Account Number"
            name="accountNumber"
            value={data.accountNumber || ''}
            onChange={(e) => handleInputChange('accountNumber', e.target.value)}
            placeholder="Enter account number"
          />

          <InputField
            label="IFSC Code"
            name="ifscCode"
            value={data.ifscCode || ''}
            onChange={(e) => handleInputChange('ifscCode', e.target.value)}
            placeholder="Enter IFSC code"
          />

          <InputField
            label="UAN Number"
            name="uanNumber"
            value={data.uanNumber || ''}
            onChange={(e) => handleInputChange('uanNumber', e.target.value)}
            placeholder="Enter UAN number (Format: AA1234567890)"
          />

          <InputField
            label="ESI Number"
            name="esiNumber"
            value={data.esiNumber || ''}
            onChange={(e) => handleInputChange('esiNumber', e.target.value)}
            placeholder="Enter ESI number"
          />

          <InputField
            label="PAN Number"
            name="panNumber"
            value={data.panNumber || ''}
            onChange={(e) => handleInputChange('panNumber', e.target.value)}
            placeholder="Enter PAN number"
          />
        </div>
      )}
    </div>
  );
}
