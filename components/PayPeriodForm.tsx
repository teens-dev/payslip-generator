// Component: Pay Period Form
// Collects pay period details including month, year, paid days, and payment date

'use client';

import React, { useState } from 'react';
import { PayPeriod } from '@/types';
import InputField from './InputField';

interface PayPeriodFormProps {
  data: PayPeriod;
  onChange: (data: PayPeriod) => void;
}

export default function PayPeriodForm({ data, onChange }: PayPeriodFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof PayPeriod, value: string | number) => {
    const numValue = typeof value === 'string' ? (field === 'year' || field === 'month' ? parseInt(value) : value) : value;

    onChange({
      ...data,
      [field]: numValue,
    });

    // Clear error for this field
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  // Get current date to show in pay date field
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Pay Period Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Year */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Year <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={data.year}
            onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
            min="2000"
            max={currentYear + 1}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.year ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year}</p>}
        </div>

        {/* Month */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Month <span className="text-red-500">*</span>
          </label>
          <select
            value={data.month}
            onChange={(e) => handleInputChange('month', parseInt(e.target.value))}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.month ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select Month</option>
            {Array.from({ length: 12 }, (_, i) => {
              const month = i + 1;
              const monthName = new Date(2024, i).toLocaleDateString('en-US', {
                month: 'long',
              });
              return (
                <option key={month} value={month}>
                  {monthName} ({month})
                </option>
              );
            })}
          </select>
          {errors.month && <p className="text-red-500 text-sm mt-1">{errors.month}</p>}
        </div>

        {/* Paid Days */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Paid Days <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.5"
            value={data.paidDays}
            onChange={(e) => handleInputChange('paidDays', parseFloat(e.target.value) || 0)}
            placeholder="Enter paid days"
            min="0"
            max="31"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.paidDays ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.paidDays && <p className="text-red-500 text-sm mt-1">{errors.paidDays}</p>}
        </div>

        {/* Loss of Pay Days */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loss of Pay Days <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.5"
            value={data.lossOfPayDays}
            onChange={(e) => handleInputChange('lossOfPayDays', parseFloat(e.target.value) || 0)}
            placeholder="Enter loss of pay days"
            min="0"
            max="31"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.lossOfPayDays ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.lossOfPayDays && (
            <p className="text-red-500 text-sm mt-1">{errors.lossOfPayDays}</p>
          )}
        </div>

        {/* Pay Date */}
        <InputField
          label="Pay Date"
          name="payDate"
          type="date"
          value={data.payDate}
          onChange={(e) => handleInputChange('payDate', e.target.value)}
          error={errors.payDate}
          required
        />
      </div>

      {/* Summary Card */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">Pay Period Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">Period</p>
            <p className="font-semibold text-gray-800">
              {data.month}/{data.year}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Paid Days</p>
            <p className="font-semibold text-gray-800">{data.paidDays}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Loss of Pay</p>
            <p className="font-semibold text-gray-800">{data.lossOfPayDays}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Days</p>
            <p className="font-semibold text-gray-800">
              {(data.paidDays + data.lossOfPayDays).toFixed(1)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
