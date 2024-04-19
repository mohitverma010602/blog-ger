import mongoose, { Mongoose, Schema } from "mongoose";

const blogPostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const BlogPost = mongoose.model("BlogPost", blogPostSchema);

//   title: { type: String, required: true },
//   content: { type: String, required: true },
//   author: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   tags: [String],
//   category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
//   publishedAt: { type: Date },
//   views: { type: Number, default: 0 },
//   likes: { type: Number, default: 0 },
//   comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
// },
