'use client';

import { useState, useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

interface MouseFollowerProps {
  size?: number;
  delay?: number;
  opacity?: number;
}

export function MouseFollower({ size = 12, delay = 0.1, opacity = 1 }: MouseFollowerProps) {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Create motion values for x and y coordinates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Create spring animations for smooth following
  const springConfig = { damping: 40, stiffness: 200, mass: 0.5 };
  const followerX = useSpring(mouseX, springConfig);
  const followerY = useSpring(mouseY, springConfig);

  // Ensure component only runs on client side
  useEffect(() => {
    setMounted(true);

    // Set initial position to center of screen to avoid jumps
    const initialX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
    const initialY = typeof window !== 'undefined' ? window.innerHeight / 2 : 0;
    mouseX.set(initialX);
    mouseY.set(initialY);

    // Make visible after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [mouseX, mouseY]);

  useEffect(() => {
    if (!mounted) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Update motion values with current mouse position
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      // Make follower visible after first mouse movement
      if (!isVisible) {
        setIsVisible(true);
      }
    };

    // Handle mouse entering/leaving the window
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseenter', handleMouseEnter);

    // Clean up event listeners
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible, mouseX, mouseY, mounted]);

  if (!mounted) return null;

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[9999]"
      style={{
        x: followerX,
        y: followerY,
        opacity: isVisible ? opacity : 0,
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'linear-gradient(180deg, rgb(112, 190, 250) 0%, rgba(255, 255, 255, 0.8) 100%)',
        transition: 'opacity 0.3s ease',
        transform: 'translate(-50%, -50%)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? opacity : 0 }}
      transition={{
        type: 'tween',
        duration: 0.3,
        ease: 'easeOut',
        delay,
      }}
    />
  );
}
