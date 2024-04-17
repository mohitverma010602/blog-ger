import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getUser = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json(new ApiResponse("Getting User from profile", "Got user"));
});

export { getUser };
