import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../services/authContext";
import apiClient from "../services/api";
import {
  Users,
  Plus,
  ListTodo,
  ArrowRight,
  X,
  Sparkles,
  Search,
  LayoutGrid,
  List,
  Target,
  Loader2,
  AlertCircle,
  FolderOpen,
} from "lucide-react";

interface Team {
  id: string;
  name: string;
  slug: string;
  description?: string;
  _count?: {
    tasks: number;
    teamMembers: number;
  };
}

interface CreateTeamModal {
  isOpen: boolean;
  name: string;
  description: string;
  isLoading: boolean;
  error: string | null;
}

const TeamsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [isLoadingTeams, setIsLoadingTeams] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [modal, setModal] = useState<CreateTeamModal>({
    isOpen: false,
    name: "",
    description: "",
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    loadTeams();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setFilteredTeams(
        teams.filter(team =>
          team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          team.description?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredTeams(teams);
    }
  }, [searchQuery, teams]);

  const loadTeams = async () => {
    try {
      setIsLoadingTeams(true);
      const response = await apiClient.getTeams();
      setTeams(response);
      setFilteredTeams(response);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load teams");
    } finally {
      setIsLoadingTeams(false);
    }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!modal.name.trim()) {
      setModal({ ...modal, error: "Team name is required" });
      return;
    }

    try {
      setModal({ ...modal, isLoading: true, error: null });
      const newTeam = await apiClient.createTeam({
        name: modal.name,
        description: modal.description,
      });
      setTeams([...teams, newTeam]);
      setModal({
        isOpen: false,
        name: "",
        description: "",
        isLoading: false,
        error: null,
      });
      navigate(`/teams/${newTeam.id}`);
    } catch (err: any) {
      setModal({
        ...modal,
        isLoading: false,
        error: err.message || "Failed to create team",
      });
    }
  };

  const handleTeamClick = (teamId: string) => {
    navigate(`/teams/${teamId}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="orb orb-blue w-80 h-80 -top-20 right-1/4 opacity-20" />
        <div className="orb orb-orange w-64 h-64 bottom-1/3 -left-20 opacity-15" />
        <div className="grid-bg absolute inset-0 opacity-20" />
      </div>

      {/* Header */}
      <div className="relative z-10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-neo-blue to-neo-cyan flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Teams</h1>
                  <p className="text-neo-muted text-sm">
                    {teams.length} {teams.length === 1 ? 'team' : 'teams'} active
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neo-muted" />
                <input
                  type="text"
                  placeholder="Search teams..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-neo pl-12 pr-4 py-3 w-64"
                />
              </div>

              {/* View Toggle */}
              <div className="glass rounded-xl p-1 flex">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-neo-blue/20 text-neo-blue' : 'text-neo-muted hover:text-white'}`}
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-neo-blue/20 text-neo-blue' : 'text-neo-muted hover:text-white'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              {/* Create Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setModal({ ...modal, isOpen: true })}
                className="btn-neo-primary flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create Team
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 glass-card rounded-xl flex items-center gap-3 border border-red-500/30"
          >
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-400">{error}</span>
          </motion.div>
        )}

        {isLoadingTeams ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="loader-neo mx-auto mb-4" />
              <p className="text-neo-muted">Loading teams...</p>
            </div>
          </div>
        ) : filteredTeams.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-12 rounded-3xl text-center"
          >
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-neo-blue/20 to-neo-cyan/20 border border-neo-blue/30 flex items-center justify-center"
            >
              {searchQuery ? (
                <Search className="w-10 h-10 text-neo-cyan" />
              ) : (
                <FolderOpen className="w-10 h-10 text-neo-cyan" />
              )}
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-3">
              {searchQuery ? "No teams found" : "No Teams Yet"}
            </h3>
            <p className="text-neo-muted mb-6 max-w-md mx-auto">
              {searchQuery
                ? `No teams match "${searchQuery}". Try a different search term.`
                : "Create your first team to start collaborating with your colleagues."
              }
            </p>
            {!searchQuery && (
              <button
                onClick={() => setModal({ ...modal, isOpen: true })}
                className="btn-neo-primary inline-flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Create Your First Team
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={viewMode === 'grid'
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
            }
          >
            {filteredTeams.map((team, i) => (
              viewMode === 'grid' ? (
                <motion.div
                  key={team.id}
                  variants={itemVariants}
                  whileHover={{ y: -8, scale: 1.02 }}
                  onClick={() => handleTeamClick(team.id)}
                  className="team-card-neo"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neo-blue/20 to-neo-cyan/20 border border-neo-blue/30 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gradient-neo">
                        {team.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="badge-neo badge-neo-blue">
                      <Target className="w-3 h-3 mr-1" />
                      Active
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{team.name}</h3>
                  {team.description && (
                    <p className="text-sm text-neo-muted mb-4 line-clamp-2">
                      {team.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-neo-muted mb-4">
                    <span className="flex items-center gap-1.5">
                      <ListTodo className="w-4 h-4" />
                      {team._count?.tasks || 0} tasks
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      {team._count?.teamMembers || 0} members
                    </span>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between group">
                    <span className="text-neo-blue font-medium text-sm group-hover:text-neo-cyan transition-colors">
                      View Team
                    </span>
                    <ArrowRight className="w-4 h-4 text-neo-blue group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={team.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.01, x: 4 }}
                  onClick={() => handleTeamClick(team.id)}
                  className="glass-card p-4 rounded-xl flex items-center gap-4 cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neo-blue/20 to-neo-cyan/20 border border-neo-blue/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-gradient-neo">
                      {team.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="text-lg font-bold text-white truncate">{team.name}</h3>
                    {team.description && (
                      <p className="text-sm text-neo-muted truncate">{team.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-6 text-sm text-neo-muted flex-shrink-0">
                    <span className="flex items-center gap-1.5">
                      <ListTodo className="w-4 h-4" />
                      {team._count?.tasks || 0}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      {team._count?.teamMembers || 0}
                    </span>
                    <ArrowRight className="w-5 h-5 text-neo-blue group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              )
            ))}
          </motion.div>
        )}
      </div>

      {/* Create Team Modal */}
      <AnimatePresence>
        {modal.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 modal-neo flex items-center justify-center p-4 z-50"
            onClick={() => setModal({ ...modal, isOpen: false })}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="modal-content-neo max-w-md w-full p-0 overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neo-blue to-neo-cyan flex items-center justify-center">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Create New Team</h2>
                    <p className="text-sm text-neo-muted">Set up your team workspace</p>
                  </div>
                </div>
                <button
                  onClick={() => setModal({ ...modal, isOpen: false })}
                  className="p-2 rounded-lg hover:bg-white/5 text-neo-muted hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleCreateTeam} className="p-6 space-y-5">
                {modal.error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <span className="text-red-400 text-sm">{modal.error}</span>
                  </motion.div>
                )}

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white/80">
                    Team Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={modal.name}
                    onChange={(e) => setModal({ ...modal, name: e.target.value })}
                    placeholder="e.g., Product Team"
                    className="input-neo"
                    autoFocus
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white/80">
                    Description
                  </label>
                  <textarea
                    value={modal.description}
                    onChange={(e) => setModal({ ...modal, description: e.target.value })}
                    placeholder="What does this team work on?"
                    rows={3}
                    className="input-neo resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setModal({ ...modal, isOpen: false })}
                    className="flex-1 btn-neo-secondary py-3"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={modal.isLoading}
                    className="flex-1 btn-neo-primary py-3 flex items-center justify-center gap-2"
                  >
                    {modal.isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Create Team
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeamsPage;
