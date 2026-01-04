import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation, } from "react-router-dom";
import { AuthProvider, useAuth } from "./services/authContext";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TeamsPage from "./pages/TeamsPage";
import TeamDetailPage from "./pages/TeamDetailPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ActivityLogPage from "./pages/ActivityLogPage";
const ProtectedRoute = ({ children, }) => {
    const { isAuthenticated, isLoading } = useAuth();
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" }), _jsx("p", { className: "mt-2 text-gray-600", children: "Loading..." })] }) }));
    }
    return isAuthenticated ? _jsx(_Fragment, { children: children }) : _jsx(Navigate, { to: "/login", replace: true });
};
const Navigation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout, isAuthenticated } = useAuth();
    if (!isAuthenticated)
        return null;
    const isActive = (path) => location.pathname === path ? "bg-blue-700" : "hover:bg-blue-600";
    return (_jsx("nav", { className: "bg-blue-600 text-white shadow-md", children: _jsxs("div", { className: "max-w-6xl mx-auto px-4 py-4 flex justify-between items-center", children: [_jsxs("div", { className: "flex items-center gap-8", children: [_jsx("h1", { onClick: () => navigate("/"), className: "text-2xl font-bold cursor-pointer hover:text-blue-100", children: "TaskFlow" }), _jsx("div", { className: "flex gap-2", children: _jsx("button", { onClick: () => navigate("/teams"), className: `px-4 py-2 rounded-md text-sm font-medium ${isActive("/teams")}`, children: "Teams" }) })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("span", { className: "text-sm", children: user?.name || "User" }), _jsx("button", { onClick: () => {
                                logout();
                                navigate("/login");
                            }, className: "px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-sm font-medium", children: "Logout" })] })] }) }));
};
function AppContent() {
    return (_jsxs(_Fragment, { children: [_jsx(Navigation, {}), _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(HomePage, {}) }), _jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/register", element: _jsx(RegisterPage, {}) }), _jsx(Route, { path: "/teams", element: _jsx(ProtectedRoute, { children: _jsx(TeamsPage, {}) }) }), _jsx(Route, { path: "/teams/:teamId", element: _jsx(ProtectedRoute, { children: _jsx(TeamDetailPage, {}) }) }), _jsx(Route, { path: "/teams/:teamId/analytics", element: _jsx(ProtectedRoute, { children: _jsx(AnalyticsPage, {}) }) }), _jsx(Route, { path: "/teams/:teamId/activity", element: _jsx(ProtectedRoute, { children: _jsx(ActivityLogPage, {}) }) }), _jsx(Route, { path: "/teams/:teamId/tasks/:taskId/activity", element: _jsx(ProtectedRoute, { children: _jsx(ActivityLogPage, {}) }) })] })] }));
}
function App() {
    return (_jsx(Router, { children: _jsx(AuthProvider, { children: _jsx(AppContent, {}) }) }));
}
export default App;
