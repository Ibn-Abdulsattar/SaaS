import { Router } from "express";
import wrapAsync from "../utils/wrapAsync.js";
import {
  getMonthlyRevenu,
  getTaskStatusStats,
  getUserGrowth,
} from "../controllers/graphicalChart.controller.js";
import auth from "../middlewares/auth.js";
const router = Router();

router.route("/revenue").get( auth(["user"]), wrapAsync(getMonthlyRevenu));
router.route("/task").get( auth(["user"]), wrapAsync(getTaskStatusStats));
router.route("/growth").get( auth(["user"]), wrapAsync(getUserGrowth));

export default router;
