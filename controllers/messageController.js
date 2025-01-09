import {catchAsyncErrors} from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import Message from "../models/messageModel.js";

export const sendMessage = catchAsyncErrors(async (req, res, next) => {
  const { senderName, senderEmail, subject, message } = req.body;

  if (!senderName) {
    return next(new ErrorHandler("Please Enter Your Name", 400));
  }
  if (!senderEmail) {
    return next(new ErrorHandler("Please Enter Your Email", 400));
  }
  if (!subject) {
    return next(new ErrorHandler("Please Enter Subject", 400));
  }
  if (!message) {
    return next(new ErrorHandler("Please Enter Message", 400));
  }

  const data = await Message.create({
    senderName,
    senderEmail,
    subject,
    message,
  });
  res.status(200).json({
    success: true,
    message: "Message Sent Successfully",
  });
});
