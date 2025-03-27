import ConnectMetamaskWallet from "@/components/auth/ConnectMetamaskWallet";
import RootLayout from "@/components/layout/RootLayout";
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
import { getUser } from "@/services/firebase-services/cookies";
import { connectMetamaskWallet } from "@/services/metamask-services/auth.service";
import useMetamaskStore from "@/store/metaMaskStore";
import { isValidUrl } from "@/utils/helper";
import { showErrorMessage, showSuccessMessage } from "@/utils/toast";
import { LucideTrash, Sparkles, Loader2, Link, Info } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

export default function Home() {
  const [nftImage, setNftImage] = useState(null);
  const [minting, setMinting] = useState(false);
  const { signer } = useMetamaskStore();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm();

  const watchedName = watch("name", "Untitled NFT");
  const watchedDescription = watch("description", "");
  const watchedCategory = watch("category", "");

  const onSubmit = async (data) => {
    try {
      await connectMetamaskWallet();
    } catch (error) {
      showErrorMessage(error.message);
      return;
    }

    console.log(data);
    setMinting(true);
    // const uploadImageRes = await uploadImage(nftImage);
    const payload = { ...data, nftImage: nftImage };

    try {
      const mintRes = await mintNFT(payload);
      const user = getUser();
      if (mintRes?.status) {
        const createNftRes = await createNFt({
          ...payload,
          owner: mintRes.data?.owner,
          tokenId: mintRes.data?.tokenId,
          contractAddress: mintRes.data?.contractAddress,
          transactionHash: mintRes.data?.transactionHash,
          url: mintRes.data?.metadata,
          externalLink: data.external_url,
          imageHash: mintRes.data?.imageHash,
          userId: user?.uid,
        });
        if (createNftRes?.status) {
          console.log(createNftRes.data);
        }
      } else {
        showErrorMessage(mintRes?.message);
      }
    } catch (error) {
      showErrorMessage("Error creating NFT");
    } finally {
      setMinting(false);
    }
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
    <RootLayout>
      <>
        <div className="mx-auto py-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8">
            {/* NFT Preview Card */}
            <div className="mb-8 lg:mb-0 lg:max-w-md">
              {/* <h2
                
                className="cursor-help text-3xl sm:text-4xl font-extralight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500"
              >
                Raga<span className="font-bold">Mint</span>
              </h2> */}
              <div className="rounded-xl overflow-hidden shadow-2xl transition-all border border-gray-700 hover:border-purple-500/50 bg-gray-800/50">
                <div className="aspect-square relative overflow-hidden">
                  {nftImage ? (
                    <Image
                      src={URL.createObjectURL(nftImage)}
                      alt="NFT Image"
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                      <div className="text-center p-4">
                        <Sparkles className="h-12 w-12 mx-auto mb-3 text-gray-500" />
                        <p className="text-gray-400 text-sm">
                          Upload your NFT image
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold truncate">
                    {watchedName || "Untitled NFT"}
                  </h3>
                  <p className="text-gray-400 mt-1 text-sm line-clamp-2">
                    {watchedDescription || "No description provided"}
                  </p>
                  {watchedCategory && (
                    <div className="mt-2">
                      <span className="text-xs bg-purple-900/50 text-purple-300 px-2 py-1 rounded-full">
                        {watchedCategory}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Creation Form */}
            <div>
              <div className="bg-gray-900/60 backdrop-blur-lg border border-gray-800 rounded-xl p-6 shadow-lg">
                <h1 className="text-xl font-syncopate sm:text-2xl tracking-tight font-light mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                  Create your<span className="font-bold"> NFT</span>
                </h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="space-y-6">
                    {/* NFT Image Upload */}
                    <div className="space-y-2">
                      <Label
                        className="text-sm font-medium flex items-center gap-2"
                        htmlFor="nftImage"
                      >
                        NFT Image <span className="text-red-500">*</span>
                      </Label>
                      <div className="flex items-center gap-2">
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
                              size={5000000}
                              title="Upload"
                              disabled={minting}
                            />
                          )}
                        />
                        {nftImage && (
                          <Button
                            onClick={() => {
                              setNftImage(null);
                              control._formValues.nftImage = null;
                            }}
                            title="Remove Image"
                            variant="destructive"
                            className="cursor-pointer shrink-0 h-9 w-9 rounded-full p-0 flex items-center justify-center"
                            disabled={minting}
                          >
                            <LucideTrash size={14} />
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">
                        Supported: JPG, PNG, GIF, WEBP. Max: 5MB
                      </p>
                      {errors.nftImage && (
                        <p className="text-red-500 text-xs">
                          {errors.nftImage.message}
                        </p>
                      )}
                    </div>

                    {/* NFT Name */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium" htmlFor="name">
                        NFT Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        {...register("name", {
                          required: "NFT Name is required",
                        })}
                        className="bg-gray-800/50 border-gray-700 focus:border-purple-500 rounded-lg focus:outline-none"
                        id="name"
                        placeholder="Name your NFT"
                        disabled={minting}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-xs">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* NFT Description */}
                    <div className="space-y-2">
                      <Label
                        className="text-sm font-medium"
                        htmlFor="description"
                      >
                        NFT Description <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        className="bg-gray-800/50 border-gray-700 focus:border-purple-500 rounded-lg resize-none min-h-[100px] focus:outline-none"
                        id="description"
                        placeholder="Describe your NFT"
                        {...register("description", {
                          required: "NFT Description is required",
                        })}
                        disabled={minting}
                      />
                      {errors.description && (
                        <p className="text-red-500 text-xs">
                          {errors.description.message}
                        </p>
                      )}
                    </div>

                    {/* NFT Category */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium" htmlFor="category">
                        NFT Category <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        name="category"
                        control={control}
                        rules={{ required: "NFT Category is required" }}
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={minting}
                          >
                            <SelectTrigger className="w-full bg-gray-800/50 border-gray-700 focus:border-purple-500 rounded-lg">
                              <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-900 border-gray-700">
                              <SelectItem
                                value="Digital Artworks"
                                className={`text-gray-400 hover:bg-gray-800/50 ${
                                  watchedCategory === "Digital Artworks" &&
                                  "bg-gray-600/50"
                                }`}
                              >
                                Digital Artworks
                              </SelectItem>
                              <SelectItem
                                value="Cosmic NFTs"
                                className={`text-gray-400 hover:bg-gray-800/50 ${
                                  watchedCategory === "Cosmic NFTs" &&
                                  "bg-gray-600/50"
                                }`}
                              >
                                Cosmic NFTs
                              </SelectItem>
                              <SelectItem
                                value="Gaming Assets"
                                className={`text-gray-400 hover:bg-gray-800/50 ${
                                  watchedCategory === "Gaming Assets" &&
                                  "bg-gray-600/50"
                                }`}
                              >
                                Gaming Assets
                              </SelectItem>
                              <SelectItem
                                value="Music & Audio"
                                className={`text-gray-400 hover:bg-gray-800/50 ${
                                  watchedCategory === "Music & Audio" &&
                                  "bg-gray-600/50"
                                }`}
                              >
                                Music & Audio
                              </SelectItem>
                              <SelectItem
                                value="Collectibles"
                                className={`text-gray-400 hover:bg-gray-800/50 ${
                                  watchedCategory === "Collectibles" &&
                                  "bg-gray-600/50"
                                }`}
                              >
                                Collectibles
                              </SelectItem>
                              <SelectItem
                                value="Virtual Worlds"
                                className={`text-gray-400 hover:bg-gray-800/50 ${
                                  watchedCategory === "Virtual Worlds" &&
                                  "bg-gray-600/50"
                                }`}
                              >
                                Virtual Worlds
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.category && (
                        <p className="text-red-500 text-xs">
                          {errors.category.message}
                        </p>
                      )}
                    </div>

                    {/* External Link */}
                    <div className="space-y-2">
                      <Label
                        className="text-sm font-medium flex items-center gap-2"
                        htmlFor="external_url"
                      >
                        External Link
                        <span
                          className="text-gray-400 hover:text-gray-300 cursor-help"
                          title="Link to your website or social media"
                        >
                          <Info size={14} />
                        </span>
                      </Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Link className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input
                          className="bg-gray-800/50 border-gray-700 focus:border-purple-500 rounded-lg pl-10 focus:outline-none"
                          id="external_url"
                          placeholder="https://example.com"
                          {...register("external_url", {
                            validate: (value) => {
                              if (!value) return true;
                              const urlCheck = isValidUrl(value, true);
                              return urlCheck.valid || urlCheck.error;
                            },
                          })}
                          disabled={minting}
                        />
                      </div>
                      <p className="text-xs text-gray-400">
                        Link to your website or social media
                      </p>
                      {errors.external_url && (
                        <p className="text-red-500 text-xs">
                          {errors.external_url.message}
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <Button
                      disabled={minting}
                      size="lg"
                      type="submit"
                      title="Deploy NFT"
                      className="w-full mt-6 text-white cursor-pointer bg-violet-400/20 hover:bg-violet-400/70 border border-violet-400/50"
                    >
                      {minting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Deploying NFT...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Deploy NFT
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <CropperUploader
          isOpen={showCropper}
          initialImage={cropFile ? URL.createObjectURL(cropFile) : null}
          onCropComplete={handleCropComplete}
          onCancel={() => {
            setNftImage(null);
            handleCancelCrop();
          }}
        />
      </>
    </RootLayout>
  );
}
