import { ethers } from "ethers";
import contractABI from "../../metadata/blockchain/NFTContractABI.json";
import { connectMetamaskWallet } from "../metamask-services/auth.service";
import { metamaskErrorFinder } from "../metamask-services/metamaskErrors";

async function uploadImageToIPFS(imageFile) {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  const data = new FormData();
  data.append("file", imageFile);

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
  const metadataJSON = {
    name: nftData.nftName || "Untitled NFT",
    description: nftData.nftDescription || "No description provided",
    image: `ipfs://${imageIpfsHash}`,
    attributes: [
      { trait_type: "Category", value: nftData.nftCategory || "Uncategorized" },
    ],
  };

  const body = {
    pinataContent: metadataJSON,
    pinataMetadata: {
      name: `NFT-${nftData.nftName || "Metadata"}`,
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
  try {
    const signer = await connectMetamaskWallet();

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    const contractAddress =
      process.env.NEXT_PUBLIC_NFT_MARKETPLACE_CONTRACT_ADDRESS;

    console.log("Signer:", signer);
    console.log("Contract Address:", contractAddress);
    console.log("Connected Account:", accounts[0]);

    let metadataURI;
    if (metadata.nftImage) {
      console.log("Uploading image to IPFS...");
      const imageHash = await uploadImageToIPFS(metadata.nftImage);

      console.log("Uploading metadata to IPFS...");
      const metadataHash = await uploadMetadataToIPFS(metadata, imageHash);

      metadataURI = `ipfs://${metadataHash}`;
      console.log("Metadata URI:", metadataURI);
    }

    const nftContract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );

    if (metadataURI) {
      try {
        const setBaseURITx = await nftContract.setBaseURI(metadataURI);
        await setBaseURITx.wait();
        console.log("Base URI set successfully");
      } catch (error) {
        throw error;
      }
    }

    console.log("Minting new NFT...");
    const transaction = await nftContract.mint();
    console.log("Transaction hash before confirmation:", transaction.hash);

    console.log("Waiting for transaction confirmation...");
    await transaction.wait();
    console.log("NFT minted successfully!");

    const transactionHash = transaction.hash;
    console.log("Confirmed transaction hash:", transactionHash);

    return {
      status: true,
      data: {
        transactionHash,
        owner: accounts[0],
        contractAddress,
        metadata: metadataURI || metadata.url,
        nftDetails: {
          name: metadata.nftName,
          description: metadata.nftDescription,
          category: metadata.nftCategory,
        },
      },
    };
  } catch (error) {
    console.error("Error minting NFT:", error);
    return {
      status: false,
      message:
        error.code === "ACTION_REJECTED"
          ? "Transaction rejected"
          : metamaskErrorFinder(error.error, "Failed to mint NFT"),
      error,
    };
  }
};
