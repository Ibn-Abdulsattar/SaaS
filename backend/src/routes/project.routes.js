import { Router } from "express";
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/project.controller.js";
import taskRoutes from "./task.routes.js";
import wrapAsync from "../utils/wrapAsync.js";
import upload from "../services/upload.js";
import auth from "../middlewares/auth.js";

const router = Router();

router.use("/:projectId/tasks", taskRoutes);

router
  .route("/")
  .post(auth(["user"]), upload.single("media"), wrapAsync(createProject))
  .get( auth(["user"]), wrapAsync(getAllProjects));
router
  .route("/:id")
  .get( auth(["user"]), wrapAsync(getProjectById))
  .put( auth(["user"]), wrapAsync(updateProject))
  .delete( auth(["user"]), wrapAsync(deleteProject));

export default router;
