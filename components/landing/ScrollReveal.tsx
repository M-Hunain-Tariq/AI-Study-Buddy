'use client';

import React, { useEffect, useRef, useState } from 'react';

export type RevealAnimation =
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'zoom-in'
  | 'fade';

interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: RevealAnimation;
  delay?: number;
  duration?: number;
  threshold?: number;
  rootMargin?: string;
  className?: string;
  as?: React.ElementType;
}

/**
 * Progressive-enhancement reveal wrapper.
 * Content is visible in SSR/first paint, then animates once when it enters view.
 * Only opacity/transform are animated to keep scrolling inexpensive.
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 560,
  threshold = 0.08,
  rootMargin = '0px 0px -32px 0px',
  className = '',
  as: Component = 'div',
}) => {
  const [hasMounted, setHasMounted] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [transitionCompleted, setTransitionCompleted] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    const element = elementRef.current;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !('IntersectionObserver' in window) || !element) {
      setIsRevealed(true);
      setTransitionCompleted(true);
      return;
    }

    // Reveal immediately if already visible; otherwise wait until the user scrolls near it.
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setIsRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsRevealed(true);
          observer.unobserve(element);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [hasMounted, threshold, rootMargin]);

  useEffect(() => {
    if (!isRevealed || transitionCompleted) return;
    const timer = window.setTimeout(() => setTransitionCompleted(true), delay + duration + 80);
    return () => window.clearTimeout(timer);
  }, [isRevealed, transitionCompleted, delay, duration]);

  const getInitialTransform = () => {
    switch (animation) {
      case 'fade-up': return 'translate3d(0, 22px, 0)';
      case 'fade-down': return 'translate3d(0, -22px, 0)';
      case 'fade-left': return 'translate3d(22px, 0, 0)';
      case 'fade-right': return 'translate3d(-22px, 0, 0)';
      case 'zoom-in': return 'scale(0.97) translate3d(0, 10px, 0)';
      case 'fade':
      default: return 'none';
    }
  };

  // Never hide SSR content. After hydration, off-screen items wait to reveal on scroll.
  const style: React.CSSProperties = !hasMounted || transitionCompleted
    ? {}
    : {
        opacity: isRevealed ? 1 : 0,
        transform: isRevealed ? 'none' : getInitialTransform(),
        transition: `opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
        willChange: isRevealed ? 'auto' : 'opacity, transform',
      };

  return <Component ref={elementRef} style={style} className={className}>{children}</Component>;
};
