import mongoose from "mongoose";

const projectModel = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  githubLink: {
    type: String,
  },
  projectLiveLink: {
    type: String,
  },
  technologies: {
    type: String,
  },
  stack: {
    type: String,
  },
  deployed: {
    type: String,
  },
  projectBanner: {
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

export const Project = mongoose.model("Project", projectModel);
