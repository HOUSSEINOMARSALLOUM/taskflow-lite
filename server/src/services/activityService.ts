import { PrismaClient } from "@prisma/client";
import { ApiError } from "../utils/errors";

const prisma = new PrismaClient();

export class ActivityService {
  async getTaskActivities(taskId: string, userId: string) {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new ApiError(404, "Task not found", "TASK_NOT_FOUND");
    }

    // Check if user is team member
    const membership = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId: task.teamId,
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

    return prisma.activityLog.findMany({
      where: { taskId },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getTeamActivities(teamId: string, userId: string) {
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

    return prisma.activityLog.findMany({
      where: { teamId },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        task: {
          select: { id: true, title: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  }
}

export default new ActivityService();
