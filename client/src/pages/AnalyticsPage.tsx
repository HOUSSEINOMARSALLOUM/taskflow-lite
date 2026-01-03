import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import apiClient from "../services/api";

interface AnalyticsData {
  teamName?: string;
  overview?: {
    totalTasks: number;
    completedTasks: number;
    todoTasks: number;
    inProgressTasks: number;
    completionRate: number;
  };
  tasksPerUser?: Array<{
    userId: string;
    userName: string;
    userEmail: string;
    taskCount: number;
    completedCount: number;
  }>;
  overdueTasks?: Array<{
    id: string;
    title: string;
    dueDate: string;
    assignedTo?: { name: string };
    daysOverdue: number;
  }>;
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

const AnalyticsPage: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (teamId) {
      loadAnalytics();
    }
  }, [teamId]);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      const [overview, tasksPerUser, overdueTasks] = await Promise.all([
        apiClient.getAnalyticsOverview(teamId!),
        apiClient.getTasksPerUser(teamId!),
        apiClient.getOverdueTasks(teamId!),
      ]);

      setData({
        overview,
        tasksPerUser,
        overdueTasks,
      });
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load analytics");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Error loading analytics
          </h2>
          <p className="text-gray-600 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const { overview, tasksPerUser, overdueTasks } = data;

  const statusData = [
    { name: "Todo", value: overview?.todoTasks || 0 },
    { name: "In Progress", value: overview?.inProgressTasks || 0 },
    { name: "Completed", value: overview?.completedTasks || 0 },
  ];

  const userTasksData =
    tasksPerUser?.map((u) => ({
      name: u.userName.split(" ")[0],
      completed: u.completedCount,
      total: u.taskCount,
    })) || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Team Analytics
        </h1>

        {/* Overview Cards */}
        {overview && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600 text-sm font-medium">Total Tasks</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {overview.totalTasks}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600 text-sm font-medium">In Progress</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {overview.inProgressTasks}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600 text-sm font-medium">Completed</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {overview.completedTasks}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600 text-sm font-medium">
                Completion Rate
              </p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {overview.completionRate.toFixed(0)}%
              </p>
            </div>
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Task Status Distribution */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Task Status Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Tasks Per User */}
          {userTasksData.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Tasks Per Team Member
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={userTasksData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="completed"
                    stackId="a"
                    fill="#10b981"
                    name="Completed"
                  />
                  <Bar
                    dataKey="total"
                    stackId="a"
                    fill="#d1d5db"
                    name="Remaining"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Overdue Tasks */}
        {overdueTasks && overdueTasks.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Overdue Tasks
            </h2>
            <div className="space-y-3">
              {overdueTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 bg-red-50 rounded border border-red-200"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">{task.title}</h3>
                    <p className="text-sm text-gray-600">
                      {task.assignedTo?.name || "Unassigned"} •{" "}
                      {task.daysOverdue} days overdue
                    </p>
                  </div>
                  <span className="text-red-600 font-medium">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {overdueTasks && overdueTasks.length === 0 && (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No Overdue Tasks
            </h2>
            <p className="text-gray-600">Great job! All tasks are on track.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
