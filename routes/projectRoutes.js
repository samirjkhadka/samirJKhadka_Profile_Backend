import express from "express";

import { isAuthenticated } from "../middlewares/auth.js";
import {
  addNewProject,
  
  deleteProject,
  getAllProjects,
  getSingleProject,
  updateProject,
} from "../controllers/projectController.js";

const projectRouter = express.Router();

projectRouter.post("/addProject", isAuthenticated, addNewProject);
projectRouter.delete("/deleteProject/:id", isAuthenticated, deleteProject);
projectRouter.put("/updateProject/:id", isAuthenticated, updateProject);
projectRouter.get("/getAllProjects", getAllProjects);
projectRouter.get("/getSingleProject/:id", getSingleProject);

export default projectRouter;
