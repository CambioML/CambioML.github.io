import React from 'react';
import { cn } from '@/lib/cn';

interface CheckboxFieldProps {
  name: string;
  value: string;
  label: React.ReactNode;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  hasError?: boolean;
  errorMessage?: string;
  id?: string;
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  name,
  value,
  label,
  checked = false,
  onChange,
  hasError = false,
  errorMessage,
  id,
}) => {
  const handleChange = () => {
    onChange?.(!checked);
  };

  return (
    <div className="space-y-1">
      <label
        className={cn(
          'flex items-start space-x-2 cursor-pointer text-sm',
          hasError && 'text-red-700 dark:text-red-300'
        )}
        htmlFor={id || name}
      >
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={handleChange}
          name={name}
          value={value}
          id={id || name}
        />
        <div
          className={cn(
            'w-5 h-5 flex items-center justify-center border rounded shrink-0 mt-0.5',
            checked ? 'bg-primary border-primary' : hasError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          )}
        >
          {checked && (
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        <span className="flex-grow text-left leading-relaxed">{label}</span>
      </label>
      {hasError && errorMessage && <p className="text-sm text-red-700 dark:text-red-300 ml-7">{errorMessage}</p>}
    </div>
  );
};

export default CheckboxField;
