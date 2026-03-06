// Component: Employee Information Form
// Collects employee details like name, ID, designation, department, date of joining

'use client';

import React, { useState } from 'react';
import { EmployeeInfo } from '@/types';
import InputField from './InputField';

interface EmployeeFormProps {
  data: EmployeeInfo;
  onChange: (data: EmployeeInfo) => void;
}

export default function EmployeeForm({ data, onChange }: EmployeeFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof EmployeeInfo, value: string) => {
    onChange({
      ...data,
      [field]: value,
    });

    // Clear error for this field
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Employee Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Employee Name"
          name="name"
          value={data.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Enter full name"
          error={errors.name}
          required
        />

        <InputField
          label="Employee ID"
          name="employeeId"
          value={data.employeeId}
          onChange={(e) => handleInputChange('employeeId', e.target.value)}
          placeholder="Enter employee ID"
          error={errors.employeeId}
          required
        />

        <InputField
          label="Designation"
          name="designation"
          value={data.designation}
          onChange={(e) => handleInputChange('designation', e.target.value)}
          placeholder="Enter designation"
          error={errors.designation}
          required
        />

        <InputField
          label="Department"
          name="department"
          value={data.department}
          onChange={(e) => handleInputChange('department', e.target.value)}
          placeholder="Enter department"
          error={errors.department}
          required
        />

        <InputField
          label="Date of Joining"
          name="dateOfJoining"
          type="date"
          value={data.dateOfJoining}
          onChange={(e) => handleInputChange('dateOfJoining', e.target.value)}
          error={errors.dateOfJoining}
          required
        />

        <InputField
          label="Email (Optional)"
          name="email"
          type="email"
          value={data.email || ''}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="Enter employee email"
        />

        <InputField
          label="Phone (Optional)"
          name="phone"
          value={data.phone || ''}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          placeholder="Enter employee phone"
        />
      </div>
    </div>
  );
}
