import express from "express";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  getAllUsers,
  deleteUser,
  updateUserRole,
  deleteUserTicket,
  getAllCancellationRequests,
  updateCancellationRequestStatus,
} from "../controllers/admin.controller.js";

const adminRouter = express.Router();

// ניהול משתמשים
adminRouter.get("/dashboard", verifyAdmin);
adminRouter.get("/users", protectRoute, verifyAdmin, getAllUsers);
adminRouter.delete("/users/:userId", protectRoute, verifyAdmin, deleteUser);
adminRouter.put(
  "/users/:userId/role",
  protectRoute,
  verifyAdmin,
  updateUserRole
);
adminRouter.delete(
  "/users/:userId/tickets/:ticketId",
  protectRoute,
  verifyAdmin,
  deleteUserTicket
);

// ניהול בקשות ביטול
adminRouter.get(
  "/cancellation-requests",
  protectRoute,
  verifyAdmin,
  getAllCancellationRequests
);
adminRouter.put(
  "/cancellation-requests/:requestId/status",
  protectRoute,
  verifyAdmin,
  updateCancellationRequestStatus
);

export default adminRouter;
