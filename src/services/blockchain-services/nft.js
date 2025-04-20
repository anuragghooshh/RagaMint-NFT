import { ethers } from "ethers";
import contractController from "../../metadata/blockchain/NFTContractABI.json";
import { connectMetamaskWallet } from "../metamask-services/auth.service";
import { metamaskErrorFinder } from "../metamask-services/metamaskErrors";

async function uploadImageToIPFS(nftImage) {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  const data = new FormData();
  data.append("file", nftImage);

  const metadata = JSON.stringify({
    name: "NFTImage",
  });

  data.append("pinataMetadata", metadata);

  try {
    const response = await fetch(url, {
      method: "POST",
      body: data,
      headers: {
        pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
        pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Upload failed with status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Image uploaded. IPFS Hash:", result.IpfsHash);
    return result.IpfsHash;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}

async function uploadMetadataToIPFS(nftData, imageIpfsHash) {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

  const imageUrl = `https://gateway.pinata.cloud/ipfs/${imageIpfsHash}`;

  const metadataJSON = {
    name: nftData.name || "Untitled NFT",
    description: nftData.description || "No description provided",
    external_url: nftData.external_url || "",
    image: imageUrl,
    attributes: [
      { trait_type: "Category", value: nftData.category || "Uncategorized" },
    ],
  };

  console.log("Creating metadata with:", metadataJSON); // Add logging to debug

  const body = {
    pinataContent: metadataJSON,
    pinataMetadata: {
      name: `NFT-${nftData.name || "Metadata"}`,
    },
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
        pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Upload failed with status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Metadata uploaded. IPFS Hash:", result.IpfsHash);
    return result.IpfsHash;
  } catch (error) {
    console.error("Error uploading metadata:", error);
    throw error;
  }
}

export const mintNFT = async (metadata) => {
  const contractABI = contractController?.abi;
  try {
    const signer = await connectMetamaskWallet();

    const balance = await signer.getBalance();
    const formattedBalance = ethers.utils.formatEther(balance);

    console.log("Formatted balance:", formattedBalance);

    if (parseFloat(formattedBalance) < 0.01) {
      return {
        status: false,
        message: "Insufficient funds in your wallet.",
      };
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    const contractAddress =
      process.env.NEXT_PUBLIC_NFT_MARKETPLACE_CONTRACT_ADDRESS;

    console.log("Signer:", signer);
    console.log("Contract Address:", contractAddress);
    console.log("Connected Account:", accounts[0]);

    let metadataURI;
    let imageHash;
    if (metadata.nftImage) {
      console.log("Uploading image to IPFS...");
      imageHash = await uploadImageToIPFS(metadata.nftImage);

      console.log("Uploading metadata to IPFS...");
      const metadataHash = await uploadMetadataToIPFS(metadata, imageHash);

      metadataURI = `https://gateway.pinata.cloud/ipfs/${metadataHash}`;
      console.log("Metadata URI:", metadataURI);
    }

    const nftContract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );

    console.log("Minting new NFT with metadata URI:", metadataURI);
    const transaction = await nftContract.mintNFT(metadataURI);
    console.log("Transaction hash before confirmation:", transaction.hash);

    console.log("Waiting for transaction confirmation...");
    await transaction.wait();
    console.log("NFT minted successfully!");

    const transactionHash = transaction.hash;
    console.log("Confirmed transaction hash:", transactionHash);

    const receipt = await signer.provider.getTransactionReceipt(
      transactionHash
    );
    console.log("Transaction receipt:", receipt);

    const contractInterface = new ethers.utils.Interface(contractABI);

    let tokenId = null;
    for (const log of receipt.logs) {
      try {
        const parsedLog = contractInterface.parseLog(log);
        if (parsedLog.name === "Transfer") {
          tokenId = parsedLog.args[2].toString();
          console.log("Found token ID:", tokenId);
          break;
        }
        if (parsedLog.name === "Minted") {
          tokenId = parsedLog.args[1].toString();
          console.log("Found token ID:", tokenId);
          break;
        }
      } catch (error) {
        continue;
      }
    }

    return {
      status: true,
      data: {
        transactionHash,
        owner: accounts[0],
        contractAddress,
        tokenId,
        metadata: metadataURI || metadata.url,
        imageHash,
        nftDetails: {
          name: metadata.name,
          description: metadata.description,
          externalLink: metadata.external_url,
          category: metadata.category,
        },
      },
    };
  } catch (error) {
    return {
      status: false,
      message:
        error.code === "ACTION_REJECTED"
          ? "Transaction rejected"
          : metamaskErrorFinder(error.error, "Failed to mint NFT"),
    };
  }
};
