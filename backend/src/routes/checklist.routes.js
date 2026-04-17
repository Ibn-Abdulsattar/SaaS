import { Router } from "express";
import {
  getChecklistsByTask,
  createChecklist,
  updateChecklistStatus,
  deleteChecklist
} from "../controllers/checklist.controller.js";
import wrapAsync from "../utils/wrapAsync.js";
import auth from "../middlewares/auth.js";

const router = Router({ mergeParams: true });

router.route("/")
  .get(auth(["admin", "manager", "user"]), wrapAsync(getChecklistsByTask))
  .post(auth([ "admin", "manager"]), wrapAsync(createChecklist));

router.route("/:checklistId")
  .put(auth(["admin", "manager", "user"]), wrapAsync(updateChecklistStatus))
  .delete(auth(["admin", "manager"]), wrapAsync(deleteChecklist));

export default router;
