import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { imageValidator } from "@/utils/helper";

const CloseIcon = () => {
  return (
    <svg
      width="8"
      height="8"
      viewBox="0 0 11 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.4473 5.27202L10.0272 1.70047C10.1839 1.5437 10.272 1.33108 10.272 1.10937C10.272 0.887669 10.1839 0.675046 10.0272 0.518277C9.87041 0.361509 9.65779 0.273437 9.43608 0.273438C9.21438 0.273438 9.00175 0.361509 8.84499 0.518277L5.27344 4.09815L1.70189 0.518277C1.54512 0.361509 1.3325 0.273437 1.11079 0.273438C0.88909 0.273438 0.676466 0.361509 0.519698 0.518277C0.36293 0.675046 0.274858 0.887669 0.274858 1.10937C0.274858 1.33108 0.36293 1.5437 0.519698 1.70047L4.09957 5.27202L0.519698 8.84357C0.441666 8.92096 0.379731 9.01304 0.337465 9.11449C0.295199 9.21594 0.273438 9.32476 0.273438 9.43466C0.273438 9.54456 0.295199 9.65338 0.337465 9.75483C0.379731 9.85628 0.441666 9.94836 0.519698 10.0258C0.597092 10.1038 0.689171 10.1657 0.790622 10.208C0.892074 10.2503 1.00089 10.272 1.11079 10.272C1.2207 10.272 1.32951 10.2503 1.43096 10.208C1.53242 10.1657 1.62449 10.1038 1.70189 10.0258L5.27344 6.44588L8.84499 10.0258C8.92238 10.1038 9.01446 10.1657 9.11591 10.208C9.21736 10.2503 9.32618 10.272 9.43608 10.272C9.54599 10.272 9.6548 10.2503 9.75625 10.208C9.8577 10.1657 9.94978 10.1038 10.0272 10.0258C10.1052 9.94836 10.1671 9.85628 10.2094 9.75483C10.2517 9.65338 10.2734 9.54456 10.2734 9.43466C10.2734 9.32476 10.2517 9.21594 10.2094 9.11449C10.1671 9.01304 10.1052 8.92096 10.0272 8.84357L6.4473 5.27202Z"
        fill="#ABACB6"
      />
    </svg>
  );
};

export default function ImageUploader({
  image,
  onChange,
  accept = [".png", ".jpeg", ".jpg"],
  disabled = false,
  size,
  buttonText = "Upload Image",
  className = "",
  ...props
}) {
  const inputRef = useRef(null);

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.value = null;
      inputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (imageValidator(file, size)) {
        onChange(file);
      }
    }
  };

  const removeImage = () => {
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = null;
    }
  };

  // If image is a File, create a URL for preview; otherwise, use the URL directly
  const imageUrl =
    typeof image === "string"
      ? image
      : image
      ? URL.createObjectURL(image)
      : null;

  return (
    <div className={`"relative ${className}`} {...props}>
      {imageUrl && (
        <div className="mb-2 relative">
          <img
            src={imageUrl}
            alt="Uploaded preview"
            className="w-full h-auto object-cover rounded"
          />
          <button
            onClick={removeImage}
            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow hover:bg-gray-100"
            aria-label="Remove image"
            type="button"
          >
            <CloseIcon />
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept.join(",")}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />

      <Button type="button" className="cursor-pointer flex items-center gap-1 bg-white/20 hover:bg-white/10 border border-gray-700" onClick={handleClick} disabled={disabled}>
        {buttonText}
      </Button>
    </div>
  );
}
