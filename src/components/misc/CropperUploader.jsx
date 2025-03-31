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
import { Minus, Plus } from "lucide-react";
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
      <DialogContent className="max-w-[500px] h-fit border border-gray-700 bg-gray-900/80 backdrop-blur-lg rounded-xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-light tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="w-full flex flex-col gap-5 pb-6 items-start justify-between">
          <div className="w-full">
            <div className="w-full h-auto max-h-[300px] aspect-square relative rounded-xl overflow-hidden">
              {showMessage && (
                <div className="px-5 py-2 bg-gray-900/80 backdrop-blur-md rounded-md absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-[+1] pointer-events-none border border-gray-700">
                  <p className="text-gray-300 text-sm">Drag to reposition</p>
                </div>
              )}
              <Cropper
                classes={{
                  mediaClassName: "transition-transform ease-linear",
                  containerClassName:
                    "absolute top-0 left-0 right-0 bottom-0 rounded-xl border-2 border-purple-400/20",
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
                className="cursor-pointer size-10 min-w-10 rounded-full grid place-content-center font-bold hover:bg-gray-800 transition-all duration-300 ease-in-out border border-gray-700"
                aria-label="Zoom out"
              >
                <Minus size={18} className="text-gray-300" />
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
                          colors: ["#7e0eff", "#2a2a2a"],
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
                      className="h-5 w-5 rounded-full outline-none flex justify-center items-center shadow-md bg-violet-400 ring-2 ring-[#6e6e6e53]"
                    />
                  );
                }}
              />
              <button
                onClick={() => {
                  if (zoom < ZOOM_MAX) setZoom(zoom + 0.3);
                }}
                type="button"
                className="cursor-pointer size-10 min-w-10 rounded-full grid place-content-center font-bold hover:bg-gray-800 transition-all duration-300 ease-in-out border border-gray-700"
                aria-label="Zoom in"
              >
                <Plus size={18} className="text-gray-300" />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Scroll to zoom, drag to reposition
            </p>
          </div>
        </div>
        <DialogFooter className="w-full flex items-center justify-end gap-4">
          <Button
            className="cursor-pointer bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700"
            variant="outline"
            title="Cancel"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button title="Save" onClick={handleDone} className="cursor-pointer bg-violet-400/20 hover:bg-violet-400/70 text-white border border-violet-400/50">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
