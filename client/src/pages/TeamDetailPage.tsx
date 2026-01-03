import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/authContext';
import apiClient from '../services/api';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: string;
  assignedToId?: string;
  assignedTo?: { name: string; email: string };
}

interface Team {
  id: string;
  name: string;
  description?: string;
  teamMembers?: any[];
}

interface CreateTaskModal {
  isOpen: boolean;
  title: string;
  description: string;
  priority: string;
  dueDate: string;
  isLoading: boolean;
  error: string | null;
}

const TeamDetailPage: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [team, setTeam] = useState<Team | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<CreateTaskModal>({
    isOpen: false,
    title: '',
    description: '',
    priority: 'MEDIUM',
    dueDate: '',
    isLoading: false,
    error: null,
  });
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  useEffect(() => {
    if (teamId) {
      loadTeamAndTasks();
    }
  }, [teamId]);

  const loadTeamAndTasks = async () => {
    try {
      setIsLoading(true);
      const [teamData, tasksData] = await Promise.all([
        apiClient.getTeam(teamId!),
        apiClient.getTeamTasks(teamId!),
      ]);
      setTeam(teamData);
      setTasks(tasksData.data || tasksData);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load team');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!modal.title.trim()) {
      setModal({ ...modal, error: 'Task title is required' });
      return;
    }

    try {
      setModal({ ...modal, isLoading: true, error: null });
      const newTask = await apiClient.createTask(teamId!, {
        title: modal.title,
        description: modal.description,
        priority: modal.priority as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
        dueDate: modal.dueDate || undefined,
      });
      setTasks([newTask, ...tasks]);
      setModal({ isOpen: false, title: '', description: '', priority: 'MEDIUM', dueDate: '', isLoading: false, error: null });
    } catch (err: any) {
      setModal({ ...modal, isLoading: false, error: err.message || 'Failed to create task' });
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      const updated = await apiClient.updateTask(taskId, { status: newStatus as any });
      setTasks(tasks.map(t => t.id === taskId ? updated : t));
    } catch (err: any) {
      setError(err.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await apiClient.deleteTask(taskId);
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch (err: any) {
      setError(err.message || 'Failed to delete task');
    }
  };

  const filteredTasks = filterStatus === 'ALL' ? tasks : tasks.filter(t => t.status === filterStatus);

  const statusColors: Record<string, string> = {
    TODO: 'bg-gray-100 text-gray-800',
    IN_PROGRESS: 'bg-blue-100 text-blue-800',
    DONE: 'bg-green-100 text-green-800',
  };

  const priorityColors: Record<string, string> = {
    LOW: 'text-green-600',
    MEDIUM: 'text-yellow-600',
    HIGH: 'text-orange-600',
    URGENT: 'text-red-600',
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading team...</p>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Team not found</h2>
          <button
            onClick={() => navigate('/teams')}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            Back to Teams
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate('/teams')}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-2"
          >
            ← Back to Teams
          </button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{team.name}</h1>
              {team.description && <p className="mt-1 text-gray-600">{team.description}</p>}
            </div>
            <button
              onClick={() => setModal({ ...modal, isOpen: true })}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              + New Task
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

        {/* Filter */}
        <div className="mb-6 flex gap-2">
          {['ALL', 'TODO', 'IN_PROGRESS', 'DONE'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filterStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
              }`}
            >
              {status === 'IN_PROGRESS' ? 'In Progress' : status.charAt(0) + status.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Tasks List */}
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks</h3>
            <p className="text-gray-600">Create a task to get started</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredTasks.map((task) => (
              <div key={task.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                    {task.description && <p className="mt-2 text-gray-600">{task.description}</p>}
                    <div className="mt-4 flex gap-3 items-center">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[task.status]}`}>
                        {task.status === 'IN_PROGRESS' ? 'In Progress' : task.status}
                      </span>
                      <span className={`text-xs font-medium ${priorityColors[task.priority]}`}>
                        {task.priority}
                      </span>
                      {task.dueDate && (
                        <span className="text-xs text-gray-600">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                      {task.assignedTo && (
                        <span className="text-xs text-gray-600">
                          → {task.assignedTo.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => navigate(`/teams/${teamId}/tasks/${task.id}`)}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-red-600 hover:text-red-700 font-medium text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Task Modal */}
      {modal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Create New Task</h2>
            </div>
            <form onSubmit={handleCreateTask} className="p-6">
              {modal.error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                  {modal.error}
                </div>
              )}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={modal.title}
                  onChange={(e) => setModal({ ...modal, title: e.target.value })}
                  placeholder="Task title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={modal.description}
                  onChange={(e) => setModal({ ...modal, description: e.target.value })}
                  placeholder="Task description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={modal.priority}
                  onChange={(e) => setModal({ ...modal, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={modal.dueDate}
                  onChange={(e) => setModal({ ...modal, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setModal({ isOpen: false, title: '', description: '', priority: 'MEDIUM', dueDate: '', isLoading: false, error: null })}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modal.isLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-md font-medium"
                >
                  {modal.isLoading ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        )}
      )}
    </div>
  );
};

export default TeamDetailPage;
