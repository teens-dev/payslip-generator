// Component: Earnings and Deductions Form
// Dynamic form to add/remove earnings and deduction items
// Includes default items that can be customized

'use client';

import React, { useState } from 'react';
import { EarningItem, DeductionItem } from '@/types';
import InputField from './InputField';
import Button from './Button';

interface EarningsDeductionsProps {
  earnings: EarningItem[];
  deductions: DeductionItem[];
  onEarningsChange: (earnings: EarningItem[]) => void;
  onDeductionsChange: (deductions: DeductionItem[]) => void;
}

// Default earnings items
const DEFAULT_EARNINGS = [
  { id: 'basic-salary', name: 'Basic Salary', amount: 0 },
  { id: 'hra', name: 'House Rent Allowance', amount: 0 },
  { id: 'special-allowance', name: 'Special Allowance', amount: 0 },
  { id: 'bonus', name: 'Bonus', amount: 0 },
  { id: 'overtime', name: 'Overtime Pay', amount: 0 },
];

// Default deductions items
const DEFAULT_DEDUCTIONS = [
  { id: 'income-tax', name: 'Income Tax', amount: 0 },
  { id: 'pf', name: 'Provident Fund', amount: 0 },
  { id: 'esi', name: 'ESI', amount: 0 },
];

export default function EarningsDeductionsForm({
  earnings,
  deductions,
  onEarningsChange,
  onDeductionsChange,
}: EarningsDeductionsProps) {
  const [showAddEarning, setShowAddEarning] = useState(false);
  const [showAddDeduction, setShowAddDeduction] = useState(false);
  const [newEarningName, setNewEarningName] = useState('');
  const [newDeductionName, setNewDeductionName] = useState('');

  // Add new earning item
  const addEarning = () => {
    if (newEarningName.trim()) {
      const newEarning: EarningItem = {
        id: Date.now().toString(),
        name: newEarningName,
        amount: 0,
      };
      onEarningsChange([...earnings, newEarning]);
      setNewEarningName('');
      setShowAddEarning(false);
    }
  };

  // Add new deduction item
  const addDeduction = () => {
    if (newDeductionName.trim()) {
      const newDeduction: DeductionItem = {
        id: Date.now().toString(),
        name: newDeductionName,
        amount: 0,
      };
      onDeductionsChange([...deductions, newDeduction]);
      setNewDeductionName('');
      setShowAddDeduction(false);
    }
  };

  // Remove earning item
  const removeEarning = (id: string) => {
    onEarningsChange(earnings.filter((e) => e.id !== id));
  };

  // Remove deduction item
  const removeDeduction = (id: string) => {
    onDeductionsChange(deductions.filter((d) => d.id !== id));
  };

  // Update earning amount
  const updateEarningAmount = (id: string, amount: number) => {
    const updated = earnings.map((e) =>
      e.id === id ? { ...e, amount } : e
    );
    onEarningsChange(updated);
  };

  // Update deduction amount
  const updateDeductionAmount = (id: string, amount: number) => {
    const updated = deductions.map((d) =>
      d.id === id ? { ...d, amount } : d
    );
    onDeductionsChange(updated);
  };

  // Initialize default items if empty
  const initializeDefaults = () => {
    if (earnings.length === 0) {
      onEarningsChange(DEFAULT_EARNINGS);
    }
    if (deductions.length === 0) {
      onDeductionsChange(DEFAULT_DEDUCTIONS);
    }
  };

  React.useEffect(() => {
    initializeDefaults();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Earnings Section */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-gray-800">Earnings</h3>
          <div className="space-y-3">
            {earnings.map((item) => (
              <div
                key={item.id}
                className="flex items-end gap-3 p-3 bg-gray-50 rounded border border-gray-200"
              >
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {item.name}
                  </label>
                  <input
                    type="number"
                    value={item.amount}
                    onChange={(e) =>
                      updateEarningAmount(item.id, parseFloat(e.target.value) || 0)
                    }
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <button
                  onClick={() => removeEarning(item.id)}
                  className="px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 font-medium"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Add new earning */}
          {showAddEarning ? (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
              <input
                type="text"
                value={newEarningName}
                onChange={(e) => setNewEarningName(e.target.value)}
                placeholder="Enter earning component name"
                className="w-full px-3 py-2 border border-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-2">
                <Button
                  label="Add"
                  onClick={addEarning}
                  variant="primary"
                  className="flex-1"
                />
                <Button
                  label="Cancel"
                  onClick={() => setShowAddEarning(false)}
                  variant="secondary"
                  className="flex-1"
                />
              </div>
            </div>
          ) : (
            <Button
              label="+ Add Earning"
              onClick={() => setShowAddEarning(true)}
              variant="secondary"
              className="w-full mt-4"
            />
          )}
        </div>

        {/* Deductions Section */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-gray-800">Deductions</h3>
          <div className="space-y-3">
            {deductions.map((item) => (
              <div
                key={item.id}
                className="flex items-end gap-3 p-3 bg-gray-50 rounded border border-gray-200"
              >
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {item.name}
                  </label>
                  <input
                    type="number"
                    value={item.amount}
                    onChange={(e) =>
                      updateDeductionAmount(item.id, parseFloat(e.target.value) || 0)
                    }
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <button
                  onClick={() => removeDeduction(item.id)}
                  className="px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 font-medium"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Add new deduction */}
          {showAddDeduction ? (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
              <input
                type="text"
                value={newDeductionName}
                onChange={(e) => setNewDeductionName(e.target.value)}
                placeholder="Enter deduction component name"
                className="w-full px-3 py-2 border border-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-2">
                <Button
                  label="Add"
                  onClick={addDeduction}
                  variant="primary"
                  className="flex-1"
                />
                <Button
                  label="Cancel"
                  onClick={() => setShowAddDeduction(false)}
                  variant="secondary"
                  className="flex-1"
                />
              </div>
            </div>
          ) : (
            <Button
              label="+ Add Deduction"
              onClick={() => setShowAddDeduction(true)}
              variant="secondary"
              className="w-full mt-4"
            />
          )}
        </div>
      </div>
    </div>
  );
}
