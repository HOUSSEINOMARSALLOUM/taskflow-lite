import { Response } from "express";
import analyticsService from "../services/analyticsService";
import { AuthRequest } from "../utils/jwt";
import { asyncHandler } from "../middleware/errorHandler";

export const getOverview = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { teamId } = req.params;
    const overview = await analyticsService.getOverview(teamId, req.user!.id);
    res.json(overview);
  }
);

export const getTasksPerUser = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { teamId } = req.params;
    const stats = await analyticsService.getTasksPerUser(teamId, req.user!.id);
    res.json({ stats });
  }
);

export const getOverdueTasks = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { teamId } = req.params;
    const overdueTasks = await analyticsService.getOverdueTasks(
      teamId,
      req.user!.id
    );
    res.json({ overdueTasks });
  }
);
