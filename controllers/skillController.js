import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { skill } from "../models/skillModel.js";
import { v2 as cloudinary } from "cloudinary";

export const addNewSkill = catchAsyncErrors(async (req, res, next) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return next(new ErrorHandler("Please Upload Skill Icon", 400));
    }
    const { svg } = req.files;
    const { title, proficiency } = req.body;

    if (!title || !proficiency) {
      return next(new ErrorHandler("Please Enter All Fields", 400));
    }

    const cloudinaryResponseForIcon = await cloudinary.uploader.upload(
      svg.tempFilePath,
      { folder: "PORTFOLIO_SKILL_IMAGES" }
    );

    if (!cloudinaryResponseForIcon || cloudinaryResponseForIcon.error) {
      console.error(
        cloudinaryResponseForIcon,
        cloudinaryResponseForIcon.error || "Unknown Cloudinary error"
      );
      return next(new ErrorHandler("Failed to upload icon", 500));
    }
    const Skill = await skill.create({
      title,
      proficiency,
      svg: {
        public_id: cloudinaryResponseForIcon.public_id,
        url: cloudinaryResponseForIcon.secure_url,
      },
    });

    res.status(200).json({
      success: true,
      message: "Skill Added Successfully",
      Skill,
    });
  } catch (error) {
    console.log(error);
  }
});

export const deleteSkill = catchAsyncErrors(async (req, res, next) => {
  try {
    const { id } = req.params;
    let Skill = await skill.findById(id);
    if (!Skill) {
      return next(new ErrorHandler("Skill Not Found", 400));
    }

    const skillSvgId = Skill.svg.public_id;

    await cloudinary.uploader.destroy(skillSvgId);

    await Skill.deleteOne();

    res.status(200).json({
      success: true,
      message: "Skill Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
  }
});

export const getAllSkills = catchAsyncErrors(async (req, res, next) => {
  try {
    const skills = await skill.find();
    res.status(200).json({
      success: true,
      skills,
    });
  } catch (error) {
    console.log(error);
  }
});

export const updateSkill = catchAsyncErrors(async (req, res, next) => {
 
    const { id } = req.params;
    let Skill = await skill.findById(id);
    if (!Skill) {
      return next(new ErrorHandler("Skill Not Found", 400));
    }
    const {  proficiency } = req.body;

    if (!proficiency) {
      return next(new ErrorHandler("Please Enter All Fields", 400));
    }
    try {
        Skill = await skill.findByIdAndUpdate(
      id,
      {
        
        proficiency,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    res.status(200).json({
      success: true,
      message: "Skill Updated Successfully",
      Skill,
      data: {
        title: Skill.title,
        proficiency: Skill.proficiency,
      },
    });
  } catch (error) {
    console.log(error);
  }
});
