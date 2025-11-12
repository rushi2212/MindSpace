import React, { useEffect, useState, useCallback } from "react";
import { fetchTasks, addTask, toggleTask, deleteTask } from "../api/api";

const TaskList = ({ userId, onTasksChange }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(false);
  const effectiveUserId = userId || "guest";

  const loadTasks = useCallback(async () => {
    try {
      const res = await fetchTasks(effectiveUserId);
      setTasks(res.data);
      // Notify parent component about task changes for stats update
      if (onTasksChange) {
        onTasksChange(res.data);
      }
    } catch (e) {
      console.error("Failed to load tasks", e);
    }
  }, [effectiveUserId, onTasksChange]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleAdd = async () => {
    if (!newTask.trim()) return;
    setLoading(true);
    try {
      await addTask({ user_id: effectiveUserId, title: newTask });
      setNewTask("");
      loadTasks();
    } catch (e) {
      console.error("Failed to add task", e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleTask(id);
      loadTasks();
    } catch (e) {
      console.error("Failed to toggle task", e);
    }
  };

  const handleDelete = async (id, e) => {
    e?.stopPropagation();
    try {
      await deleteTask(id);
      loadTasks();
    } catch (e) {
      console.error("Failed to delete task", e);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const completionRate =
    tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-100 mb-2">📋 My Tasks</h2>
        <div className="flex justify-between items-center">
          <p className="text-gray-400 text-sm">{tasks.length} total tasks</p>
          <div className="flex gap-4 text-sm">
            <span className="text-emerald-400">
              ✓ {completedCount} completed
            </span>
            <span className="text-gray-400">{completionRate}% done</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {tasks.length > 0 && (
        <div className="w-full bg-slate-700/50 rounded-full h-2 mb-6 overflow-hidden">
          <div
            className="bg-linear-to-r from-emerald-500 to-green-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
      )}

      {/* Input Section */}
      <div className="flex gap-2 mb-6">
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={handleKeyPress}
          className="input-field flex-1"
          placeholder="Add a new task..."
          disabled={loading}
        />
        <button
          onClick={handleAdd}
          disabled={loading || !newTask.trim()}
          className="btn-success disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </div>

      {/* Tasks List */}
      <ul className="space-y-2">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>No tasks yet. Add one to get started! 🚀</p>
          </div>
        ) : (
          tasks.map((t) => (
            <li
              key={t.id}
              onClick={() => handleToggle(t.id)}
              className={`
                cursor-pointer p-4 rounded-lg transition-all duration-200 border
                flex items-center gap-3 group hover:shadow-lg
                ${
                  t.completed
                    ? "bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20"
                    : "bg-slate-700/30 border-slate-600/50 hover:bg-slate-700/50"
                }
              `}
            >
              <div
                className={`
                w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0
                ${
                  t.completed
                    ? "bg-emerald-500 border-emerald-500"
                    : "border-slate-500 group-hover:border-emerald-500"
                }
              `}
              >
                {t.completed && <span className="text-white text-sm">✓</span>}
              </div>
              <span
                className={`flex-1 transition-all ${
                  t.completed ? "line-through text-gray-500" : "text-gray-100"
                }`}
              >
                {t.title}
              </span>
              <div className="flex items-center gap-2">
                {t.completed && (
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded">
                    Done
                  </span>
                )}
                <button
                  aria-label="Delete task"
                  onClick={(e) => handleDelete(t.id, e)}
                  className="text-rose-400 hover:text-rose-300 transition-colors px-2 py-1"
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default TaskList;
