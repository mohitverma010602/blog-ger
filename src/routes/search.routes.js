import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  searchNameByNameOrUsername,
  searchPostByName,
} from "../controllers/search.controller.js";

const router = Router();

router.route("/posts/:postName").get(verifyJWT, searchPostByName);
router.route("/users/:name").get(verifyJWT, searchNameByNameOrUsername);

export default router;
