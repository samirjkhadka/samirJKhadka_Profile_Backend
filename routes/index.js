import express from "express";
import messageRouter from "./MessageRoutes.js";
import userRouter from "./userRoutes.js";
import projectRouter from "./projectRoutes.js";
import skillRouter from "./skillRoutes.js";

const router = express.Router();

const path = "/api/v1";

router.use(`${path}/message`, messageRouter);
router.use(`${path}/user`, userRouter);
router.use(`${path}/projects`, projectRouter);
router.use(`${path}/skills`, skillRouter);

export default router;
