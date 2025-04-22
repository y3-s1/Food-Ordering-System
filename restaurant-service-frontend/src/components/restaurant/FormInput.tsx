// src/components/restaurant/FormInput.tsx
import React from 'react';

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  error?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  multiline = false,
  rows = 3,
  error,
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block mb-2 text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {multiline ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          rows={rows}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition-colors ${
            error ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
          placeholder={placeholder}
          required={required}
        />
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition-colors ${
            error ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
          placeholder={placeholder}
          required={required}
        />
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FormInput;