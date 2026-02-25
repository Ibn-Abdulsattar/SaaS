import { Router } from "express";
import wrapAsync from "../utils/wrapAsync.js";
import { getSummaryStats } from "../controllers/dashboard.controller.js";
import auth from "../middlewares/auth.js";
const router = Router();


router.route("/stats").get( auth(["user"]), wrapAsync(getSummaryStats));

export default router;












