import { Router } from "express";
import {
  changePassword,
  getUser,
  updateAvatar,
  updateUser,
} from "../controllers/profile.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(verifyJWT, getUser);
router.route("/edit").patch(verifyJWT, updateUser);
router
  .route("/editAvatar")
  .patch(verifyJWT, upload.single("avatar"), updateAvatar);
router.route("/change-password").patch(verifyJWT, changePassword);

export default router;
