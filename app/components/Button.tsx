'use client';

import { Icon } from '@phosphor-icons/react';
import { IconType } from 'react-icons';

interface ButtonProps {
  label: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  outline?: boolean;
  small?: boolean;
  icon?: Icon;
  labelIcon?: Icon | IconType;
  secondaryColor?: boolean;
}

const Button = ({
  label,
  onClick,
  disabled,
  outline,
  small,
  icon: Icon,
  labelIcon: LabelIcon,
  secondaryColor,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative
        disabled:opacity-70
        disabled:cursor-not-allowed
        rounded-xl
        hover:bg-neutral-200
        hover:text-cambio-gray
        transition
        w-full
        h-full
        px-4
        ${outline ? 'bg-white' : 'bg-cambio-gray'}
        ${outline ? 'border-cambio-gray' : 'border-none'}
        ${outline ? 'border-2' : 'border-none'}
        ${outline ? 'text-neutral-800' : 'text-neutral-100'}
        ${small ? 'py-2' : 'py-3'}
        ${small ? 'text-md' : 'text-lg'}
        ${!outline && secondaryColor && 'bg-sky-700'}
      `}
    >
      {Icon && (
        <Icon
          size={24}
          className="
            absolute
            left-4
            top-3
          "
        />
      )}
      <div className="flex items-center justify-center gap-2">
        {label && <span>{label} </span>}
        {LabelIcon && (
          <LabelIcon
            size={24}
            className="
            shrink-0
          "
          />
        )}
      </div>
    </button>
  );
};

export default Button;
