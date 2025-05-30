'use client';

import { motion } from 'framer-motion';

interface SwitchButtonsProps {
  options: Array<{
    id: string;
    label: string;
  }>;
  activeOption: string;
  onChange: (id: string) => void;
  className?: string;
}

export function SwitchButtons({ options, activeOption, onChange, className }: SwitchButtonsProps) {
  return (
    <div className={className}>
      <div className="flex bg-card-1 border border-border-1 rounded-xl p-1">
        {options.map((option) => (
          <motion.button
            key={option.id}
            onClick={() => onChange(option.id)}
            className="relative px-4 py-2 rounded-md text-sm font-medium text-white"
            style={{
              background: activeOption === option.id ? 'rgba(22, 22, 22)' : 'rgb(22, 22, 22, 0.5)',
              border: activeOption === option.id ? '1px solid rgb(34, 34, 34)' : 'none',
              boxShadow: activeOption === option.id ? '0px 0px 2px 0.5px rgba(112, 190, 250, 0.75)' : 'none',
            }}
          >
            <span className="bg-gradient">{option.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
