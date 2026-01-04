import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import teamRoutes from "./routes/teamRoutes";
import taskRoutes from "./routes/taskRoutes";
import activityRoutes from "./routes/activityRoutes";
import analyticsRoutes from "./routes/analyticsRoutes";
import { errorHandler, notFound } from "./middleware/errorHandler";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "OK", message: "TaskFlow Lite API is running" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/teams/:teamId/tasks", taskRoutes);
app.use("/api/teams/:teamId/activities", activityRoutes);
app.use("/api/teams/:teamId/analytics", analyticsRoutes);

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`🚀 TaskFlow Lite API running on http://localhost:${port}`);
});
