import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
    ArrowRight,
    CheckCircle,
    BarChart2,
    Shield,
    Users,
    Zap,
    Layout,
    Clock,
    Sparkles,
    Cpu,
    Globe,
    Rocket,
} from "lucide-react";

const LandingPage: React.FC = () => {
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 40, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
            } as any,
        },
    };

    const float3DVariants = {
        animate: {
            y: [0, -15, 0],
            rotateX: [0, 2, 0],
            rotateY: [0, -2, 0],
            transition: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
            },
        },
    };

    return (
        <div className="min-h-screen bg-dark-gradient flex flex-col font-sans overflow-x-hidden">
            {/* Animated Background Orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="orb orb-blue w-96 h-96 top-0 left-1/4 opacity-30" style={{ animationDelay: '0s' }} />
                <div className="orb orb-orange w-80 h-80 top-1/3 right-1/4 opacity-20" style={{ animationDelay: '2s' }} />
                <div className="orb orb-cyan w-64 h-64 bottom-1/4 left-1/3 opacity-25" style={{ animationDelay: '4s' }} />
                <div className="grid-bg absolute inset-0 opacity-30" />
            </div>

            {/* Navigation */}
            <nav className="fixed w-full z-50 nav-neo">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20 items-center">
                        <div className="flex items-center">
                            <Link to="/" className="flex items-center gap-3 group">
                                <motion.div
                                    className="relative"
                                    whileHover={{ scale: 1.05, rotate: 5 }}
                                    transition={{ type: "spring", stiffness: 400 }}
                                >
                                    <img
                                        src="/neo-logo.png"
                                        alt="Neo-HeadstarterAI"
                                        className="w-12 h-12 object-contain drop-shadow-lg"
                                    />
                                    <div className="absolute inset-0 bg-neo-blue/20 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </motion.div>
                                <div className="flex flex-col">
                                    <span className="text-2xl font-bold text-white tracking-tight">
                                        TaskFlow
                                    </span>
                                    <span className="text-xs text-neo-blue font-semibold tracking-widest uppercase">
                                        by Neo-HeadstarterAI
                                    </span>
                                </div>
                            </Link>
                        </div>
                        <div className="hidden md:flex items-center gap-8">
                            <a href="#features" className="nav-link-neo">
                                Features
                            </a>
                            <a href="#how-it-works" className="nav-link-neo">
                                How It Works
                            </a>
                            <a href="#ai" className="nav-link-neo">
                                AI Powered
                            </a>
                            <Link to="/login" className="nav-link-neo">
                                Sign In
                            </Link>
                            <Link to="/register" className="btn-neo-primary text-sm">
                                <span className="flex items-center gap-2">
                                    Get Started
                                    <Sparkles className="w-4 h-4" />
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-grow pt-20">
                {/* Hero Section */}
                <section ref={heroRef} className="hero-neo relative pt-20 pb-32 lg:pt-32">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                            className="max-w-4xl mx-auto"
                        >
                            {/* Badge */}
                            <motion.div
                                variants={itemVariants}
                                className="inline-flex items-center gap-2 mb-6 px-5 py-2 rounded-full glass-button text-sm font-semibold"
                            >
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                >
                                    <Sparkles className="w-4 h-4 text-neo-cyan" />
                                </motion.div>
                                <span className="text-white">2030 Edition — AI-Powered Productivity</span>
                            </motion.div>

                            {/* Hero Title */}
                            <motion.h1
                                variants={itemVariants}
                                className="text-6xl md:text-8xl font-extrabold tracking-tight leading-tight mb-8"
                            >
                                <span className="text-white">The Future of</span>
                                <br />
                                <span className="text-gradient-neo">
                                    Task Management
                                </span>
                            </motion.h1>

                            {/* Subtitle */}
                            <motion.p
                                variants={itemVariants}
                                className="text-xl md:text-2xl text-neo-muted mb-12 max-w-2xl mx-auto leading-relaxed"
                            >
                                Experience next-generation productivity with AI-driven insights,
                                immersive 3D interfaces, and seamless team collaboration.
                            </motion.p>

                            {/* CTA Buttons */}
                            <motion.div
                                variants={itemVariants}
                                className="flex flex-col sm:flex-row justify-center gap-4"
                            >
                                <Link to="/register" className="btn-neo-primary text-lg px-10 py-5 flex items-center justify-center gap-3 group">
                                    Start Your Journey
                                    <motion.div
                                        animate={{ x: [0, 5, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    >
                                        <ArrowRight className="w-5 h-5" />
                                    </motion.div>
                                </Link>
                                <Link to="/login" className="btn-neo-secondary text-lg px-10 py-5 flex items-center justify-center gap-3">
                                    <Rocket className="w-5 h-5" />
                                    Live Demo
                                </Link>
                            </motion.div>

                            {/* Stats Row */}
                            <motion.div
                                variants={itemVariants}
                                className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
                            >
                                {[
                                    { value: "10K+", label: "Active Teams" },
                                    { value: "99.9%", label: "Uptime" },
                                    { value: "50ms", label: "Response Time" },
                                ].map((stat, i) => (
                                    <div key={i} className="text-center">
                                        <div className="text-3xl md:text-4xl font-bold text-gradient-neo">{stat.value}</div>
                                        <div className="text-sm text-neo-muted mt-1">{stat.label}</div>
                                    </div>
                                ))}
                            </motion.div>
                        </motion.div>

                        {/* 3D Dashboard Preview */}
                        <motion.div
                            initial={{ opacity: 0, y: 100, rotateX: 10 }}
                            animate={{ opacity: 1, y: 0, rotateX: 0 }}
                            transition={{ delay: 0.6, duration: 1, type: "spring" }}
                            className="mt-24 perspective-1200"
                        >
                            <motion.div
                                variants={float3DVariants}
                                animate="animate"
                                className="relative mx-auto max-w-6xl transform-3d"
                            >
                                {/* Glow Effect */}
                                <div className="absolute inset-0 bg-neo-blue/20 blur-3xl rounded-3xl transform scale-95" />

                                {/* Dashboard Frame */}
                                <div className="relative glass-card p-3 rounded-3xl overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-transparent via-white/3 to-white/8 pointer-events-none" />

                                    {/* Browser Dots */}
                                    <div className="flex gap-2 mb-3 px-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                    </div>

                                    <img
                                        src="/hero-dashboard.png"
                                        alt="TaskFlow Dashboard Interface"
                                        className="rounded-2xl w-full h-auto object-cover"
                                    />

                                    {/* Floating Elements */}
                                    <motion.div
                                        animate={{ y: [-5, 5, -5], x: [-3, 3, -3] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                        className="absolute -right-8 top-1/4 glass-card p-4 rounded-xl shadow-neo hidden lg:block"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neo-blue to-neo-cyan flex items-center justify-center">
                                                <Zap className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white">AI Analysis</div>
                                                <div className="text-xs text-neo-muted">+45% Productivity</div>
                                            </div>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        animate={{ y: [5, -5, 5], x: [3, -3, 3] }}
                                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                        className="absolute -left-8 bottom-1/3 glass-card p-4 rounded-xl shadow-neo hidden lg:block"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neo-orange to-neo-coral flex items-center justify-center">
                                                <CheckCircle className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white">24 Tasks Done</div>
                                                <div className="text-xs text-neo-muted">Today's Progress</div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* AI-Powered Section */}
                <section id="ai" className="py-32 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neo-blue/5 to-transparent" />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                            >
                                <div className="badge-neo badge-neo-blue mb-6">
                                    <Cpu className="w-4 h-4 mr-2" />
                                    AI-Powered Intelligence
                                </div>
                                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                                    Your Tasks,{" "}
                                    <span className="text-gradient-neo">Supercharged</span>
                                    {" "}by AI
                                </h2>
                                <p className="text-xl text-neo-muted mb-8 leading-relaxed">
                                    Neo-HeadstarterAI brings cutting-edge artificial intelligence to
                                    revolutionize how you manage projects. Smart prioritization,
                                    predictive deadlines, and automated workflows—all powered by our
                                    proprietary AI engine.
                                </p>
                                <div className="space-y-4">
                                    {[
                                        "Smart task prioritization & scheduling",
                                        "Predictive workload balancing",
                                        "Automated progress insights",
                                        "Natural language task creation",
                                    ].map((feature, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            viewport={{ once: true }}
                                            className="flex items-center gap-3"
                                        >
                                            <div className="w-6 h-6 rounded-full bg-neo-blue/20 flex items-center justify-center flex-shrink-0">
                                                <CheckCircle className="w-4 h-4 text-neo-cyan" />
                                            </div>
                                            <span className="text-white/90">{feature}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                                className="relative perspective-1200"
                            >
                                <motion.div
                                    animate={{
                                        rotateY: [0, 5, 0, -5, 0],
                                        rotateX: [0, 3, 0, -3, 0],
                                    }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                                    className="relative"
                                >
                                    {/* AI Brain Visualization */}
                                    <div className="glass-card p-8 rounded-3xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-neo-blue/30 blur-3xl rounded-full" />
                                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-neo-orange/20 blur-3xl rounded-full" />

                                        <div className="relative z-10 flex flex-col items-center">
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                                className="w-32 h-32 mb-6 relative"
                                            >
                                                <div className="absolute inset-0 rounded-full border-2 border-neo-blue/30 border-dashed" />
                                                <div className="absolute inset-2 rounded-full border-2 border-neo-cyan/40 border-dashed animate-spin-slow" style={{ animationDirection: 'reverse' }} />
                                                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-neo-blue to-neo-cyan flex items-center justify-center">
                                                    <img src="/neo-logo.png" alt="Neo AI" className="w-16 h-16 object-contain" />
                                                </div>
                                            </motion.div>

                                            <h3 className="text-2xl font-bold text-white mb-2">Neo AI Engine</h3>
                                            <p className="text-neo-muted text-center">
                                                Processing 1M+ tasks daily with 99.7% accuracy
                                            </p>

                                            <div className="mt-6 grid grid-cols-3 gap-4 w-full">
                                                {[
                                                    { icon: BarChart2, label: "Analytics", value: "Real-time" },
                                                    { icon: Globe, label: "Coverage", value: "Global" },
                                                    { icon: Zap, label: "Speed", value: "< 50ms" },
                                                ].map((item, i) => (
                                                    <div key={i} className="text-center p-3 rounded-xl bg-white/5">
                                                        <item.icon className="w-5 h-5 text-neo-cyan mx-auto mb-1" />
                                                        <div className="text-xs text-neo-muted">{item.label}</div>
                                                        <div className="text-sm font-bold text-white">{item.value}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-32 relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="text-center mb-20"
                        >
                            <div className="badge-neo badge-neo-orange inline-flex mb-6">
                                <Sparkles className="w-4 h-4 mr-2" />
                                Premium Features
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                Everything You Need to{" "}
                                <span className="text-gradient-neo">Excel</span>
                            </h2>
                            <p className="text-xl text-neo-muted max-w-2xl mx-auto">
                                Built for the future of work. Our feature set is designed to make
                                collaboration seamless and productivity effortless.
                            </p>
                        </motion.div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {features.map((feature, index) => (
                                <FeatureCard key={index} {...feature} index={index} />
                            ))}
                        </div>

                        {/* Feature Showcase */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="mt-24"
                        >
                            <div className="glass-card p-1 rounded-3xl overflow-hidden">
                                <div className="bg-gradient-to-br from-dark-800 to-dark-700 rounded-3xl p-8 md:p-12">
                                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                                        <div>
                                            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                                                Seamless Team{" "}
                                                <span className="text-gradient-neo">Collaboration</span>
                                            </h3>
                                            <p className="text-lg text-neo-muted mb-8 leading-relaxed">
                                                Work together in real-time with shared boards, instant updates,
                                                and transparent progress tracking. Break down silos and amplify
                                                your team's potential.
                                            </p>
                                            <div className="space-y-4">
                                                {[
                                                    { icon: CheckCircle, color: "neo-blue", text: "Real-time status syncing" },
                                                    { icon: Users, color: "neo-orange", text: "Team-wide visibility" },
                                                    { icon: Shield, color: "neo-cyan", text: "Role-based access control" },
                                                ].map((item, i) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        whileInView={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: i * 0.1 }}
                                                        viewport={{ once: true }}
                                                        className="flex items-center gap-4"
                                                    >
                                                        <div className={`w-8 h-8 rounded-lg bg-${item.color}/20 flex items-center justify-center`}>
                                                            <item.icon className={`w-4 h-4 text-${item.color}`} />
                                                        </div>
                                                        <span className="text-white/90">{item.text}</span>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                        <motion.div
                                            whileHover={{ scale: 1.02, rotateY: -5 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                            className="relative perspective-1200"
                                        >
                                            <div className="absolute inset-0 bg-neo-blue/10 blur-3xl rounded-3xl" />
                                            <img
                                                src="/features-collaboration.png"
                                                alt="Team Collaboration"
                                                className="relative rounded-2xl shadow-neo-lg border border-white/10"
                                            />
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* How It Works */}
                <section id="how-it-works" className="py-32 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent" />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="text-center mb-20"
                        >
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                Simple Steps to{" "}
                                <span className="text-gradient-neo">Success</span>
                            </h2>
                            <p className="text-xl text-neo-muted max-w-2xl mx-auto">
                                Get started in minutes. Our intuitive workflow ensures you're
                                productive from day one.
                            </p>
                        </motion.div>

                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div className="space-y-8">
                                {[
                                    {
                                        num: "01",
                                        title: "Create Your Workspace",
                                        desc: "Set up your team workspace in seconds. Customize your environment and invite members instantly.",
                                        icon: Layout,
                                    },
                                    {
                                        num: "02",
                                        title: "Assign & Organize Tasks",
                                        desc: "Break down projects into actionable tasks with priorities, deadlines, and smart assignments.",
                                        icon: CheckCircle,
                                    },
                                    {
                                        num: "03",
                                        title: "Track & Analyze",
                                        desc: "Monitor progress in real-time with AI-powered insights and comprehensive analytics.",
                                        icon: BarChart2,
                                    },
                                ].map((step, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -30 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.15, duration: 0.5 }}
                                        viewport={{ once: true }}
                                        className="glass-card p-6 rounded-2xl flex gap-6 group hover:border-neo-blue/30 transition-colors"
                                    >
                                        <div className="flex-shrink-0">
                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neo-blue to-neo-cyan flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">
                                                {step.num}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                                                {step.title}
                                            </h4>
                                            <p className="text-neo-muted">{step.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                                className="relative"
                            >
                                <div className="absolute inset-0 bg-neo-orange/10 blur-3xl rounded-full" />
                                <motion.div
                                    animate={{ y: [-10, 10, -10] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <img
                                        src="/how-it-works.png"
                                        alt="Workflow Process"
                                        className="relative z-10 w-full h-auto drop-shadow-2xl rounded-2xl"
                                    />
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-32 relative overflow-hidden">
                    <div className="absolute inset-0">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neo-blue/20 rounded-full blur-3xl" />
                        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-neo-orange/10 rounded-full blur-3xl" />
                    </div>

                    <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="glass-card p-12 md:p-16 rounded-4xl"
                        >
                            <motion.div
                                animate={{ y: [-5, 5, -5] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="mb-8"
                            >
                                <img src="/neo-logo.png" alt="Neo" className="w-20 h-20 mx-auto drop-shadow-lg" />
                            </motion.div>
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                Ready for the{" "}
                                <span className="text-gradient-neo">Future?</span>
                            </h2>
                            <p className="text-xl text-neo-muted mb-10 max-w-2xl mx-auto">
                                Join thousands of forward-thinking teams who have already
                                transformed their productivity with Neo-HeadstarterAI.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    to="/register"
                                    className="btn-neo-primary text-lg px-12 py-5 flex items-center justify-center gap-3"
                                >
                                    Get Started Free
                                    <Rocket className="w-5 h-5" />
                                </Link>
                                <Link
                                    to="/login"
                                    className="btn-neo-secondary text-lg px-12 py-5"
                                >
                                    Watch Demo
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="relative border-t border-white/10 pt-20 pb-10">
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent pointer-events-none" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
                        <div className="col-span-2">
                            <div className="flex items-center gap-3 mb-6">
                                <img src="/neo-logo.png" alt="Neo" className="w-12 h-12 object-contain" />
                                <div>
                                    <span className="text-xl font-bold text-white block">TaskFlow</span>
                                    <span className="text-xs text-neo-blue">by Neo-HeadstarterAI</span>
                                </div>
                            </div>
                            <p className="text-neo-muted text-sm leading-relaxed mb-6 max-w-sm">
                                The next-generation task management platform powered by AI.
                                Built for teams who demand excellence.
                            </p>
                            <div className="flex gap-4">
                                {['𝕏', 'in', 'gh', 'yt'].map((icon, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ scale: 1.1, y: -2 }}
                                        className="w-10 h-10 rounded-full glass flex items-center justify-center text-neo-muted hover:text-neo-blue hover:border-neo-blue/30 transition-colors cursor-pointer"
                                    >
                                        {icon}
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {[
                            {
                                title: "Product",
                                links: ["Features", "How it Works", "Pricing", "Roadmap", "Changelog"],
                            },
                            {
                                title: "Resources",
                                links: ["Documentation", "API Reference", "Community", "Blog", "Tutorials"],
                            },
                            {
                                title: "Company",
                                links: ["About Neo", "Careers", "Press Kit", "Contact", "Partners"],
                            },
                        ].map((section, i) => (
                            <div key={i}>
                                <h4 className="font-bold text-white mb-6">{section.title}</h4>
                                <ul className="space-y-3">
                                    {section.links.map((link, j) => (
                                        <li key={j}>
                                            <a href="#" className="text-sm text-neo-muted hover:text-neo-blue transition-colors">
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-sm text-neo-dim">
                            © {new Date().getFullYear()} Neo-HeadstarterAI. All rights reserved.
                        </div>
                        <div className="flex gap-6 text-sm text-neo-dim">
                            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-white transition-colors">Cookie Settings</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon: Icon, title, description, index }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
        viewport={{ once: true }}
        whileHover={{ y: -10, scale: 1.02 }}
        className="glass-card p-8 rounded-2xl group cursor-pointer"
    >
        <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neo-blue/20 to-neo-cyan/20 border border-neo-blue/30 flex items-center justify-center mb-6 group-hover:shadow-neo-glow transition-shadow"
        >
            <Icon className="w-7 h-7 text-neo-cyan" />
        </motion.div>
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-gradient-neo transition-all">
            {title}
        </h3>
        <p className="text-neo-muted leading-relaxed">{description}</p>
    </motion.div>
);

const features = [
    {
        icon: Shield,
        title: "Enterprise Security",
        description: "Bank-grade encryption with JWT authentication and role-based access control for maximum protection.",
    },
    {
        icon: Users,
        title: "Team Collaboration",
        description: "Real-time sync, shared workspaces, and instant updates keep everyone aligned and productive.",
    },
    {
        icon: BarChart2,
        title: "Smart Analytics",
        description: "AI-powered dashboards give you actionable insights and predictive productivity metrics.",
    },
    {
        icon: Clock,
        title: "Time Intelligence",
        description: "Smart scheduling, deadline predictions, and automated reminders so you never miss a beat.",
    },
    {
        icon: Zap,
        title: "Lightning Performance",
        description: "Sub-50ms response times with edge computing ensure buttery-smooth experiences.",
    },
    {
        icon: Layout,
        title: "Adaptive Interface",
        description: "A stunning 3D interface that adapts to your workflow and learns your preferences.",
    },
];

export default LandingPage;
