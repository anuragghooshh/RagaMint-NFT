import connectDB from "@/lib/mongodb";
import NFT from "@/models/NFT";
import { verifyToken } from "@/lib/firebaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method Not Allowed" });

  await connectDB();
  //   const token = req.headers.authorization?.split("Bearer ")[1];
  //   const user = await verifyToken(token);

  //   if (!user)
  //     return res.status(403).json({
  //       status: false,
  //       message: "Unauthorized",
  //     });

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
    });

    if (!tokenId) {
      return res.status(400).json({
        status: false,
        message: "TokenId is required for NFT creation",
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
    res
      .status(500)
      .json({ status: false, error: "Database error", details: error });
  }
}
