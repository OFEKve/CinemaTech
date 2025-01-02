import express from "express";
import {
  signup,
  login,
  logout,
  authCheck,
  requestPasswordReset,
  resetPassword,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/authCheck", protectRoute, authCheck);
router.post("/request-password-reset", requestPasswordReset);

router.post("/reset-password", resetPassword);

export default router;
