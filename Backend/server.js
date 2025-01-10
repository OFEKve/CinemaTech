import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { ENV_VARS } from "./config/envVars.js";
import connectDB from "./config/db.js";
import routes from "./route.js";
// import { importData } from "./seedMenu.js";
const app = express();

app.use(express.json());
// הוסף את זה לפני הגדרות ה-CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.use(
  cors({
    origin: ["http://localhost:5173", "https://ofekvegastech.netlify.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Set-Cookie"],
  })
);

app.use(cookieParser());
const PORT = ENV_VARS.PORT;

app.use("/api/v1", routes);
// importData();
connectDB();
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
