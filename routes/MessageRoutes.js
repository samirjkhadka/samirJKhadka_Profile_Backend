import express from "express";
import {
    deleteMessage,
  getAllMessages,
  sendMessage,
} from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.post("/sendMessage", sendMessage);
messageRouter.get("/getAllMessages", getAllMessages);
messageRouter.delete("/deleteMessage/:id", deleteMessage);

export default messageRouter;
