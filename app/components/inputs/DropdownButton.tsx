import { CaretDown, CaretUp, Icon } from '@phosphor-icons/react';
import React, { useState, useRef } from 'react';

export interface Option {
  value: string;
  label: string;
  callback?: () => void;
}

interface DropdownButtonProps {
  options: Option[];
  optionLabel?: string;
  disabled?: boolean;
  icon?: Icon;
}

const DropdownButton = ({ options, disabled = false, optionLabel, icon: Icon }: DropdownButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionClick = (option: Option) => {
    option.callback && option.callback();
    setIsOpen(false);
  };

  return (
    <div className={`relative w-full text-md ${disabled ? 'pointer-events-none opacity-50' : ''}`} ref={selectRef}>
      <div
        className="bg-cambio-gray rounded-xl cursor-pointer text-neutral-100 w-full h-full flex justify-center items-center"
        onClick={toggleDropdown}
      >
        {Icon && <Icon size={24} />}
        <div className="p-2 relative mr-8">{optionLabel ? optionLabel : 'Select an option'}</div>
        {isOpen ? (
          <CaretUp size={24} className="absolute right-2 top-1/4" />
        ) : (
          <CaretDown size={24} className="absolute right-2 top-1/4" />
        )}
      </div>
      {isOpen && !disabled && (
        <div
          className="absolute z-[100] mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-[200px] overflow-y-auto"
        >
          {options.map((option) => (
            <div
              key={option.value}
              className="p-2 cursor-pointer hover:bg-gray-100 overflow-hidden truncate text-center"
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownButton;
