import express from "express";
import {
  forgotPassword,
  getUserDetails,
  getUserForProfile,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  updatePassword,
  updateProfile,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.post("/registerUser", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/me", isAuthenticated, getUserDetails);
userRouter.get("/logout", isAuthenticated, logoutUser);
userRouter.get("/portfolio/me/:id", getUserForProfile);
userRouter.put("/password/update", isAuthenticated, updatePassword);
userRouter.put("/me/profile/update", isAuthenticated, updateProfile);
userRouter.post("/password/forgot", forgotPassword);
userRouter.put("/password/reset/:token", resetPassword);

export default userRouter;
