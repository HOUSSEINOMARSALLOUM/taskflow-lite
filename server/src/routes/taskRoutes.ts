import express from "express";
import * as taskController from "../controllers/taskController";
import { authenticate } from "../utils/jwt";

const router = express.Router({ mergeParams: true });

router.use(authenticate);

router.post("/", taskController.createTask);
router.get("/", taskController.getTeamTasks);
router.get("/:taskId", taskController.getTaskById);
router.put("/:taskId", taskController.updateTask);
router.delete("/:taskId", taskController.deleteTask);

export default router;
