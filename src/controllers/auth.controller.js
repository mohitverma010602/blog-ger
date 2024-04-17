import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import { sendEmailWithData } from "../utils/sendEmailWithData.js";

const generateAccessTokenandRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      `Error while generating token also ${error.message}`,
      500
    );
  }
};

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
  //check if the user exists:throw error
  //if user exists validate password:wrong password
  //generate token and set it to headers

  const { username, email, password } = req.body;

  if (!(username || email)) {
    throw new ApiError("Username or Email required", 400);
  }

  if (!password) {
    throw new ApiError("Password is required", 400);
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(
      "You are not registered, Please register before logging",
      404
    );
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError("Invalid user credentials", 401);
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenandRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        { loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse({}, "User logged out successfully"));
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new ApiError("Email required", 400);
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError("User with this email does not exists", 401);
  }

  const resetToken = jwt.sign(
    { _id: user._id },
    process.env.RESET_PASSWORD_TOKEN,
    { expiresIn: "1h" }
  );

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/reset-password/${resetToken}`;

  await sendEmailWithData(
    email,
    "Password Reset Link",
    `<p>You have requested to reset your password. Click <a href="${resetUrl}">here</a> to reset your password.</p>`
  );

  res
    .status(200)
    .json(
      new ApiResponse({}, "Password reset email has been sent to your email")
    );
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  if (!token) {
    throw new ApiError("Reset token is required", 400);
  }

  console.log(token);
  console.log(process.env.RESET_PASSWORD_TOKEN);

  const decodedToken = jwt.verify(token, process.env.RESET_PASSWORD_TOKEN);
  console.log(decodedToken);
  if (!decodedToken || !decodedToken._id) {
    throw new ApiError("Invalid reset token", 400);
  }

  const user = await User.findById(decodedToken?._id);
  if (!user) {
    throw new ApiError("User not found", 404);
  }

  const { password } = req.body;
  user.password = password;
  await user.save({ validateBeforeSave: false });

  res.status(200).json(new ApiResponse({}, "Password changed successfully"));
});

export { registerUser, loginUser, logoutUser, forgotPassword, resetPassword };
