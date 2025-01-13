import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Project } from "../models/projectModel.js";
import { v2 as cloudinary } from "cloudinary";

export const addNewProject = catchAsyncErrors(async (req, res, next) => {
  try {
    const {
      title,
      description,
      githubLink,
      projectLiveLink,
      technologies,
      stack,
      deployed,
    } = req.body;

    if (
      !title ||
      !description ||
      !githubLink ||
      !projectLiveLink ||
      !technologies ||
      !stack ||
      !deployed
    ) {
      return next(new ErrorHandler("Please Enter All Fields", 400));
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      return next(new ErrorHandler("Please Upload Project Banner", 400));
    }

    const { projectBanner } = req.files;

    if (
      projectBanner.mimetype !== "image/png" &&
      projectBanner.mimetype !== "image/jpeg" &&
      projectBanner.mimetype !== "image/jpg"
    ) {
      return next(
        new ErrorHandler("Please Upload a valid image, PNG/JPEG/JPG", 400)
      );
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(
      projectBanner.tempFilePath,
      { folder: "Portfolio_Project_Banners" }
    );

    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error(
        "Cloudinary Errror: ",
        cloudinaryResponse.error || "Unknown Cloudinary error"
      );
      return next(new ErrorHandler("Failed to upload project banner", 500));
    }

    const newProject = await Project.create({
      title,
      description,
      githubLink,
      projectLiveLink,
      technologies,
      stack,
      deployed,
      projectBanner: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
    });

    res.status(200).json({
      success: true,
      message: "Project Added Successfully",
      newProject,
    });
  } catch (error) {
    console.log(error);
  }
});

export const updateProject = catchAsyncErrors(async (req, res, next) => {
  try {
    const updateProjectData = {
      title: req.body.title,
      description: req.body.description,
      githubLink: req.body.githubLink,
      projectLiveLink: req.body.projectLiveLink,
      technologies: req.body.technologies,
      stack: req.body.stack,
      deployed: req.body.deployed,
    };

    if (req.files && req.files.projectBanner) {
      const { projectBanner } = req.files.projectBanner;
      const project = await Project.findById(req.params.id);
      const projectBannerId = project.projectBanner.public_id;
      await cloudinary.uploader.destroy(projectBannerId);
      const newProjectBanner = await cloudinary.uploader.upload(
        projectBanner.tempFilePath,
        {
          folder: "Portfolio_Project_Banners",
        }
      );
      updateProjectData.projectBanner = {
        public_id: newProjectBanner.public_id,
        url: newProjectBanner.secure_url,
      };
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      updateProjectData,
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
    res.status(200).json({
      success: true,
      message: "Project Updated Successfully",
      project,
    });
  } catch (error) {
    console.log(error);
  }
});

export const deleteProject = catchAsyncErrors(async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return next(new ErrorHandler("Project Not Found", 400));
    }

    const projectBannerId = project.projectBanner.public_id;
    await cloudinary.uploader.destroy(projectBannerId);

    await project.deleteOne();
    res.status(200).json({
      success: true,
      message: "Project Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
  }
});

export const getAllProjects = catchAsyncErrors(async (req, res, next) => {
  try {
    const projects = await Project.find();
    res.status(200).json({
      success: true,
      projects,
    });
  } catch (error) {
    console.log(error);
  }
});

export const getSingleProject = catchAsyncErrors(async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    req.status(400).json({
      success: false,
      message: error + " :Internal Server Error",
    });
  }
});
