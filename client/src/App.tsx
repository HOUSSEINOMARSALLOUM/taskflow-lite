import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./services/authContext";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TeamsPage from "./pages/TeamsPage";
import TeamDetailPage from "./pages/TeamDetailPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ActivityLogPage from "./pages/ActivityLogPage";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, isLoading } = useAuth();

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

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  const isActive = (path: string) =>
    location.pathname === path ? "bg-blue-700" : "hover:bg-blue-600";

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <h1
            onClick={() => navigate("/")}
            className="text-2xl font-bold cursor-pointer hover:text-blue-100"
          >
            TaskFlow
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/teams")}
              className={`px-4 py-2 rounded-md text-sm font-medium ${isActive(
                "/teams"
              )}`}
            >
              Teams
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm">{user?.name || "User"}</span>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

function AppContent() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/teams"
          element={
            <ProtectedRoute>
              <TeamsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teams/:teamId"
          element={
            <ProtectedRoute>
              <TeamDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teams/:teamId/analytics"
          element={
            <ProtectedRoute>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teams/:teamId/activity"
          element={
            <ProtectedRoute>
              <ActivityLogPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teams/:teamId/tasks/:taskId/activity"
          element={
            <ProtectedRoute>
              <ActivityLogPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
