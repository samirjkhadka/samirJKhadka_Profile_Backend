import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { softwareApplication } from "../models/softwareApplicationModel.js";
import { v2 as cloudinary } from "cloudinary";

export const addNewApplication = catchAsyncErrors(async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      return next(new ErrorHandler("Please Enter Name", 400));
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      return next(new ErrorHandler("Please Upload Icon", 400));
    }

    const { svg } = req.files;

    const cloudinaryResponseForIcon = await cloudinary.uploader.upload(
      svg.tempFilePath,
      { folder: "PORTFOLIO_SOFTWARE_APPLICATION_IMAGES" }
    );

    if (!cloudinaryResponseForIcon || cloudinaryResponseForIcon.error) {
      console.error(
        "Cloudinary Error: ",
        cloudinaryResponseForIcon.error || "Unknown Cloudinary error"
      );
      return next(new ErrorHandler("Failed to upload icon", 500));
    }
    const SoftwareApplication = await softwareApplication.create({
      name,
      svg: {
        public_id: cloudinaryResponseForIcon.public_id,
        url: cloudinaryResponseForIcon.secure_url,
      },
    });

    res.status(200).json({
      success: true,
      message: "Software Application Added Successfully",
      SoftwareApplication,
    });
  } catch (error) {
    console.log(error);
  }
});

export const deleteApplication = catchAsyncErrors(async (req, res, next) => {
  try {
    const { id } = req.params;
    let SoftwareApplication = await softwareApplication.findById(id);
    if (!SoftwareApplication) {
      return next(new ErrorHandler("Software Application Not Found", 400));
    }
    const softwareApplicationSvgId = SoftwareApplication.svg.public_id;

    await cloudinary.uploader.destroy(softwareApplicationSvgId);

    await SoftwareApplication.deleteOne();

    res.status(200).json({
      success: true,
      message: "Software Application Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
  }
});

export const getAllApplications = catchAsyncErrors(async (req, res, next) => {
  try {
    const SoftwareApplication = await softwareApplication.find();
    res.status(200).json({
      success: true,
      SoftwareApplication,
    });
  } catch (error) {
    console.log(error);
  }
});
