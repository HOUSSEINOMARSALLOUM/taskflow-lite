import express from "express";
import * as activityController from "../controllers/activityController";
import { authenticate } from "../utils/jwt";

const router = express.Router({ mergeParams: true });

router.use(authenticate);

router.get("/team", activityController.getTeamActivities);
router.get("/task/:taskId", activityController.getTaskActivities);

export default router;
