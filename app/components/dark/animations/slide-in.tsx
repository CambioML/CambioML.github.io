'use client';

import MotionWrapper from './motion-wrapper';
import type { ReactNode } from 'react';

type Direction = 'left' | 'right' | 'up' | 'down';

interface SlideInProps {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

export default function SlideIn({
  children,
  direction = 'left',
  delay = 0,
  duration = 0.5,
  className = '',
  once = true,
}: SlideInProps) {
  const getVariant = () => {
    switch (direction) {
      case 'left':
        return 'slideInLeft';
      case 'right':
        return 'slideInRight';
      case 'up':
        return 'slideInUp';
      case 'down':
        return 'slideInDown';
      default:
        return 'slideInLeft';
    }
  };

  return (
    <MotionWrapper variant={getVariant()} delay={delay} duration={duration} className={className} once={once}>
      {children}
    </MotionWrapper>
  );
}
