// src/hooks/useToast.js
import { useState, useCallback } from 'react';

/**
 * Custom hook to manage toast notifications.
 * @returns {Array} A tuple containing the current toast message and a function to show a toast.
 */
export const useToast = () => {
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('info'); // 'info', 'success', 'error'

  /**
   * Shows a toast message for a specified duration.
   * @param {string} message - The message to display in the toast.
   * @param {string} type - The type of toast ('info', 'success', 'error').
   * @param {number} duration - How long the toast should be visible in milliseconds.
   */
  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    setToastMessage(message);
    setToastType(type);
    const timer = setTimeout(() => {
      setToastMessage('');
      setToastType('info'); // Reset type after hiding
    }, duration);
    return () => clearTimeout(timer); // Cleanup function for useEffect (if used)
  }, []);

  return { toastMessage, toastType, showToast };
};