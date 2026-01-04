import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../services/api";
const ActivityLogPage = () => {
    const { teamId, taskId } = useParams();
    const navigate = useNavigate();
    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterUser, setFilterUser] = useState(null);
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
            }
            else {
                activityData = await apiClient.getTeamActivities(teamId);
            }
            setActivities(activityData);
            setError(null);
        }
        catch (err) {
            setError(err.message || "Failed to load activity log");
        }
        finally {
            setIsLoading(false);
        }
    };
    const filteredActivities = filterUser
        ? activities.filter((a) => a.userId === filterUser)
        : activities;
    const uniqueUsers = Array.from(new Map(activities.filter((a) => a.user).map((a) => [a.userId, a.user])).values());
    const getActionIcon = (action) => {
        const icons = {
            CREATE: "➕",
            UPDATE: "✏️",
            DELETE: "🗑️",
            STATUS_CHANGE: "🔄",
            ASSIGN: "👤",
            COMMENT: "💬",
        };
        return icons[action] || "📝";
    };
    const getActionColor = (action) => {
        const colors = {
            CREATE: "text-green-600",
            UPDATE: "text-blue-600",
            DELETE: "text-red-600",
            STATUS_CHANGE: "text-purple-600",
            ASSIGN: "text-yellow-600",
            COMMENT: "text-indigo-600",
        };
        return colors[action] || "text-gray-600";
    };
    const formatDetails = (details) => {
        if (!details)
            return null;
        if (details.oldStatus && details.newStatus) {
            return `${details.oldStatus} → ${details.newStatus}`;
        }
        if (details.changes) {
            return Object.entries(details.changes)
                .map(([key, value]) => `${key}: ${value}`)
                .join(", ");
        }
        return JSON.stringify(details).substring(0, 100);
    };
    if (isLoading) {
        return (_jsx("div", { className: "flex justify-center items-center min-h-screen", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" }), _jsx("p", { className: "mt-2 text-gray-600", children: "Loading activity log..." })] }) }));
    }
    return (_jsx("div", { className: "min-h-screen bg-gray-50 py-8", children: _jsxs("div", { className: "max-w-4xl mx-auto px-4", children: [_jsxs("div", { className: "mb-8", children: [_jsx("button", { onClick: () => navigate(-1), className: "text-blue-600 hover:text-blue-700 text-sm font-medium mb-4", children: "\u2190 Back" }), _jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Activity Log" }), taskId && (_jsx("p", { className: "text-gray-600 mt-2", children: "Showing changes for task" }))] }), error && (_jsx("div", { className: "mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700", children: error })), uniqueUsers.length > 0 && !taskId && (_jsx("div", { className: "mb-6", children: _jsxs("div", { className: "flex flex-wrap gap-2", children: [_jsx("button", { onClick: () => setFilterUser(null), className: `px-3 py-1 rounded-full text-sm font-medium transition-colors ${filterUser === null
                                    ? "bg-blue-600 text-white"
                                    : "bg-white text-gray-700 border border-gray-300 hover:border-gray-400"}`, children: "All Users" }), uniqueUsers.map((user) => (_jsx("button", { onClick: () => setFilterUser(user.id), className: `px-3 py-1 rounded-full text-sm font-medium transition-colors ${filterUser === user.id
                                    ? "bg-blue-600 text-white"
                                    : "bg-white text-gray-700 border border-gray-300 hover:border-gray-400"}`, children: user.name }, user.id)))] }) })), filteredActivities.length === 0 ? (_jsxs("div", { className: "text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "No activities" }), _jsx("p", { className: "text-gray-600", children: "Activity will appear here as team members make changes" })] })) : (_jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute left-8 top-0 bottom-0 w-1 bg-gray-200" }), _jsx("div", { className: "space-y-6", children: filteredActivities.map((activity) => (_jsxs("div", { className: "relative flex gap-4", children: [_jsx("div", { className: "absolute left-4 top-2 w-9 h-9 bg-white border-4 border-blue-600 rounded-full flex items-center justify-center text-lg", children: getActionIcon(activity.action) }), _jsx("div", { className: "ml-16 bg-white p-6 rounded-lg shadow", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx("span", { className: `text-lg font-semibold ${getActionColor(activity.action)}`, children: activity.action.replace(/_/g, " ") }), activity.task && (_jsxs("span", { className: "text-sm text-gray-600", children: ["\u00B7", " ", _jsx("span", { className: "font-medium", children: activity.task.title })] }))] }), activity.user && (_jsxs("p", { className: "text-sm text-gray-600 mb-2", children: ["by", " ", _jsx("span", { className: "font-medium", children: activity.user.name })] })), activity.details && (_jsx("div", { className: "mt-2 p-3 bg-gray-50 rounded text-sm text-gray-700 font-mono", children: formatDetails(activity.details) }))] }), _jsx("div", { className: "text-right ml-4", children: _jsx("p", { className: "text-sm text-gray-600 whitespace-nowrap", children: new Date(activity.createdAt).toLocaleString() }) })] }) })] }, activity.id))) })] }))] }) }));
};
export default ActivityLogPage;
