// src/components/Footer.js
import React from 'react';
import { motion } from 'framer-motion';
import { Home, Search, Plus, Bell, User } from 'lucide-react';
import { buttonHover, buttonTap } from '../utils/framerMotionVariants';

/**
 * Renders the application footer with navigation icons and a central add post button.
 * @param {object} props - Component props.
 * @param {function} props.onAddPostClick - Callback function when the '+' button is clicked.
 * @returns {JSX.Element} The Footer component.
 */
const Footer = ({ onAddPostClick }) => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-xl border-t border-gray-800 h-16 flex items-center justify-around z-40">
      <motion.button whileHover={buttonHover} whileTap={buttonTap} className="p-2 text-gray-400 hover:text-white transition-colors" aria-label="Home">
        <Home size={28} />
      </motion.button>
      <motion.button whileHover={buttonHover} whileTap={buttonTap} className="p-2 text-gray-400 hover:text-white transition-colors" aria-label="Search">
        <Search size={28} />
      </motion.button>

      {/* Central Plus Button for Adding Posts */}
      <div className="relative bottom-4 w-20 h-20 flex items-center justify-center">
        <div className="absolute w-16 h-16 bg-gray-900 rounded-full bottom-0"></div>
        <motion.button
          type="button"
          onClick={onAddPostClick}
          className="absolute bottom-0 p-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 shadow-xl hover:shadow-pink-500/50 transition-all duration-300 transform scale-100"
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Add New Post"
        >
          <Plus className="w-8 h-8 text-white" />
        </motion.button>
      </div>

      <motion.button whileHover={buttonHover} whileTap={buttonTap} className="p-2 text-gray-400 hover:text-white transition-colors" aria-label="Notifications">
        <Bell size={28} />
      </motion.button>
      <motion.button whileHover={buttonHover} whileTap={buttonTap} className="p-2 text-gray-400 hover:text-white transition-colors" aria-label="Profile">
        <User size={28} />
      </motion.button>
    </footer>
  );
};

export default Footer;