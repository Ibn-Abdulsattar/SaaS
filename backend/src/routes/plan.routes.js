import { Router } from "express";
import wrapAsync from "../utils/wrapAsync.js";
import {
  addSubscriptionPlan,
  allSubscriptionPlans,
} from "../controllers/plan.controller.js";
import auth from "../middlewares/auth.js";
const router = Router();

router
  .route("/plans")
  .post( auth(["user"]), wrapAsync(addSubscriptionPlan))
  .get( auth(["user"]), wrapAsync(allSubscriptionPlans));

  export default router;
