import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema(
  {
    name: { type: String, unique: true, required: true },
    description: { type: String },
    parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);
