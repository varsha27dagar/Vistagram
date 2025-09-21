// src/components/Modal.js
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { modalVariants } from '../utils/framerMotionVariants';

/**
 * A generic modal component that handles its own visibility animation.
 * @param {object} props - Component props.
 * @param {boolean} props.isOpen - Controls the visibility of the modal.
 * @param {function} props.onClose - Callback function when the modal is requested to close.
 * @param {React.ReactNode} props.children - The content to be displayed inside the modal.
 * @returns {JSX.Element|null} The Modal component, or null if not open.
 */
const Modal = ({ isOpen, onClose, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-end md:items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-4 md:p-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose} // Close modal when clicking outside
        >
          <motion.div
            className="bg-gray-800/90 backdrop-blur-xl border border-gray-700 rounded-t-2xl md:rounded-2xl p-8 pt-16 w-full max-w-lg h-auto md:h-auto shadow-2xl relative flex flex-col"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <motion.button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 text-gray-300 hover:text-white z-50 p-2 rounded-full hover:bg-gray-700 transition-colors"
              whileHover={{ rotate: 90, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Close modal"
            >
              <X height={24} width={24} />
            </motion.button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;