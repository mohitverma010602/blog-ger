import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id).select(
    "-password -refreshToken"
  );

  res.status(200).json(new ApiResponse(user, "Got user profile"));
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id).select(
    "-password -refreshToken"
  );
  if (!user) {
    throw new ApiError("User not found", 404);
  }

  const { username, fullName, email } = req.body;
  if (!username || !fullName || !email) {
    throw new ApiError("Missing field", 400);
  }

  user.username = username || user.username;
  user.fullName = fullName || user.fullName;
  user.email = email || user.email;

  await user.save({ validateBeforeSave: false });

  res.status(200).json(new ApiResponse(user, "User updated successfully"));
});

const updateAvatar = asyncHandler(async (req, res) => {
  console.log(req.file);
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    throw new ApiError("Avatar file not found", 400);
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar.url) {
    throw new ApiError("Error while uploading avatar", 400);
  }
  console.log(avatar);

  const user = await User.findById(req.user._id).select(
    "-password -refreshToken"
  );
  if (!user) {
    throw new ApiError("User not found", 404);
  }

  await deleteFromCloudinary(user.avatar);
  user.avatar = avatar.url;
  user.save({ validateBeforeSave: false });

  res
    .status(200)
    .json(new ApiResponse({ user }, "Avatar successfully changed"));
});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new ApiError("Missing fields", 400);
  }

  const user = await User.findById(req.user?._id);

  const isPasswordCorrect = user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError("Invalid Old Password", 400);
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  res.status(200).json(new ApiResponse({}, "Password Changed Successfully"));
});

export { getUser, updateUser, updateAvatar, changePassword };
