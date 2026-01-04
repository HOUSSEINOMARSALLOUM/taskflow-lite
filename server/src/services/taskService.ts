import { PrismaClient } from "@prisma/client";
import { ApiError } from "../utils/errors";
import { CreateTaskRequest, UpdateTaskRequest } from "../utils/types";
import { PaginationParams, createPaginatedResponse } from "../utils/pagination";

const prisma = new PrismaClient();

export class TaskService {
  async createTask(teamId: string, userId: string, data: CreateTaskRequest) {
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

    // Validate assignee if provided
    if (data.assignedToId) {
      const assigneeMembership = await prisma.teamMember.findUnique({
        where: {
          teamId_userId: {
            teamId,
            userId: data.assignedToId,
          },
        },
      });

      if (!assigneeMembership) {
        throw new ApiError(
          400,
          "Assignee is not a member of this team",
          "INVALID_ASSIGNEE"
        );
      }
    }

    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority || "MEDIUM",
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        teamId,
        createdById: userId,
        assignedToId: data.assignedToId || null,
        status: "TODO",
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: "task_created",
        userId,
        taskId: task.id,
        teamId,
        details: JSON.stringify({
          title: task.title,
          priority: task.priority,
        }),
      },
    });

    return task;
  }

  async getTeamTasks(
    teamId: string,
    userId: string,
    filters: {
      status?: string;
      assignedToId?: string;
      priority?: string;
    },
    pagination: PaginationParams
  ) {
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

    const where: any = { teamId };

    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.assignedToId) {
      where.assignedToId = filters.assignedToId;
    }
    if (filters.priority) {
      where.priority = filters.priority;
    }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        include: {
          createdBy: {
            select: { id: true, name: true, email: true },
          },
          assignedTo: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
      }),
      prisma.task.count({ where }),
    ]);

    return createPaginatedResponse(
      tasks,
      total,
      pagination.page,
      pagination.limit
    );
  }

  async getTaskById(taskId: string, userId: string) {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
        activities: {
          orderBy: { createdAt: "desc" },
        },
      },
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

    return task;
  }

  async updateTask(taskId: string, userId: string, data: UpdateTaskRequest) {
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

    const oldStatus = task.status;
    const newStatus = data.status || oldStatus;

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        title: data.title ?? task.title,
        description: data.description ?? task.description,
        priority: data.priority ?? task.priority,
        dueDate: data.dueDate ? new Date(data.dueDate) : task.dueDate,
        status: newStatus,
        assignedToId: data.assignedToId ?? task.assignedToId,
        completedAt: newStatus === "DONE" ? new Date() : null,
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    // Log activity if status changed
    if (oldStatus !== newStatus) {
      await prisma.activityLog.create({
        data: {
          action: "status_changed",
          userId,
          taskId,
          teamId: task.teamId,
          details: JSON.stringify({
            oldStatus,
            newStatus,
          }),
        },
      });
    }

    return updatedTask;
  }

  async deleteTask(taskId: string, userId: string) {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new ApiError(404, "Task not found", "TASK_NOT_FOUND");
    }

    // Check if user is task creator or team leader
    if (task.createdById !== userId) {
      const membership = await prisma.teamMember.findUnique({
        where: {
          teamId_userId: {
            teamId: task.teamId,
            userId,
          },
        },
      });

      if (!membership || membership.role !== "LEADER") {
        throw new ApiError(
          403,
          "Only creator or team leader can delete task",
          "FORBIDDEN"
        );
      }
    }

    return prisma.task.delete({
      where: { id: taskId },
    });
  }
}

export default new TaskService();
