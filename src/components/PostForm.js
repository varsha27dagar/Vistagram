import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Camera } from 'lucide-react';
import { useCamera } from '../hooks/useCamera'; // Assuming useCamera is correctly implemented to return what's needed
import { buttonHover, buttonTap } from '../utils/framerMotionVariants';

/**
 * Form for creating a new post, supporting image upload or camera capture.
 * @param {object} props - Component props.
 * @param {function} props.onSubmit - Callback function when the post form is submitted.
 *                                    Receives { imageBase64, caption, tagsArray }.
 * @param {function} props.showToast - Function to display a toast notification.
 * @returns {JSX.Element} The PostForm component.
 */
const PostForm = ({ onSubmit, showToast }) => {
  const [activeTab, setActiveTab] = useState("upload");
  const [caption, setCaption] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const fileInputRef = useRef(null);

  const {
    videoRef,
    canvasRef,
    capturedImage: cameraCapturedImage, // Rename to avoid conflict with local state for uploaded image
    setCapturedImage: setCameraCapturedImage, // Rename to avoid conflict
    startCamera,
    stopCamera,
    capturePhoto,
    clearCapturedImage: clearCameraCapturedImage // Rename to avoid conflict
  } = useCamera();

  // Unified state for the image currently being displayed/prepared for post
  const [displayImage, setDisplayImage] = useState(null);

  // Effect to manage camera lifecycle and update displayImage
  useEffect(() => {
    if (activeTab === "camera") {
      const cameraStarted = startCamera();
      if (!cameraStarted) {
        showToast("Could not access camera. Please ensure permissions are granted.", "error");
        setActiveTab("upload"); // Fallback to upload if camera fails
      }
      // When switching to camera, clear any previously uploaded image
      setDisplayImage(null);
      clearCameraCapturedImage(); // Ensure the camera hook's state is also clear
    } else { // activeTab === "upload"
      stopCamera(); // Stop camera when not in camera tab
      // When switching to upload, clear any previously captured camera image
      setDisplayImage(null);
      clearCameraCapturedImage(); // Ensure the camera hook's state is also clear
    }

    // Cleanup function for useEffect to stop camera when component unmounts or dependencies change
    return () => {
      stopCamera();
    };
  }, [activeTab, startCamera, stopCamera, showToast, clearCameraCapturedImage]);

  // Effect to sync cameraCapturedImage from hook to local displayImage state
  useEffect(() => {
    if (activeTab === "camera" && cameraCapturedImage) {
      setDisplayImage(cameraCapturedImage);
    }
  }, [cameraCapturedImage, activeTab]);


  // Handle file input change for uploads
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDisplayImage(reader.result); // Set uploaded image to displayImage
        setCameraCapturedImage(reader.result); // Also set it in the camera hook's state for consistency if it's the `capturedImage` that gets submitted.
                                              // This might be redundant depending on how `useCamera` handles `capturedImage`
                                              // but ensures `imageToSubmit` gets the correct value.
      };
      reader.readAsDataURL(file); // Read file as Base64
    }
  };

  const handleCapturePhoto = () => {
    capturePhoto(); // This updates cameraCapturedImage in the hook
    // The useEffect above will then update displayImage
  };


  const handleSubmit = () => {
    // The image to submit should be `displayImage` which holds either camera or uploaded image
    const imageToSubmit = displayImage;

    if (!imageToSubmit || !caption.trim()) {
      showToast("Please add an image and a caption!", "error");
      return;
    }

    const newTags = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    onSubmit({
      imageBase64: imageToSubmit,
      caption: caption.trim(),
      tagsArray: newTags,
    });

    // Reset form state
    setCaption("");
    setTagsInput("");
    setDisplayImage(null); // Clear image preview
    clearCameraCapturedImage(); // Ensure camera hook state is also cleared if camera was active
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Clear file input
    }
  };


  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 mb-3 p-1 bg-gray-700 rounded-xl">
        <motion.button
          type="button"
          onClick={() => setActiveTab("camera")}
          className={`flex-1 py-3 rounded-lg text-base md:text-lg font-medium transition-all duration-300 ${
            activeTab === "camera"
              ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md"
              : "text-gray-300 hover:bg-gray-600"
          }`}
          whileTap={buttonTap}
          aria-pressed={activeTab === "camera"}
        >
          Camera
        </motion.button>
        <motion.button
          type="button"
          onClick={() => setActiveTab("upload")}
          className={`flex-1 py-3 rounded-lg text-base md:text-lg font-medium transition-all duration-300 ${
            activeTab === "upload"
              ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md"
              : "text-gray-300 hover:bg-gray-600"
          }`}
          whileTap={buttonTap}
          aria-pressed={activeTab === "upload"}
        >
          Upload
        </motion.button>
      </div>

      {activeTab === "camera" && (
        <div className="flex flex-col items-center gap-4">
          {!displayImage ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded-xl bg-gray-900 border border-gray-700 aspect-video object-cover max-h-80"
              />
              <canvas ref={canvasRef} className="hidden" />
              <motion.button
                type="button"
                onClick={handleCapturePhoto} // Use the new handler
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg text-lg"
                whileHover={buttonHover}
                whileTap={buttonTap}
                aria-label="Capture Photo"
              >
                <Camera className="w-5 h-5" /> Capture
              </motion.button>
            </>
          ) : (
            <motion.img
              src={displayImage}
              alt="Preview of captured photo"
              className="w-full rounded-xl object-cover shadow-lg border border-gray-700 max-h-80"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </div>
      )}

      {activeTab === "upload" && (
        <div className="flex flex-col items-center gap-4">
          {displayImage ? (
            <motion.img
              src={displayImage}
              alt="Preview of uploaded image"
              className="w-full rounded-xl object-cover shadow-lg border border-gray-700 max-h-80"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            />
          ) : (
            <motion.label
              className="cursor-pointer w-full h-40 border-2 border-dashed border-gray-600 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-pink-400 transition-colors duration-200 text-lg font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              htmlFor="file-upload-input"
            >
              <input
                id="file-upload-input"
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <Plus className="w-8 h-8 mb-2" />
              Click to Upload
            </motion.label>
          )}
        </div>
      )}

      <div className="mt-6 space-y-3">
        <label htmlFor="caption-input" className="sr-only">Caption</label>
        <input
          id="caption-input"
          type="text"
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full px-5 py-3 rounded-xl bg-gray-900 text-white placeholder-gray-400 border border-gray-700 focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all duration-200 text-lg"
          aria-label="Caption input"
        />
        <label htmlFor="tags-input" className="sr-only">Tags</label>
        <input
          id="tags-input"
          type="text"
          placeholder="Add tags (comma separated)"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          className="w-full px-5 py-3 rounded-xl bg-gray-900 text-white placeholder-gray-400 border border-gray-700 focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all duration-200 text-lg"
          aria-label="Tags input"
        />
        <motion.button
          type="button"
          onClick={handleSubmit}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold hover:opacity-90 transition-opacity shadow-lg mt-4 text-lg"
          whileHover={buttonHover}
          whileTap={buttonTap}
          aria-label="Post button"
        >
          Post
        </motion.button>
      </div>
    </div>
  );
};

export default PostForm;