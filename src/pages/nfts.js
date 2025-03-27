import { useEffect, useState } from "react";
import { getUserNFTs } from "@/services/api/nft.service";
import { showErrorMessage } from "@/utils/toast";
import Link from "next/link";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import RootLayout from "@/components/layout/RootLayout";
import NFTCard from "@/components/cards/NFTCard";

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
            <h1 className="text-2xl sm:text-3xl font-syncopate font-light bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500 mb-4 sm:mb-0">
              My <span className="font-bold">Collection</span>
            </h1>
            <Link href="/">
              <Button size="sm" className="flex items-center gap-1">
                <Plus size={16} />
                Create
              </Button>
            </Link>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex flex-col justify-center items-center h-[60vh]">
              <Loader2 className="h-10 w-10 animate-spin text-blue-500 mb-4" />
              <p className="text-gray-400">Loading your NFTs...</p>
            </div>
          ) : nfts.length === 0 ? (
            <div className="rounded-xl overflow-hidden shadow-2xl transition-all border border-gray-700 hover:border-purple-500/50 bg-gray-800/50 p-8 text-center my-8">
              <div className="mb-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-gray-700/50 flex items-center justify-center mb-4">
                  <Plus size={32} className="text-gray-400" />
                </div>
                <h2 className="text-xl font-semibold mb-2">No NFTs Found</h2>
                <p className="text-gray-400">
                  You haven't minted any NFTs yet.
                </p>
              </div>
              <Link
                href="/"
                className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-3 rounded-lg font-medium transition"
              >
                Create Your First NFT
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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
