import { Router } from "express";
import { getUser } from "../controllers/profile.controller.js";

const router = Router();

router.route("/").get(getUser);

export default router;
