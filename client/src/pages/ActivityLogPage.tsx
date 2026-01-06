import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "../services/api";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  User,
  MessageSquare,
  Clock,
  Filter,
  Activity,
  FileText,
  AlertCircle,
  CheckCircle,
  Sparkles,
} from "lucide-react";

interface Activity {
  id: string;
  action: string;
  details?: Record<string, any>;
  createdAt: string;
  userId?: string;
  user?: { name: string; email: string };
  taskId?: string;
  task?: { title: string };
}

const ActivityLogPage: React.FC = () => {
  const { teamId, taskId } = useParams<{ teamId: string; taskId?: string }>();
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterUser, setFilterUser] = useState<string | null>(null);

  useEffect(() => {
    if (teamId) {
      loadActivities();
    }
  }, [teamId, taskId]);

  const loadActivities = async () => {
    try {
      setIsLoading(true);
      let activityData;

      if (taskId) {
        activityData = await apiClient.getTaskActivities(taskId);
      } else {
        activityData = await apiClient.getTeamActivities(teamId!);
      }

      setActivities(activityData);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load activity log");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredActivities = filterUser
    ? activities.filter((a) => a.userId === filterUser)
    : activities;

  const uniqueUsers = Array.from(
    new Map(
      activities.filter((a) => a.user).map((a) => [a.userId, { id: a.userId, ...a.user }])
    ).values()
  );

  const getActionIcon = (action: string) => {
    const icons: Record<string, React.ReactNode> = {
      CREATE: <Plus className="w-4 h-4" />,
      UPDATE: <Edit className="w-4 h-4" />,
      DELETE: <Trash2 className="w-4 h-4" />,
      STATUS_CHANGE: <RefreshCw className="w-4 h-4" />,
      ASSIGN: <User className="w-4 h-4" />,
      COMMENT: <MessageSquare className="w-4 h-4" />,
    };
    return icons[action] || <FileText className="w-4 h-4" />;
  };

  const getActionColor = (action: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      CREATE: { bg: "bg-green-500/20", text: "text-green-400", border: "border-green-500/30" },
      UPDATE: { bg: "bg-neo-blue/20", text: "text-neo-blue", border: "border-neo-blue/30" },
      DELETE: { bg: "bg-red-500/20", text: "text-red-400", border: "border-red-500/30" },
      STATUS_CHANGE: { bg: "bg-neo-purple/20", text: "text-neo-purple", border: "border-neo-purple/30" },
      ASSIGN: { bg: "bg-neo-orange/20", text: "text-neo-orange", border: "border-neo-orange/30" },
      COMMENT: { bg: "bg-neo-cyan/20", text: "text-neo-cyan", border: "border-neo-cyan/30" },
    };
    return colors[action] || { bg: "bg-white/10", text: "text-white", border: "border-white/20" };
  };

  const formatDetails = (details: Record<string, any> | undefined) => {
    if (!details) return null;

    if (details.oldStatus && details.newStatus) {
      return (
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 rounded bg-white/10 text-sm">{details.oldStatus}</span>
          <span className="text-neo-muted">→</span>
          <span className="px-2 py-1 rounded bg-neo-blue/20 text-neo-blue text-sm">{details.newStatus}</span>
        </div>
      );
    }

    if (details.changes) {
      return (
        <div className="flex flex-wrap gap-2">
          {Object.entries(details.changes).map(([key, value]: [string, any], i) => (
            <span key={i} className="px-2 py-1 rounded bg-white/5 text-xs text-neo-muted">
              {key}: {String(value)}
            </span>
          ))}
        </div>
      );
    }

    return <span className="text-sm text-neo-muted">{JSON.stringify(details).substring(0, 100)}</span>;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loader-neo mx-auto mb-4" />
          <p className="text-neo-muted">Loading activity log...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative py-8">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="orb orb-cyan w-80 h-80 -top-20 right-0 opacity-15" />
        <div className="orb orb-blue w-64 h-64 bottom-1/3 -left-20 opacity-10" />
        <div className="grid-bg absolute inset-0 opacity-20" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-neo-muted hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neo-cyan to-neo-blue flex items-center justify-center">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Activity Log</h1>
              <p className="text-neo-muted">
                {taskId ? "Task change history" : "Team activity timeline"}
              </p>
            </div>
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 glass-card rounded-xl flex items-center gap-3 border border-red-500/30"
          >
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-400">{error}</span>
          </motion.div>
        )}

        {/* User Filter */}
        {uniqueUsers.length > 0 && !taskId && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <Filter className="w-5 h-5 text-neo-muted" />
              <span className="text-sm text-neo-muted">Filter by team member:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterUser(null)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filterUser === null
                    ? "btn-neo-primary"
                    : "glass-button"
                  }`}
              >
                All Users
              </motion.button>
              {uniqueUsers.map((user: any) => (
                <motion.button
                  key={user.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilterUser(user.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filterUser === user.id
                      ? "btn-neo-primary"
                      : "glass-button"
                    }`}
                >
                  {user.name}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Activity Timeline */}
        {filteredActivities.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-12 rounded-3xl text-center"
          >
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-neo-blue/20 border border-neo-blue/30 flex items-center justify-center"
            >
              <Activity className="w-8 h-8 text-neo-cyan" />
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-3">No Activities Yet</h3>
            <p className="text-neo-muted max-w-md mx-auto">
              Activity will appear here as team members make changes to tasks and the team.
            </p>
          </motion.div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-gradient-to-b from-neo-blue via-neo-cyan to-neo-blue/20" />

            {/* Timeline items */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {filteredActivities.map((activity, index) => {
                const colors = getActionColor(activity.action);

                return (
                  <motion.div
                    key={activity.id}
                    variants={itemVariants}
                    className="relative flex gap-6"
                  >
                    {/* Timeline dot */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className={`relative z-10 w-14 h-14 rounded-2xl ${colors.bg} border ${colors.border} flex items-center justify-center ${colors.text} flex-shrink-0`}
                    >
                      {getActionIcon(activity.action)}
                    </motion.div>

                    {/* Content */}
                    <motion.div
                      whileHover={{ scale: 1.01, x: 4 }}
                      className="flex-1 glass-card p-5 rounded-2xl group"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <span className={`text-lg font-semibold ${colors.text}`}>
                              {activity.action.replace(/_/g, " ")}
                            </span>
                            {activity.task && (
                              <span className="text-sm text-neo-muted">
                                on{" "}
                                <span className="text-white font-medium">
                                  {activity.task.title}
                                </span>
                              </span>
                            )}
                          </div>

                          {activity.user && (
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-neo-blue to-neo-cyan flex items-center justify-center text-xs text-white font-bold">
                                {activity.user.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-sm text-neo-muted">
                                by{" "}
                                <span className="text-white">{activity.user.name}</span>
                              </span>
                            </div>
                          )}

                          {activity.details && (
                            <div className="mt-3 p-3 rounded-xl bg-white/5 border border-white/10">
                              {formatDetails(activity.details)}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-sm text-neo-muted whitespace-nowrap">
                          <Clock className="w-4 h-4" />
                          {new Date(activity.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        )}

        {/* AI Summary */}
        {filteredActivities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-10 glass-card p-6 rounded-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-neo-cyan/10 rounded-full blur-3xl" />
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neo-cyan to-neo-blue flex items-center justify-center flex-shrink-0"
              >
                <Sparkles className="w-7 h-7 text-white" />
              </motion.div>
              <div className="flex-grow text-center md:text-left">
                <h3 className="text-lg font-bold text-white mb-1">Activity Summary</h3>
                <p className="text-neo-muted text-sm">
                  {filteredActivities.length} activities recorded •
                  {uniqueUsers.length} team members active •
                  Most recent: {new Date(filteredActivities[0]?.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-sm text-green-400">All synced</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ActivityLogPage;
