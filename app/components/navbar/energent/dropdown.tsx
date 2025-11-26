'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

export interface DropdownItem {
  id: string;
  label: string;
  href: string;
  description?: string;
  icon?: LucideIcon;
  isExternal?: boolean;
}

interface DropdownProps {
  label: string;
  items: DropdownItem[];
  className?: string;
  triggerClassName?: string;
  dropdownClassName?: string;
  isActive?: boolean;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  onItemClick?: (item: DropdownItem) => void;
  columnCount?: number;
}

export function Dropdown({
  label,
  items,
  className,
  triggerClassName,
  dropdownClassName,
  isOpen: externalIsOpen,
  onOpenChange,
  onItemClick,
  columnCount,
}: DropdownProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  // Use external control if provided, otherwise use internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = onOpenChange ?? setInternalIsOpen;
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsOpen]);

  const handleItemClick = (item: DropdownItem) => {
    setIsOpen(false);
    onItemClick?.(item);
  };

  // Calculate grid columns class based on columnCount
  const getGridColumnsClass = () => {
    if (!columnCount || columnCount === 1) return '';
    if (columnCount === 2) return 'grid-cols-2';
    if (columnCount === 3) return 'grid-cols-3';
    if (columnCount === 4) return 'grid-cols-4';
    return `grid-cols-${columnCount}`;
  };

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      <button
        className={cn(
          'px-6 py-2 text-sm transition-colors relative z-10 flex items-center gap-1 whitespace-nowrap',
          'text-foreground hover:bg-accent',
          triggerClassName
        )}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
      >
        <span className="flex-shrink-0">{label}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={cn(
              'absolute top-full left-0 mt-1 z-50 rounded-md border shadow-lg',
              'bg-popover text-popover-foreground border-border',
              columnCount && columnCount > 1 ? 'min-w-[800px] max-h-[80vh] overflow-y-auto' : 'min-w-[200px]',
              dropdownClassName
            )}
            onMouseLeave={() => setIsOpen(false)}
          >
            <div className={cn('py-1', columnCount && columnCount > 1 ? `grid gap-0 ${getGridColumnsClass()}` : '')}>
              {items.map((item, index) => {
                const Icon = item.icon;
                const isMultiColumn = columnCount && columnCount > 1;
                const columnIndex = isMultiColumn ? index % columnCount : 0;
                const isLastInColumn = isMultiColumn && columnIndex === columnCount - 1;

                return item.isExternal ? (
                  <a
                    key={item.id}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'block px-4 py-2 text-sm transition-colors hover:bg-accent text-accent-foreground',
                      isMultiColumn && !isLastInColumn ? 'border-r border-border' : ''
                    )}
                    onClick={() => handleItemClick(item)}
                  >
                    <div className="flex items-start gap-3">
                      {Icon && (
                        <div className="flex-shrink-0 mt-0.5">
                          <Icon className={cn('w-4 h-4', 'text-accent-foreground')} />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="font-medium">{item.label}</div>
                        {item.description && (
                          <div className={cn('text-xs mt-1', 'text-accent-foreground/80')}>{item.description}</div>
                        )}
                      </div>
                    </div>
                  </a>
                ) : (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={cn(
                      'block px-4 py-2 text-sm transition-colors hover:bg-accent text-accent-foreground',
                      isMultiColumn && !isLastInColumn ? 'border-r border-border' : ''
                    )}
                    onClick={() => handleItemClick(item)}
                  >
                    <div className="flex items-start gap-3">
                      {Icon && (
                        <div className="flex-shrink-0 mt-0.5">
                          <Icon className={cn('w-4 h-4', 'text-accent-foreground')} />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="font-medium">{item.label}</div>
                        {item.description && (
                          <div className={cn('text-xs mt-1', 'text-accent-foreground/80')}>{item.description}</div>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
