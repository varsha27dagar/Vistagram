// src/components/Toast.js
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Renders a toast notification component.
 * @param {object} props - Component props.
 * @param {string} props.message - The message to display in the toast.
 * @param {string} [props.type='info'] - The type of toast ('info', 'success', 'error').
 * @returns {JSX.Element} The Toast component.
 */
const Toast = ({ message, type = 'info' }) => {
  if (!message) return null;

  const typeClasses = {
    info: 'bg-blue-500',
    success: 'bg-green-500',
    error: 'bg-red-500',
  };

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-4 left-1/2 -translate-x-1/2 ${typeClasses[type]} text-white px-4 py-2 rounded-lg shadow-lg z-50`}
          role="alert"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;