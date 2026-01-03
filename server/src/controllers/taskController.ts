import { Response } from "express";
import taskService from "../services/taskService";
import { AuthRequest } from "../utils/jwt";
import { asyncHandler } from "../middleware/errorHandler";
import { parsePagination } from "../utils/pagination";
import { TaskStatus, Priority } from "@prisma/client";

export const createTask = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { teamId } = req.params;
    const { title, description, priority, dueDate, assignedToId } = req.body;

    if (!title) {
      res.status(400).json({ error: "Task title is required" });
      return;
    }

    const task = await taskService.createTask(teamId, req.user!.id, {
      title,
      description,
      priority,
      dueDate,
      assignedToId,
    });

    res.status(201).json({ task });
  }
);

export const getTeamTasks = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { teamId } = req.params;
    const pagination = parsePagination(req.query);

    const filters = {
      status: req.query.status as TaskStatus | undefined,
      assignedToId: req.query.assignedToId as string | undefined,
      priority: req.query.priority as Priority | undefined,
    };

    const result = await taskService.getTeamTasks(
      teamId,
      req.user!.id,
      filters,
      pagination
    );
    res.json(result);
  }
);

export const getTaskById = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { taskId } = req.params;
    const task = await taskService.getTaskById(taskId, req.user!.id);
    res.json({ task });
  }
);

export const updateTask = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { taskId } = req.params;
    const task = await taskService.updateTask(taskId, req.user!.id, req.body);
    res.json({ task });
  }
);

export const deleteTask = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { taskId } = req.params;
    await taskService.deleteTask(taskId, req.user!.id);
    res.json({ message: "Task deleted successfully" });
  }
);
