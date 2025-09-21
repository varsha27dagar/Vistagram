// src/App.js
import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from './hooks/useToast';
import Header from './components/Header';
import Footer from './components/Footer';
import Modal from './components/Modal';
import PostForm from './components/PostForm';
import Toast from './components/Toast';
import PostCard from './components/PostCard';
import { slideVariants } from './utils/framerMotionVariants'; // Import only necessary variants here
import { usePosts } from './hooks/usePosta';
import { useMobileDetection } from './hooks/useMobileDirection';

function App() {
  const {
    posts,
    currentPost,
    currentIndex,
    direction,
    addPost,
    deletePost,
    toggleLike,
    incrementShare,
    paginate,
  } = usePosts();

  const { toastMessage, toastType, showToast } = useToast();
  const isMobile = useMobileDetection();

  const [showModal, setShowModal] = useState(false);

  // Ref to the current post image, passed to PostCard for floating hearts animation
  const currentPostImageRef = useRef(null);

  /**
   * Handles the submission of the new post form.
   * @param {object} postData - Contains imageBase64, caption, and tagsArray.
   */
  const handlePostSubmit = useCallback(({ imageBase64, caption, tagsArray }) => {
    addPost(imageBase64, caption, tagsArray);
    showToast("Post added successfully!", "success");
    setShowModal(false); // Close modal after successful post
  }, [addPost, showToast]);

  /**
   * Handles sharing a post. Copies link to clipboard and shows a toast.
   * @param {string} postId - The ID of the post to share.
   */
  const handleShare = useCallback((postId) => {
    incrementShare(postId);
    const shareableLink = `${window.location.origin}/post/${postId}`;
    navigator.clipboard.writeText(shareableLink).then(() => {
      showToast("Link copied!", "info");
    }).catch(err => {
      console.error("Failed to copy link: ", err);
      showToast("Failed to copy link.", "error");
    });
  }, [incrementShare, showToast]);

  /**
   * Handles deleting a post.
   * @param {string} postId - The ID of the post to delete.
   */
  const handleDelete = useCallback((postId) => {
    deletePost(postId);
    showToast("Post deleted.", "info");
  }, [deletePost, showToast]);

  /**
   * Handles opening the modal for creating a new post.
   */
  const handleAddPostClick = useCallback(() => {
    setShowModal(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans flex flex-col items-center relative overflow-hidden">
      {/* Toast Notifications */}
      <Toast message={toastMessage} type={toastType} />

      {/* Header Component */}
      <Header />

      <main className="flex-grow w-full h-[calc(100vh-64px)] max-w-full flex items-center justify-center relative overflow-hidden">
        {posts.length === 0 ? (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-gray-400 text-xl md:text-2xl text-center px-4 z-10"
          >
            No posts yet! Click the '+' button to add your first Vistagram.
          </motion.p>
        ) : (
          <AnimatePresence initial={false} custom={direction}>
            {currentPost && (
              <PostCard
                key={currentPost.id}
                post={currentPost}
                direction={direction}
                onToggleLike={toggleLike}
                onShare={handleShare}
                onDelete={handleDelete}
                onPaginate={paginate}
                hasMultiplePosts={posts.length > 1}
                // No longer passing currentPostImageRef directly, FloatingHearts handles its own ref logic
              />
            )}
          </AnimatePresence>
        )}
      </main>

      {/* Footer Component */}
      <Footer onAddPostClick={handleAddPostClick} />

      {/* Post Creation Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h2 id="modal-title" className="text-2xl font-bold text-white mb-6 text-center">Create New Post</h2>
        <PostForm onSubmit={handlePostSubmit} showToast={showToast} />
      </Modal>
    </div>
  );
}

export default App;