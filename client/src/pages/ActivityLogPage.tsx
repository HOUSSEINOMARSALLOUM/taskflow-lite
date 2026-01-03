import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../services/api";

interface Activity {
  id: string;
  action: string;
  details?: Record<string, any>;
  createdAt: string;
  userId?: string;
  user?: { name: string; email: string };
  taskId?: string;
  task?: { title: string };
}

interface TeamActivity extends Activity {
  taskId?: string;
  task?: { title: string };
}

const ActivityLogPage: React.FC = () => {
  const { teamId, taskId } = useParams<{ teamId: string; taskId?: string }>();
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterUser, setFilterUser] = useState<string | null>(null);

  useEffect(() => {
    if (teamId) {
      loadActivities();
    }
  }, [teamId, taskId]);

  const loadActivities = async () => {
    try {
      setIsLoading(true);
      let activityData;

      if (taskId) {
        activityData = await apiClient.getTaskActivities(taskId);
      } else {
        activityData = await apiClient.getTeamActivities(teamId!);
      }

      setActivities(activityData);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load activity log");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredActivities = filterUser
    ? activities.filter((a) => a.userId === filterUser)
    : activities;

  const uniqueUsers = Array.from(
    new Map(
      activities.filter((a) => a.user).map((a) => [a.userId, a.user])
    ).values()
  );

  const getActionIcon = (action: string) => {
    const icons: Record<string, string> = {
      CREATE: "➕",
      UPDATE: "✏️",
      DELETE: "🗑️",
      STATUS_CHANGE: "🔄",
      ASSIGN: "👤",
      COMMENT: "💬",
    };
    return icons[action] || "📝";
  };

  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      CREATE: "text-green-600",
      UPDATE: "text-blue-600",
      DELETE: "text-red-600",
      STATUS_CHANGE: "text-purple-600",
      ASSIGN: "text-yellow-600",
      COMMENT: "text-indigo-600",
    };
    return colors[action] || "text-gray-600";
  };

  const formatDetails = (details: Record<string, any> | undefined) => {
    if (!details) return null;

    if (details.oldStatus && details.newStatus) {
      return `${details.oldStatus} → ${details.newStatus}`;
    }

    if (details.changes) {
      return Object.entries(details.changes)
        .map(([key, value]: [string, any]) => `${key}: ${value}`)
        .join(", ");
    }

    return JSON.stringify(details).substring(0, 100);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading activity log...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-4"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Activity Log</h1>
          {taskId && (
            <p className="text-gray-600 mt-2">Showing changes for task</p>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Filter */}
        {uniqueUsers.length > 0 && !taskId && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterUser(null)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filterUser === null
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:border-gray-400"
                }`}
              >
                All Users
              </button>
              {uniqueUsers.map((user: any) => (
                <button
                  key={user.id}
                  onClick={() => setFilterUser(user.id)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filterUser === user.id
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {user.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Activity Timeline */}
        {filteredActivities.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No activities
            </h3>
            <p className="text-gray-600">
              Activity will appear here as team members make changes
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gray-200"></div>

            {/* Timeline items */}
            <div className="space-y-6">
              {filteredActivities.map((activity) => (
                <div key={activity.id} className="relative flex gap-4">
                  {/* Timeline dot */}
                  <div className="absolute left-4 top-2 w-9 h-9 bg-white border-4 border-blue-600 rounded-full flex items-center justify-center text-lg">
                    {getActionIcon(activity.action)}
                  </div>

                  {/* Content */}
                  <div className="ml-16 bg-white p-6 rounded-lg shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`text-lg font-semibold ${getActionColor(
                              activity.action
                            )}`}
                          >
                            {activity.action.replace(/_/g, " ")}
                          </span>
                          {activity.task && (
                            <span className="text-sm text-gray-600">
                              ·{" "}
                              <span className="font-medium">
                                {activity.task.title}
                              </span>
                            </span>
                          )}
                        </div>

                        {activity.user && (
                          <p className="text-sm text-gray-600 mb-2">
                            by{" "}
                            <span className="font-medium">
                              {activity.user.name}
                            </span>
                          </p>
                        )}

                        {activity.details && (
                          <div className="mt-2 p-3 bg-gray-50 rounded text-sm text-gray-700 font-mono">
                            {formatDetails(activity.details)}
                          </div>
                        )}
                      </div>

                      <div className="text-right ml-4">
                        <p className="text-sm text-gray-600 whitespace-nowrap">
                          {new Date(activity.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLogPage;
