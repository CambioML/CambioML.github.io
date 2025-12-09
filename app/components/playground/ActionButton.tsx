import { Icon } from '@phosphor-icons/react';
import { cn } from '@/lib/cn';

type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'secondary';

interface ActionButtonProps {
  label: string;
  onClick: () => void;
  icon?: Icon;
  disabled?: boolean;
  id?: string;
  className?: string;
  fullWidth?: boolean;
  variant?: ButtonVariant;
}

const ActionButton = ({
  label,
  onClick,
  icon: IconComponent,
  disabled = false,
  id,
  className,
  fullWidth = false,
  variant = 'solid',
}: ActionButtonProps) => {
  const variantStyles = {
    solid: 'bg-blue-500 text-white shadow-[0_8px_20px_rgba(37,99,235,0.35)] hover:bg-blue-600',
    outline: 'bg-transparent text-blue-500 border-2 border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950',
    ghost: 'bg-transparent text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950',
    secondary:
      'bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-300 dark:hover:bg-neutral-600',
  };

  return (
    <button
      id={id}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-medium cursor-pointer transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantStyles[variant],
        fullWidth && 'w-full',
        className
      )}
    >
      {IconComponent && <IconComponent size={18} />}
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
};

export default ActionButton;
