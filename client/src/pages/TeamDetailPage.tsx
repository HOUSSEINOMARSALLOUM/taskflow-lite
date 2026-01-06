import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../services/authContext";
import apiClient from "../services/api";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Calendar,
  User,
  Clock,
  CheckCircle,
  Circle,
  Loader2,
  AlertCircle,
  BarChart2,
  Activity,
  Filter,
  ListTodo,
  X,
  Sparkles,
  AlertTriangle,
  Flag,
  MoreVertical,
  Target,
  Users,
  Zap,
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  dueDate?: string;
  assignedToId?: string;
  assignedTo?: { name: string; email: string };
}

interface Team {
  id: string;
  name: string;
  description?: string;
  teamMembers?: any[];
}

interface CreateTaskModal {
  isOpen: boolean;
  title: string;
  description: string;
  priority: string;
  dueDate: string;
  isLoading: boolean;
  error: string | null;
}

const TeamDetailPage: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [team, setTeam] = useState<Team | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<CreateTaskModal>({
    isOpen: false,
    title: "",
    description: "",
    priority: "MEDIUM",
    dueDate: "",
    isLoading: false,
    error: null,
  });
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  useEffect(() => {
    if (teamId) {
      loadTeamAndTasks();
    }
  }, [teamId]);

  const loadTeamAndTasks = async () => {
    try {
      setIsLoading(true);
      const [teamData, tasksData] = await Promise.all([
        apiClient.getTeam(teamId!),
        apiClient.getTeamTasks(teamId!),
      ]);
      setTeam(teamData);
      setTasks(tasksData.data || tasksData);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load team");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!modal.title.trim()) {
      setModal({ ...modal, error: "Task title is required" });
      return;
    }

    try {
      setModal({ ...modal, isLoading: true, error: null });
      const newTask = await apiClient.createTask(teamId!, {
        title: modal.title,
        description: modal.description,
        priority: modal.priority as "LOW" | "MEDIUM" | "HIGH" | "URGENT",
        dueDate: modal.dueDate || undefined,
      });
      setTasks([newTask, ...tasks]);
      setModal({
        isOpen: false,
        title: "",
        description: "",
        priority: "MEDIUM",
        dueDate: "",
        isLoading: false,
        error: null,
      });
    } catch (err: any) {
      setModal({
        ...modal,
        isLoading: false,
        error: err.message || "Failed to create task",
      });
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      const updated = await apiClient.updateTask(taskId, {
        status: newStatus as any,
      });
      setTasks(tasks.map((t) => (t.id === taskId ? updated : t)));
    } catch (err: any) {
      setError(err.message || "Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await apiClient.deleteTask(taskId);
      setTasks(tasks.filter((t) => t.id !== taskId));
    } catch (err: any) {
      setError(err.message || "Failed to delete task");
    }
  };

  const filteredTasks =
    filterStatus === "ALL"
      ? tasks
      : tasks.filter((t) => t.status === filterStatus);

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { bg: string; text: string; icon: React.ReactNode; label: string }> = {
      TODO: {
        bg: "bg-neo-orange/20",
        text: "text-neo-orange",
        icon: <Circle className="w-4 h-4" />,
        label: "To Do"
      },
      IN_PROGRESS: {
        bg: "bg-neo-blue/20",
        text: "text-neo-blue",
        icon: <Clock className="w-4 h-4" />,
        label: "In Progress"
      },
      DONE: {
        bg: "bg-green-500/20",
        text: "text-green-400",
        icon: <CheckCircle className="w-4 h-4" />,
        label: "Done"
      },
    };
    return configs[status] || configs.TODO;
  };

  const getPriorityConfig = (priority: string) => {
    const configs: Record<string, { bg: string; text: string; label: string }> = {
      LOW: { bg: "bg-green-500/20", text: "text-green-400", label: "Low" },
      MEDIUM: { bg: "bg-neo-orange/20", text: "text-neo-orange", label: "Medium" },
      HIGH: { bg: "bg-red-500/20", text: "text-red-400", label: "High" },
      URGENT: { bg: "bg-red-600/30", text: "text-red-500", label: "Urgent" },
    };
    return configs[priority] || configs.MEDIUM;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loader-neo mx-auto mb-4" />
          <p className="text-neo-muted">Loading team...</p>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-12 rounded-3xl text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Team Not Found</h2>
          <p className="text-neo-muted mb-6">The team you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate("/teams")}
            className="btn-neo-primary"
          >
            Back to Teams
          </button>
        </div>
      </div>
    );
  }

  // Stats calculation
  const taskStats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === "TODO").length,
    inProgress: tasks.filter(t => t.status === "IN_PROGRESS").length,
    done: tasks.filter(t => t.status === "DONE").length,
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="orb orb-blue w-80 h-80 -top-20 right-0 opacity-15" />
        <div className="orb orb-orange w-64 h-64 bottom-1/4 -left-20 opacity-10" />
        <div className="grid-bg absolute inset-0 opacity-20" />
      </div>

      {/* Header */}
      <div className="relative z-10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate("/teams")}
            className="flex items-center gap-2 text-neo-muted hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Teams
          </button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neo-blue/20 to-neo-cyan/20 border border-neo-blue/30 flex items-center justify-center">
                <span className="text-3xl font-bold text-gradient-neo">
                  {team.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{team.name}</h1>
                {team.description && (
                  <p className="text-neo-muted mt-1">{team.description}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/teams/${teamId}/analytics`)}
                className="btn-neo-secondary flex items-center gap-2"
              >
                <BarChart2 className="w-5 h-5" />
                Analytics
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/teams/${teamId}/activity`)}
                className="btn-neo-secondary flex items-center gap-2"
              >
                <Activity className="w-5 h-5" />
                Activity
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setModal({ ...modal, isOpen: true })}
                className="btn-neo-primary flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                New Task
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
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

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: "Total Tasks", value: taskStats.total, icon: ListTodo, gradient: "from-neo-blue to-neo-cyan" },
            { label: "To Do", value: taskStats.todo, icon: Circle, gradient: "from-neo-orange to-yellow-500" },
            { label: "In Progress", value: taskStats.inProgress, icon: Clock, gradient: "from-neo-purple to-pink-500" },
            { label: "Completed", value: taskStats.done, icon: CheckCircle, gradient: "from-green-500 to-emerald-400" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -3 }}
              className="glass-card p-4 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-neo-muted">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Filter */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2 text-neo-muted">
            <Filter className="w-5 h-5" />
            <span className="text-sm">Filter:</span>
          </div>
          <div className="flex gap-2">
            {[
              { key: "ALL", label: "All" },
              { key: "TODO", label: "To Do" },
              { key: "IN_PROGRESS", label: "In Progress" },
              { key: "DONE", label: "Done" },
            ].map((filter) => (
              <motion.button
                key={filter.key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterStatus(filter.key)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filterStatus === filter.key
                    ? "btn-neo-primary"
                    : "glass-button"
                  }`}
              >
                {filter.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Tasks List */}
        {filteredTasks.length === 0 ? (
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
              <ListTodo className="w-8 h-8 text-neo-cyan" />
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-3">No Tasks Yet</h3>
            <p className="text-neo-muted mb-6 max-w-md mx-auto">
              {filterStatus === "ALL"
                ? "Create your first task to start tracking your team's progress."
                : `No tasks with "${filterStatus.replace("_", " ").toLowerCase()}" status.`
              }
            </p>
            {filterStatus === "ALL" && (
              <button
                onClick={() => setModal({ ...modal, isOpen: true })}
                className="btn-neo-primary inline-flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Create First Task
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {filteredTasks.map((task) => {
              const statusConfig = getStatusConfig(task.status);
              const priorityConfig = getPriorityConfig(task.priority);
              const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "DONE";

              return (
                <motion.div
                  key={task.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.01, x: 4 }}
                  className={`glass-card p-5 rounded-2xl group ${isOverdue ? 'border-red-500/30' : ''}`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        {/* Status Quick Toggle */}
                        <div className="flex flex-col gap-1 mt-1">
                          {["TODO", "IN_PROGRESS", "DONE"].map((status) => {
                            const config = getStatusConfig(status);
                            const isActive = task.status === status;
                            return (
                              <motion.button
                                key={status}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleStatusChange(task.id, status)}
                                className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${isActive
                                    ? `${config.bg} ${config.text}`
                                    : 'bg-white/5 text-white/30 hover:bg-white/10'
                                  }`}
                              >
                                {config.icon}
                              </motion.button>
                            );
                          })}
                        </div>

                        <div className="flex-1">
                          <h3 className={`text-lg font-semibold ${task.status === "DONE" ? 'text-neo-muted line-through' : 'text-white'}`}>
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className="text-neo-muted text-sm mt-1 line-clamp-2">
                              {task.description}
                            </p>
                          )}

                          <div className="flex flex-wrap items-center gap-3 mt-3">
                            {/* Status Badge */}
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                              {statusConfig.icon}
                              {statusConfig.label}
                            </span>

                            {/* Priority Badge */}
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${priorityConfig.bg} ${priorityConfig.text}`}>
                              <Flag className="w-3 h-3" />
                              {priorityConfig.label}
                            </span>

                            {/* Due Date */}
                            {task.dueDate && (
                              <span className={`inline-flex items-center gap-1.5 text-xs ${isOverdue ? 'text-red-400' : 'text-neo-muted'}`}>
                                <Calendar className="w-3 h-3" />
                                {new Date(task.dueDate).toLocaleDateString()}
                                {isOverdue && <AlertTriangle className="w-3 h-3" />}
                              </span>
                            )}

                            {/* Assigned To */}
                            {task.assignedTo && (
                              <span className="inline-flex items-center gap-1.5 text-xs text-neo-muted">
                                <User className="w-3 h-3" />
                                {task.assignedTo.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate(`/teams/${teamId}/tasks/${task.id}/activity`)}
                        className="p-2 rounded-lg hover:bg-white/5 text-neo-muted hover:text-neo-blue transition-colors"
                        title="View Activity"
                      >
                        <Activity className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-neo-muted hover:text-red-400 transition-colors"
                        title="Delete Task"
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* Create Task Modal */}
      <AnimatePresence>
        {modal.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 modal-neo flex items-center justify-center p-4 z-50"
            onClick={() => setModal({ ...modal, isOpen: false })}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="modal-content-neo max-w-md w-full p-0 overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neo-blue to-neo-cyan flex items-center justify-center">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Create New Task</h2>
                    <p className="text-sm text-neo-muted">Add a task to {team.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setModal({ ...modal, isOpen: false })}
                  className="p-2 rounded-lg hover:bg-white/5 text-neo-muted hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleCreateTask} className="p-6 space-y-5">
                {modal.error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <span className="text-red-400 text-sm">{modal.error}</span>
                  </motion.div>
                )}

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white/80">
                    Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={modal.title}
                    onChange={(e) => setModal({ ...modal, title: e.target.value })}
                    placeholder="What needs to be done?"
                    className="input-neo"
                    autoFocus
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white/80">
                    Description
                  </label>
                  <textarea
                    value={modal.description}
                    onChange={(e) => setModal({ ...modal, description: e.target.value })}
                    placeholder="Add more details..."
                    rows={3}
                    className="input-neo resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white/80">
                      Priority
                    </label>
                    <select
                      value={modal.priority}
                      onChange={(e) => setModal({ ...modal, priority: e.target.value })}
                      className="input-neo"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white/80">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={modal.dueDate}
                      onChange={(e) => setModal({ ...modal, dueDate: e.target.value })}
                      className="input-neo"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setModal({ ...modal, isOpen: false })}
                    className="flex-1 btn-neo-secondary py-3"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={modal.isLoading}
                    className="flex-1 btn-neo-primary py-3 flex items-center justify-center gap-2"
                  >
                    {modal.isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        Create Task
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeamDetailPage;
