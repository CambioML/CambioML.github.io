'use client';

import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useThemeContext } from '@/app/contexts/ThemeContext';
import { cn } from '@/lib/cn';

interface ThemeToggleProps {
  variant?: 'light' | 'dark';
  className?: string;
}

export const ThemeToggle = ({ variant = 'light', className }: ThemeToggleProps) => {
  const { theme, resolvedTheme, toggleTheme } = useThemeContext();

  const getIcon = () => {
    return resolvedTheme === 'dark' ? <Moon size={16} /> : <Sun size={16} />;
  };

  const getTooltipText = () => {
    if (theme === 'auto') {
      return `Auto (${resolvedTheme})`;
    }
    return theme === 'dark' ? 'Dark mode' : 'Light mode';
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className={cn(
        'relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 group',
        variant === 'dark' || resolvedTheme === 'dark'
          ? 'bg-white/5 border border-white/10 hover:bg-white/10 text-white hover:border-white/20'
          : 'border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700',
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={getTooltipText()}
    >
      <motion.div
        key={`${theme}-${resolvedTheme}`}
        initial={{ opacity: 0, rotate: -90 }}
        animate={{ opacity: 1, rotate: 0 }}
        exit={{ opacity: 0, rotate: 90 }}
        transition={{ duration: 0.2 }}
      >
        {getIcon()}
      </motion.div>

      {/* Tooltip */}
      <div
        className={cn(
          'absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap',
          variant === 'dark' || resolvedTheme === 'dark' 
            ? 'bg-white/10 text-white border border-white/20' 
            : 'bg-gray-800 text-white'
        )}
      >
        {getTooltipText()}
      </div>
    </motion.button>
  );
};
