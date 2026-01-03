import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../services/authContext";
import apiClient from "../services/api";

interface Team {
  id: string;
  name: string;
  _count?: { tasks: number };
}

interface DashboardStats {
  totalTeams: number;
  totalTasks: number;
  completedTasks: number;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading, isAuthenticated } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalTeams: 0,
    totalTasks: 0,
    completedTasks: 0,
  });
  const [recentTeams, setRecentTeams] = useState<Team[]>([]);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      loadDashboardStats();
    }
  }, [isAuthenticated, isLoading]);

  const loadDashboardStats = async () => {
    try {
      const teams = await apiClient.getTeams();
      setRecentTeams(teams.slice(0, 3));
      setStats({
        totalTeams: teams.length,
        totalTasks: teams.reduce((sum, t) => sum + (t._count?.tasks || 0), 0),
        completedTasks: 0,
      });
    } catch (error) {
      console.error("Failed to load dashboard stats:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Unauthenticated Landing Page
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-900">TaskFlow Lite</h1>
            <p className="text-gray-600">
              Role-Based Team Task & Progress Management
            </p>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-semibold mb-4">Welcome!</h2>
              <p className="text-gray-700 mb-6">
                TaskFlow Lite is a lightweight, role-based task management
                platform for small teams, student groups, NGOs, and startups.
              </p>
              <ul className="space-y-3 text-gray-700 mb-8">
                <li>✓ Simple team and task management</li>
                <li>✓ Real-time status tracking</li>
                <li>✓ Activity logs and history</li>
                <li>✓ Analytics and insights</li>
              </ul>
              <a
                href="/login"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
              >
                Sign In
              </a>
              <span className="mx-2">or</span>
              <a
                href="/register"
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded"
              >
                Sign Up
              </a>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-semibold mb-4">Key Features</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Authentication
                  </h4>
                  <p className="text-sm text-gray-600">
                    Secure JWT-based authentication with role-based access
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Team Management
                  </h4>
                  <p className="text-sm text-gray-600">
                    Create teams, add members, and manage permissions
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Task Tracking</h4>
                  <p className="text-sm text-gray-600">
                    Assign, prioritize, and track tasks with due dates
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Analytics</h4>
                  <p className="text-sm text-gray-600">
                    Visualize progress with charts and completion rates
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Authenticated Dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">Here's your task overview</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-8">
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <p className="text-gray-600 text-sm font-medium">Teams</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {stats.totalTeams}
            </p>
            <p className="text-xs text-gray-500 mt-2">Active teams</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <p className="text-gray-600 text-sm font-medium">Tasks</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {stats.totalTasks}
            </p>
            <p className="text-xs text-gray-500 mt-2">Total tasks</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <p className="text-gray-600 text-sm font-medium">Completed</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {stats.completedTasks}
            </p>
            <p className="text-xs text-gray-500 mt-2">Tasks done</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              👥 Manage Teams
            </h3>
            <p className="text-blue-700 text-sm mb-4">
              Create and organize your teams
            </p>
            <button
              onClick={() => navigate("/teams")}
              className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
            >
              Go to Teams
            </button>
          </div>
          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              📊 View Analytics
            </h3>
            <p className="text-green-700 text-sm mb-4">
              Track team productivity
            </p>
            {stats.totalTeams > 0 ? (
              <button
                onClick={() =>
                  navigate(`/teams/${recentTeams[0]?.id}/analytics`)
                }
                className="inline-block px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
              >
                View Analytics
              </button>
            ) : (
              <button
                disabled
                className="inline-block px-4 py-2 bg-gray-400 text-white text-sm font-medium rounded-md cursor-not-allowed"
              >
                Create a team first
              </button>
            )}
          </div>
        </div>

        {/* Recent Teams */}
        {recentTeams.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Recent Teams
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentTeams.map((team) => (
                <div
                  key={team.id}
                  onClick={() => navigate(`/teams/${team.id}`)}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
                >
                  <h3 className="font-semibold text-gray-900">{team.name}</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    {team._count?.tasks || 0} tasks
                  </p>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2">
                    View Team →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
