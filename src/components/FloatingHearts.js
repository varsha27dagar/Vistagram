// src/components/FloatingHearts.js
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { generateUniqueId } from '../utils/helpers';

/**
 * Manages and displays an animation of hearts floating upwards from a specific point.
 * @param {object} props - Component props.
 * @param {string} props.triggerId - A unique ID that changes to trigger a new heart animation.
 * @param {HTMLElement} props.targetRef - A ref to the element from which hearts should originate (e.g., the post image).
 * @returns {JSX.Element} The FloatingHearts component.
 */
const FloatingHearts = ({ triggerId, targetRef }) => {
  const [floatingHearts, setFloatingHearts] = useState([]);

  // Trigger heart animation when `triggerId` changes
  useEffect(() => {
    if (triggerId && targetRef && targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      setFloatingHearts((prev) => [
        ...prev,
        {
          id: generateUniqueId(),
          x: centerX,
          y: centerY,
          initialOpacity: 1,
          initialScale: 0.8,
        },
      ]);
    }
  }, [triggerId, targetRef]);

  // Remove hearts after their animation is complete
  useEffect(() => {
    if (floatingHearts.length > 0) {
      const timer = setTimeout(() => {
        setFloatingHearts((prev) => prev.slice(1));
      }, 1000); // Duration of the heart animation
      return () => clearTimeout(timer);
    }
  }, [floatingHearts]);

  return (
    <AnimatePresence>
      {floatingHearts.map((heart) => (
        <motion.div
          key={heart.id}
          initial={{
            x: heart.x,
            y: heart.y,
            opacity: heart.initialOpacity,
            scale: heart.initialScale,
            position: "fixed",
            zIndex: 9999,
            pointerEvents: "none", // Ensures clicks pass through
            marginLeft: '-15px', // Center the heart icon
            marginTop: '-15px', // Center the heart icon
          }}
          animate={{
            y: heart.y - 100, // Float upwards
            opacity: 0,
            scale: 1.5,
            transition: { duration: 1, ease: "easeOut" },
          }}
          exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.3 } }}
        >
          <Heart className="w-8 h-8 fill-red-500 text-red-500" />
        </motion.div>
      ))}
    </AnimatePresence>
  );
};

export default FloatingHearts;