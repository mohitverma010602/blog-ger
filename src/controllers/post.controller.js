import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const getAllPost = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse({}, "Getting Post"));
});

const getPostWithId = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse({}, "Getting Post With Id"));
});

const createPost = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse({}, "Creating Post"));
});

const editPostWithId = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse({}, "Editing Post With Id"));
});

const deletePostWithId = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse({}, "Deleting Post With Id"));
});

export {
  getAllPost,
  getPostWithId,
  createPost,
  editPostWithId,
  deletePostWithId,
};
