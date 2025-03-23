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
      nftName,
      nftDescription,
      url,
      nftCategory,
      royalties,
      owner,
      transactionHash,
      contractAddress,
      // tokenID = "",
    } = req.body;
    const newNFT = new NFT({
      nftName,
      nftDescription,
      url,
      nftCategory,
      royalties,
      owner,
      transactionHash,
      contractAddress,
      // tokenID,
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
