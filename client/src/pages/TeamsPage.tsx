import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../services/authContext";
import apiClient from "../services/api";

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
  const [isLoadingTeams, setIsLoadingTeams] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  const loadTeams = async () => {
    try {
      setIsLoadingTeams(true);
      const response = await apiClient.getTeams();
      setTeams(response);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Teams</h1>
              <p className="mt-1 text-gray-600">
                Manage your teams and collaborate
              </p>
            </div>
            <button
              onClick={() => setModal({ ...modal, isOpen: true })}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              + Create Team
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {isLoadingTeams ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading teams...</p>
            </div>
          </div>
        ) : teams.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No teams yet
            </h3>
            <p className="text-gray-600 mb-4">
              Create your first team to get started
            </p>
            <button
              onClick={() => setModal({ ...modal, isOpen: true })}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Create Team
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => (
              <div
                key={team.id}
                onClick={() => handleTeamClick(team.id)}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {team.name}
                  </h3>
                  {team.description && (
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {team.description}
                    </p>
                  )}
                  <div className="mt-4 flex justify-between text-sm text-gray-600">
                    <span>{team._count?.tasks || 0} tasks</span>
                    <span>{team._count?.teamMembers || 0} members</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Team Modal */}
      {modal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Create New Team
              </h2>
            </div>
            <form onSubmit={handleCreateTeam} className="p-6">
              {modal.error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                  {modal.error}
                </div>
              )}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Team Name *
                </label>
                <input
                  type="text"
                  value={modal.name}
                  onChange={(e) => setModal({ ...modal, name: e.target.value })}
                  placeholder="Enter team name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={modal.description}
                  onChange={(e) =>
                    setModal({ ...modal, description: e.target.value })
                  }
                  placeholder="Optional team description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setModal({
                      isOpen: false,
                      name: "",
                      description: "",
                      isLoading: false,
                      error: null,
                    })
                  }
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modal.isLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-md font-medium"
                >
                  {modal.isLoading ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamsPage;
