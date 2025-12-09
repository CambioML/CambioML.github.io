'use client';

import { HTMLAttributes, ReactNode, useEffect, useState } from 'react';
import { cn } from '@/lib/cn';

interface ModalOverlayProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  isVisible: boolean;
  zIndexClass?: string;
}

const ModalOverlay = ({ children, isVisible, className, zIndexClass = 'z-50', ...rest }: ModalOverlayProps) => {
  const [renderVisible, setRenderVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setRenderVisible(isVisible));
    return () => cancelAnimationFrame(frame);
  }, [isVisible]);

  return (
    <div
      {...rest}
      className={cn(
        'fixed inset-0 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-gradient-to-t from-black/80 via-neutral-900/60 to-neutral-900/30 transition-opacity duration-300 ease-in-out',
        zIndexClass,
        renderVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        className
      )}
    >
      {children}
    </div>
  );
};

export default ModalOverlay;
