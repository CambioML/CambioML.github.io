import { cn } from '@/lib/cn';

interface DividerProps {
  className?: string;
}

export function Divider({ className }: DividerProps) {
  return (
    <div 
      className={cn(
        'w-full h-px bg-gray-400 dark:bg-border-1', 
        className
      )} 
    />
  );
} 