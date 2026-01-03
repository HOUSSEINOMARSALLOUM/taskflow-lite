import express from "express";
import * as analyticsController from "../controllers/analyticsController";
import { authenticate } from "../utils/jwt";

const router = express.Router({ mergeParams: true });

router.use(authenticate);

router.get("/overview", analyticsController.getOverview);
router.get("/tasks-per-user", analyticsController.getTasksPerUser);
router.get("/overdue", analyticsController.getOverdueTasks);

export default router;
