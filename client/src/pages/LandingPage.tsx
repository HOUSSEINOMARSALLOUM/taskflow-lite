
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ArrowRight,
    CheckCircle,
    BarChart2,
    Shield,
    Users,
    Zap,
    Layout,
    Clock,
} from "lucide-react";

const LandingPage: React.FC = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
            } as any,
        },
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans overflow-x-hidden">
            {/* Navigation */}
            <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center">
                            <Link to="/" className="flex items-center gap-2">
                                <div className="bg-blue-600 p-1.5 rounded-lg">
                                    <Layout className="h-6 w-6 text-white" />
                                </div>
                                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                                    TaskFlow
                                </span>
                            </Link>
                        </div>
                        <div className="hidden md:flex items-center gap-6">
                            <a href="#features" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
                                Features
                            </a>
                            <a href="#how-it-works" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
                                How It Works
                            </a>
                            <Link
                                to="/login"
                                className="text-slate-600 hover:text-blue-600 font-medium transition-colors"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/register"
                                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-grow pt-16">
                {/* Hero Section */}
                <section className="relative pt-20 pb-32 lg:pt-32 overflow-hidden">
                    <div className="absolute inset-0 z-0 opacity-30">
                        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
                        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
                        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                            className="max-w-3xl mx-auto"
                        >
                            <motion.div variants={itemVariants} className="inline-block mb-4 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-semibold tracking-wide">
                                🚀 Version 1.0 Live
                            </motion.div>
                            <motion.h1
                                variants={itemVariants}
                                className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-tight mb-8"
                            >
                                Manage tasks with
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
                                    clarity & speed
                                </span>
                            </motion.h1>
                            <motion.p
                                variants={itemVariants}
                                className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed"
                            >
                                The modern, role-based task management platform designed for high-performing teams. Stop juggling spreadsheets and start shipping.
                            </motion.p>
                            <motion.div
                                variants={itemVariants}
                                className="flex flex-col sm:flex-row justify-center gap-4"
                            >
                                <Link
                                    to="/register"
                                    className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-full transition-all shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2 group"
                                >
                                    Start Customizing
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link
                                    to="/login"
                                    className="px-8 py-4 bg-white hover:bg-gray-50 text-slate-700 border border-slate-200 text-lg font-bold rounded-full transition-all shadow-sm hover:shadow"
                                >
                                    Live Demo
                                </Link>
                            </motion.div>
                        </motion.div>

                        {/* Float UI Mockup */}
                        <motion.div
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="mt-20 relative mx-auto max-w-5xl"
                        >
                            <div className="rounded-2xl bg-white shadow-2xl border border-slate-200 p-2 sm:p-4 overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-transparent via-white/5 to-white/30 pointer-events-none"></div>
                                <img
                                    src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop"
                                    alt="App Dashboard"
                                    className="rounded-xl w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity duration-700"
                                />
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-24 bg-white relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">
                                Everything you need to stay organized
                            </h2>
                            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                                Powerful features, simplified for your workflow. TaskFlow Lite brings enterprise-grade management without the clutter.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <FeatureCard key={index} {...feature} index={index} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section id="how-it-works" className="py-24 bg-slate-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-bold text-slate-900 mb-6">Designed for real teams</h2>
                                <div className="space-y-8">
                                    {[
                                        { title: "Create Teams", desc: "Set up your workspace in seconds. Invite members and assign roles." },
                                        { title: "Assign Tasks", desc: "Break down projects into actionable tasks with due dates and priorities." },
                                        { title: "Track Progress", desc: "Visualize momentum with real-time analytics and activity logs." }
                                    ].map((step, i) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                                {i + 1}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900">{step.title}</h4>
                                                <p className="text-slate-600">{step.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl">
                                <h3 className="text-2xl font-bold mb-4">Why TaskFlow Lite?</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="text-green-300" /> <span>Free for small teams</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="text-green-300" /> <span>Open source</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="text-green-300" /> <span>No complex onboarding</span>
                                    </div>
                                    <div className="p-4 bg-white/10 rounded-lg mt-6 backdrop-blur-sm">
                                        <p className="italic">"The simplest way to manage our student organization projects. It just works."</p>
                                        <div className="mt-2 text-sm opacity-80">- Alex M., Student Lead</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-slate-900 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-overlay filter blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2"></div>
                    <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                        <h2 className="text-4xl font-bold mb-6">Ready to streamline your workflow?</h2>
                        <p className="text-xl text-slate-300 mb-10">
                            Join thousands of teams who have switched to a lighter, faster way to work.
                        </p>
                        <Link
                            to="/register"
                            className="inline-block px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg rounded-full transition-all shadow-lg hover:shadow-blue-500/50 transform hover:-translate-y-1"
                        >
                            Get Started for Free
                        </Link>
                    </div>
                </section>
            </main>

            <footer className="bg-slate-50 py-12 border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
                    <div className="flex items-center gap-2 mb-4 md:mb-0">
                        <Layout className="h-5 w-5 text-blue-600" />
                        <span className="font-semibold text-slate-700">TaskFlow Lite</span>
                    </div>
                    <div>
                        &copy; {new Date().getFullYear()} TaskFlow Lite. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon: Icon, title, description, index }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
        viewport={{ once: true }}
        className="bg-slate-50 p-8 rounded-2xl hover:bg-white hover:shadow-xl transition-all border border-slate-100 group"
    >
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-600 leading-relaxed">{description}</p>
    </motion.div>
);

const features = [
    {
        icon: Shield,
        title: "Secure & Reliable",
        description: "Enterprise-grade simple security with JWT authentication and role-based access control.",
    },
    {
        icon: Users,
        title: "Team Collaboration",
        description: "Built for teams. Assign tasks, track progress, and keep everyone aligned effortlessly.",
    },
    {
        icon: BarChart2,
        title: "Insightful Analytics",
        description: "Visual dashboards give you a clear view of productivity and project status at a glance.",
    },
    {
        icon: Clock,
        title: "Real-time Tracking",
        description: "Stay updated with activity logs and due date reminders. Never miss a deadline.",
    },
    {
        icon: Zap,
        title: "Lightning Fast",
        description: "Optimized for speed. No bloat, just the essential tools you need to get work done.",
    },
    {
        icon: Layout,
        title: "Intuitive Interface",
        description: "A clean, modern interface that requires zero training. Start working immediately.",
    },
];

export default LandingPage;

