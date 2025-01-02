import express from "express";
import {
  addTicketToUser,
  getUserTickets,
  submitCancellationRequest,
  getUserCancellationRequests,
} from "../controllers/tickets.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

// הוספת טיקט למשתמש
router.post("/", addTicketToUser);

// שליפת כל הטיקטים של משתמש
router.get("/:username", protectRoute, getUserTickets);

// הגשת בקשת ביטול כרטיס
router.post("/:ticketId/cancellation", protectRoute, submitCancellationRequest);

// שליפת בקשות ביטול של משתמש
router.get(
  "/:username/cancellation-requests",
  protectRoute,
  getUserCancellationRequests
);

export default router;
