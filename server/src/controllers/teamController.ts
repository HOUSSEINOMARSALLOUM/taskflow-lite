import { Response } from "express";
import teamService from "../services/teamService";
import { AuthRequest } from "../utils/jwt";
import { asyncHandler } from "../middleware/errorHandler";

export const createTeam = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { name, description } = req.body;

    if (!name) {
      res.status(400).json({ error: "Team name is required" });
      return;
    }

    const team = await teamService.createTeam(req.user!.id, {
      name,
      description,
    });
    res.status(201).json({ team });
  }
);

export const getUserTeams = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const teams = await teamService.getUserTeams(req.user!.id);
    res.json({ teams });
  }
);

export const getTeamById = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { teamId } = req.params;
    const team = await teamService.getTeamById(teamId, req.user!.id);
    res.json({ team });
  }
);

export const addTeamMember = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { teamId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({ error: "User ID is required" });
      return;
    }

    const membership = await teamService.addTeamMember(
      teamId,
      req.user!.id,
      userId
    );
    res.status(201).json({ membership });
  }
);
