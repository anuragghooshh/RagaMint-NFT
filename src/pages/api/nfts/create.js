import connectDB from "@/lib/mongodb";
import NFT from "@/models/NFT";
import { verifyToken } from "@/lib/firebaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method Not Allowed" });

  await connectDB();
  const token = req.headers.authorization?.split("Bearer ")[1];
  const user = await verifyToken(token);

  if (!user)
    return res.status(403).json({
      status: false,
      message: "Unauthorized",
    });

  try {
    const {
      name,
      description,
      url,
      category,
      owner,
      transactionHash,
      contractAddress,
      tokenId,
      externalLink,
      userId,
      imageHash,
    } = req.body;

    console.log("body", {
      name,
      description,
      url,
      category,
      owner,
      transactionHash,
      contractAddress,
      tokenId,
      externalLink,
      imageHash,
    });

    if (!tokenId) {
      return res.status(400).json({
        status: false,
        message: "TokenId is required for NFT creation",
      });
    }

    if (!imageHash) {
      return res.status(400).json({
        status: false,
        message: "Image hash is required for NFT creation",
      });
    }

    // Use the authenticated user's UID from Firebase
    const creatorId = userId || user.uid;

    // Check if NFT already exists with this combination
    const existingNFT = await NFT.findOne({
      contractAddress,
      tokenId,
      creatorId,
    });

    if (existingNFT) {
      return res.status(400).json({
        status: false,
        message: "You have already minted an NFT with this tokenId",
      });
    }

    const newNFT = new NFT({
      name,
      description,
      url,
      category,
      owner,
      transactionHash,
      contractAddress,
      tokenId,
      externalLink,
      creatorId,
      imageHash,
    });
    await newNFT.save();
    res.status(201).json({
      status: true,
      data: {
        nft: newNFT,
      },
      message: "NFT created successfully!",
    });
  } catch (error) {
    console.log(error);
    // Check for duplicate key error (MongoDB error code 11000)
    if (error.code === 11000) {
      return res.status(400).json({
        status: false,
        message: "You have already created an NFT with this tokenId",
      });
    }

    res
      .status(500)
      .json({ status: false, error: "Database error", details: error });
  }
}
