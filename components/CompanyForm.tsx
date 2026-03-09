// Component: Company Information Form
// Collects company details including logo upload
// Manages state for company name, address, city, pincode, country, and logo

'use client';

import React, { useState } from 'react';
import { CompanyInfo } from '@/types';
import InputField from './InputField';
import Button from './Button';

interface CompanyFormProps {
  data: CompanyInfo;
  onChange: (data: CompanyInfo) => void;
  onLogoUpload?: (url: string) => void;
}

export default function CompanyForm({ data, onChange, onLogoUpload }: CompanyFormProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(data.logo || null);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!data.name.trim()) newErrors.name = 'Company name is required';
    if (!data.address.trim()) newErrors.address = 'Address is required';
    if (!data.city.trim()) newErrors.city = 'City is required';
    if (!data.pincode.trim()) newErrors.pincode = 'Pincode is required';
    if (!data.country.trim()) newErrors.country = 'Country is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CompanyInfo, value: string) => {
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

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors({ ...errors, logo: 'Please select an image file' });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, logo: 'File size must be less than 5MB' });
      return;
    }

    setUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to server (API route will handle Supabase upload)
      const formData = new FormData();
      formData.append('file', file);
      formData.append('companyId', data.id || '');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        onChange({
          ...data,
          logo: result.data.url,
          logoBucket: result.data.bucket,
        });
        if (onLogoUpload) {
          onLogoUpload(result.data.url);
        }
        setErrors({ ...errors, logo: '' });
      } else {
        setErrors({ ...errors, logo: result.error || 'Upload failed' });
      }
    } catch (error) {
      console.error('Logo upload error:', error);
      setErrors({ ...errors, logo: 'Failed to upload logo' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Company Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Company Name"
          name="name"
          value={data.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Enter company name"
          error={errors.name}
          required
        />

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Company Logo</label>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                disabled={uploading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.logo && <p className="text-red-500 text-sm mt-1">{errors.logo}</p>}
            </div>
            {logoPreview && (
              <img
                src={logoPreview}
                alt="Company Logo"
                className="h-16 w-16 object-contain border border-gray-300 rounded"
              />
            )}
          </div>
        </div>

        <InputField
          label="Address"
          name="address"
          value={data.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          placeholder="Enter street address"
          error={errors.address}
          required
        />

        <InputField
          label="City"
          name="city"
          value={data.city}
          onChange={(e) => handleInputChange('city', e.target.value)}
          placeholder="Enter city"
          error={errors.city}
          required
        />

        <InputField
          label="Pincode"
          name="pincode"
          value={data.pincode}
          onChange={(e) => handleInputChange('pincode', e.target.value)}
          placeholder="Enter pincode"
          error={errors.pincode}
          required
        />

        <InputField
          label="Country"
          name="country"
          value={data.country}
          onChange={(e) => handleInputChange('country', e.target.value)}
          placeholder="Enter country"
          error={errors.country}
          required
        />

        <InputField
          label="Email (Optional)"
          name="email"
          type="email"
          value={data.email || ''}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="Enter company email"
        />

        <InputField
          label="Phone (Optional)"
          name="phone"
          value={data.phone || ''}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          placeholder="Enter company phone"
        />

        <InputField
          label="GST Number (Optional)"
          name="gstNumber"
          value={data.gstNumber || ''}
          onChange={(e) => handleInputChange('gstNumber', e.target.value)}
          placeholder="Enter GST number"
        />

        <InputField
          label="PAN Number (Optional)"
          name="panNumber"
          value={data.panNumber || ''}
          onChange={(e) => handleInputChange('panNumber', e.target.value)}
          placeholder="Enter PAN number"
        />
      </div>
    </div>
  );
}
