import { BlogPost } from "../models/blogPost.model.js";
import { Comment } from "../models/comments.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

const getCommentForBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    // Validate if id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError("Not a valid Id", 400);
    }

    // Find comments associated with the blog post ID
    const comments = await Comment.find({ blogPost: id });

    // Respond with success message and comments
    res
      .status(200)
      .json(
        new ApiResponse(
          { comments },
          "Successfully retrieved comments for the blog post"
        )
      );
  } catch (error) {
    // Handle any errors
    console.error("Error while retrieving comments:", error);
    res.status(500).json(new ApiResponse(null, "Internal Server Error"));
  }
});

const createCommentOnBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    // Validate if id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError("Invalid post ID", 400);
    }

    // Find the blog post by ID
    const post = await BlogPost.findById(id);

    // Check if the post exists
    if (!post) {
      throw new ApiError("Post not found", 404);
    }

    const { content } = req.body;

    // Validate comment content
    if (!content || typeof content !== "string") {
      throw new ApiError("Comment content is required", 400);
    }

    // Create the comment
    const comment = await Comment.create({
      content,
      author: post.author,
      blogPost: id,
    });

    // Add comment to its blog
    post.comments.push(comment);

    // Save the updated post
    await post.save();

    // Respond with success message and created comment
    res
      .status(201)
      .json(new ApiResponse({ comment }, "Comment created successfully"));
  } catch (error) {
    // Handle any errors
    console.error("Error creating comment:", error);
    res.status(500).json(new ApiResponse(null, "Internal server error"));
  }
});

const updateComment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    // Validate if id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError("Invalid id", 400);
    }

    // Find the comment by ID
    const comment = await Comment.findById(id);

    // Check if the comment exists
    if (!comment) {
      throw new ApiError("Comment not found", 404);
    }

    const { content } = req.body;

    // Validate if content is provided
    if (!content || typeof content !== "string") {
      throw new ApiError("Content is required", 400);
    }

    // Update the comment content
    comment.content = content;
    await comment.save();

    // Respond with success message and updated comment
    res
      .status(200)
      .json(new ApiResponse({ comment }, "Updated comment successfully"));
  } catch (error) {
    // Handle any errors
    console.error("Error updating comment:", error);
    res.status(500).json(new ApiResponse(null, "Internal server Error"));
  }
});

const deleteComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    // Find the comment by ID
    const comment = await Comment.findById(id);

    // Check if the comment exists
    if (!comment) {
      throw new ApiError("Comment not found", 404);
    }

    // Extract the ID of the blog post associated with the comment
    const blogId = comment.blogPost._id;

    // Delete the comment
    await Comment.findByIdAndDelete(id);

    // Remove the comment ID from the comments array in the associated blog post
    await BlogPost.findByIdAndUpdate(blogId, { $pull: { comments: id } });

    // Respond with success message
    res.status(200).json(new ApiResponse(null, "Comment deleted successfully"));
  } catch (error) {
    // Handle any errors
    console.error("Error updating comment:", error);
    res.status(500).json(new ApiResponse(null, "Internal server Error"));
  }
});

export { getCommentForBlog, createCommentOnBlog, updateComment, deleteComment };
