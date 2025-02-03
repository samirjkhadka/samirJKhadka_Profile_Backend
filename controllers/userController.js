import { v2 as cloudinary } from "cloudinary";
import ErrorHandler from "../middlewares/error.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import User from "../models/userModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";
import { generateToken } from "../utils/jwtToken.js";

export const registerUser = catchAsyncErrors(async (req, res, next) => {
  try {
    if (!req.body.fullName || !req.body.email || !req.body.password) {
      return next(new ErrorHandler("Please Enter All Fields", 400));
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      return next(new ErrorHandler("Please Upload Avatar", 400));
    }

    const { avatar, resume } = req.files;

    //uploading avatar
    if (
      avatar.mimetype !== "image/png" &&
      avatar.mimetype !== "image/jpeg" &&
      avatar.mimetype !== "image/jpg"
    ) {
      return next(new ErrorHandler("Please Upload a valid image", 400));
    }
    const cloudinaryResponseForAvatar = await cloudinary.uploader.upload(
      avatar.tempFilePath,
      { folder: "Portfolio_Avatar" }
    );

    if (!cloudinaryResponseForAvatar || cloudinaryResponseForAvatar.error) {
      console.error(
        cloudinaryResponseForAvatar,
        cloudinaryResponseForAvatar.error || "Unknown Cloudinary error"
      );
      return next(
        new ErrorHandler(
          "Failed to upload avatar " + cloudinaryResponseForAvatar.error,
          500
        )
      );
    }

    //uploading resume
    const cloudinaryResponseForResume = await cloudinary.uploader.upload(
      resume.tempFilePath,
      { folder: "Portfolio_Resume" }
    );
    if (!cloudinaryResponseForResume || cloudinaryResponseForResume.error) {
      console.error(
        "Cloudinary Errror: ",
        cloudinaryResponseForResume.error || "Unknown Cloudinary error"
      );
      return next(new ErrorHandler("Failed to upload resume", 500));
    }

    const {
      fullName,
      email,
      phone,
      aboutMe,
      password,
      portfolioURL,
      githubURL,
      instagramURL,
      twitterURL,
      facebookURL,
      linkedinURL,
    } = req.body;

    const user = await User.create({
      fullName,
      email,
      phone,
      aboutMe,
      password,
      portfolioURL,
      githubURL,
      instagramURL,
      twitterURL,
      facebookURL,
      linkedinURL,
      avatar: {
        public_id: cloudinaryResponseForAvatar.public_id,
        url: cloudinaryResponseForAvatar.secure_url,
      },
      resume: {
        public_id: cloudinaryResponseForResume.public_id,
        url: cloudinaryResponseForResume.secure_url,
      },
    });
    generateToken(user, "User Registered Successfully", 201, res);
  } catch (error) {
    console.log(error);
  }
});
export const loginUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler("Please Enter Email & Password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("Invalid Email or Password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid Email or Password", 401));
    }

    generateToken(user, "User Logged In Successfully", 200, res);
  } catch (error) {
    console.log(error);
  }
});
export const logoutUser = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logged Out Successfully",
    });
});
export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
  }
});
export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  try {
    const newUserData = {
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      aboutMe: req.body.aboutMe,
      portfolioURL: req.body.portfolioURL,
      githubURL: req.body.githubURL,
      instagramURL: req.body.instagramURL,
      xURL: req.body.twitterURL,
      facebookURL: req.body.facebookURL,
      linkedInURL: req.body.linkedinURL,
    };

    if (req.files && req.files.avatar) {
      const { avatar } = req.files.avatar;
      const user = await User.findById(req.user.id);
      const profileImageId = user.avatar.public_id;
      await cloudinary.uploader.destroy(profileImageId);
      const newProfileImage = await cloudinary.uploader.upload(
        avatar.tempFilePath,
        {
          folder: "Portfolio_Avatar",
        }
      );
      newUserData.avatar = {
        public_id: newProfileImage.public_id,
        url: newProfileImage.secure_url,
      };
    }

    if (req.files && req.files.resume) {
      const { resume } = req.files;
   
      const user = await User.findById(req.user.id);
      const resumeFileId = user.resume.public_id;
      if (resumeFileId) {
        await cloudinary.uploader.destroy(resumeFileId);
      }

      const newResume = await cloudinary.uploader.upload(
        resume.tempFilePath,
        { folder: "Portfolio_Resume" }
      );

      newUserData.resume = {
        public_id: newResume.public_id,
        url: newResume.secure_url,
      };
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
  }
});

export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(new ErrorHandler("User Not Found", 404));
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Portfolio Password Recovery",
        message,
      });

      res.status(200).json({
        success: true,
        message: `Email sent to ${user.email} successfully`,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return next(new ErrorHandler(error.message, 500));
    }
  } catch (error) {
    console.log(error);
  }
});
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  try {
    const { token } = req.params;
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ErrorHandler("Invalid Token", 400));
    }
    if (req.body.password !== req.body.confirmPassword) {
      return next(new ErrorHandler("Passwords does not match", 400));
    }
    user.password = await req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    generateToken(user, "Password Updated Successfully", 200, res);
  } catch (error) {
    console.log(error);
  }
});

export const getUserForProfile = catchAsyncErrors(async (req, res, next) => {
  try {
    const id = "6784a9739f511216f74736b5";

    const user = await User.findById(id);

    if (!user) {
      return next(new ErrorHandler("User Not Found", 404));
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
  }
});
export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    const user = await User.findById(req.user.id).select("+password");

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return next(
        new ErrorHandler(
          "Please Enter Current Password, New Password and Confirm New Password",
          400
        )
      );
    }

    const isPasswordMatched = await user.comparePassword(currentPassword);

    if (!isPasswordMatched) {
      return next(new ErrorHandler("Incorrect Password", 400));
    }

    if (newPassword !== confirmNewPassword) {
      return next(new ErrorHandler("Passwords does not match", 400));
    }

    user.password = newPassword;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Password Updated Successfully",
    });
  } catch (error) {
    console.log(error);
  }
});
