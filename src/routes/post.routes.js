import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createPost,
  deletePost,
  editPost,
  getAllMyPost,
  getAllPost,
  getPostWithId,
} from "../controllers/post.controller.js";

const router = Router();

router.route("/").get(verifyJWT, getAllPost);
router.route("/my-post").get(verifyJWT, getAllMyPost);
router.route("/create").post(verifyJWT, createPost);
router.route("/:id").get(verifyJWT, getPostWithId);
router.route("/:id/edit").put(verifyJWT, editPost);
router.route("/:id/delete").delete(verifyJWT, deletePost);

export default router;
