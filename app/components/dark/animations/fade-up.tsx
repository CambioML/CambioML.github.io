'use client';

import { motion, type MotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

interface FadeUpProps extends MotionProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export default function FadeUp({ children, delay = 0, className = '', ...rest }: FadeUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{
        duration: 0.5,
        ease: 'easeOut',
        delay,
      }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
