import imageCompression from "browser-image-compression";

export const compressImage = async (file, options = {}) => {
  // Skip compression for GIFs to preserve animation
  if (file.type === "image/gif") {
    return file;
  }

  const defaultOptions = {
    maxSizeMB: 0.5, // Maximum size in MB
    maxWidthOrHeight: 1920, // Limit dimensions
    useWebWorker: true, // Use web worker for better UI performance
    initialQuality: 0.8, // Initial quality (0 to 1)
  };

  const compressionOptions = { ...defaultOptions, ...options };

  try {
    const compressedFile = await imageCompression(file, compressionOptions);

    console.log(`Original size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(
      `Compressed size: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`
    );

    return compressedFile;
  } catch (error) {
    console.error("Image compression failed:", error);
    return file; // Return original file if compression fails
  }
};
