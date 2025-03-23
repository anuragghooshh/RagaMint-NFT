import ConnectMetamaskWallet from "@/components/auth/ConnectMetamaskWallet";
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
import { Textarea } from "@/components/ui/textarea";
import { useCropImage } from "@/hooks/useCropImage";
import { uploadImage } from "@/services/api/auth.service";
import { createNFt } from "@/services/api/nft.service";
import { mintNFT } from "@/services/blockchain-services/nft";
import { showErrorMessage, showSuccessMessage } from "@/utils/toast";
import { LucideTrash } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

export default function Home() {
  const [nftImage, setNftImage] = useState(null);
  const [minting, setMinting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setMinting(true);
    // const uploadImageRes = await uploadImage(nftImage);
    const payload = { ...data, imageFile: nftImage };

    const mintRes = await mintNFT(payload);

    if (mintRes?.status) {
      const createNftRes = await createNFt({
        ...payload,
        owner: mintRes.data?.owner,
        // tokenId: mintRes.data?.tokenId,
        contractAddress: mintRes.data?.contractAddress,
        transactionHash: mintRes.data?.transactionHash,
        url: mintRes.data?.metadata,
      });
      if (createNftRes?.status) {
        console.log(createNftRes.data);
      }
    } else {
      showErrorMessage(mintRes?.message);
    }
    setMinting(false);
  };

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
        <ConnectMetamaskWallet />
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

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full">
            <Label htmlFor="nftName">NFT Name</Label>
            <Input
              {...register("nftName", { required: "NFT Name is required" })}
              className="mt-2"
              id="nftName"
              placeholder="Enter NFT Name"
              disabled={minting}
            />
            {errors.nftName && (
              <p className="text-red-500 text-xs mt-2">
                {errors.nftName.message}
              </p>
            )}
          </div>

          <div className="w-full mt-5">
            <Label htmlFor="nftDescription">NFT Description</Label>
            <Textarea
              className="mt-2"
              id="nftDescription"
              placeholder="Enter NFT Description"
              {...register("nftDescription", {
                required: "NFT Description is required",
              })}
              disabled={minting}
            />
            {errors.nftDescription && (
              <p className="text-red-500 text-xs mt-2">
                {errors.nftDescription.message}
              </p>
            )}
          </div>

          <div className="w-full mt-5 flex items-center gap-2">
            <Label className="mr-5" htmlFor="nftImage">
              NFT Image
            </Label>

            <Controller
              name="nftImage"
              control={control}
              rules={{ required: "NFT Image is required" }}
              render={({ field }) => (
                <ImageUploader
                  onChange={(file) => {
                    onFileInput(file);
                    field.onChange(file);
                  }}
                  size={500000}
                  title="Upload Image"
                  disabled={minting}
                />
              )}
            />

            {nftImage ? (
              <Button
                onClick={() => {
                  setNftImage(null);
                  control._formValues.nftImage = null;
                }}
                title="Remove Image"
                variant="destructive"
                className="group cursor-pointer"
                disabled={minting}
              >
                <LucideTrash size={24} />
                <span className="group-hover:block hidden">Remove</span>
              </Button>
            ) : null}

            {errors.nftImage && (
              <p className="text-red-500 text-xs mt-2">
                {errors.nftImage.message}
              </p>
            )}
          </div>

          <div className="w-full mt-5">
            <Label htmlFor="nftCategory">NFT Category</Label>

            <Controller
              name="nftCategory"
              control={control}
              rules={{ required: "NFT Category is required" }}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={minting}
                >
                  <SelectTrigger className="w-full mt-2">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Digital Artworks">
                      Digital Artworks
                    </SelectItem>
                    <SelectItem value="Cosmic NFTs">Cosmic NFTs</SelectItem>
                    <SelectItem value="Gaming Assets">Gaming Assets</SelectItem>
                    <SelectItem value="Music & Audio">Music & Audio</SelectItem>
                    <SelectItem value="Collectibles">Collectibles</SelectItem>
                    <SelectItem value="Virtual Worlds">
                      Virtual Worlds
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />

            {errors.nftCategory && (
              <p className="text-red-500 text-xs mt-2">
                {errors.nftCategory.message}
              </p>
            )}
          </div>

          <Button
            disabled={minting}
            size="lg"
            type="submit"
            className="mt-10"
            title="Create NFT"
          >
            Deploy NFT
          </Button>
        </form>

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
