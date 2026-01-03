import { PrismaClient } from "@prisma/client";
import { ApiError } from "../utils/errors";
import { CreateTeamRequest } from "../utils/types";

const prisma = new PrismaClient();

export class TeamService {
  async createTeam(userId: string, data: CreateTeamRequest) {
    // Generate slug from name
    const slug = data.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "")
      .substring(0, 50);

    // Check if slug exists
    const existingTeam = await prisma.team.findUnique({
      where: { slug },
    });

    if (existingTeam) {
      throw new ApiError(
        400,
        "Team with this name already exists",
        "TEAM_EXISTS"
      );
    }

    // Create team and add creator as leader
    const team = await prisma.team.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        members: {
          create: {
            userId,
            role: "LEADER",
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return team;
  }

  async getUserTeams(userId: string) {
    const teams = await prisma.team.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            tasks: true,
          },
        },
      },
    });

    return teams;
  }

  async getTeamById(teamId: string, userId: string) {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            tasks: true,
          },
        },
      },
    });

    if (!team) {
      throw new ApiError(404, "Team not found", "TEAM_NOT_FOUND");
    }

    // Check if user is member
    const isMember = team.members.some((m) => m.userId === userId);
    if (!isMember) {
      throw new ApiError(
        403,
        "You are not a member of this team",
        "NOT_MEMBER"
      );
    }

    return team;
  }

  async addTeamMember(teamId: string, userId: string, newMemberId: string) {
    // Check if user is team leader
    const membership = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId,
        },
      },
    });

    if (!membership || membership.role !== "LEADER") {
      throw new ApiError(403, "Only team leaders can add members", "FORBIDDEN");
    }

    // Check if new member exists
    const newMember = await prisma.user.findUnique({
      where: { id: newMemberId },
    });

    if (!newMember) {
      throw new ApiError(404, "User not found", "USER_NOT_FOUND");
    }

    // Check if already a member
    const existingMembership = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId: newMemberId,
        },
      },
    });

    if (existingMembership) {
      throw new ApiError(
        400,
        "User is already a member of this team",
        "ALREADY_MEMBER"
      );
    }

    // Add member
    return prisma.teamMember.create({
      data: {
        teamId,
        userId: newMemberId,
        role: "MEMBER",
      },
    });
  }
}

export default new TeamService();
