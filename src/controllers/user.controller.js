import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getUser = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse("Getting User", "Got user"));
});

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, fullName, password, role } = req.body;

  if (
    [username, email, fullName, password].some((field) => field?.trim === "")
  ) {
    throw new ApiError("Please fill all the details", 400);
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { fullName }],
  });

  if (existedUser) {
    throw new ApiError("User already exists", 409);
  }

  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError("Avatar is required", 400);
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar) {
    throw new ApiError("Avatar is required", 400);
  }

  const user = await User.create({
    username,
    email,
    fullName,
    password,
    role,
    avatar: avatar.url,
  });

  const createdUser = await User.findOne(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError("Something went wrong while registering user", 500);
  }

  return res
    .status(201)
    .json(new ApiResponse(createdUser, "User created successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  console.log("logging user");
  res.send("logging user");
});

const logoutUser = asyncHandler(async (req, res) => {
  console.log("logout user");
  res.send("logout user");
});

export { getUser, registerUser, loginUser, logoutUser };
