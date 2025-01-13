import mongoose from "mongoose";

const skillModel = new mongoose.Schema({
  title: {
    type: String,
  },
  proficiency: {
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

export const skill =  mongoose.model("Skill", skillModel);
