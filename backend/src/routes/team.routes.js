import { Router } from "express";
import auth from "../middlewares/auth.js";
import wrapAsync from "../utils/wrapAsync.js";
import {
  addMembersToTeam,
  createTeam,
  getAllMembersOfTeam,
} from "../controllers/team.controller.js";
const router = Router();

router.route("/").post(auth(["user"]), wrapAsync(createTeam));
router
  .route("/:teamId/members")
  .post(auth(["user"]), wrapAsync(addMembersToTeam))
  .get(auth(["user"]), wrapAsync(getAllMembersOfTeam));

export default router;
