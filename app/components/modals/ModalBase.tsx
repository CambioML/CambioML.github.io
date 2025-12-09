'use client';

import { ReactNode, useEffect, useMemo, useState } from 'react';
import { X } from '@phosphor-icons/react';
import { cn } from '@/lib/cn';
import { useOutsideClickModal } from '@/app/hooks/useOutsideClickModal';
import ModalOverlay from './ModalOverlay';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-3xl',
  xl: 'max-w-5xl',
  full: 'max-w-screen-2xl',
};

interface ModalBaseProps {
  isOpen?: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;
  zIndexClass?: string;
  overlayClassName?: string;
  bodyClassName?: string;
  contentClassName?: string;
  headerClassName?: string;
  hideHeader?: boolean;
  hideCloseButton?: boolean;
  overlayProps?: React.HTMLAttributes<HTMLDivElement>;
}

const ModalBase = ({
  isOpen = false,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  zIndexClass,
  overlayClassName,
  bodyClassName,
  contentClassName,
  headerClassName,
  hideHeader = false,
  hideCloseButton = false,
  overlayProps,
}: ModalBaseProps) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const containerRef = useOutsideClickModal(onClose);

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;
    if (isOpen) {
      setShouldRender(true);
      document.body.style.overflow = 'hidden';
    } else {
      timeout = setTimeout(() => setShouldRender(false), 300);
      document.body.style.overflow = '';
    }
    return () => {
      if (timeout) clearTimeout(timeout);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const maxWidthClass = useMemo(() => sizeClasses[size] || sizeClasses.md, [size]);

  if (!shouldRender) {
    return null;
  }

  return (
    <ModalOverlay isVisible={isOpen} className={overlayClassName} zIndexClass={zIndexClass} {...overlayProps}>
      <div
        className={cn(
          'relative w-full my-6 mx-auto h-full lg:h-auto md:h-auto px-4 py-6 transition-all duration-300 ease-in-out',
          maxWidthClass
        )}
      >
        <div
          className={cn(
            'translate duration-300 ease-in-out h-full',
            isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          )}
        >
          <div
            className={cn(
              'translate h-full lg:h-auto md:h-auto border border-border rounded-2xl shadow-2xl relative flex flex-col w-full bg-background text-foreground outline-none focus:outline-none',
              contentClassName
            )}
            ref={containerRef}
          >
            {!hideHeader && (
              <div className={cn('flex items-center justify-between p-4 rounded-t text-foreground', headerClassName)}>
                <div className="text-lg font-semibold">{title}</div>
                {!hideCloseButton && (
                  <button
                    onClick={onClose}
                    className="p-1 border=0 hover:opacity-70 transition rounded-full hover:bg-muted text-foreground"
                  >
                    <X size={24} />
                  </button>
                )}
              </div>
            )}
            <div className={cn('relative p-6 flex-auto', bodyClassName)}>{children}</div>
            {footer && <div className="flex flex-col gap-2 p-6">{footer}</div>}
          </div>
        </div>
      </div>
    </ModalOverlay>
  );
};

export default ModalBase;
