// src/utils/helpers.js

/**
 * Generates a unique ID string.
 * @returns {string} A unique ID.
 */
export const generateUniqueId = () => Math.random().toString(36).substring(2, 9);