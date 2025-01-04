import express from "express";
import {
  assignHall,
  getHallForMovie,
  getAllHalls,
} from "../controllers/halls.controller.js";

const router = express.Router();

// הקצאת אולם לסרט ולשעה
router.post("/assign", assignHall);

// שליפת אולם לסרט ולשעה מסוימת
router.get("/:movieId", getHallForMovie);

// שליפת כל האולמות (לא חובה, אבל שימושי לניהול)
router.get("/", getAllHalls);

export default router;
