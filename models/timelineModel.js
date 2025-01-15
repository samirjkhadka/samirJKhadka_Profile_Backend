import mongoose from "mongoose";

const timelineModel = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please Enter Title"],
  },
  description: {
    type: String,
    required: [true, "Please Enter Description"],
  },
  timeline: {
    from: {
      type: String,
    },
    to: {
      type: String,
    },
  },
});

export const Timeline = mongoose.model("Timeline", timelineModel);
