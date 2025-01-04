import express from "express";
import {
  reserveSeats,
  getReservedSeats,
} from "../controllers/seat.controller.js";

const router = express.Router();

// Route to reserve seats for a movie
router.post("/reserve", reserveSeats);

// Route to get reserved seats for a movie
router.get("/reserved/:movieId", getReservedSeats);

export default router;
