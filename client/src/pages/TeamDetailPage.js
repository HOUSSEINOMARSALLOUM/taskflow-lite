import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../services/authContext";
import apiClient from "../services/api";
const TeamDetailPage = () => {
    const { teamId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [team, setTeam] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modal, setModal] = useState({
        isOpen: false,
        title: "",
        description: "",
        priority: "MEDIUM",
        dueDate: "",
        isLoading: false,
        error: null,
    });
    const [filterStatus, setFilterStatus] = useState("ALL");
    useEffect(() => {
        if (teamId) {
            loadTeamAndTasks();
        }
    }, [teamId]);
    const loadTeamAndTasks = async () => {
        try {
            setIsLoading(true);
            const [teamData, tasksData] = await Promise.all([
                apiClient.getTeam(teamId),
                apiClient.getTeamTasks(teamId),
            ]);
            setTeam(teamData);
            setTasks(tasksData.data || tasksData);
            setError(null);
        }
        catch (err) {
            setError(err.message || "Failed to load team");
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleCreateTask = async (e) => {
        e.preventDefault();
        if (!modal.title.trim()) {
            setModal({ ...modal, error: "Task title is required" });
            return;
        }
        try {
            setModal({ ...modal, isLoading: true, error: null });
            const newTask = await apiClient.createTask(teamId, {
                title: modal.title,
                description: modal.description,
                priority: modal.priority,
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
        }
        catch (err) {
            setModal({
                ...modal,
                isLoading: false,
                error: err.message || "Failed to create task",
            });
        }
    };
    const handleStatusChange = async (taskId, newStatus) => {
        try {
            const updated = await apiClient.updateTask(taskId, {
                status: newStatus,
            });
            setTasks(tasks.map((t) => (t.id === taskId ? updated : t)));
        }
        catch (err) {
            setError(err.message || "Failed to update task");
        }
    };
    const handleDeleteTask = async (taskId) => {
        if (!window.confirm("Are you sure you want to delete this task?"))
            return;
        try {
            await apiClient.deleteTask(taskId);
            setTasks(tasks.filter((t) => t.id !== taskId));
        }
        catch (err) {
            setError(err.message || "Failed to delete task");
        }
    };
    const filteredTasks = filterStatus === "ALL"
        ? tasks
        : tasks.filter((t) => t.status === filterStatus);
    const statusColors = {
        TODO: "bg-gray-100 text-gray-800",
        IN_PROGRESS: "bg-blue-100 text-blue-800",
        DONE: "bg-green-100 text-green-800",
    };
    const priorityColors = {
        LOW: "text-green-600",
        MEDIUM: "text-yellow-600",
        HIGH: "text-orange-600",
        URGENT: "text-red-600",
    };
    if (isLoading) {
        return (_jsx("div", { className: "flex justify-center items-center min-h-screen", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" }), _jsx("p", { className: "mt-2 text-gray-600", children: "Loading team..." })] }) }));
    }
    if (!team) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Team not found" }), _jsx("button", { onClick: () => navigate("/teams"), className: "mt-4 text-blue-600 hover:text-blue-700 font-medium", children: "Back to Teams" })] }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("div", { className: "bg-white border-b border-gray-200", children: _jsxs("div", { className: "max-w-6xl mx-auto px-4 py-6", children: [_jsx("button", { onClick: () => navigate("/teams"), className: "text-blue-600 hover:text-blue-700 text-sm font-medium mb-2", children: "\u2190 Back to Teams" }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: team.name }), team.description && (_jsx("p", { className: "mt-1 text-gray-600", children: team.description }))] }), _jsx("button", { onClick: () => setModal({ ...modal, isOpen: true }), className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700", children: "+ New Task" })] })] }) }), _jsxs("div", { className: "max-w-6xl mx-auto px-4 py-8", children: [error && (_jsx("div", { className: "mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700", children: error })), _jsx("div", { className: "mb-6 flex gap-2", children: ["ALL", "TODO", "IN_PROGRESS", "DONE"].map((status) => (_jsx("button", { onClick: () => setFilterStatus(status), className: `px-3 py-1 rounded-full text-sm font-medium transition-colors ${filterStatus === status
                                ? "bg-blue-600 text-white"
                                : "bg-white text-gray-700 border border-gray-300 hover:border-gray-400"}`, children: status === "IN_PROGRESS"
                                ? "In Progress"
                                : status.charAt(0) + status.slice(1).toLowerCase() }, status))) }), filteredTasks.length === 0 ? (_jsxs("div", { className: "text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "No tasks" }), _jsx("p", { className: "text-gray-600", children: "Create a task to get started" })] })) : (_jsx("div", { className: "grid gap-4", children: filteredTasks.map((task) => (_jsx("div", { className: "bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow", children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: task.title }), task.description && (_jsx("p", { className: "mt-2 text-gray-600", children: task.description })), _jsxs("div", { className: "mt-4 flex gap-3 items-center", children: [_jsx("span", { className: `px-2 py-1 rounded text-xs font-medium ${statusColors[task.status]}`, children: task.status === "IN_PROGRESS"
                                                            ? "In Progress"
                                                            : task.status }), _jsx("span", { className: `text-xs font-medium ${priorityColors[task.priority]}`, children: task.priority }), task.dueDate && (_jsxs("span", { className: "text-xs text-gray-600", children: ["Due: ", new Date(task.dueDate).toLocaleDateString()] })), task.assignedTo && (_jsxs("span", { className: "text-xs text-gray-600", children: ["\u2192 ", task.assignedTo.name] }))] })] }), _jsxs("div", { className: "flex gap-2 ml-4", children: [_jsx("button", { onClick: () => navigate(`/teams/${teamId}/tasks/${task.id}`), className: "text-blue-600 hover:text-blue-700 font-medium text-sm", children: "Details" }), _jsx("button", { onClick: () => handleDeleteTask(task.id), className: "text-red-600 hover:text-red-700 font-medium text-sm", children: "Delete" })] })] }) }, task.id))) }))] }), modal.isOpen && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50", children: _jsxs("div", { className: "bg-white rounded-lg shadow-xl max-w-md w-full", children: [_jsx("div", { className: "px-6 py-4 border-b border-gray-200", children: _jsx("h2", { className: "text-xl font-semibold text-gray-900", children: "Create New Task" }) }), _jsxs("form", { onSubmit: handleCreateTask, className: "p-6", children: [modal.error && (_jsx("div", { className: "mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm", children: modal.error })), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Title *" }), _jsx("input", { type: "text", value: modal.title, onChange: (e) => setModal({ ...modal, title: e.target.value }), placeholder: "Task title", className: "w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Description" }), _jsx("textarea", { value: modal.description, onChange: (e) => setModal({ ...modal, description: e.target.value }), placeholder: "Task description", rows: 3, className: "w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Priority" }), _jsxs("select", { value: modal.priority, onChange: (e) => setModal({ ...modal, priority: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "LOW", children: "Low" }), _jsx("option", { value: "MEDIUM", children: "Medium" }), _jsx("option", { value: "HIGH", children: "High" }), _jsx("option", { value: "URGENT", children: "Urgent" })] })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Due Date" }), _jsx("input", { type: "date", value: modal.dueDate, onChange: (e) => setModal({ ...modal, dueDate: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { type: "button", onClick: () => setModal({
                                                isOpen: false,
                                                title: "",
                                                description: "",
                                                priority: "MEDIUM",
                                                dueDate: "",
                                                isLoading: false,
                                                error: null,
                                            }), className: "flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md font-medium", children: "Cancel" }), _jsx("button", { type: "submit", disabled: modal.isLoading, className: "flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-md font-medium", children: modal.isLoading ? "Creating..." : "Create" })] })] })] }) }))] }));
};
export default TeamDetailPage;
