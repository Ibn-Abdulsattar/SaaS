import { Router } from "express";
import wrapAsync from "../utils/wrapAsync.js";
import {
  forgot,
  login,
  logout,
  register,
  resetPassword,
} from "../controllers/auth.controller.js";
import { loginSchema, registerSchema } from "../validator/auth.validator.js";
import { validateAuth } from "../validator/auth.validator.js";
const router = Router();

router.route("/login").post(loginSchema, validateAuth, wrapAsync(login));
router.route("/register").post(registerSchema, validateAuth, wrapAsync(register));
router.route("/logout").post(wrapAsync(logout));
router.route("/forgot").post(wrapAsync(forgot));
router.route("/reset-password").post(wrapAsync(resetPassword));

export default router;
