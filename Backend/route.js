import express from "express";
import authRoutes from "./routes/auth.route.js";
import movieRoutes from "./routes/movie.route.js";
import searchRoutes from "./routes/search.route.js";
import seatRoutes from "./routes/seatRoute.js";
import menuRoutes from "./routes/menu.route.js";
import ticketRoutes from "./routes/tickets.route.js";
import adminRoutes from "./routes/admin.route.js";
import hallsRoutes from "./routes/halls.route.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/movie", movieRoutes);
router.use("/search", searchRoutes);
router.use("/seat", seatRoutes);
router.use("/menu", menuRoutes);
router.use("/tickets", ticketRoutes);
router.use("/admin", adminRoutes);
router.use("/halls", hallsRoutes);

export default router;
