// components/effects/CursorTrailEffect.tsx
'use client';

import React, { useEffect, useCallback } from 'react';

// Simple throttle function: Ensures the wrapped function doesn't run more than once per 'limit' milliseconds
function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function(this: ThisParameterType<T>, ...args: Parameters<T>): void {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}


export default function CursorTrailEffect() {
  const schoolEmojis = ['🎓', '🏫', '📚', '✏️', '💡', '✨']; // Add/change emojis here

  // Function to create and animate an emoji
  const spawnEmoji = useCallback((x: number, y: number) => {
    const emojiElement = document.createElement('span');
    const randomEmoji = schoolEmojis[Math.floor(Math.random() * schoolEmojis.length)];

    emojiElement.innerText = randomEmoji;
    emojiElement.classList.add('cursor-emoji'); // Add class for styling and animation

    // Position near the cursor (adjust offsets as desired)
    emojiElement.style.left = `${x - 10}px`;
    emojiElement.style.top = `${y - 20}px`;

    // Optional: Add slight random horizontal offset via CSS variable
    // emojiElement.style.setProperty('--random-offset', Math.random().toString());

    document.body.appendChild(emojiElement);

    // Remove the element after animation completes (match animation duration)
    setTimeout(() => {
      emojiElement.remove();
    }, 700); // 700ms matches animation duration
  }, [schoolEmojis]); // Include dependency if emojis could change (though they are constant here)


  // Throttled version of spawnEmoji specifically for mouse move
  // Only allow spawning one emoji via mouse move every 100ms max
  const throttledSpawnEmoji = useCallback(throttle(spawnEmoji, 100), [spawnEmoji]);

  useEffect(() => {
    // Handler for mouse click
    const handleClick = (event: MouseEvent) => {
      spawnEmoji(event.clientX, event.clientY);
    };

    // Handler for mouse move (throttled)
    const handleMouseMove = (event: MouseEvent) => {
      throttledSpawnEmoji(event.clientX, event.clientY);
    };

    // Add event listeners
    document.addEventListener('click', handleClick);
    document.addEventListener('mousemove', handleMouseMove);

    // Cleanup function: Remove listeners when component unmounts
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [spawnEmoji, throttledSpawnEmoji]); // Add dependencies


  // This component doesn't render anything itself, it just sets up effects
  return null;
}