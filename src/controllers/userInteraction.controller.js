import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

const followUser = asyncHandler(async (req, res) => {
  try {
    // Ensure userId is extracted securely from the authenticated user
    const userId = req.user ? req.user._id : null;
    if (!userId) {
      throw new ApiError("User not authenticated", 401);
    }

    // Extract the userToFollowId from the request parameters
    const userToFollowId = req.params.id;

    // Fetch the user and the user to follow from the database
    const user = await User.findById(userId);
    const userToFollow = await User.findById(userToFollowId);

    // Check if both users exist
    if (!user || !userToFollow) {
      throw new ApiError("User not found", 404);
    }

    // Check if the user is trying to follow themselves
    if (userId.equals(userToFollowId)) {
      throw new ApiError("Cannot follow yourself", 400);
    }

    // Check if the user is already following the target user
    if (user.following.includes(userToFollowId)) {
      throw new ApiError("Already following this user", 400);
    }

    // Update the user and the user to follow with the new relationship
    user.following.push(userToFollowId);
    userToFollow.followers.push(userId);
    await Promise.all([user.save(), userToFollow.save()]);

    // Send a success response
    res
      .status(200)
      .json({ message: `Successfully followed ${userToFollow.fullName}` });
  } catch (error) {
    // Log the error
    console.error("Error:", error);
    res.status(500).json("Internal sever error", error);
  }
});

const unfollowUser = asyncHandler(async (req, res) => {
  try {
    // Ensure userId is extracted securely from the authenticated user
    const userId = req.user ? req.user.id : null;
    if (!userId) {
      throw new ApiError("User not authenticated", 401);
    }

    // Extract the userToUnfollowId from the request parameters
    const userToUnfollowId = req.params.id;

    // Fetch the user and the user to unfollow from the database
    const user = await User.findById(userId);
    const userToUnfollow = await User.findById(userToUnfollowId);

    // Check if both users exist
    if (!user || !userToUnfollow) {
      throw new ApiError("User not found", 404);
    }

    // Check if the user is not a follower of the target user
    if (!userToUnfollow.followers.includes(userId)) {
      throw new ApiError("Not a follower of the user", 400);
    }

    // Remove the user from the followers list of the user to unfollow
    userToUnfollow.followers.pull(userId);
    // Remove the user to unfollow from the following list of the current user
    user.following.pull(userToUnfollowId);

    // Update both users in the database
    await Promise.all([user.save(), userToUnfollow.save()]);

    // Send a success response
    res.status(200).json({
      message: `Successfully unfollowed ${userToUnfollow.fullName}`,
    });
  } catch (error) {
    // Log the error
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const getFollowers = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError("Invalid user ID", 400);
    }

    // Find the user by ID and only select the necessary fields
    const user = await User.findById(id);

    // Check if the user exists
    if (!user) {
      throw new ApiError("User not found", 404);
    }

    // Get followers
    const followers = [...user.followers];

    // Return a success response with followers
    res
      .status(200)
      .json(
        new ApiResponse(
          { followers },
          `Retrieved followers of ${user.fullName}`
        )
      );
  } catch (error) {
    console.error("Error while getting followers:", error);
    throw new ApiError("Error while getting followers", 500);
  }
});

const getFollowing = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError("Invalid user ID", 400);
    }

    // Find the user by ID and only select the necessary fields
    const user = await User.findById(id);

    // Check if the user exists
    if (!user) {
      throw new ApiError("User not found", 404);
    }

    // Get followers
    const following = [...user.following];

    // Return a success response with following
    res
      .status(200)
      .json(
        new ApiResponse(
          { following },
          `Retrieved following of ${user.fullName}`
        )
      );
  } catch (error) {
    console.error("Error while getting following:", error);
    throw new ApiError("Error while getting following", 500);
  }
});

export { followUser, unfollowUser, getFollowers, getFollowing };
