import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
  {
    content: { type: String, required: true },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    blogPost: {
      type: Schema.Types.ObjectId,
      ref: "BlogPost",
      required: true,
    },
    // parentComment: { type: Schema.Types.ObjectId, ref: "Comment" },
  },
  { timestamps: true }
);

export const Comment = mongoose.model("Comment", commentSchema);
