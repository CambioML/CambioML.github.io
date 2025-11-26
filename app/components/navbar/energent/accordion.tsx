'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { motion, AnimatePresence } from 'framer-motion';
import type { ReactNode } from 'react';

interface AccordionItemProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function AccordionItem({ title, children, defaultOpen = false, className }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className={cn(
        'border border-border rounded-lg overflow-hidden transition-all duration-300',
        isOpen ? 'shadow-soft' : 'bg-transparent',
        className
      )}
    >
      <div
        className="flex justify-between items-center px-6.25 py-7.5  cursor-pointer gap-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <p className="text-foreground leading-[30px]">{title}</p>
        <motion.button
          className="flex items-center justify-center w-8 h-8 rounded-[3px] shadow-soft"
          aria-label={isOpen ? 'Close' : 'Open'}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence initial={false} mode="wait">
            {isOpen ? (
              <motion.div
                key="x-icon"
                initial={{ rotate: 45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 45, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-4 w-4 " />
              </motion.div>
            ) : (
              <motion.div
                key="plus-icon"
                initial={{ rotate: -45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -45, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Plus className="h-4 w-4 " />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: 'auto',
              opacity: 1,
              transition: {
                height: {
                  duration: 0.3,
                },
                opacity: {
                  duration: 0.25,
                  delay: 0.05,
                },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: {
                  duration: 0.3,
                },
                opacity: {
                  duration: 0.25,
                },
              },
            }}
            className="overflow-hidden"
          >
            <div className="px-6.25 pb-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface AccordionProps {
  items?: Array<{
    title: string;
    content: ReactNode;
    defaultOpen?: boolean;
  }>;
  className?: string;
  children?: ReactNode;
}

export default function Accordion({ items, className, children }: AccordionProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {items?.map((item, index) => (
        <AccordionItem key={index} title={item.title} defaultOpen={item.defaultOpen}>
          {item.content}
        </AccordionItem>
      ))}
      {children}
    </div>
  );
}
