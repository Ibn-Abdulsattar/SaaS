import { Router } from "express";
import {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  deleteTask,
  changeTaskStatus,
} from "../controllers/task.controller.js";
import wrapAsync from "../utils/wrapAsync.js";
import auth from "../middlewares/auth.js";
import {
  createTaskSchema,
  deleteTaskSchema,
  updateTaskSchema,
} from "../validator/task.valdator.js";
import { validateRequest } from "../middlewares/validationRequest.js";
import checklistRoutes from "./checklist.routes.js";

const router = Router({ mergeParams: true });
router.use("/:taskId/checklists", checklistRoutes);

router
  .route("/")
  .post(
    auth(["admin", "manager"]),
    createTaskSchema,
    validateRequest("Task"),
    wrapAsync(createTask),
  )
  .get(auth(["user","admin", "manager"]), wrapAsync(getTasksByProject));
router
  .route("/:id")
  .get(auth(["user","admin", "manager"]), wrapAsync(getTaskById))
  .put(
    auth(["manager","admin"]),
    updateTaskSchema,
    validateRequest("Task"),
    wrapAsync(updateTask),
  )
  .delete(
    auth(["admin", "manager"]),
    deleteTaskSchema,
    validateRequest("Task"),
    wrapAsync(deleteTask),
  );
router.route("/:id/status").patch(
  auth(["user", "manager", "admin"]),
  wrapAsync(changeTaskStatus),
);
export default router;
