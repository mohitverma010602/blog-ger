import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import {
  createPost,
  deletePostWithId,
  editPostWithId,
  getAllPost,
  getPostWithId,
} from "../controllers/post.controller";

const router = Router();

router.route("/").get(verifyJWT, getAllPost);
router.route("/create").post(verifyJWT, createPost);
router.route("/:id").get(verifyJWT, getPostWithId);
router.route("/:id/edit").put(verifyJWT, editPostWithId);
router.route("/:id/delete").delete(verifyJWT, deletePostWithId);

export default router;
