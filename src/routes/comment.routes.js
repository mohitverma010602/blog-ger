import { Router } from "express";
import {
  deleteComment,
  updateComment,
} from "../controllers/comment.controller.js";
const router = Router();

router.route("/:id/edit").put(updateComment);
router.route("/:id/delete").delete(deleteComment);

export default router;
