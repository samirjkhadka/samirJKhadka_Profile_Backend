import express from "express";
import messageRouter from "./MessageRoutes.js";

const router = express.Router();

const path = "/api/v1";

router.use(`${path}/message`, messageRouter);

export default router;