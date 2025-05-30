'use client';

import { motion, type Variant } from 'framer-motion';
import { forwardRef } from 'react';
import type { ReactNode } from 'react';

export type AnimationVariant =
  | 'fadeIn'
  | 'fadeInUp'
  | 'fadeInDown'
  | 'fadeInLeft'
  | 'fadeInRight'
  | 'fadeOut'
  | 'fadeOutUp'
  | 'fadeOutDown'
  | 'fadeOutLeft'
  | 'fadeOutRight'
  | 'scaleIn'
  | 'scaleOut'
  | 'slideInLeft'
  | 'slideInRight'
  | 'slideInUp'
  | 'slideInDown';

interface MotionWrapperProps {
  children: ReactNode;
  variant?: AnimationVariant;
  delay?: number;
  duration?: number;
  once?: boolean;
  className?: string;
  viewportMargin?: string;
}

// Animation variants
const variants: Record<AnimationVariant, { initial: Variant; animate: Variant; exit?: Variant }> = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  fadeInUp: {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 60 },
  },
  fadeInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  fadeInLeft: {
    initial: { opacity: 0, x: -60 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -60 },
  },
  fadeInRight: {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 60 },
  },
  fadeOut: {
    initial: { opacity: 1 },
    animate: { opacity: 0 },
    exit: { opacity: 1 },
  },
  fadeOutUp: {
    initial: { opacity: 1, y: 0 },
    animate: { opacity: 0, y: -20 },
    exit: { opacity: 1, y: 0 },
  },
  fadeOutDown: {
    initial: { opacity: 1, y: 0 },
    animate: { opacity: 0, y: 20 },
    exit: { opacity: 1, y: 0 },
  },
  fadeOutLeft: {
    initial: { opacity: 1, x: 0 },
    animate: { opacity: 0, x: -20 },
    exit: { opacity: 1, x: 0 },
  },
  fadeOutRight: {
    initial: { opacity: 1, x: 0 },
    animate: { opacity: 0, x: 20 },
    exit: { opacity: 1, x: 0 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  },
  scaleOut: {
    initial: { opacity: 1, scale: 1 },
    animate: { opacity: 0, scale: 0.9 },
    exit: { opacity: 1, scale: 1 },
  },
  slideInLeft: {
    initial: { x: -100 },
    animate: { x: 0 },
    exit: { x: -100 },
  },
  slideInRight: {
    initial: { x: 100 },
    animate: { x: 0 },
    exit: { x: 100 },
  },
  slideInUp: {
    initial: { y: 100 },
    animate: { y: 0 },
    exit: { y: 100 },
  },
  slideInDown: {
    initial: { y: -100 },
    animate: { y: 0 },
    exit: { y: -100 },
  },
};

const MotionWrapper = forwardRef<HTMLDivElement, MotionWrapperProps>(
  (
    { children, variant = 'fadeIn', delay = 0, duration = 0.5, once = true, className = '', viewportMargin = '-100px' },
    ref
  ) => {
    const selectedVariant = variants[variant];

    return (
      <motion.div
        ref={ref}
        initial="initial"
        whileInView="animate"
        exit="exit"
        viewport={{ once, margin: viewportMargin }}
        variants={selectedVariant}
        transition={{
          duration,
          delay,
          ease: 'easeOut',
        }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }
);

MotionWrapper.displayName = 'MotionWrapper';

export default MotionWrapper;
