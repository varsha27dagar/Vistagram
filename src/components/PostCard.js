// src/components/PostCard.js
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2, Share2, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  slideVariants, heartVariants, captionOverlayVariants,
  buttonHover, buttonTap, swipeConfidenceThreshold
} from '../utils/framerMotionVariants';
import FloatingHearts from './FloatingHearts';
import { useMobileDetection } from '../hooks/useMobileDirection';


/**
 * Calculates swipe power based on offset and velocity for Framer Motion drag.
 * @param {number} offset - The distance the element was dragged.
 * @param {number} velocity - The velocity of the drag.
 * @returns {number} The calculated swipe power.
 */
const swipePower = (offset, velocity) => Math.abs(offset) * velocity;

/**
 * Displays a single Vistagram post with interactive elements.
 * @param {object} props - Component props.
 * @param {object} props.post - The post object to display.
 * @param {number} props.direction - Direction of current carousel slide.
 * @param {function} props.onToggleLike - Callback for liking/unliking a post.
 * @param {function} props.onShare - Callback for sharing a post.
 * @param {function} props.onDelete - Callback for deleting a post.
 * @param {function} props.onPaginate - Callback for navigating posts.
 * @param {boolean} props.hasMultiplePosts - True if there are more than one post, to show navigation arrows.
 * @returns {JSX.Element} The PostCard component.
 */
const PostCard = ({ post, direction, onToggleLike, onShare, onDelete, onPaginate, hasMultiplePosts }) => {
  const [showCaptionOverlay, setShowCaptionOverlay] = useState(false);
  const currentPostImageRef = useRef(null);
  const [heartTrigger, setHeartTrigger] = useState(null); // Used to trigger FloatingHearts animation
  const isMobile = useMobileDetection();

  const handleLike = () => {
    onToggleLike(post.id);
    if (!post.liked) { // Only trigger visual heart animation if it was just liked
      setHeartTrigger(post.id);
    }
  };

  const handleShareClick = () => {
    onShare(post.id);
  };

  const handleDeleteClick = () => {
    onDelete(post.id);
  };

  const handleSwipeEnd = (event, { offset, velocity }) => {
    const swipe = swipePower(offset.x, velocity.x);

    if (swipe < -swipeConfidenceThreshold) {
      onPaginate(1); // Swipe left, go to next
    } else if (swipe > swipeConfidenceThreshold) {
      onPaginate(-1); // Swipe right, go to previous
    }
    setShowCaptionOverlay(false); // Hide caption on swipe
  };

  return (
    <motion.div
      key={post.id}
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={1}
      onDragEnd={handleSwipeEnd}
      className="absolute inset-0 flex items-center justify-center bg-black h-full w-full"
      role="group"
      aria-label="Post carousel item"
    >
      <img
        ref={currentPostImageRef}
        src={post.image}
        alt={`User post by ${post.caption.substring(0, 20)}...`}
        className="w-full h-full object-cover"
        onDoubleClick={handleLike}
        onClick={() => !isMobile && setShowCaptionOverlay(prev => !prev)} // Toggle caption only on single click on desktop
      />

      {/* Floating Hearts Animation */}
      <FloatingHearts triggerId={heartTrigger} targetRef={currentPostImageRef} />

      {/* Action Buttons */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 flex flex-col gap-6 z-30 p-2 rounded-l-full bg-black/30 backdrop-blur-sm">
        <div className="flex flex-col items-center">
          <motion.button
            type="button"
            onClick={handleLike}
            className="p-3 rounded-full hover:bg-white/20 transition-colors"
            whileTap={buttonTap}
            aria-label={post.liked ? "Unlike post" : "Like post"}
          >
            <motion.div
              variants={heartVariants}
              animate={post.liked ? "liked" : "unliked"}
              key={post.liked ? "liked" : "unliked"} // Force re-render of animation
            >
              <Heart
                className={`w-7 h-7 ${
                  post.liked
                    ? "fill-red-500 text-red-500 drop-shadow-[0_0_12px_rgba(255,0,0,0.8)]"
                    : "text-gray-300 hover:text-red-400"
                }`}
              />
            </motion.div>
          </motion.button>
          <span className="text-xs text-gray-300 font-medium">{post.likes}</span>
        </div>

        <div className="flex flex-col items-center">
          <motion.button
            type="button"
            onClick={handleShareClick}
            className="p-3 rounded-full hover:bg-white/20 transition-colors"
            whileTap={buttonTap}
            aria-label="Share post"
          >
            <Share2 className="w-7 h-7 text-gray-300 hover:text-blue-400" />
          </motion.button>
          <span className="text-xs text-gray-300 font-medium">{post.shares}</span>
        </div>

        <div className="flex flex-col items-center">
          <motion.button
            type="button"
            onClick={() => setShowCaptionOverlay(prev => !prev)}
            className="p-3 rounded-full hover:bg-white/20 transition-colors"
            whileTap={buttonTap}
            aria-label="Toggle caption and comments"
          >
            <MessageCircle className="w-7 h-7 text-gray-300 hover:text-green-400" />
          </motion.button>
        </div>

        <motion.button
          type="button"
          onClick={handleDeleteClick}
          className="p-3 rounded-full hover:bg-white/20 transition-colors"
          whileTap={buttonTap}
          aria-label="Delete post"
        >
          <Trash2 className="w-7 h-7 text-gray-300 hover:text-red-500" />
        </motion.button>
      </div>

      {/* Caption Overlay */}
      <AnimatePresence>
        {showCaptionOverlay && (
          <motion.div
            variants={captionOverlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            style={{bottom:55}}
            className="absolute left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent backdrop-blur-sm z-20 text-shadow-sm max-h-1/2 overflow-y-auto"
            aria-live="polite"
          >
            <p className="text-gray-200 text-sm mb-1 font-light">{post.time}</p>
            <h2 className="text-white text-3xl md:text-4xl font-extrabold mb-3 leading-tight break-words">
              {post.caption}
            </h2>
            <div className="flex flex-wrap gap-2 justify-start items-center mt-3">
              {(post.tags || []).map((tag, i) => (
                <span
                  key={i}
                  className="text-sm font-semibold bg-gradient-to-r from-pink-400 to-purple-400 text-white px-3 py-1.5 rounded-full border border-pink-400/50 shadow-md whitespace-nowrap opacity-90 hover:opacity-100 transition-opacity"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showCaptionOverlay && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-gray-300 text-sm italic z-20"
        >
          {isMobile ? "Swipe to change posts" : "Tap or double-click to view caption"}
        </motion.p>
      )}

      {/* Navigation Arrows (Desktop only, if multiple posts exist) */}
      {hasMultiplePosts && !isMobile && (
        <>
          <motion.button
            onClick={() => onPaginate(-1)}
            className="absolute left-4 z-30 p-3 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-lg text-white shadow-lg top-1/2 -translate-y-1/2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Previous post"
          >
            <ChevronLeft size={28} />
          </motion.button>
          <motion.button
            onClick={() => onPaginate(1)}
            className="absolute right-20 md:right-16 z-30 p-3 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-lg text-white shadow-lg top-1/2 -translate-y-1/2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Next post"
          >
            <ChevronRight size={28} />
          </motion.button>
        </>
      )}
    </motion.div>
  );
};

export default PostCard;