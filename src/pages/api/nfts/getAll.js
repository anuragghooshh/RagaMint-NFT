import connectDB from "@/lib/mongodb";
import NFT from "@/models/NFT";
import { verifyToken } from "@/lib/firebaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      status: false,
      message: "Method Not Allowed",
    });
  }

  await connectDB();

  const token = req.headers.authorization?.split("Bearer ")[1];

  try {
    const user = await verifyToken(token);

    if (!user) {
      return res.status(403).json({
        status: false,
        message: "Unauthorized",
      });
    }

    const userNFTs = await NFT.find({ creatorId: user.uid })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      status: true,
      message: "NFTs retrieved successfully",
      data: userNFTs,
    });
  } catch (error) {
    console.error("Error fetching user NFTs:", error);

    return res.status(500).json({
      status: false,
      message: "Failed to retrieve NFTs",
      error: error.message,
    });
  }
}
