'use client';

import MotionWrapper from './motion-wrapper';
import type { ReactNode } from 'react';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  variant?: 'fadeIn' | 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight';
}

export default function FadeIn({
  children,
  delay = 0,
  duration = 1,
  className = '',
  once = true,
  variant = 'fadeIn',
}: FadeInProps) {
  return (
    <MotionWrapper variant={variant} delay={delay} duration={duration} className={className} once={once}>
      {children}
    </MotionWrapper>
  );
}
