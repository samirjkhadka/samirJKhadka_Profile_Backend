import { v2 as cloudinary } from "cloudinary";
import ErrorHandler from "../middlewares/error.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import User from "../models/userModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/jwtToken.js";

export const registerUser = catchAsyncErrors(async (req, res, next) => {});
export const loginUser = catchAsyncErrors(async (req, res, next) => {});
export const logoutUser = catchAsyncErrors(async (req, res, next) => {});
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {});
export const resetPassword = catchAsyncErrors(async (req, res, next) => {});
export const getUserDetails = catchAsyncErrors(async (req, res, next) => {});
export const getUserForProfile = catchAsyncErrors(async (req, res, next) => {});
export const updatePassword = catchAsyncErrors(async (req, res, next) => {});
export const updateProfile = catchAsyncErrors(async (req, res, next) => {});
