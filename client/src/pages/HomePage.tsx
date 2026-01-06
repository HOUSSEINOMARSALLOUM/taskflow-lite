import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../services/authContext";
import apiClient from "../services/api";
import {
  Users,
  CheckCircle,
  ListTodo,
  TrendingUp,
  ArrowRight,
  BarChart2,
  Clock,
  Sparkles,
  Zap,
  Target,
  Calendar,
  Activity,
} from "lucide-react";

interface Team {
  id: string;
  name: string;
  description?: string;
  _count?: { tasks: number; teamMembers: number };
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
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loader-neo mx-auto mb-4" />
          <p className="text-neo-muted">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="orb orb-blue w-96 h-96 top-0 right-0 opacity-20" />
        <div className="orb orb-orange w-64 h-64 bottom-1/4 left-0 opacity-15" />
        <div className="grid-bg absolute inset-0 opacity-20" />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
          >
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 mb-2"
              >
                <img src="/neo-logo.png" alt="Neo" className="w-10 h-10" />
                <span className="badge-neo badge-neo-blue text-xs">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI-Powered Dashboard
                </span>
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                {greeting},{" "}
                <span className="text-gradient-neo">{user?.name?.split(' ')[0]}</span>!
              </h1>
              <p className="text-xl text-neo-muted">
                Let's make today productive. Here's your workspace overview.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex gap-3"
            >
              <button
                onClick={() => navigate("/teams")}
                className="btn-neo-primary flex items-center gap-2"
              >
                <Users className="w-5 h-5" />
                Manage Teams
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Stats Grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
          >
            {[
              {
                icon: Users,
                label: "Active Teams",
                value: stats.totalTeams,
                change: "+2 this week",
                color: "neo-blue",
                gradient: "from-neo-blue to-neo-cyan",
              },
              {
                icon: ListTodo,
                label: "Total Tasks",
                value: stats.totalTasks,
                change: "+15 today",
                color: "neo-orange",
                gradient: "from-neo-orange to-yellow-500",
              },
              {
                icon: CheckCircle,
                label: "Completed",
                value: stats.completedTasks,
                change: "87% completion rate",
                color: "green-500",
                gradient: "from-green-500 to-emerald-400",
              },
              {
                icon: TrendingUp,
                label: "Productivity",
                value: "94%",
                change: "+12% vs last week",
                color: "neo-purple",
                gradient: "from-neo-purple to-pink-500",
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="stat-card-neo group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center"
                  >
                    <Activity className="w-4 h-4 text-neo-muted" />
                  </motion.div>
                </div>
                <p className="text-sm text-neo-muted mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-white mb-2">{stat.value}</p>
                <p className="text-xs text-neo-muted flex items-center gap-1">
                  <Zap className="w-3 h-3 text-neo-cyan" />
                  {stat.change}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"
          >
            {/* Teams Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="glass-card p-6 rounded-2xl group cursor-pointer relative overflow-hidden"
              onClick={() => navigate("/teams")}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-neo-blue/10 rounded-full blur-3xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neo-blue to-neo-cyan flex items-center justify-center">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Manage Teams</h3>
                    <p className="text-neo-muted text-sm">Create and organize your teams</p>
                  </div>
                </div>
                <p className="text-neo-muted mb-4">
                  Collaborate with your team members, assign roles, and track progress together.
                </p>
                <div className="flex items-center text-neo-blue font-semibold group-hover:gap-3 transition-all gap-2">
                  Go to Teams
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>

            {/* Analytics Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="glass-card p-6 rounded-2xl group cursor-pointer relative overflow-hidden"
              onClick={() => stats.totalTeams > 0 && navigate(`/teams/${recentTeams[0]?.id}/analytics`)}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-neo-orange/10 rounded-full blur-3xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neo-orange to-yellow-500 flex items-center justify-center">
                    <BarChart2 className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">View Analytics</h3>
                    <p className="text-neo-muted text-sm">Track team productivity</p>
                  </div>
                </div>
                <p className="text-neo-muted mb-4">
                  AI-powered insights to help you understand performance and optimize workflows.
                </p>
                {stats.totalTeams > 0 ? (
                  <div className="flex items-center text-neo-orange font-semibold group-hover:gap-3 transition-all gap-2">
                    View Analytics
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                ) : (
                  <div className="text-neo-muted text-sm">Create a team first to view analytics</div>
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* Recent Teams */}
          {recentTeams.length > 0 && (
            <motion.div variants={itemVariants}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Recent Teams</h2>
                  <p className="text-neo-muted">Quick access to your active workspaces</p>
                </div>
                <button
                  onClick={() => navigate("/teams")}
                  className="btn-neo-secondary text-sm py-2 px-4"
                >
                  View All
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recentTeams.map((team, i) => (
                  <motion.div
                    key={team.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    onClick={() => navigate(`/teams/${team.id}`)}
                    className="team-card-neo"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-neo-blue/20 to-neo-cyan/20 border border-neo-blue/30 flex items-center justify-center text-2xl">
                        {team.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="badge-neo badge-neo-blue">
                        <Target className="w-3 h-3 mr-1" />
                        Active
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2">{team.name}</h3>
                    {team.description && (
                      <p className="text-sm text-neo-muted mb-4 line-clamp-2">
                        {team.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-neo-muted">
                      <span className="flex items-center gap-1">
                        <ListTodo className="w-4 h-4" />
                        {team._count?.tasks || 0} tasks
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {team._count?.teamMembers || 0} members
                      </span>
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                      <span className="text-neo-blue font-medium text-sm">View Team</span>
                      <ArrowRight className="w-4 h-4 text-neo-blue" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Empty State */}
          {recentTeams.length === 0 && !isLoading && (
            <motion.div
              variants={itemVariants}
              className="glass-card p-12 rounded-3xl text-center"
            >
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-neo-blue/20 to-neo-cyan/20 border border-neo-blue/30 flex items-center justify-center"
              >
                <Users className="w-10 h-10 text-neo-cyan" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-3">No Teams Yet</h3>
              <p className="text-neo-muted mb-6 max-w-md mx-auto">
                Create your first team to start collaborating with your colleagues
                and managing tasks efficiently.
              </p>
              <button
                onClick={() => navigate("/teams")}
                className="btn-neo-primary inline-flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Create Your First Team
              </button>
            </motion.div>
          )}

          {/* AI Insights Teaser */}
          <motion.div
            variants={itemVariants}
            className="mt-10 glass-card p-6 rounded-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-neo-blue/10 rounded-full blur-3xl" />
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neo-blue to-neo-cyan flex items-center justify-center flex-shrink-0"
              >
                <img src="/neo-logo.png" alt="Neo AI" className="w-10 h-10" />
              </motion.div>
              <div className="flex-grow text-center md:text-left">
                <h3 className="text-xl font-bold text-white mb-2">Neo AI Insights</h3>
                <p className="text-neo-muted">
                  Your productivity is up 12% this week! Neo AI suggests focusing on
                  high-priority tasks in the morning for optimal performance.
                </p>
              </div>
              <button className="btn-neo-secondary whitespace-nowrap">
                View Report
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;
