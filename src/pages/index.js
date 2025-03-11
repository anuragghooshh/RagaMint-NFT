import CropperUploader from "@/components/misc/CropperUploader";
import ImageUploader from "@/components/misc/Uploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { useCropImage } from "@/hooks/useCropImage";
import { LucideTrash } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [nftImage, setNftImage] = useState(null);

  const {
    showCropper,
    cropFile,
    handleSelectFile,
    handleCancelCrop,
    handleCropComplete,
  } = useCropImage(
    (file) => setNftImage(file),
    () => setNftImage(null)
  );

  const onFileInput = (file) => {
    if (!file) {
      setNftImage(null);
      return;
    }
    handleSelectFile(file);
  };

  return (
    <>
      <div className="w-full px-5 max-w-[480px] mx-auto min-h-screen bg-black py-10">
        <div className="size-52 aspect-square bg-gray-700 rounded-4xl mx-auto mb-10 relative overflow-hidden">
          {nftImage && (
            <Image
              src={URL.createObjectURL(nftImage)}
              alt="NFT Image"
              fill
              objectFit="cover"
            />
          )}
        </div>

        <div className="w-full">
          <Label htmlFor="nftName">NFT Name</Label>
          <Input className="mt-2" id="nftName" placeholder="Enter NFT Name" />
        </div>

        <div className="w-full mt-5">
          <Label htmlFor="nftDescription">NFT Description</Label>
          <Input
            className="mt-2"
            id="nftDescription"
            placeholder="Enter NFT Description"
          />
        </div>

        <div className="w-full mt-5 flex items-center gap-2">
          <Label className="mr-5" htmlFor="nftImage">
            NFT Image
          </Label>
          <ImageUploader
            className=""
            onChange={onFileInput}
            size={500000}
            title="Upload Image"
          />
          {nftImage && (
            <Button
              onClick={() => setNftImage(null)}
              title="Remove Image"
              variant="destructive"
              className="group cursor-pointer"
            >
              <LucideTrash size={24} />
              <span className="group-hover:block hidden">Remove</span>
            </Button>
          )}
        </div>

        <div className="w-full mt-5">
          <Label htmlFor="nftCategory">NFT Category</Label>
          <Select>
            <SelectTrigger className="w-full mt-2">
              <SelectValue className="text-gray-400">
                Select Category
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Digital Artworks">Digital Artworks</SelectItem>
              <SelectItem value="Cosmic NFTs">Cosmic NFTs</SelectItem>
              <SelectItem value="Gaming Assets">Gaming Assets</SelectItem>
              <SelectItem value="Music & Audio">Music & Audio</SelectItem>
              <SelectItem value="Collectibles">Collectibles</SelectItem>
              <SelectItem value="Virtual Worlds">Virtual Worlds</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button size="lg" type="submit" className="mt-10" title="Create NFT">
          Deploy NFT
        </Button>

        <CropperUploader
          isOpen={showCropper}
          initialImage={cropFile ? URL.createObjectURL(cropFile) : null}
          onCropComplete={handleCropComplete}
          onCancel={() => {
            setNftImage(null);
            handleCancelCrop();
          }}
        />
      </div>
    </>
  );
}
