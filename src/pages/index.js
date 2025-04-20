import { GradientButton } from "@/components/buttons/GradientButton";
import RootLayout from "@/components/layout/RootLayout";
import CropperUploader from "@/components/misc/CropperUploader";
import ImageUploader from "@/components/misc/Uploader";
import WalletInfo from "@/components/misc/WalletInfo";
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
import { createNFt } from "@/services/api/nft.service";
import { mintNFT } from "@/services/blockchain-services/nft";
import { getUser } from "@/services/firebase-services/cookies";
import { connectMetamaskWallet } from "@/services/metamask-services/auth.service";
import useMetamaskStore from "@/store/metaMaskStore";
import { isValidUrl } from "@/utils/helper";
import { showErrorMessage } from "@/utils/toast";
import {
  LucideTrash,
  Sparkles,
  Loader2,
  Link,
  Info,
  GemIcon,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import SuggestionButton from "@/components/buttons/SuggestionButton";
import { Badge } from "@/components/ui/badge";
import {
  getImageCaptionUsingAI,
  getImageDescriptionUsingAI,
  getImageNameUsingAI,
  predictNFTRarity,
} from "@/services/api/ai.service";
import RarityBadge from "@/components/misc/RarityBadge";

export default function Home() {
  const [nftImage, setNftImage] = useState(null);
  const [minting, setMinting] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const { signer } = useMetamaskStore();
  const [aiSuggestionLoading, setAiSuggestionLoading] = useState({
    name: false,
    description: false,
    category: false,
  });

  const [rarityData, setRarityData] = useState(null);
  const [rarityLoading, setRarityLoading] = useState(false);

  const checkNFTRarity = async () => {
    if (!nftImage || !watchedDescription) {
      showErrorMessage("Please provide an image and description first");
      return;
    }

    setRarityLoading(true);
    try {
      const readFileAsDataURL = () => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(nftImage);
        });
      };

      const dataUrl = await readFileAsDataURL();
      const base64Image = dataUrl.split(",")[1];

      const captionData = await getImageCaptionUsingAI({
        inputs: base64Image,
        options: { use_cache: false },
      });

      const caption = captionData[0]?.generated_text || "";

      const rarityResult = await predictNFTRarity({
        caption: caption,
        description: watchedDescription,
      });

      setRarityData(rarityResult);
    } catch (error) {
      console.error("Error checking rarity:", error);
      showErrorMessage(error.message || "Failed to check NFT rarity");
    } finally {
      setRarityLoading(false);
    }
  };

  const generateAiSuggestion = async (field) => {
    if (!nftImage) {
      showErrorMessage("Please upload an image first");
      return;
    }

    setAiSuggestionLoading((prev) => ({ ...prev, [field]: true }));
    setValue(field, "Generating...");

    try {
      const readFileAsDataURL = () => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(nftImage);
        });
      };

      const dataUrl = await readFileAsDataURL();
      const base64Image = dataUrl.split(",")[1];

      const captionData = await getImageCaptionUsingAI({
        inputs: base64Image,
        options: { use_cache: false },
      });
      const caption = captionData[0]?.generated_text || "";
      console.log("Caption generated:", caption);

      if (field === "name") {
        const nameData = await await getImageNameUsingAI({
          inputs: `<s>[INST] Create a very short, 1-2 word artistic NFT name for this image description: "${caption}". Keep it short and catchy. Only respond with the name, nothing else. [/INST]`,
          parameters: { max_new_tokens: 20, temperature: 0.7 },
        });
        let name = nameData[0]?.generated_text || "";

        name = name.replace(/<s>\[INST\].*?\[\/INST\]\s*/gs, "").trim();

        const quoteMatch = name.match(/"([^"]+)"/);
        if (quoteMatch && quoteMatch[1]) {
          name = quoteMatch[1].trim();
        } else {
          if (
            name.startsWith('"') ||
            name.startsWith('"') ||
            name.startsWith("'")
          ) {
            name = name.substring(1);
          }
          if (name.endsWith('"') || name.endsWith('"') || name.endsWith("'")) {
            name = name.substring(0, name.length - 1);
          }
        }

        name = name.trim();

        name = name.split(/[,.;:]|\n/)[0].trim();
        if (name.split(" ").length > 3) {
          name = name.split(" ").slice(0, 2).join(" ");
        }

        name = name
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        if (name.includes("(Note:")) {
          name = name.split("(Note:")[0].trim();
        }

        setValue("name", name);
      } else if (field === "description") {
        const descData = await getImageDescriptionUsingAI({
          inputs: `<s>[INST] Write a complete, artistic NFT description (2-3 complete sentences) for this image: "${caption}". Write from the perspective of an art collector. Be concise and creative. Only provide the description, nothing else. [/INST]`,
          parameters: { max_new_tokens: 150, temperature: 0.7 },
        });

        let description = descData[0]?.generated_text || "";

        description = description
          .replace(/<s>\[INST\].*?\[\/INST\]\s*/gs, "")
          .trim();

        if (
          description.startsWith('"') ||
          description.startsWith('"') ||
          description.startsWith("'")
        ) {
          description = description.substring(1);
        }

        if (
          description.endsWith('"') ||
          description.endsWith('"') ||
          description.endsWith("'")
        ) {
          description = description.substring(0, description.length - 1);
        }

        description = description.trim();

        const sentences = description.match(/[^.!?]+[.!?]+/g) || [];
        if (sentences.length > 0) {
          description = sentences
            .slice(0, Math.min(3, sentences.length))
            .join(" ")
            .trim();
        }

        if (description.length < 40 && caption) {
          description = `This NFT captures ${caption}. ${description}`;
        }

        setValue("description", description);
      }

      console.log(`AI suggestion for ${field} generated!`);
    } catch (error) {
      console.log(error);
      showErrorMessage(error.message || "Failed to generate AI suggestion");
      setValue(field, "");
    } finally {
      setAiSuggestionLoading((prev) => ({ ...prev, [field]: false }));
    }
  };

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const watchedName = watch("name", "Untitled NFT");
  const watchedDescription = watch("description", "");
  const watchedCategory = watch("category", "");

  const onSubmit = async (data) => {
    try {
      await connectMetamaskWallet();
    } catch (error) {
      showErrorMessage(error.message || "Failed to connect wallet");
      return;
    }

    console.log(data);
    setMinting(true);
    // const uploadImageRes = await uploadImage(nftImage);
    const payload = { ...data, nftImage: nftImage };

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

    if (file.type === "image/gif") {
      setNftImage(file);
    } else {
      handleSelectFile(file);
    }
  };

  useEffect(() => {
    setIsWalletConnected(!!signer);
  }, [signer]);

  useEffect(() => {
    if (rarityData) {
      setRarityData(null);
    }
  }, [nftImage, watchedDescription, watchedCategory, watchedName]);

  return (
    <RootLayout>
      <>
        <div className="mx-auto py-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8">
            {/* NFT Preview Card */}
            <div className="mb-8 lg:mb-0 lg:max-w-md">
              <div className="rounded-xl relative overflow-hidden shadow-2xl transition-all border border-gray-700 hover:border-teal-500/50 bg-gray-800/50">
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
                <div className="p-4 relative w-full">
                  {aiSuggestionLoading.name ||
                  aiSuggestionLoading.description ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-tr from-teal-500/20 to-yellow-500/20 pointer-events-none animate-pulse" />
                  ) : null}
                  <h3 className="text-lg font-semibold truncate">
                    {watchedName || "Untitled NFT"}
                  </h3>
                  <p className="text-gray-400 mt-1 text-sm line-clamp-2">
                    {watchedDescription || "No description provided"}
                  </p>
                  {watchedCategory && (
                    <div className="mt-2">
                      <span className="text-xs bg-teal-900/50 text-teal-300 px-2 py-1 rounded-full">
                        {watchedCategory}
                      </span>
                    </div>
                  )}
                  <div className="mt-4 flex flex-row-reverse gap-4 flex-wrap justify-between items-center">
                    <Button
                      onClick={checkNFTRarity}
                      disabled={
                        rarityData ||
                        rarityLoading ||
                        !nftImage ||
                        !watchedDescription
                      }
                      title="Check NFT Rarity"
                      className="cursor-pointer bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 rounded-lg px-4 py-2"
                    >
                      <GemIcon className="h-4 w-4" />
                      {rarityLoading ? "Checking..." : "Check Rarity"}
                    </Button>
                    {rarityData && (
                      <RarityBadge
                        score={rarityData.score}
                        reasons={rarityData.reasons}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Creation Form */}
            <div>
              <div className="bg-gray-900/60 backdrop-blur-lg border border-gray-800 rounded-xl p-6 shadow-lg">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
                  <h1 className="text-xl font-syncopate sm:text-2xl tracking-tight font-light bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-yellow-400  flex flex-wrap items-center">
                    Add your <span className="font-bold mx-1">Metadata</span>
                  </h1>
                  <div className="mt-2 sm:mt-0 flex items-center space-x-1">
                    <Badge className="bg-gray-800/50 text-gray-400">
                      <Sparkles className="h-3 w-3 text-teal-300" />
                      <span className="whitespace-nowrap">AI-Powered</span>
                    </Badge>
                    <TooltipProvider delayDuration={300}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded-full"
                          >
                            <Info className="h-3.5 w-3.5 text-gray-400" />
                            <span className="sr-only">
                              About AI-powered features
                            </span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                          <p>
                            Generate NFT name and description automatically
                            using AI and your uploaded image
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                {isWalletConnected && <WalletInfo />}
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
                              accept={[
                                ".png",
                                ".jpeg",
                                ".jpg",
                                ".gif",
                                ".webp",
                              ]}
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
                      <div className="flex justify-between items-center">
                        <Label className="text-sm font-medium" htmlFor="name">
                          NFT Name <span className="text-red-500">*</span>
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div>
                                <SuggestionButton
                                  onClick={() => generateAiSuggestion("name")}
                                  loading={aiSuggestionLoading.name}
                                  disabled={!nftImage || minting}
                                />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Generate AI name suggestion based on your image
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="relative">
                        {aiSuggestionLoading.name && (
                          <div
                            title="Generating AI name"
                            className="absolute inset-y-0 left-0 w-full h-full bg-gradient-to-tr from-teal-500/20 to-yellow-500/20 rounded-lg pointer-events-auto cursor-not-allowed z-[+1] animate-pulse"
                          />
                        )}
                        <Input
                          {...register("name", {
                            required: "NFT Name is required",
                          })}
                          className={`bg-gray-800/50 border-0 focus:!ring-teal-500/20 rounded-lg focus:outline-none`}
                          id="name"
                          placeholder="Name your NFT"
                          disabled={minting || aiSuggestionLoading.name}
                        />
                      </div>
                      {errors.name && (
                        <p className="text-red-500 text-xs">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* NFT Description */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label
                          className="text-sm font-medium"
                          htmlFor="description"
                        >
                          NFT Description{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div>
                                <SuggestionButton
                                  onClick={() =>
                                    generateAiSuggestion("description")
                                  }
                                  loading={aiSuggestionLoading.description}
                                  disabled={!nftImage || minting}
                                />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Generate AI description based on your image</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="relative">
                        {aiSuggestionLoading.description && (
                          <div
                            title="Generating AI Description"
                            className="absolute inset-y-0 left-0 w-full h-full bg-gradient-to-tr from-teal-500/20 to-yellow-500/20 rounded-lg pointer-events-auto cursor-not-allowed z-[+1] animate-pulse"
                          />
                        )}
                        <Textarea
                          className="bg-gray-800/50 border-0 focus:!ring-teal-500/20 rounded-lg resize-none min-h-[100px] focus:outline-none"
                          id="description"
                          placeholder="Describe your NFT"
                          {...register("description", {
                            required: "NFT Description is required",
                          })}
                          disabled={minting || aiSuggestionLoading.description}
                        />
                      </div>
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
                            <SelectTrigger className="w-full bg-gray-800/50 border-gray-700 focus:border-teal-500 rounded-lg">
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
                          className="bg-gray-800/50 border-0 focus:!ring-teal-500/20 rounded-lg pl-10 focus:outline-none"
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
                    <GradientButton
                      disabled={minting}
                      size="lg"
                      type="submit"
                      title="Deploy NFT"
                      className="w-full"
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
                    </GradientButton>
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
