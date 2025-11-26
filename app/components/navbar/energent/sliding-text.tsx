'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';

interface SlidingTextProps {
  children: ReactNode;
  className?: string;
  duration?: number;
}

export function SlidingText({ children, className = '', duration = 0.3 }: SlidingTextProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn('relative overflow-hidden inline-block', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Container has a fixed height to prevent layout shifts */}
      <div className="relative">
        {/* Original content that slides up */}
        <motion.div
          className={cn('inline-block')}
          initial={{ y: 0 }}
          animate={{ y: isHovered ? '-100%' : 0 }}
          transition={{ duration, ease: 'easeInOut' }}
        >
          {children}
        </motion.div>

        {/* Clone content that slides up from bottom */}
        <motion.div
          className={cn('inline-block absolute left-0')}
          initial={{ y: '100%' }}
          animate={{ y: isHovered ? 0 : '100%' }}
          transition={{ duration, ease: 'easeInOut' }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
