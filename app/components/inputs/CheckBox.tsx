import React from 'react';

interface CheckBoxProps {
  label?: string;
  checked: boolean;
  onChange: () => void;
  alternateColor?: boolean;
  id?: string;
}

const CheckBox: React.FC<CheckBoxProps> = ({ label, checked, onChange, alternateColor, id }) => {
  return (
    <label className="flex items-center space-x-2 cursor-pointer text-sm flex-grow whitespace-wrap" id={id}>
      <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
      <div
        className={`w-5 h-5 flex items-center justify-center border rounded shrink-0 ${checked ? (alternateColor ? 'bg-sky-400 border-sky-400' : 'bg-green-500 border-green-500') : 'border-gray-300'}`}
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
      {label && <span className="flex-grow text-left">{label}</span>}
    </label>
  );
};

export default CheckBox;
