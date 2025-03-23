import mongoose from "mongoose";

const NFTSchema = new mongoose.Schema({
  nftName: {
    type: String,
    required: true,
    maxlength: 100,
  },
  // tokenID: {
  //   type: String,
  //   required: false,
  //   unique: true,
  // },
  contractAddress: {
    type: String,
    required: true,
  },
  transactionHash: {
    type: String,
    required: true,
  },
  nftDescription: String,
  url: {
    type: String,
    required: true,
  },
  nftCategory: {
    type: String,
    required: true,
  },
  royalties: Number,
  owner: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.NFT || mongoose.model("NFT", NFTSchema);
