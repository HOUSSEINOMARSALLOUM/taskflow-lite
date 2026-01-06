import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../services/authContext";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Loader2,
  Check,
  Rocket,
  Shield
} from "lucide-react";

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[a-z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^A-Za-z0-9]/.test(pass)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'];
  const strengthColors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-neo-blue', 'bg-green-500'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      await register(email, name, password);
      navigate("/");
    } catch (err: any) {
      setError(
        err.response?.data?.error || "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mesh-gradient flex items-center justify-center relative overflow-hidden py-12">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="orb orb-cyan w-96 h-96 -top-32 -right-32 opacity-30" />
        <div className="orb orb-blue w-80 h-80 -bottom-20 -left-20 opacity-40" />
        <div className="orb orb-orange w-48 h-48 top-1/2 left-1/4 opacity-20" />
        <div className="grid-bg absolute inset-0 opacity-20" />
      </div>

      {/* Floating Decorative Cards */}
      <motion.div
        animate={{ y: [-10, 10, -10], rotate: [-2, 2, -2] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 right-10 glass-card p-4 rounded-xl hidden lg:block"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neo-blue to-neo-cyan flex items-center justify-center">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Quick Setup</div>
            <div className="text-xs text-neo-muted">2 min onboarding</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [10, -10, 10], rotate: [2, -2, 2] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/3 left-10 glass-card p-4 rounded-xl hidden lg:block"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neo-orange to-neo-coral flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Enterprise Security</div>
            <div className="text-xs text-neo-muted">SOC2 Compliant</div>
          </div>
        </div>
      </motion.div>

      {/* Main Register Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="glass-card p-8 md:p-10 rounded-3xl relative overflow-hidden">
          {/* Card Glow Effect */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-neo-cyan/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-neo-orange/10 rounded-full blur-3xl" />

          {/* Logo & Header */}
          <div className="relative z-10 text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-block mb-4"
            >
              <div className="relative">
                <img
                  src="/neo-logo.png"
                  alt="Neo"
                  className="w-20 h-20 mx-auto drop-shadow-lg"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -inset-2 bg-neo-blue/20 rounded-full blur-xl"
                />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-white mb-2"
            >
              Join the Future
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-neo-muted"
            >
              Create your Neo-HeadstarterAI account
            </motion.p>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <span className="text-red-400 text-sm">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
            {/* Name Field */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-white/80">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-neo-muted" />
                </div>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="input-neo pl-12"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-white/80">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-neo-muted" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-neo pl-12"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-white/80">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-neo-muted" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-neo pl-12 pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-neo-muted hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full transition-colors ${level <= passwordStrength
                            ? strengthColors[passwordStrength]
                            : 'bg-white/10'
                          }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-neo-muted">
                    Password strength: <span className="text-white">{strengthLabels[passwordStrength]}</span>
                  </p>
                </motion.div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/80">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-neo-muted" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="input-neo pl-12 pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-neo-muted hover:text-white transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
                {/* Match indicator */}
                {confirmPassword && password === confirmPassword && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-y-0 right-12 flex items-center"
                  >
                    <Check className="w-5 h-5 text-green-400" />
                  </motion.div>
                )}
              </div>
            </div>

            {/* Terms Agreement */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                required
                className="w-5 h-5 mt-0.5 rounded border-white/20 bg-white/5 text-neo-blue focus:ring-neo-blue/50"
              />
              <span className="text-sm text-neo-muted">
                I agree to the{" "}
                <a href="#" className="text-neo-blue hover:text-neo-cyan">Terms of Service</a>
                {" "}and{" "}
                <a href="#" className="text-neo-blue hover:text-neo-cyan">Privacy Policy</a>
              </span>
            </label>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full btn-neo-primary py-4 text-lg font-semibold flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <Sparkles className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-dark-700 text-neo-muted">or sign up with</span>
            </div>
          </div>

          {/* Social Register */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { name: 'Google', icon: '🔍' },
              { name: 'GitHub', icon: '🐙' },
              { name: 'Microsoft', icon: '🪟' },
            ].map((provider) => (
              <motion.button
                key={provider.name}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="glass-button py-3 text-center text-lg"
                title={`Sign up with ${provider.name}`}
              >
                {provider.icon}
              </motion.button>
            ))}
          </div>

          {/* Sign In Link */}
          <p className="text-center text-neo-muted mt-8">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-neo-blue hover:text-neo-cyan font-semibold transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Features Teaser */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 glass p-4 rounded-xl"
        >
          <div className="flex items-center justify-center gap-6 text-sm">
            {[
              { icon: '🚀', text: 'Free to start' },
              { icon: '🔒', text: 'Secure' },
              { icon: '⚡', text: 'Lightning fast' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-neo-muted">
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
