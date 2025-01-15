import express from "express";

import { isAuthenticated } from "../middlewares/auth.js";
import { deleteTimeline, getAllTimelines, postTimeLine } from "../controllers/timelineController.js";

const timelineRouter = express.Router();

timelineRouter.post("/addTimeline", isAuthenticated, postTimeLine);
timelineRouter.delete("/deleteTimeline/:id", isAuthenticated, deleteTimeline);
timelineRouter.get("/getAllTimelines", getAllTimelines);

export default timelineRouter;
