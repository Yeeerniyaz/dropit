import mongoose from "mongoose";

const Share = new mongoose.Schema(
  {
    sender: {
      type: String,
    },
    receiver: {
      type: String,
    },
    url: {
      type: String,
      required: true,
    },
    type: {
      type: String,
    },
    size: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    term: {
      type: Number,
      default: 604800000,
    },
    code: {
      type: String,
    },
    isTerm: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Share", Share);
