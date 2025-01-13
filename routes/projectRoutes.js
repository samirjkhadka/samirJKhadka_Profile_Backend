import express from "express";

import { isAuthenticated } from "../middlewares/auth.js";
import {
  addProject,
  deleteProject,
  getAllProjects,
  getSingleProject,
  updateProject,
} from "../controllers/projectController.js";

const projectRouter = express.Router();

projectRouter.post("/addProject", isAuthenticated, addProject);
projectRouter.delete("/deleteProject/:id", isAuthenticated, deleteProject);
projectRouter.put("/updateProject/:id", isAuthenticated, updateProject);
projectRouter.post("/getAllProjects", getAllProjects);
projectRouter.post("/getSingleProject", getSingleProject);

export default userRouter;
