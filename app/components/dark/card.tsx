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
        'relative border border-border-1 rounded-lg overflow-hidden',
        variant === 'top-light' &&
          'before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-light before:to-transparent',
        variant === 'left-light' &&
          'before:absolute before:inset-y-0 before:left-0 before:w-[2px] before:bg-gradient-to-b before:from-transparent before:via-light before:to-transparent',
        className
      )}
    >
      {children}
    </div>
  );
}

// Card Header component for consistent styling
export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('p-4 bg-zinc-900/30', className)}>{children}</div>;
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={cn('p-6 bg-card-1', className)}>{children}</div>;
}
