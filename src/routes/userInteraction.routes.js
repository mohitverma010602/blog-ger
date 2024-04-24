import { Router } from "express";
import {
  followUser,
  getFollowers,
  getFollowing,
  unfollowUser,
} from "../controllers/userInteraction.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router({ mergeParams: true });

router.route("/follow").post(verifyJWT, followUser);
router.route("/unfollow").post(verifyJWT, unfollowUser);
router.route("/followers").get(verifyJWT, getFollowers);
router.route("/following").get(verifyJWT, getFollowing);

export default router;
