import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type CardVariant = 'top-light' | 'left-light' | 'no-light';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: CardVariant;
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className, variant = 'no-light' }: CardProps) {
  return (
    <div
      className={cn(
        'relative border border-gray-300 dark:border-border-1 rounded-lg overflow-hidden bg-white dark:bg-card-1 shadow-md dark:shadow-none',
        variant === 'top-light' &&
          'before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-black dark:before:bg-gradient-to-r dark:before:from-transparent dark:before:via-light dark:before:to-transparent',
        variant === 'left-light' &&
          'before:absolute before:inset-y-0 before:left-0 before:w-[2px] before:bg-black dark:before:bg-gradient-to-b dark:before:from-transparent dark:before:via-light dark:before:to-transparent',
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={cn('p-6 bg-white dark:bg-card-1', className)}>{children}</div>;
} 