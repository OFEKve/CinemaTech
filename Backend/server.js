import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { ENV_VARS } from "./config/envVars.js";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.route.js";
import movieRoutes from "./routes/movie.route.js";
import searchRoutes from "./routes/search.route.js";
import seatRoutes from "./routes/seatRoute.js";
import menuRoutes from "./routes/menu.route.js";
import ticketRoutes from "./routes/tickets.route.js";
import adminRoutes from "./routes/admin.route.js";
import hallsRoutes from "./routes/halls.route.js";
const app = express();
// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const PORT = ENV_VARS.PORT;

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/movie", movieRoutes);
app.use("/api/v1/search", searchRoutes);
app.use("/api/v1/seat", seatRoutes);
app.use("/api/v1/menu", menuRoutes);
app.use("/api/v1/tickets", ticketRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/halls", hallsRoutes);
connectDB();
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
