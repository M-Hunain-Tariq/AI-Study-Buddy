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
  delay?: number; // in milliseconds
  duration?: number; // in milliseconds
  threshold?: number;
  rootMargin?: string;
  className?: string;
  as?: React.ElementType;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 750,
  threshold = 0.08,
  rootMargin = '0px 0px -20px 0px',
  className = '',
  as: Component = 'div',
}) => {
  // Keep server-rendered landing content visible. Hiding every reveal wrapper
  // before hydration can make the whole page look blank when client JS is delayed.
  const [isRevealed, setIsRevealed] = useState(true);
  const [transitionCompleted, setTransitionCompleted] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isRevealed) return;

    // If browser doesn't support IntersectionObserver or user prefers reduced motion
    if (
      typeof window === 'undefined' ||
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setIsRevealed(true);
      setTransitionCompleted(true);
      return;
    }

    const currentEl = elementRef.current;
    if (!currentEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry && entry.isIntersecting) {
          setIsRevealed(true);
          // Permanently unobserve: one-time animation only
          if (currentEl) {
            observer.unobserve(currentEl);
          }
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(currentEl);

    // Fallback: If element is already in the viewport on mount, reveal smoothly
    const initialCheckTimer = setTimeout(() => {
      if (!isRevealed && currentEl) {
        const rect = currentEl.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          setIsRevealed(true);
          observer.disconnect();
        }
      }
    }, 120);

    return () => {
      clearTimeout(initialCheckTimer);
      observer.disconnect();
    };
  }, [threshold, rootMargin, isRevealed]);

  // Clean up inline styles once the reveal animation finishes
  useEffect(() => {
    if (isRevealed && !transitionCompleted) {
      const timer = setTimeout(() => {
        setTransitionCompleted(true);
      }, delay + duration + 60);

      return () => clearTimeout(timer);
    }
  }, [isRevealed, transitionCompleted, delay, duration]);

  // Compute transform based on animation variant
  const getInitialTransform = () => {
    switch (animation) {
      case 'fade-up':
        return 'translate3d(0, 32px, 0)';
      case 'fade-down':
        return 'translate3d(0, -32px, 0)';
      case 'fade-left':
        return 'translate3d(36px, 0, 0)';
      case 'fade-right':
        return 'translate3d(-36px, 0, 0)';
      case 'zoom-in':
        return 'scale(0.94) translate3d(0, 16px, 0)';
      case 'fade':
      default:
        return 'none';
    }
  };

  // Once transition is fully completed, completely clear inline style so child hover/transform behaves natively
  const style: React.CSSProperties = transitionCompleted
    ? {}
    : {
        opacity: isRevealed ? 1 : 0,
        transform: isRevealed ? 'none' : getInitialTransform(),
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: isRevealed ? 'auto' : 'opacity, transform',
      };

  return (
    <Component
      ref={elementRef}
      style={style}
      className={className}
    >
      {children}
    </Component>
  );
};
