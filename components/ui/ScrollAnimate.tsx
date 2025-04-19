// components/ui/ScrollAnimate.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';

interface ScrollAnimateProps {
  children: React.ReactNode;
  className?: string; // Allow passing additional classes
  delay?: string; // Optional delay class e.g., 'delay-100', 'delay-300'
  threshold?: number; // How much of element needs to be visible (0 to 1)
}

export default function ScrollAnimate({
  children,
  className = '',
  delay = 'delay-0', // Default delay
  threshold = 0.1 // Trigger when 10% is visible
}: ScrollAnimateProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Check if the element is intersecting
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          // Disconnect observer once visible (optional: for one-time animation)
          if (elementRef.current) {
            observer.unobserve(elementRef.current);
          }
        }
      },
      { threshold: threshold } // Use the threshold prop
    );

    // Start observing the element
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    // Cleanup function to disconnect observer
    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [threshold]); // Only re-run if threshold changes

  return (
    <div
      ref={elementRef}
      // Start hidden/translated down, apply transition + delay, become visible when isVisible is true
      className={`transition-all duration-700 ease-out ${delay} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'} ${className}`}
    >
      {children}
    </div>
  );
}