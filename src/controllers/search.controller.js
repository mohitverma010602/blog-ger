import { BlogPost } from "../models/blogPost.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const searchPostByName = asyncHandler(async (req, res) => {
  try {
    const postName = req.params?.postName;

    // Validate postName to prevent injection attacks or unexpected behavior
    if (!postName) {
      return res
        .status(400)
        .json(new ApiResponse(null, "Post name is required."));
    }

    const regex = new RegExp(postName, "i");

    const foundPosts = await BlogPost.find({
      $or: [{ title: { $regex: regex } }, { content: { $regex: regex } }],
    });

    if (foundPosts.length === 0) {
      return res
        .status(404)
        .json(
          new ApiResponse(null, `No posts found related to '${postName}'.`)
        );
    }

    // Respond with found posts
    return res
      .status(200)
      .json(
        new ApiResponse({ foundPosts }, `Found posts related to '${postName}'.`)
      );
  } catch (error) {
    // Log the error for debugging and troubleshooting
    console.error("Error while searching for posts:", error);

    // Respond with a generic error message to avoid exposing sensitive information
    return res
      .status(500)
      .json(
        new ApiResponse(
          null,
          "An unexpected error occurred while searching for posts."
        )
      );
  }
});

const searchNameByNameOrUsername = asyncHandler(async (req, res) => {
  try {
    const name = req.params?.name;

    // Validate name to prevent injection attacks or unexpected behavior
    if (!name) {
      return res
        .status(400)
        .json(new ApiResponse(null, "Username or name is required."));
    }

    const regex = new RegExp(name, "i");

    const foundUsers = await User.find({
      $or: [{ fullName: { $regex: regex } }, { username: { $regex: regex } }],
    });

    if (foundUsers.length === 0) {
      return res
        .status(404)
        .json(new ApiResponse(null, `No users found related to '${name}'.`));
    }

    // Respond with found users
    return res
      .status(200)
      .json(
        new ApiResponse({ foundUsers }, `Found users related to '${name}'.`)
      );
  } catch (error) {
    // Log the error for debugging and troubleshooting
    console.error("Error while searching for users:", error);

    // Respond with a generic error message to avoid exposing sensitive information
    return res
      .status(500)
      .json(
        new ApiResponse(
          null,
          "An unexpected error occurred while searching for users."
        )
      );
  }
});

export { searchNameByNameOrUsername, searchPostByName };
