// src/hooks/useMobileDetection.js
import { useState, useEffect } from 'react';

/**
 * Custom hook to detect if the current viewport width is considered mobile.
 * @param {number} breakpoint - The width in pixels below which the device is considered mobile (default: 768px).
 * @returns {boolean} - True if the device is mobile, false otherwise.
 */
export const useMobileDetection = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Initial check
    checkMobile();

    // Listen for window resize events
    window.addEventListener('resize', checkMobile);

    // Clean up the event listener on component unmount
    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint]); // Re-run effect if breakpoint changes

  return isMobile;
};