import axios, { AxiosInstance, AxiosError } from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

class ApiClient {
  private client: AxiosInstance;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Load tokens from localStorage
    this.accessToken = localStorage.getItem("accessToken");
    this.refreshToken = localStorage.getItem("refreshToken");

    // Add request interceptor
    this.client.interceptors.request.use(
      (config) => {
        if (this.accessToken) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          if (this.refreshToken) {
            try {
              const response = await axios.post(`${API_URL}/auth/refresh`, {
                refreshToken: this.refreshToken,
              });

              this.setTokens(response.data.accessToken, this.refreshToken);
              originalRequest.headers.Authorization = `Bearer ${this.accessToken}`;
              return this.client(originalRequest);
            } catch (refreshError) {
              this.clearTokens();
              return Promise.reject(refreshError);
            }
          }
        }

        return Promise.reject(error);
      }
    );
  }

  setTokens(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }

  getAccessToken() {
    return this.accessToken;
  }

  isAuthenticated() {
    return !!this.accessToken;
  }

  // Auth endpoints
  async register(email: string, name: string, password: string) {
    const response = await this.client.post("/auth/register", {
      email,
      name,
      password,
    });
    this.setTokens(response.data.accessToken, response.data.refreshToken);
    return response.data.user;
  }

  async login(email: string, password: string) {
    const response = await this.client.post("/auth/login", {
      email,
      password,
    });
    this.setTokens(response.data.accessToken, response.data.refreshToken);
    return response.data.user;
  }

  async logout() {
    try {
      await this.client.post("/auth/logout");
    } finally {
      this.clearTokens();
    }
  }

  async getMe() {
    const response = await this.client.get("/auth/me");
    return response.data.user;
  }

  // Team endpoints
  async getTeams() {
    const response = await this.client.get("/teams");
    return response.data.teams;
  }

  async createTeam(name: string, description?: string) {
    const response = await this.client.post("/teams", {
      name,
      description,
    });
    return response.data.team;
  }

  async getTeam(teamId: string) {
    const response = await this.client.get(`/teams/${teamId}`);
    return response.data.team;
  }

  async addTeamMember(teamId: string, userId: string) {
    const response = await this.client.post(`/teams/${teamId}/members`, {
      userId,
    });
    return response.data.membership;
  }

  // Task endpoints
  async getTeamTasks(
    teamId: string,
    filters?: any,
    page?: number,
    limit?: number
  ) {
    const params: any = {};
    if (filters?.status) params.status = filters.status;
    if (filters?.assignedToId) params.assignedToId = filters.assignedToId;
    if (filters?.priority) params.priority = filters.priority;
    if (page) params.page = page;
    if (limit) params.limit = limit;

    const response = await this.client.get(`/teams/${teamId}/tasks`, {
      params,
    });
    return response.data;
  }

  async createTask(
    teamId: string,
    title: string,
    description?: string,
    priority?: string,
    dueDate?: string,
    assignedToId?: string
  ) {
    const response = await this.client.post(`/teams/${teamId}/tasks`, {
      title,
      description,
      priority,
      dueDate,
      assignedToId,
    });
    return response.data.task;
  }

  async getTask(taskId: string) {
    const response = await this.client.get(`/teams/-/tasks/${taskId}`);
    return response.data.task;
  }

  async updateTask(taskId: string, data: any) {
    const response = await this.client.put(`/teams/-/tasks/${taskId}`, data);
    return response.data.task;
  }

  async deleteTask(teamId: string, taskId: string) {
    await this.client.delete(`/teams/${teamId}/tasks/${taskId}`);
  }

  // Activity endpoints
  async getTeamActivities(teamId: string) {
    const response = await this.client.get(`/teams/${teamId}/activities/team`);
    return response.data.activities;
  }

  async getTaskActivities(teamId: string, taskId: string) {
    const response = await this.client.get(
      `/teams/${teamId}/activities/task/${taskId}`
    );
    return response.data.activities;
  }

  // Analytics endpoints
  async getAnalyticsOverview(teamId: string) {
    const response = await this.client.get(
      `/teams/${teamId}/analytics/overview`
    );
    return response.data;
  }

  async getTasksPerUser(teamId: string) {
    const response = await this.client.get(
      `/teams/${teamId}/analytics/tasks-per-user`
    );
    return response.data.stats;
  }

  async getOverdueTasks(teamId: string) {
    const response = await this.client.get(
      `/teams/${teamId}/analytics/overdue`
    );
    return response.data.overdueTasks;
  }
}

export const apiClient = new ApiClient();
export default apiClient;
