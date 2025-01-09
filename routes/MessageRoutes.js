import express from "express";
import { sendMessage } from "../controllers/messageController.js";


const messageRouter = express.Router();

messageRouter.post("/sendMessage", sendMessage);


export default messageRouter;