import express from "express";
import { searchMovie } from "../controllers/search.controller.js";

const router = express.Router();
router.get("/movie/:searchTerm", searchMovie);

export default router;
