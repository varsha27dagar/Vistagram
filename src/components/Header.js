// src/components/Header.js
import React from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

/**
 * Renders the application header with a user profile button.
 * @returns {JSX.Element} The Header component.
 */
const Header = () => {
  return (
    <header className="absolute top-0 left-0 right-0 p-4 z-40">
      <motion.button
        type="button"
        className="p-3 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-lg text-white shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="User Profile"
      >
        <User size={28} />
      </motion.button>
    </header>
  );
};

export default Header;