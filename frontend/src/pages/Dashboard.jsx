import React, { useState, useCallback } from "react";
import TaskList from "../components/TaskList";

const Dashboard = () => {
  const userId = "demo123"; // replace after login
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    active: 0,
    rate: 0,
  });

  const updateStats = useCallback((tasks) => {
    const completed = tasks.filter((t) => t.completed).length;
    const total = tasks.length;
    const active = total - completed;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    setStats({ total, completed, active, rate });
  }, []);

  const handleTasksChange = useCallback(
    (tasks) => {
      updateStats(tasks);
    },
    [updateStats]
  );
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-5xl font-bold mb-2 bg-linear-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
          📊 Productivity Dashboard
        </h1>
        <p className="text-gray-400">Stay organized and achieve your goals</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="card">
          <div className="text-3xl font-bold text-emerald-400">
            {stats.completed}
          </div>
          <p className="text-gray-400 text-sm mt-2">Tasks Completed</p>
        </div>
        <div className="card">
          <div className="text-3xl font-bold text-purple-400">
            {stats.active}
          </div>
          <p className="text-gray-400 text-sm mt-2">Active Tasks</p>
        </div>
        <div className="card">
          <div className="text-3xl font-bold text-pink-400">{stats.rate}%</div>
          <p className="text-gray-400 text-sm mt-2">Completion Rate</p>
        </div>
      </div>

      {/* Tasks Section */}
      <div className="card max-w-2xl mx-auto">
        <TaskList userId={userId} onTasksChange={handleTasksChange} />
      </div>
    </div>
  );
};

export default Dashboard;
