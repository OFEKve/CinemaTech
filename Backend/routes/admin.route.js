import express from "express";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import { protectRoute } from "../middleware/protectRoute.js";
import { CancellationRequest } from "../models/cancellationRequest.model.js"; // שינוי לייבוא עם סוגריים מסולסלות

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
adminRouter.get(
  "/cancellation-requests/unread",
  protectRoute,
  verifyAdmin,
  async (req, res) => {
    try {
      console.log("Fetching unread requests...");
      console.log("CancellationRequest model exists:", !!CancellationRequest); // בדיקה שהמודל קיים

      const unreadRequests = await CancellationRequest.find({
        status: "pending",
      })
        .populate("user", "username")
        .populate("ticket", "movieName date")
        .sort({ createdAt: -1 });

      console.log("Found requests:", unreadRequests);

      const formattedRequests = unreadRequests.map((req) => ({
        reason: req.reason,
        requestDate: new Date(req.createdAt).toLocaleDateString(),
      }));

      res.json({ requests: formattedRequests });
    } catch (error) {
      console.error("Error fetching unread requests:", error);
      console.error("Stack trace:", error.stack);
      res.status(500).json({
        error: "Failed to fetch unread requests",
        details: error.message,
      });
    }
  }
);

export default adminRouter;
