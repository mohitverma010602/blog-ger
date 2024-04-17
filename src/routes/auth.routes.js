import { Router } from "express";
import {
  forgotPassword,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
} from "../controllers/auth.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(upload.single("avatar"), registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(verifyJWT, logoutUser);
router.route("/forgot-password").post(verifyJWT, forgotPassword);
router.route("/reset-password/:token").post(verifyJWT, resetPassword);

export default router;
