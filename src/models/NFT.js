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
  imageHash: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  owner: String,
  creatorId: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

NFTSchema.index(
  { contractAddress: 1, tokenId: 1, creatorId: 1 },
  { unique: true }
);

export default mongoose.models.NFT || mongoose.model("NFT", NFTSchema);