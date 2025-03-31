import React from "react";
import Image from "next/image";
import { ExternalLink, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const NFTCard = ({ nft }) => {
  return (
    <div className="group rounded-xl overflow-hidden shadow-lg backdrop-blur-sm border border-gray-700 bg-gray-800/50 flex flex-col h-full">
      <div className="relative w-full aspect-square overflow-hidden">
        <Image
          src={
            nft.imageHash
              ? `https://gateway.pinata.cloud/ipfs/${nft.imageHash}`
              : "/placeholder-nft.png"
          }
          alt={nft.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            e.target.src = "/placeholder-nft.png";
          }}
        />
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold truncate">{nft.name}</h3>
        <p className="text-gray-400 mt-2 text-sm line-clamp-3">
          {nft.description}
        </p>

        <div className="my-3 flex flex-wrap gap-2">
          <span className="text-xs font-medium bg-purple-900/50 text-purple-300 px-2 py-1 rounded-full">
            {nft.category}
          </span>
          <span className="text-xs font-medium bg-blue-900/50 text-blue-300 px-2 py-1 rounded-full">
            #{nft.tokenId}
          </span>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-700 grid grid-cols-2 gap-2 text-xs">
          <Link
            href={`${process.env.NEXT_PUBLIC_TRANSACTION_SCANNER_BASE_URI}${nft.transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
            title="View Transaction"
            className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ArrowUpRight size={10} />
            Transaction
          </Link>

          <Link
            href={`${process.env.NEXT_PUBLIC_OPENSEA_BASE_URI}${process.env.NEXT_PUBLIC_NFT_MARKETPLACE_CONTRACT_ADDRESS}/${nft.tokenId}`}
            target="_blank"
            rel="noopener noreferrer"
            title="View on OpenSea"
            className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ArrowUpRight size={10} />
            OpenSea
          </Link>

          {nft.externalLink && (
            <a
              href={nft.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              title="Visit Website"
              className="flex items-center gap-1 text-gray-400 hover:text-gray-300 transition-colors col-span-2"
            >
              <ExternalLink size={10} />
              Website
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default NFTCard;
