'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

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
      <div className="flex bg-white dark:bg-card-1 border border-gray-300 dark:border-border-1 rounded-xl p-1 shadow-sm">
        {options.map((option) => (
          <motion.button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={cn(
              'relative px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
              activeOption === option.id
                ? 'bg-black dark:bg-gray-800 text-white shadow-lg border border-gray-800 dark:border-gray-600'
                : 'text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50'
            )}
          >
            <span className={activeOption === option.id ? 'text-white dark:bg-gradient' : ''}>{option.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
