import React, { useState, useCallback, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Cropper from "react-easy-crop";
import { Range, getTrackBackground } from "react-range";
import { Button } from "../ui/button";

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 3;

export default function CropperUploader({
  title = "Crop Image",
  isOpen = false,
  initialImage,
  onCropComplete,
  onCancel,
  cropRatio = 1,
}) {
  if (!isOpen) return null;

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showMessage, setShowMessage] = useState(true);

  const handleCropArea = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleDone = () => {
    onCropComplete?.(croppedAreaPixels);
  };

  useEffect(() => {
    if (crop.x !== 0 || crop.y !== 0 || zoom !== 1) {
      setShowMessage(false);
    } else {
      setShowMessage(true);
    }
  }, [crop, zoom]);

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="max-w-[500px] h-fit border border-gray-800">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="w-full flex flex-col gap-5 pb-6 items-start justify-between">
          <div className="w-full">
            <div className="w-full h-auto max-h-[300px] aspect-square relative">
              {showMessage && (
                <div className="px-5 py-2 bg-[#56565693] backdrop-blur-md rounded-md absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-[+1] pointer-events-none">
                  <p className="text-white text-paragraph-15">
                    Drag to reposition
                  </p>
                </div>
              )}
              <Cropper
                classes={{
                  mediaClassName: "transition-transform ease-linear",
                  containerClassName:
                    "absolute top-0 left-0 right-0 bottom-0 rounded-xl border-2 border-gray-800",
                }}
                showGrid={true}
                image={initialImage}
                crop={crop}
                zoom={zoom}
                aspect={cropRatio}
                onCropChange={setCrop}
                onCropComplete={handleCropArea}
                restrictPosition={false}
                onZoomChange={setZoom}
                zoomWithScroll
              />
            </div>
            <div className="mt-5 w-full flex items-center justify-between gap-4">
              <button
                onClick={() => {
                  if (zoom > ZOOM_MIN) setZoom(zoom - 0.3);
                }}
                type="button"
                className="size-10 min-w-10 rounded-full grid place-content-center font-bold hover:bg-gray-800 transition-all duration-300 ease-in-out"
              >
                -
              </button>
              <Range
                step={0.1}
                min={ZOOM_MIN}
                max={ZOOM_MAX}
                values={[zoom]}
                onChange={(values) => setZoom(values[0])}
                renderTrack={({ props, children }) => {
                  const { key, ...restProps } = props;
                  return (
                    <div
                      key={key}
                      {...restProps}
                      className="rounded-lg flex-grow-0"
                      style={{
                        ...props.style,
                        height: "6px",
                        width: "100%",
                        background: getTrackBackground({
                          values: [zoom],
                          colors: ["#7e0eff", "#ccc"],
                          min: ZOOM_MIN,
                          max: ZOOM_MAX,
                        }),
                      }}
                    >
                      {children}
                    </div>
                  );
                }}
                renderThumb={({ props }) => {
                  const { key, ...restProps } = props;
                  return (
                    <div
                      key={key}
                      {...restProps}
                      className="h-5 w-5 rounded-full outline-none flex justify-center items-center shadow-md bg-[#8336dc] ring-4 ring-[#0000002f]"
                    />
                  );
                }}
              />
              <button
                onClick={() => {
                  if (zoom < ZOOM_MAX) setZoom(zoom + 0.3);
                }}
                type="button"
                className="size-10 min-w-10 rounded-full grid place-content-center text-paragraph-15 font-bold  hover:bg-gray-800 transition-all duration-300 ease-in-out"
              >
                +
              </button>
            </div>
          </div>
        </div>
        <DialogFooter className="w-full flex items-center justify-end gap-4">
          <Button
            className="cursor-pointer"
            variant="outline"
            title="Cancel"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button className="cursor-pointer" title="Crop" onClick={handleDone}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
