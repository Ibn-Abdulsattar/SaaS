import { Router } from "express";
import wrapAsync from "../utils/wrapAsync.js";
import { getRecentActivities } from "../controllers/activity.controller.js";
const router = Router();


router.route("/").get(wrapAsync(getRecentActivities));

export default router;












