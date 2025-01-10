import express from "express";
import messageRouter from "./MessageRoutes.js";
import userRouter from "./userRoutes.js";

const router = express.Router();

const path = "/api/v1";

router.use(`${path}/message`, messageRouter);
router.use(`${path}/user`, userRouter);

export default router;
