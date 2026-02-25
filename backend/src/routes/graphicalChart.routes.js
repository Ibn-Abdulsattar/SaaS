import { Router } from "express";
import wrapAsync from "../utils/wrapAsync.js";
import {
  getMonthlyRevenu,
  getTaskStatusStats,
  getUserGrowth,
} from "../controllers/graphicalChart.controller.js";
const router = Router();

router.route("/revenue").get(wrapAsync(getMonthlyRevenu));
router.route("/task").get(wrapAsync(getTaskStatusStats));
router.route("/growth").get(wrapAsync(getUserGrowth));

export default router;
