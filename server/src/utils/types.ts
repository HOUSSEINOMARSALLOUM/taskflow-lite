export interface CreateTeamRequest {
  name: string;
  description?: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  dueDate?: string;
  assignedToId?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  dueDate?: string;
  status?: "TODO" | "IN_PROGRESS" | "DONE";
  assignedToId?: string;
}

export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
