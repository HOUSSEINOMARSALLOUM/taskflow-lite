import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
        totalTasks: teams.reduce((sum: number, t: Team) => sum + (t._count?.tasks || 0), 0),
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
          >
            <p className="text-gray-600 text-sm font-medium">Teams</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {stats.totalTeams}
            </p>
            <p className="text-xs text-gray-500 mt-2">Active teams</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
          >
            <p className="text-gray-600 text-sm font-medium">Tasks</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {stats.totalTasks}
            </p>
            <p className="text-xs text-gray-500 mt-2">Total tasks</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
          >
            <p className="text-gray-600 text-sm font-medium">Completed</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {stats.completedTasks}
            </p>
            <p className="text-xs text-gray-500 mt-2">Tasks done</p>
          </motion.div>
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
