import mongoose from "mongoose";

const messageModel = new mongoose.Schema(
  {
    senderName: {
      type: String,
      minLength: [3, "Name must contain at least 3 characters"],
      required: true,
    },
    subject: {
      type: String,
      required: true,
      minLength: [3, "Subject must contain at least 3 characters"],
    },
    senderEmail: {
      type: String,
      required: true,
      minLength: [3, "Email must contain at least 3 characters"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageModel);