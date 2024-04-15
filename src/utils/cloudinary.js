import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ApiError } from "./ApiError.js";

cloudinary.config({
  cloud_name: process.env.ClOUDINARY_CLOUD_NAME,
  api_key: process.env.ClOUDINARY_API_KEY,
  api_secret: process.env.ClOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async function (localFilePath) {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      use_filename: true,
      unique_filename: true,
      overwrite: true,
      folder: "blog-ger",
    });

    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    throw new ApiError("Error while uploding file to cloudinary", 500);
  }
};

export { uploadOnCloudinary };
