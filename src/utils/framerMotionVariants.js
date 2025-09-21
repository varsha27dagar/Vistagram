// src/utils/framerMotionVariants.js

/**
 * Framer Motion variants for slide transitions in a carousel.
 * @type {object}
 */
export const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
      scale: { duration: 0.2 }
    }
  },
  exit: (direction) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.95,
    position: 'absolute',
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
      scale: { duration: 0.2 }
    }
  }),
};

/**
 * Framer Motion variants for modal animations.
 * @type {object}
 */
export const modalVariants = {
  hidden: { opacity: 0, y: "100vh", scale: 0.8 },
  visible: {
    opacity: 1,
    y: "0",
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15, duration: 0.3 },
  },
  exit: { opacity: 0, y: "100vh", scale: 0.8 },
};

/**
 * Framer Motion variants for heart icon animation on like.
 * @type {object}
 */
export const heartVariants = {
  unliked: { scale: 1, color: '#6B7280' },
  liked: {
    scale: [1, 1.2, 1],
    color: ['#EF4444', '#EF4444', '#EF4444'],
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

/**
 * Framer Motion variants for caption overlay animation.
 * @type {object}
 */
export const captionOverlayVariants = {
  hidden: { opacity: 0, y: "100%" },
  visible: { opacity: 1, y: "0%", transition: { type: "spring", stiffness: 100, damping: 15 } },
};

/**
 * Framer Motion properties for button hover effect.
 * @type {object}
 */
export const buttonHover = { scale: 1.05 };

/**
 * Framer Motion properties for button tap effect.
 * @type {object}
 */
export const buttonTap = { scale: 0.95 };

/**
 * Threshold for swipe gesture detection.
 * @type {number}
 */
export const swipeConfidenceThreshold = 10000;