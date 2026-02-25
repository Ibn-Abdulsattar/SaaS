import { Router } from "express";
import {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/task.controller.js";
import wrapAsync from "../utils/wrapAsync.js";
import auth from "../middlewares/auth.js";

const router = Router({ mergeParams: true });

router.route("/").post( auth(["user"]), wrapAsync(createTask)).get(wrapAsync(getTasksByProject));
router
  .route("/:id")
  .get( auth(["user"]), wrapAsync(getTaskById))
  .put( auth(["user"]), wrapAsync(updateTask))
  .delete( auth(["user"]), wrapAsync(deleteTask));

export default router;
