import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { ENV_VARS } from "./config/envVars.js";
import connectDB from "./config/db.js";
import routes from "./route.js";
// import { importData } from "./seedMenu.js";
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const PORT = ENV_VARS.PORT;

app.use("/api/v1", routes);
// importData();
connectDB();
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
