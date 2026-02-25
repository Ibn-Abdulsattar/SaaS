import { Router } from "express";
import wrapAsync from "../utils/wrapAsync.js";
import { getSummaryStats } from "../controllers/dashboard.controller.js";
const router = Router();


router.route("/stats").get(wrapAsync(getSummaryStats));

export default router;












