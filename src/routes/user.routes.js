import { Router } from "express";
import {
  getUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/").get(getUser);
router.route("/register").post(upload.single("avatar"), registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);

export default router;
