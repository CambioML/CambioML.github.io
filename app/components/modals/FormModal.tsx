'use client';

import React, { useCallback } from 'react';
import ModalBase from './ModalBase';
import { cn } from '@/lib/cn';

interface FormModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title?: string;
  body?: React.ReactElement;
  footer?: React.ReactElement;
  actionLabel: string;
  disabled?: boolean;
  secondaryAction?: () => void;
  secondaryActionLabel?: string;
}

const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  body,
  footer,
  actionLabel,
  disabled,
  secondaryAction,
  secondaryActionLabel,
}) => {
  const handleSubmit = useCallback(() => {
    if (disabled) return;
    onSubmit();
  }, [disabled, onSubmit]);

  const handleSecondaryAction = useCallback(() => {
    if (disabled || !secondaryAction) return;
    secondaryAction();
  }, [disabled, secondaryAction]);

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col gap-6">
        {body}
        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-center gap-4 w-full justify-end">
            {secondaryAction && secondaryActionLabel && (
              <button
                disabled={disabled}
                onClick={handleSecondaryAction}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 h-10',
                  'text-muted-foreground hover:text-foreground hover:bg-muted/60 disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                {secondaryActionLabel}
              </button>
            )}
            <button
              disabled={disabled}
              onClick={handleSubmit}
              className={cn(
                'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 h-10',
                'bg-blue-500 text-white shadow-[0_8px_20px_rgba(37,99,235,0.35)] hover:bg-blue-500/90 disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {actionLabel}
            </button>
          </div>
          {footer}
        </div>
      </div>
    </ModalBase>
  );
};

export default FormModal;
