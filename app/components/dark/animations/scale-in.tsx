'use client';

import MotionWrapper from './motion-wrapper';
import type { ReactNode } from 'react';

interface ScaleInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

export default function ScaleIn({ children, delay = 0, duration = 0.5, className = '', once = true }: ScaleInProps) {
  return (
    <MotionWrapper variant="scaleIn" delay={delay} duration={duration} className={className} once={once}>
      {children}
    </MotionWrapper>
  );
}
