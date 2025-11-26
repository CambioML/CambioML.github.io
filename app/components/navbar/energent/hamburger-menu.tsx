'use client';

import { cn } from '@/lib/cn';

interface HamburgerMenuProps {
  className?: string;
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function HamburgerMenu({
  className,
  isOpen,
  onToggle,
  color = 'rgb(112, 190, 250)',
  size = 'md',
}: HamburgerMenuProps) {
  const handleClick = () => {
    const newState = !isOpen;
    onToggle?.(newState);
  };

  // Size mappings
  const sizeClasses = {
    sm: 'size-8',
    md: 'size-10',
    lg: 'size-12',
  };

  const lineWidthClasses = {
    sm: 'w-4',
    md: 'w-5',
    lg: 'w-6',
  };

  return (
    <button
      className={cn(
        sizeClasses[size],
        'flex flex-col items-center justify-center rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 relative',
        className
      )}
      onClick={handleClick}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
    >
      <div
        className={cn(
          lineWidthClasses[size],
          'h-px rounded-[1px] absolute transition-all duration-300',
          isOpen ? 'rotate-45' : 'translate-y-[-3px]'
        )}
        style={{ backgroundColor: color }}
      />
      <div
        className={cn(
          lineWidthClasses[size],
          'h-px rounded-[1px] absolute transition-all duration-300',
          isOpen ? '-rotate-45' : 'translate-y-[3px]'
        )}
        style={{ backgroundColor: color }}
      />
    </button>
  );
}
