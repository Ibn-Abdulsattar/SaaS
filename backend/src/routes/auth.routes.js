import { Router } from "express";
import wrapAsync from "../utils/wrapAsync.js";
import {
  forgot,
  login,
  logout,
  register,
  resetPassword,
  google
} from "../controllers/auth.controller.js";
import { loginSchema, registerSchema } from "../validator/auth.validator.js";
import { validateAuth } from "../validator/auth.validator.js";
import auth from "../middlewares/auth.js";
const router = Router();

router.route("/login").post(loginSchema, validateAuth, wrapAsync(login));
router.route("/register").post(registerSchema, validateAuth, wrapAsync(register));
router.route("/logout").post( auth(["user", "admin", "manager"]), wrapAsync(logout));
router.route("/forgot").post(wrapAsync(forgot));
router.route("/reset-password").post(wrapAsync(resetPassword));
router.post("/google", wrapAsync(google));

export default router;
