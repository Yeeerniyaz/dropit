import mongoose from "mongoose";

const disk = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      require: true,
    },
    size: {
      type: Number,
      default: 0,
    },
    path: {
      type: String,
      default: "",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "disk",
    },
    mimeTypes: {
      type: String,
      default: "",
    },
    childs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "disk",
      },
    ],
  },

  { timestamps: true }
);

export default mongoose.model("disk", disk);
