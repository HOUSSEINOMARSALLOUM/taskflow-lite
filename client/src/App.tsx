import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthProvider, useAuth } from "./services/authContext";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TeamsPage from "./pages/TeamsPage";
import TeamDetailPage from "./pages/TeamDetailPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ActivityLogPage from "./pages/ActivityLogPage";
import LandingPage from "./pages/LandingPage";
import {
  Users,
  Home,
  LogOut,
  ChevronDown,
  Settings,
  User,
  Bell,
  Sparkles,
} from "lucide-react";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="loader-neo mx-auto"
          />
          <p className="mt-4 text-neo-muted">Loading your workspace...</p>
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
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  if (!isAuthenticated) return null;

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/teams", label: "Teams", icon: Users },
  ];

  return (
    <nav className="nav-neo sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          {/* Logo & Nav Links */}
          <div className="flex items-center gap-8">
            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate("/")}
              className="flex items-center gap-3 cursor-pointer"
            >
              <motion.img
                src="/neo-logo.png"
                alt="Neo"
                className="w-10 h-10"
                whileHover={{ rotate: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-white">TaskFlow</span>
                <span className="text-xs text-neo-blue block -mt-1 font-semibold tracking-wide">
                  by Neo-HeadstarterAI
                </span>
              </div>
            </motion.div>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <motion.button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`nav-link-neo flex items-center gap-2 ${isActive(link.path) ? "active" : ""
                    }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* AI Badge */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-neo-blue/10 border border-neo-blue/20"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4 text-neo-cyan" />
              </motion.div>
              <span className="text-xs font-medium text-neo-blue">AI Active</span>
            </motion.div>

            {/* Notifications */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative p-2 rounded-xl hover:bg-white/5 text-neo-muted hover:text-white transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-neo-orange rounded-full" />
            </motion.button>

            {/* User Menu */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-white/5 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neo-blue to-neo-cyan flex items-center justify-center text-white font-bold text-sm">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="hidden sm:block text-sm text-white font-medium">
                  {user?.name?.split(" ")[0] || "User"}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-neo-muted transition-transform ${showUserMenu ? "rotate-180" : ""
                    }`}
                />
              </motion.button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-56 glass-card rounded-xl overflow-hidden shadow-neo"
                  >
                    <div className="p-3 border-b border-white/10">
                      <p className="text-sm font-medium text-white">{user?.name}</p>
                      <p className="text-xs text-neo-muted">{user?.email}</p>
                    </div>
                    <div className="p-2">
                      <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-neo-muted hover:text-white transition-colors text-left">
                        <User className="w-4 h-4" />
                        <span className="text-sm">Profile</span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-neo-muted hover:text-white transition-colors text-left">
                        <Settings className="w-4 h-4" />
                        <span className="text-sm">Settings</span>
                      </button>
                    </div>
                    <div className="p-2 border-t border-white/10">
                      <button
                        onClick={() => {
                          logout();
                          navigate("/login");
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-dark-gradient">
      <Navigation />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={isAuthenticated ? <HomePage /> : <LandingPage />} />
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
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
