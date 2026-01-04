import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../services/authContext";
import apiClient from "../services/api";
const HomePage = () => {
    const navigate = useNavigate();
    const { user, isLoading, isAuthenticated } = useAuth();
    const [stats, setStats] = useState({
        totalTeams: 0,
        totalTasks: 0,
        completedTasks: 0,
    });
    const [recentTeams, setRecentTeams] = useState([]);
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
        }
        catch (error) {
            console.error("Failed to load dashboard stats:", error);
        }
    };
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" }), _jsx("p", { className: "mt-2 text-gray-600", children: "Loading..." })] }) }));
    }
    // Unauthenticated Landing Page
    if (!isAuthenticated) {
        return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100", children: [_jsx("header", { className: "bg-white shadow", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 py-6", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "TaskFlow Lite" }), _jsx("p", { className: "text-gray-600", children: "Role-Based Team Task & Progress Management" })] }) }), _jsx("main", { className: "max-w-7xl mx-auto px-4 py-12", children: _jsxs("div", { className: "grid md:grid-cols-2 gap-8", children: [_jsxs("div", { className: "bg-white rounded-lg shadow-md p-8", children: [_jsx("h2", { className: "text-2xl font-semibold mb-4", children: "Welcome!" }), _jsx("p", { className: "text-gray-700 mb-6", children: "TaskFlow Lite is a lightweight, role-based task management platform for small teams, student groups, NGOs, and startups." }), _jsxs("ul", { className: "space-y-3 text-gray-700 mb-8", children: [_jsx("li", { children: "\u2713 Simple team and task management" }), _jsx("li", { children: "\u2713 Real-time status tracking" }), _jsx("li", { children: "\u2713 Activity logs and history" }), _jsx("li", { children: "\u2713 Analytics and insights" })] }), _jsx("a", { href: "/login", className: "inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded", children: "Sign In" }), _jsx("span", { className: "mx-2", children: "or" }), _jsx("a", { href: "/register", className: "inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded", children: "Sign Up" })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-md p-8", children: [_jsx("h3", { className: "text-xl font-semibold mb-4", children: "Key Features" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-gray-900", children: "Authentication" }), _jsx("p", { className: "text-sm text-gray-600", children: "Secure JWT-based authentication with role-based access" })] }), _jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-gray-900", children: "Team Management" }), _jsx("p", { className: "text-sm text-gray-600", children: "Create teams, add members, and manage permissions" })] }), _jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-gray-900", children: "Task Tracking" }), _jsx("p", { className: "text-sm text-gray-600", children: "Assign, prioritize, and track tasks with due dates" })] }), _jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-gray-900", children: "Analytics" }), _jsx("p", { className: "text-sm text-gray-600", children: "Visualize progress with charts and completion rates" })] })] })] })] }) })] }));
    }
    // Authenticated Dashboard
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("div", { className: "bg-white border-b border-gray-200", children: _jsxs("div", { className: "max-w-6xl mx-auto px-4 py-12", children: [_jsxs("h1", { className: "text-4xl font-bold text-gray-900 mb-2", children: ["Welcome back, ", user?.name, "!"] }), _jsx("p", { className: "text-gray-600", children: "Here's your task overview" })] }) }), _jsxs("div", { className: "max-w-6xl mx-auto px-4 py-8", children: [_jsxs("div", { className: "grid grid-cols-1 gap-6 sm:grid-cols-3 mb-8", children: [_jsxs("div", { className: "bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow", children: [_jsx("p", { className: "text-gray-600 text-sm font-medium", children: "Teams" }), _jsx("p", { className: "text-3xl font-bold text-gray-900 mt-2", children: stats.totalTeams }), _jsx("p", { className: "text-xs text-gray-500 mt-2", children: "Active teams" })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow", children: [_jsx("p", { className: "text-gray-600 text-sm font-medium", children: "Tasks" }), _jsx("p", { className: "text-3xl font-bold text-gray-900 mt-2", children: stats.totalTasks }), _jsx("p", { className: "text-xs text-gray-500 mt-2", children: "Total tasks" })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow", children: [_jsx("p", { className: "text-gray-600 text-sm font-medium", children: "Completed" }), _jsx("p", { className: "text-3xl font-bold text-green-600 mt-2", children: stats.completedTasks }), _jsx("p", { className: "text-xs text-gray-500 mt-2", children: "Tasks done" })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-8", children: [_jsxs("div", { className: "bg-blue-50 rounded-lg p-6 border border-blue-200", children: [_jsx("h3", { className: "text-lg font-semibold text-blue-900 mb-2", children: "\uD83D\uDC65 Manage Teams" }), _jsx("p", { className: "text-blue-700 text-sm mb-4", children: "Create and organize your teams" }), _jsx("button", { onClick: () => navigate("/teams"), className: "inline-block px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700", children: "Go to Teams" })] }), _jsxs("div", { className: "bg-green-50 rounded-lg p-6 border border-green-200", children: [_jsx("h3", { className: "text-lg font-semibold text-green-900 mb-2", children: "\uD83D\uDCCA View Analytics" }), _jsx("p", { className: "text-green-700 text-sm mb-4", children: "Track team productivity" }), stats.totalTeams > 0 ? (_jsx("button", { onClick: () => navigate(`/teams/${recentTeams[0]?.id}/analytics`), className: "inline-block px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700", children: "View Analytics" })) : (_jsx("button", { disabled: true, className: "inline-block px-4 py-2 bg-gray-400 text-white text-sm font-medium rounded-md cursor-not-allowed", children: "Create a team first" }))] })] }), recentTeams.length > 0 && (_jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-4", children: "Recent Teams" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: recentTeams.map((team) => (_jsxs("div", { onClick: () => navigate(`/teams/${team.id}`), className: "p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all cursor-pointer", children: [_jsx("h3", { className: "font-semibold text-gray-900", children: team.name }), _jsxs("p", { className: "text-sm text-gray-600 mt-2", children: [team._count?.tasks || 0, " tasks"] }), _jsx("button", { className: "text-blue-600 hover:text-blue-700 text-sm font-medium mt-2", children: "View Team \u2192" })] }, team.id))) })] }))] })] }));
};
export default HomePage;
