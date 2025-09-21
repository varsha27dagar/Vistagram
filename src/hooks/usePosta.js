// src/hooks/usePosts.js
import { useState, useEffect, useCallback } from 'react';
import { generateUniqueId } from '../utils/helpers';

/**
 * Custom hook for managing a list of posts, including persistence to localStorage.
 * @returns {object} An object containing posts, currentIndex, direction, and various post-related functions.
 */
export const usePosts = () => {
  const [posts, setPosts] = useState(() => {
    try {
      const storedPosts = localStorage.getItem('vistagramPosts');
      return storedPosts ? JSON.parse(storedPosts) : [];
    } catch (error) {
      console.error("Failed to parse posts from localStorage", error);
      return [];
    }
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Persist posts to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('vistagramPosts', JSON.stringify(posts));
    } catch (error) {
      console.error("Failed to save posts to localStorage (Quota Exceeded might be an issue with large images).", error);
    }
  }, [posts]);

  // Adjust currentIndex if posts array changes (e.g., post deleted or added)
  useEffect(() => {
    if (posts.length === 0) {
      setCurrentIndex(0);
    } else if (currentIndex >= posts.length) {
      setCurrentIndex(posts.length - 1);
    }
  }, [posts.length, currentIndex]);

  /**
   * Navigates to the next or previous post in the carousel.
   * @param {number} newDirection - 1 for next, -1 for previous.
   */
  const paginate = useCallback((newDirection) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (posts.length === 0) return 0;
      if (nextIndex < 0) {
        nextIndex = posts.length - 1; // Wrap around to last post
      } else if (nextIndex >= posts.length) {
        nextIndex = 0; // Wrap around to first post
      }
      return nextIndex;
    });
  }, [posts.length]);

  /**
   * Adds a new post to the beginning of the posts array.
   * @param {string} imageBase64 - The image data in Base64 format.
   * @param {string} captionText - The caption for the post.
   * @param {string[]} tagsArray - An array of tags for the post.
   * @returns {object} The newly created post object.
   */
  const addPost = useCallback((imageBase64, captionText, tagsArray) => {
    const newPostItem = {
      id: generateUniqueId(),
      image: imageBase64,
      caption: captionText,
      tags: tagsArray,
      time: new Date().toLocaleString(),
      likes: 0,
      shares: 0,
      comments: [],
      liked: false,
    };

    setPosts((prevPosts) => [newPostItem, ...prevPosts]);
    setCurrentIndex(0); // Show the newly added post
    return newPostItem;
  }, []);

  /**
   * Deletes a post by its ID.
   * @param {string} idToDelete - The ID of the post to delete.
   */
  const deletePost = useCallback((idToDelete) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== idToDelete));
  }, []);

  /**
   * Toggles the like status of a post and updates the like count.
   * @param {string} id - The ID of the post to like/unlike.
   * @returns {boolean|undefined} True if liked, false if unliked, undefined if post not found.
   */
  const toggleLike = useCallback((id) => {
    let likedStatusChanged;
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === id) {
          const newLikedStatus = !post.liked;
          const newLikesCount = newLikedStatus ? post.likes + 1 : post.likes - 1;
          likedStatusChanged = newLikedStatus; // Capture the status for external use
          return { ...post, liked: newLikedStatus, likes: newLikesCount };
        }
        return post;
      })
    );
    return likedStatusChanged; // Return the new liked status
  }, []);

  /**
   * Increments the share count for a post.
   * @param {string} id - The ID of the post that was shared.
   */
  const incrementShare = useCallback((id) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === id ? { ...post, shares: post.shares + 1 } : post
      )
    );
  }, []);

  return {
    posts,
    currentPost: posts[currentIndex],
    currentIndex,
    direction,
    addPost,
    deletePost,
    toggleLike,
    incrementShare,
    paginate,
    setCurrentIndex // Expose for external control if needed, e.g., after post creation
  };
};