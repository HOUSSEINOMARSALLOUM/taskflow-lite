import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../services/authContext";
import apiClient from "../services/api";
const TeamsPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [teams, setTeams] = useState([]);
    const [isLoadingTeams, setIsLoadingTeams] = useState(true);
    const [error, setError] = useState(null);
    const [modal, setModal] = useState({
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
        }
        catch (err) {
            setError(err.message || "Failed to load teams");
        }
        finally {
            setIsLoadingTeams(false);
        }
    };
    const handleCreateTeam = async (e) => {
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
        }
        catch (err) {
            setModal({
                ...modal,
                isLoading: false,
                error: err.message || "Failed to create team",
            });
        }
    };
    const handleTeamClick = (teamId) => {
        navigate(`/teams/${teamId}`);
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("div", { className: "bg-white border-b border-gray-200", children: _jsx("div", { className: "max-w-6xl mx-auto px-4 py-6", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Teams" }), _jsx("p", { className: "mt-1 text-gray-600", children: "Manage your teams and collaborate" })] }), _jsx("button", { onClick: () => setModal({ ...modal, isOpen: true }), className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700", children: "+ Create Team" })] }) }) }), _jsxs("div", { className: "max-w-6xl mx-auto px-4 py-8", children: [error && (_jsx("div", { className: "mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700", children: error })), isLoadingTeams ? (_jsx("div", { className: "flex justify-center items-center min-h-[400px]", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" }), _jsx("p", { className: "mt-2 text-gray-600", children: "Loading teams..." })] }) })) : teams.length === 0 ? (_jsxs("div", { className: "text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "No teams yet" }), _jsx("p", { className: "text-gray-600 mb-4", children: "Create your first team to get started" }), _jsx("button", { onClick: () => setModal({ ...modal, isOpen: true }), className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700", children: "Create Team" })] })) : (_jsx("div", { className: "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3", children: teams.map((team) => (_jsx("div", { onClick: () => handleTeamClick(team.id), className: "bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer", children: _jsxs("div", { className: "p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: team.name }), team.description && (_jsx("p", { className: "mt-2 text-sm text-gray-600 line-clamp-2", children: team.description })), _jsxs("div", { className: "mt-4 flex justify-between text-sm text-gray-600", children: [_jsxs("span", { children: [team._count?.tasks || 0, " tasks"] }), _jsxs("span", { children: [team._count?.teamMembers || 0, " members"] })] })] }) }, team.id))) }))] }), modal.isOpen && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50", children: _jsxs("div", { className: "bg-white rounded-lg shadow-xl max-w-md w-full", children: [_jsx("div", { className: "px-6 py-4 border-b border-gray-200", children: _jsx("h2", { className: "text-xl font-semibold text-gray-900", children: "Create New Team" }) }), _jsxs("form", { onSubmit: handleCreateTeam, className: "p-6", children: [modal.error && (_jsx("div", { className: "mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm", children: modal.error })), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Team Name *" }), _jsx("input", { type: "text", value: modal.name, onChange: (e) => setModal({ ...modal, name: e.target.value }), placeholder: "Enter team name", className: "w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Description" }), _jsx("textarea", { value: modal.description, onChange: (e) => setModal({ ...modal, description: e.target.value }), placeholder: "Optional team description", rows: 3, className: "w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { type: "button", onClick: () => setModal({
                                                isOpen: false,
                                                name: "",
                                                description: "",
                                                isLoading: false,
                                                error: null,
                                            }), className: "flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md font-medium", children: "Cancel" }), _jsx("button", { type: "submit", disabled: modal.isLoading, className: "flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-md font-medium", children: modal.isLoading ? "Creating..." : "Create" })] })] })] }) }))] }));
};
export default TeamsPage;
