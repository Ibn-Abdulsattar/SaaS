import { Router } from "express";
import wrapAsync from "../utils/wrapAsync.js";
import auth from "../middlewares/auth.js";
import { updateProfile, profile } from "../controllers/profile.controller.js";
import upload from "../services/upload.js";
const router = Router();

router
  .route("/me")
  .get(auth(["user"]), wrapAsync(profile))
  .put(auth(["user"]), upload.single("media"), wrapAsync(updateProfile));

export default router;
