import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, } from "recharts";
import apiClient from "../services/api";
const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];
const AnalyticsPage = () => {
    const { teamId } = useParams();
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (teamId) {
            loadAnalytics();
        }
    }, [teamId]);
    const loadAnalytics = async () => {
        try {
            setIsLoading(true);
            const [overview, tasksPerUser, overdueTasks] = await Promise.all([
                apiClient.getAnalyticsOverview(teamId),
                apiClient.getTasksPerUser(teamId),
                apiClient.getOverdueTasks(teamId),
            ]);
            setData({
                overview,
                tasksPerUser,
                overdueTasks,
            });
            setError(null);
        }
        catch (err) {
            setError(err.message || "Failed to load analytics");
        }
        finally {
            setIsLoading(false);
        }
    };
    if (isLoading) {
        return (_jsx("div", { className: "flex justify-center items-center min-h-screen", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" }), _jsx("p", { className: "mt-2 text-gray-600", children: "Loading analytics..." })] }) }));
    }
    if (error || !data) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Error loading analytics" }), _jsx("p", { className: "text-gray-600 mt-2", children: error })] }) }));
    }
    const { overview, tasksPerUser, overdueTasks } = data;
    const statusData = [
        { name: "Todo", value: overview?.todoTasks || 0 },
        { name: "In Progress", value: overview?.inProgressTasks || 0 },
        { name: "Completed", value: overview?.completedTasks || 0 },
    ];
    const userTasksData = tasksPerUser?.map((u) => ({
        name: u.userName.split(" ")[0],
        completed: u.completedCount,
        total: u.taskCount,
    })) || [];
    return (_jsx("div", { className: "min-h-screen bg-gray-50 py-8", children: _jsxs("div", { className: "max-w-6xl mx-auto px-4", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-8", children: "Team Analytics" }), overview && (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-8", children: [_jsxs("div", { className: "bg-white p-6 rounded-lg shadow", children: [_jsx("p", { className: "text-gray-600 text-sm font-medium", children: "Total Tasks" }), _jsx("p", { className: "text-3xl font-bold text-gray-900 mt-2", children: overview.totalTasks })] }), _jsxs("div", { className: "bg-white p-6 rounded-lg shadow", children: [_jsx("p", { className: "text-gray-600 text-sm font-medium", children: "In Progress" }), _jsx("p", { className: "text-3xl font-bold text-blue-600 mt-2", children: overview.inProgressTasks })] }), _jsxs("div", { className: "bg-white p-6 rounded-lg shadow", children: [_jsx("p", { className: "text-gray-600 text-sm font-medium", children: "Completed" }), _jsx("p", { className: "text-3xl font-bold text-green-600 mt-2", children: overview.completedTasks })] }), _jsxs("div", { className: "bg-white p-6 rounded-lg shadow", children: [_jsx("p", { className: "text-gray-600 text-sm font-medium", children: "Completion Rate" }), _jsxs("p", { className: "text-3xl font-bold text-green-600 mt-2", children: [overview.completionRate.toFixed(0), "%"] })] })] })), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8", children: [_jsxs("div", { className: "bg-white p-6 rounded-lg shadow", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-4", children: "Task Status Distribution" }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(PieChart, { children: [_jsx(Pie, { data: statusData, cx: "50%", cy: "50%", labelLine: false, label: ({ name, value }) => `${name}: ${value}`, outerRadius: 100, fill: "#8884d8", dataKey: "value", children: statusData.map((entry, index) => (_jsx(Cell, { fill: COLORS[index] }, `cell-${index}`))) }), _jsx(Tooltip, {})] }) })] }), userTasksData.length > 0 && (_jsxs("div", { className: "bg-white p-6 rounded-lg shadow", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-4", children: "Tasks Per Team Member" }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(BarChart, { data: userTasksData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "name" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Legend, {}), _jsx(Bar, { dataKey: "completed", stackId: "a", fill: "#10b981", name: "Completed" }), _jsx(Bar, { dataKey: "total", stackId: "a", fill: "#d1d5db", name: "Remaining" })] }) })] }))] }), overdueTasks && overdueTasks.length > 0 && (_jsxs("div", { className: "bg-white p-6 rounded-lg shadow", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-4", children: "Overdue Tasks" }), _jsx("div", { className: "space-y-3", children: overdueTasks.map((task) => (_jsxs("div", { className: "flex items-center justify-between p-4 bg-red-50 rounded border border-red-200", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-medium text-gray-900", children: task.title }), _jsxs("p", { className: "text-sm text-gray-600", children: [task.assignedTo?.name || "Unassigned", " \u2022", " ", task.daysOverdue, " days overdue"] })] }), _jsx("span", { className: "text-red-600 font-medium", children: new Date(task.dueDate).toLocaleDateString() })] }, task.id))) })] })), overdueTasks && overdueTasks.length === 0 && (_jsxs("div", { className: "bg-white p-6 rounded-lg shadow text-center", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-2", children: "No Overdue Tasks" }), _jsx("p", { className: "text-gray-600", children: "Great job! All tasks are on track." })] }))] }) }));
};
export default AnalyticsPage;
