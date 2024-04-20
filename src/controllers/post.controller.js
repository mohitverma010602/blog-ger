import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { BlogPost } from "../models/blogPost.model.js";
import { User } from "../models/user.model.js";

const getAllPost = asyncHandler(async (req, res) => {
  const posts = await BlogPost.find({})
    .populate({
      path: "author",
      select: "-password -refreshToken",
    })
    .populate("comments");

  // Check if there are no posts
  if (!posts.length) {
    throw new ApiError("No posts found", 404);
  }

  // Send the response
  res
    .status(200)
    .json(new ApiResponse({ posts }, "Successfully retrieved posts"));
});

const getAllMyPost = asyncHandler(async (req, res) => {
  const userBlogs = await BlogPost.aggregate([
    {
      $match: { author: req.user?._id }, // Match blogs authored by the user
    },
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author",
      },
    },
    {
      $unwind: "$author",
    },
    {
      $project: {
        title: 1,
        content: 1,
        // Add other fields you want to include
        "author._id": 1,
        "author.username": 1,
        "author.email": 1,
      },
    },
  ]);

  res
    .status(200)
    .json(new ApiResponse({ userBlogs }, "Successfully retrieved posts"));
});

const getPostWithId = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Find the post by ID and populate the author field
  const post = await BlogPost.findById(id).populate({
    path: "author",
    select: "-password -refreshToken",
  });

  // Check if the post with the given ID exists
  if (!post) {
    throw new ApiError("Post not found", 404);
  }

  // Send the response
  res
    .status(200)
    .json(
      new ApiResponse({ post }, `Successfully retrieved post with ID ${id}`)
    );
});

const createPost = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  // Check if title or content is missing
  if (!title || !content) {
    throw new ApiError("Title or Content missing", 400);
  }

  // Find the user by ID
  const user = await User.findById(req.user?._id).select(
    "-password -refreshToken"
  );

  // If user is not found, throw an error
  if (!user) {
    throw new ApiError("User not found. Please register or login.", 404);
  }

  // Create a new blog post
  const blogPost = await BlogPost.create({
    title,
    content,
    author: req.user._id,
  });

  // Add the blog post ID to the user's blogs array
  user.blogs.push(blogPost._id);

  // Save the user changes
  await user.save();

  // Populate the author field in the blog post and return the result
  const populatedBlogPost = await BlogPost.findById(blogPost._id).populate({
    path: "author",
    select: "-password -refreshToken",
  });

  // Send the response
  res
    .status(200)
    .json(new ApiResponse({ post: populatedBlogPost }, "Creating Post"));
});

const editPost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Find the post by ID and populate the author field
  const post = await BlogPost.findById(id).populate({
    path: "author",
    select: "-password -refreshToken",
  });

  // Check if the post with the given ID exists
  if (!post) {
    throw new ApiError("Post not found", 404);
  }

  // Destructure title and content from the request body
  const { title, content } = req.body;

  // Check if both title and content are missing
  if (!title && !content) {
    throw new ApiError("Title and content are missing", 400);
  }

  // Update the post with the provided title and content, or keep the existing values if not provided
  if (title) {
    post.title = title;
  }

  if (content) {
    post.content = content;
  }

  // Save the updated post
  await post.save({ validateBeforeSave: false });

  // Send the response
  res
    .status(200)
    .json(new ApiResponse(post, `Successfully edited post with ID ${id}`));
});

const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Find the deleted post to retrieve the associated author ID
  const deletedPost = await BlogPost.findById(id);

  if (!deletedPost) {
    throw new ApiError("Post not found", 404);
  }

  // Retrieve the author ID of the deleted post
  const authorId = deletedPost.author;

  // Delete the post by ID
  await BlogPost.findByIdAndDelete(id);

  // Remove the deleted post ID from the blogs array of the associated user
  await User.findByIdAndUpdate(authorId, { $pull: { blogs: id } });

  // Send the response
  res
    .status(200)
    .json(new ApiResponse({}, `Successfully deleted post with ID ${id}`));
});

export {
  getAllPost,
  getAllMyPost,
  getPostWithId,
  createPost,
  editPost,
  deletePost,
};
