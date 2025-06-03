'use client';

import MotionWrapper from './motion-wrapper';
import type { ReactNode } from 'react';

interface FadeInUpProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

export default function FadeInUp({ children, delay = 0, duration = 0.5, className = '', once = true }: FadeInUpProps) {
  return (
    <MotionWrapper variant="fadeInUp" delay={delay} duration={duration} className={className} once={once}>
      {children}
    </MotionWrapper>
  );
}
