import express from "express";

import { isAuthenticated } from "../middlewares/auth.js";

import {
  addNewSkill,
  deleteSkill,
  getAllSkills,
  updateSkill,
} from "../controllers/skillController.js";

const skillRouter = express.Router();

skillRouter.post("/addSkill", isAuthenticated, addNewSkill);
skillRouter.delete("/deleteSkill/:id", isAuthenticated, deleteSkill);
skillRouter.put("/updateSkill/:id", isAuthenticated, updateSkill);
skillRouter.get("/getAllSkills", getAllSkills);

export default skillRouter;
