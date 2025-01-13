import mongoose from "mongoose";

const softwareApplicationModel = new mongoose.Schema({
  name: {
    type: String,
  },
  svg: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
});

export const softwareApplication = mongoose.model(
  "SoftwareApplication",
  softwareApplicationModel
);