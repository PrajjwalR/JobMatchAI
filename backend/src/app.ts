import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import uploadRoutes from "./routes/upload";
import openRouterRoutes from "./routes/openrouter";
import resumeEnhancementRoutes from "./routes/resumeEnhancement";

// Debug: Check environment variables
console.log("Environment variables loaded:");
console.log("OPENROUTER_API_KEY exists:", !!process.env.OPENROUTER_API_KEY);
console.log(
  "OPENROUTER_API_KEY length:",
  process.env.OPENROUTER_API_KEY?.length || 0
);
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("Current working directory:", process.cwd());

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/openrouter", openRouterRoutes);
app.use("/api/resume-enhancement", resumeEnhancementRoutes);

app.get("/", (req, res) => {
  res.send("JobMatch AI Backend is running!");
});

export default app;
