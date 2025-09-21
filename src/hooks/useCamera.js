// src/hooks/useCamera.js
import { useRef, useCallback, useState, useEffect } from 'react';

/**
 * Custom hook to manage camera access and photo capture.
 * @returns {object} An object containing videoRef, canvasRef, capturedImage (Base64),
 *                   startCamera, stopCamera, capturePhoto, and clearCapturedImage.
 */
export const useCamera = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null); // Base64 string

  /**
   * Starts the camera stream.
   * @returns {boolean} True if camera access was successful, false otherwise.
   */
  const startCamera = useCallback(async () => {
    stopCamera(); // Ensure any previous stream is stopped
    setCapturedImage(null); // Clear previous captured image
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      return true;
    } catch (err) {
      console.error("Error accessing camera: ", err);
      return false;
    }
  }, []);

  /**
   * Stops the camera stream and releases media tracks.
   */
  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  }, []);

  /**
   * Captures a photo from the video stream and converts it to a Base64 image.
   */
  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      // Set canvas dimensions to match video dimensions for correct aspect ratio
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL("image/png"); // Capture as Base64 PNG
      setCapturedImage(imageData);
      stopCamera(); // Stop camera after capture
    }
  }, [stopCamera]);

  /**
   * Clears the currently captured image.
   */
  const clearCapturedImage = useCallback(() => {
    setCapturedImage(null);
  }, []);

  // Effect to clean up camera on component unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    videoRef,
    canvasRef,
    capturedImage,
    setCapturedImage, // Allow external setting for initial value or file uploads
    startCamera,
    stopCamera,
    capturePhoto,
    clearCapturedImage,
  };
};