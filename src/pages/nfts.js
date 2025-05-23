import { useEffect, useState } from "react";
import { getUserNFTs } from "@/services/api/nft.service";
import { showErrorMessage } from "@/utils/toast";
import Link from "next/link";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import RootLayout from "@/components/layout/RootLayout";
import NFTCard from "@/components/cards/NFTCard";
import { GradientButton } from "@/components/buttons/GradientButton";

export default function MyNFTs() {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserNFTs();
  }, []);

  const fetchUserNFTs = async () => {
    try {
      setLoading(true);
      const response = await getUserNFTs();

      if (response.status) {
        setNfts(response.data || []);
      } else {
        showErrorMessage(response.message || "Failed to fetch your NFTs");
      }
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      showErrorMessage("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <RootLayout>
      <>
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <h1 className="text-xl sm:text-2xl font-syncopate font-light text-yellow-500 mb-4 sm:mb-0">
              My <span className="font-bold">Collection</span>
            </h1>
            <Link href="/">
              <Button
                size="lg"
                className="cursor-pointer flex items-center gap-1 bg-white/20 hover:bg-white/10 border border-gray-700"
              >
                <Plus size={16} />
                Create
              </Button>
            </Link>
          </div>

          {/* Content */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className="rounded-xl overflow-hidden backdrop-blur-2xl border border-gray-800 bg-gray-900/60 shadow-lg animate-pulse"
                >
                  <div className="aspect-square w-full bg-gray-800"></div>

                  <div className="p-4 space-y-3">
                    <div className="h-5 bg-gray-800 rounded w-3/4"></div>

                    {/* Description placeholder */}
                    <div className="h-4 bg-gray-800 rounded w-full"></div>
                    <div className="h-4 bg-gray-800 rounded w-2/3"></div>

                    <div className="flex">
                      <div className="h-5 bg-gray-800 rounded w-1/3 mt-2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : nfts.length === 0 ? (
            <div className="rounded-xl overflow-hidden border border-gray-800 hover:border-teal-500/30 bg-gray-900/60 backdrop-blur-lg shadow-2xl transition-all duration-300 p-10 text-center my-12 max-w-md mx-auto">
              <div className="mb-8">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center mb-6 p-1 group hover:scale-105 transition-all duration-300">
                  <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                    <Plus
                      size={32}
                      className="text-teal-400 group-hover:rotate-90 transition-transform duration-500 ease-out"
                    />
                  </div>
                </div>

                <h2 className="text-2xl font-light mb-3 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-teal-600">
                  Your Collection is <span className="font-bold">Empty</span>
                </h2>
                <p className="text-gray-400 max-w-xs mx-auto mb-2">
                  You haven't minted any NFTs yet. Create your first digital
                  masterpiece.
                </p>
              </div>

              <Link href="/">
                <GradientButton size="xl" className="w-full px-8 py-3.5">
                  <Plus size={18} className="mr-2" />
                  Create Your First NFT
                </GradientButton>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {nfts.map((nft) => (
                <NFTCard key={nft._id} nft={nft} />
              ))}
            </div>
          )}
        </div>
      </>
    </RootLayout>
  );
}
