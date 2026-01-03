import { Response } from "express";
import activityService from "../services/activityService";
import { AuthRequest } from "../utils/jwt";
import { asyncHandler } from "../middleware/errorHandler";

export const getTeamActivities = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { teamId } = req.params;
    const activities = await activityService.getTeamActivities(
      teamId,
      req.user!.id
    );
    res.json({ activities });
  }
);

export const getTaskActivities = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { taskId } = req.params;
    const activities = await activityService.getTaskActivities(
      taskId,
      req.user!.id
    );
    res.json({ activities });
  }
);
