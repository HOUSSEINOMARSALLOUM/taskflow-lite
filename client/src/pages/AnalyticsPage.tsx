import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import apiClient from "../services/api";
import {
  BarChart2,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertTriangle,
  Users,
  Target,
  ArrowLeft,
  Sparkles,
  Zap,
  Activity,
} from "lucide-react";

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

const COLORS = ["#3b9eff", "#10b981", "#ff8800", "#ff6b6b", "#8b5cf6", "#00d4ff"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 rounded-xl">
        <p className="text-white font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const AnalyticsPage: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loader-neo mx-auto mb-4" />
          <p className="text-neo-muted">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-12 rounded-3xl text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Error Loading Analytics</h2>
          <p className="text-neo-muted mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="btn-neo-secondary"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const { overview, tasksPerUser, overdueTasks } = data;

  const statusData = [
    { name: "To Do", value: overview?.todoTasks || 0, color: "#ff8800" },
    { name: "In Progress", value: overview?.inProgressTasks || 0, color: "#3b9eff" },
    { name: "Completed", value: overview?.completedTasks || 0, color: "#10b981" },
  ];

  const userTasksData = tasksPerUser?.map((u) => ({
    name: u.userName.split(" ")[0],
    completed: u.completedCount,
    remaining: u.taskCount - u.completedCount,
    total: u.taskCount,
  })) || [];

  // Productivity trend (simulated data for visual)
  const trendData = [
    { day: "Mon", tasks: 12, completed: 8 },
    { day: "Tue", tasks: 15, completed: 12 },
    { day: "Wed", tasks: 10, completed: 9 },
    { day: "Thu", tasks: 18, completed: 14 },
    { day: "Fri", tasks: 14, completed: 13 },
    { day: "Sat", tasks: 8, completed: 7 },
    { day: "Sun", tasks: 5, completed: 5 },
  ];

  return (
    <div className="min-h-screen relative py-8">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="orb orb-blue w-80 h-80 top-0 right-1/4 opacity-15" />
        <div className="orb orb-orange w-64 h-64 bottom-1/4 left-0 opacity-10" />
        <div className="grid-bg absolute inset-0 opacity-20" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
        >
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-neo-muted hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Team
            </button>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neo-blue to-neo-cyan flex items-center justify-center">
                <BarChart2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Team Analytics</h1>
                <p className="text-neo-muted">AI-powered insights and performance metrics</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="badge-neo badge-neo-blue">
              <Sparkles className="w-4 h-4 mr-2" />
              Real-time Data
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Overview Cards */}
          {overview && (
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                {
                  icon: Target,
                  label: "Total Tasks",
                  value: overview.totalTasks,
                  color: "neo-blue",
                  gradient: "from-neo-blue to-neo-cyan",
                },
                {
                  icon: Clock,
                  label: "In Progress",
                  value: overview.inProgressTasks,
                  color: "neo-orange",
                  gradient: "from-neo-orange to-yellow-500",
                },
                {
                  icon: CheckCircle,
                  label: "Completed",
                  value: overview.completedTasks,
                  color: "green-500",
                  gradient: "from-green-500 to-emerald-400",
                },
                {
                  icon: TrendingUp,
                  label: "Completion Rate",
                  value: `${overview.completionRate.toFixed(0)}%`,
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
                    <Activity className="w-4 h-4 text-neo-muted" />
                  </div>
                  <p className="text-sm text-neo-muted mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Task Status Distribution */}
            <motion.div variants={itemVariants} className="glass-card p-6 rounded-2xl">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-neo-blue/20 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-neo-cyan" />
                </div>
                Task Status Distribution
              </h2>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-4">
                {statusData.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-neo-muted">{item.name}: {item.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Weekly Trend */}
            <motion.div variants={itemVariants} className="glass-card p-6 rounded-2xl">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-neo-orange/20 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-neo-orange" />
                </div>
                Weekly Productivity Trend
              </h2>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b9eff" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b9eff" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="tasks" stroke="#3b9eff" fillOpacity={1} fill="url(#colorTasks)" name="Created" />
                  <Area type="monotone" dataKey="completed" stroke="#10b981" fillOpacity={1} fill="url(#colorCompleted)" name="Completed" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Tasks Per User */}
          {userTasksData.length > 0 && (
            <motion.div variants={itemVariants} className="glass-card p-6 rounded-2xl mb-8">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-neo-purple/20 flex items-center justify-center">
                  <Users className="w-4 h-4 text-neo-purple" />
                </div>
                Tasks Per Team Member
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={userTasksData} barGap={8}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="completed" stackId="a" fill="#10b981" name="Completed" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="remaining" stackId="a" fill="#3b9eff" name="Remaining" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* Overdue Tasks */}
          {overdueTasks && overdueTasks.length > 0 && (
            <motion.div variants={itemVariants} className="glass-card p-6 rounded-2xl">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                </div>
                Overdue Tasks
                <span className="ml-2 badge-neo badge-neo-red text-xs">{overdueTasks.length}</span>
              </h2>
              <div className="space-y-3">
                {overdueTasks.map((task, i) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-red-500/10 border border-red-500/30 group hover:bg-red-500/15 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{task.title}</h3>
                        <p className="text-sm text-neo-muted">
                          {task.assignedTo?.name || "Unassigned"} • {task.daysOverdue} days overdue
                        </p>
                      </div>
                    </div>
                    <span className="text-red-400 font-medium text-sm">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {overdueTasks && overdueTasks.length === 0 && (
            <motion.div variants={itemVariants} className="glass-card p-12 rounded-2xl text-center">
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-green-500/20 border border-green-500/30 flex items-center justify-center"
              >
                <CheckCircle className="w-8 h-8 text-green-400" />
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-2">No Overdue Tasks</h2>
              <p className="text-neo-muted">Great job! All tasks are on track. 🎉</p>
            </motion.div>
          )}

          {/* AI Insights */}
          <motion.div variants={itemVariants} className="mt-8 glass-card p-6 rounded-2xl relative overflow-hidden">
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
                  Based on your team's performance, completing high-priority tasks in the morning
                  could boost productivity by 15%. Consider redistributing workload for better balance.
                </p>
              </div>
              <button className="btn-neo-secondary whitespace-nowrap">
                Get Full Report
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
