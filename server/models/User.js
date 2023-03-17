import mongoose from "mongoose";

const User = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  avatarUrl: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  diskSpace: {
    type: Number,
    default: 1024 ** 3 * 15,
  },
  usedSpace: {
    type: Number,
    default: 0,
  },
  shares: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Share",
    },
  ],
  resiver: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Share",
    },
  ],
});

export default mongoose.model("User", User);
