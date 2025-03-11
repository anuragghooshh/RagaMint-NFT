import { getCroppedImgBlob } from '@/utils/getCroppedImage';
import { useState } from 'react';

export function useCropImage(onCropped, onCancel) {
  const [cropFile, setCropFile] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  const handleSelectFile = file => {
    setCropFile(file);
    setShowCropper(true);
  };

  const handleCancelCrop = () => {
    setCropFile(null);
    setShowCropper(false);
    onCancel?.();
  };

  const handleCropComplete = async cropAreaPixels => {
    if (!cropFile) return;
    const imageSrc = URL.createObjectURL(cropFile);
    const croppedBlob = await getCroppedImgBlob(imageSrc, cropAreaPixels);
    const croppedFile = new File([croppedBlob], cropFile.name, { type: 'image/jpeg' });
    setCropFile(null);
    setShowCropper(false);
    onCropped && onCropped(croppedFile);
  };

  return {
    showCropper,
    cropFile,
    handleSelectFile,
    handleCancelCrop,
    handleCropComplete,
    setShowCropper,
    setCropFile
  };
}
