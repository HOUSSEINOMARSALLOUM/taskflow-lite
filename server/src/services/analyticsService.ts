import { PrismaClient } from "@prisma/client";
import { ApiError } from "../utils/errors";

const prisma = new PrismaClient();

export class AnalyticsService {
  async getOverview(teamId: string, userId: string) {
    // Check if user is team member
    const membership = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId,
        },
      },
    });

    if (!membership) {
      throw new ApiError(
        403,
        "You are not a member of this team",
        "NOT_MEMBER"
      );
    }

    const [
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      overdueTasks,
    ] = await Promise.all([
      prisma.task.count({ where: { teamId } }),
      prisma.task.count({ where: { teamId, status: "DONE" } }),
      prisma.task.count({ where: { teamId, status: "IN_PROGRESS" } }),
      prisma.task.count({ where: { teamId, status: "TODO" } }),
      prisma.task.count({
        where: {
          teamId,
          status: { not: "DONE" },
          dueDate: { lt: new Date() },
        },
      }),
    ]);

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      overdueTasks,
      completionRate:
        totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    };
  }

  async getTasksPerUser(teamId: string, userId: string) {
    // Check if user is team member
    const membership = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId,
        },
      },
    });

    if (!membership) {
      throw new ApiError(
        403,
        "You are not a member of this team",
        "NOT_MEMBER"
      );
    }

    const stats = await prisma.user.findMany({
      where: {
        teams: {
          some: {
            teamId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        assignedTasks: {
          where: { teamId },
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    return stats.map((user) => ({
      userId: user.id,
      name: user.name,
      email: user.email,
      total: user.assignedTasks.length,
      completed: user.assignedTasks.filter((t) => t.status === "DONE").length,
      inProgress: user.assignedTasks.filter((t) => t.status === "IN_PROGRESS")
        .length,
      todo: user.assignedTasks.filter((t) => t.status === "TODO").length,
    }));
  }

  async getOverdueTasks(teamId: string, userId: string) {
    // Check if user is team member
    const membership = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId,
        },
      },
    });

    if (!membership) {
      throw new ApiError(
        403,
        "You are not a member of this team",
        "NOT_MEMBER"
      );
    }

    return prisma.task.findMany({
      where: {
        teamId,
        status: { not: "DONE" },
        dueDate: { lt: new Date() },
      },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { dueDate: "asc" },
    });
  }
}

export default new AnalyticsService();
