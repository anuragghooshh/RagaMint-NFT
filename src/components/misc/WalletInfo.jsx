import useMetamaskStore from "@/store/metaMaskStore";
import React, { useEffect, useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import { ethers } from "ethers";
import { Badge } from "../ui/badge";
import { Metamask } from "../../../public/icons/misc/SignInPlatforms";

const WalletInfo = () => {
  const { signer } = useMetamaskStore();
  const [walletInfo, setWalletInfo] = useState({
    address: "",
    shortAddress: "",
    balance: "",
    network: "",
    chainId: "",
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const getWalletInfo = async () => {
      if (!signer) return;

      try {
        const address = await signer.getAddress();
        const balance = await signer.getBalance();
        const network = await signer.provider.getNetwork();

        const shortAddress = `${address.substring(0, 7)}...${address.substring(
          address.length - 5
        )}`;
        const etherBalance = parseFloat(
          ethers.utils.formatEther(balance)
        ).toFixed(4);

        let networkName = "";
        switch (network.chainId) {
          case 1:
            networkName = "Ethereum";
            break;
          case 5:
            networkName = "Goerli";
            break;
          case 11155111:
            networkName = "Sepolia";
            break;
          case 137:
            networkName = "Polygon";
            break;
          case 80001:
            networkName = "Mumbai";
            break;
          case 31337:
            networkName = "Hardhat";
            break;
          case 1337:
            networkName = "Ganache";
            break;
          case 42161:
            networkName = "Arbitrum One";
            break;
          case 421613:
            networkName = "Arbitrum Goerli";
            break;
          case 43114:
            networkName = "Avalanche";
            break;
          case 43113:
            networkName = "Avalanche Fuji";
            break;
          case 59140:
            networkName = "Linea Mainnet";
            break;
          case 59144:
            networkName = "Linea Testnet";
            break;
          case 1234:
            networkName = "Amoy Mainnet";
            break;
          case 1235:
            networkName = "Amoy Testnet";
            break;
          case 1236:
            networkName = "Mega Testnet";
            break;
          default:
            networkName = "Unknown";
        }

        setWalletInfo({
          address,
          shortAddress,
          balance: etherBalance,
          network: networkName,
          chainId: network.chainId,
        });
      } catch (error) {
        console.error("Error fetching wallet info:", error);
      }
    };

    getWalletInfo();
  }, [signer]);

  const copyAddress = () => {
    navigator.clipboard.writeText(walletInfo.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getExplorerUrl = () => {
    const baseUrls = {
      1: "https://etherscan.io/address/",
      5: "https://goerli.etherscan.io/address/",
      11155111: "https://sepolia.etherscan.io/address/",
      137: "https://polygonscan.com/address/",
      80001: "https://mumbai.polygonscan.com/address/",
    };

    const baseUrl =
      baseUrls[walletInfo.chainId] || "https://etherscan.io/address/";
    return baseUrl + walletInfo.address;
  };

  if (!signer || !walletInfo.address) return null;

  return (
    <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700 mb-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Metamask size={20} />
          <h3 className="text-sm font-medium text-gray-200">
            Connected Wallet
          </h3>
        </div>
        <Badge
          variant="outline"
          className="bg-yellow-900/30 text-yellow-400 border-yellow-800 text-xs"
        >
          Connected
        </Badge>
      </div>

      <div className="flex items-center gap-2 mt-3">
        <div className="bg-gray-700/30 rounded-md px-3 py-1.5 flex-1 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-300 font-mono">
            {walletInfo.shortAddress}
          </span>
          <button
            onClick={copyAddress}
            className="text-gray-400 cursor-pointer hover:text-gray-200 transition-colors"
            title="Copy address"
          >
            {copied ? (
              <Check size={16} className="text-yellow-400" />
            ) : (
              <Copy size={16} />
            )}
          </button>
        </div>
        <a
          href={getExplorerUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-700/30 rounded-md p-1.5 text-gray-400 hover:text-gray-200 transition-colors"
          title="View on explorer"
        >
          <ExternalLink size={16} />
        </a>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-3">
        <div className="bg-gray-700/20 rounded-md p-2">
          <p className="text-xs text-gray-400 mb-1">Balance</p>
          <p className="text-sm font-medium">{walletInfo.balance} ETH</p>
        </div>
        <div className="bg-gray-700/20 rounded-md p-2">
          <p className="text-xs text-gray-400 mb-1">Network</p>
          <p className="text-sm font-medium">{walletInfo.network}</p>
        </div>
      </div>

      {/* <p className="text-xs text-gray-400">
        * Minimum requirement of 0.01 ETH in your wallet for minting
      </p> */}

      {walletInfo.balance < 0.01 ? (
        <p className="text-xs text-red-400 mt-4">
          * Minimum requirement of 0.01 ETH in your wallet for minting
        </p>
      ) : null}
    </div>
  );
};

export default WalletInfo;
