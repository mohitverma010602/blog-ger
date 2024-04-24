import { Router } from "express";
import {
  deleteComment,
  updateComment,
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/:id/edit").put(verifyJWT, updateComment);
router.route("/:id/delete").delete(verifyJWT, deleteComment);

export default router;
