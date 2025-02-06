import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video
  if ([title, description].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }
  const userVideoFile = req.files?.videoFile[0]?.path;
  const userThumbNailFile = req.files?.thumbnail[0]?.path;
  if (!userVideoFile) {
    console.log("no video");
    throw new ApiError(400, "Video is required");
  }
  if (!userThumbNailFile) {
    console.log("no photo");
    throw new ApiError(400, "Thumbnail is required");
  }

  let videoFile;
  try {
    videoFile = await uploadOnCloudinary(userVideoFile);
    console.log("Video Uploaded Successfully", videoFile.url);
  } catch (error) {
    console.log("Error uploading Video", error);
    throw new ApiError(500, "failed to upload Video");
  }
  let thumbnail;
  try {
    thumbnail = await uploadOnCloudinary(userThumbNailFile);
    console.log("Thumbnail Uploaded Successfully", thumbnail.url);
  } catch (error) {
    console.log("Error uploading Thumbnail", error);
    throw new ApiError(500, "failed to upload Thumbnail");
  }

  try {
    const video = await Video.create({
      title,
      description,
      thumbnail: thumbnail.url,
      videoFile: videoFile.url,
      duration: videoFile.duration,
    });
    const uploadedVideo = await Video.findById(video._id);
    if (!uploadedVideo) {
      throw new ApiError(500, "something went wrong while uploading video");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, video, "Video Uploaded Successfully"));
  } catch (error) {
    console.log("Error uploading Thumbnail", error);
    if (videoFile) {
      await deleteFromCloudinary(videoFile.public_id);
    }
    if (thumbnail) {
      await deleteFromCloudinary(thumbnail.public_id);
    }
    throw new ApiError(500, "failed to upload the video");
  }
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
  if (videoId?.trim() === "") {
    throw new ApiError(400, "Video Id is missing");
  }
  const video = await Video.findById(videoId);
  res
    .status(200)
    .json(new ApiResponse(200, video, "Video Fetched Successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
  if (!videoId) {
    throw new ApiError(404, "Video id not found");
  }
  await Video.findByIdAndDelete(videoId);
  res.status(200).json(new ApiResponse(200, [], "video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { isPublished } = req.body;
  if (!videoId) {
    throw new ApiError(404, "Video id not found");
  }
  const video = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        isPublished,
      },
    },
    {
      new: true,
    }
  );
  console.log(isPublished);
  res.status(200).json(new ApiResponse(200, video, "Video Status changed"));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
