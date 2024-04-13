import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getUser = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse("Getting User", "Got user"));
});

export { getUser };
