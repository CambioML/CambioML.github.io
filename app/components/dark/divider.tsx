import { cn } from '@/lib/cn';

interface DividerProps {
  className?: string;
}

export function Divider({ className }: DividerProps) {
  return <div className={cn('w-full h-px bg-gradient-to-r from-transparent via-border-1 to-transparent', className)} />;
}
