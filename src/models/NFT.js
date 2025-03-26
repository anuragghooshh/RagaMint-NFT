import mongoose from "mongoose";

const NFTSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 100,
  },
  tokenId: {
    type: String,
    required: true,
    index: true
  },
  contractAddress: {
    type: String,
    required: true,
  },
  transactionHash: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  externalLink: {
    type: String,
    required: false,
  },
  url: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  owner: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.NFT || mongoose.model("NFT", NFTSchema);
