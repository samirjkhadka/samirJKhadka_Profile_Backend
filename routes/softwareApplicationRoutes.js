import express from "express";

import { isAuthenticated } from "../middlewares/auth.js";
import {
  addNewApplication,
  deleteApplication,
  getAllApplications,
} from "../controllers/softwareApplicationController.js";

const softwareApplicationRouter = express.Router();

softwareApplicationRouter.post(
  "/addApplication",
  isAuthenticated,
  addNewApplication
);
softwareApplicationRouter.delete(
  "/deleteApplication/:id",
  isAuthenticated,
  deleteApplication
);
softwareApplicationRouter.get("/getAllApplications", getAllApplications);

export default softwareApplicationRouter;
