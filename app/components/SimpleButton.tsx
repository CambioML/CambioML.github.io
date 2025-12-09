'use client';

import { Icon } from '@phosphor-icons/react';

interface SimpleButtonProps {
  label: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  small?: boolean;
  compact?: boolean;
  icon?: Icon;
  labelIcon?: Icon;
}

const SimpleButton = ({
  label,
  onClick,
  disabled,
  small,
  compact,
  icon: Icon,
  labelIcon: LabelIcon,
}: SimpleButtonProps) => {
  const baseClasses = [
    'relative',
    'disabled:opacity-70',
    'disabled:cursor-not-allowed',
    'rounded-xl',
    'bg-neutral-200',
    'hover:bg-cambio-blue-0',
    'hover:text-white',
    'transition',
    'text-neutral-600',
    compact
      ? 'px-4 py-2 text-sm font-medium w-auto'
      : small
        ? 'py-3 text-lg w-full font-semibold'
        : 'py-4 text-3xl w-full font-semibold',
  ].join(' ');

  return (
    <button onClick={onClick} disabled={disabled} className={baseClasses}>
      {Icon && <Icon size={24} className="absolute left-4 top-3" />}
      <div className="flex items-center justify-center gap-2">
        <span>{label}</span>
        {LabelIcon && <LabelIcon size={24} />}
      </div>
    </button>
  );
};

export default SimpleButton;
