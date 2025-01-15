import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Timeline } from "../models/timelineModel.js";

export const postTimeLine = catchAsyncErrors(async (req, res, next) => {
  const { title, description, from, to } = req.body;

  try {
    const newTimeLine = await Timeline.create({
      title,
      description,
      timeline: { from, to },
    });
    res.status(200).json({
      success: true,
      message: "Timeline Added Successfully",
      newTimeLine,
    });
  } catch (error) {
    console.log(error);
  }
});


export const deleteTimeline =  catchAsyncErrors(async (req, res, next) => {
    try{
      const { id } = req.params;
      let timeline = await Timeline.findById(id);
      if (!timeline) {
        return next(new ErrorHandler("Timeline Not Found", 400));
      }
      await timeline.deleteOne();
      res.status(200).json({
        success: true,
        message: "Timeline Deleted Successfully",
      });
    }
    catch (error) {
      console.log(error);
    }
})

export const getAllTimelines =  catchAsyncErrors(async (req, res, next) => {
    try{
      const timelines = await Timeline.find();
      res.status(200).json({
        success: true,
        timelines,
      });
    }
    catch (error) {
      console.log(error);
    }
})