import React, { useCallback, useState } from "react";
import TaskList from "../components/TaskList";
import { Icon } from "../components/Icon";

const Dashboard = () => {
  const userId = "demo123";
  const [stats, setStats] = useState({ total: 0, completed: 0, active: 0, rate: 0 });
  const updateStats = useCallback((tasks) => {
    const completed = tasks.filter((task) => task.completed).length;
    const total = tasks.length;
    setStats({ total, completed, active: total - completed, rate: total ? Math.round((completed / total) * 100) : 0 });
  }, []);
  const handleTasksChange = useCallback((tasks) => updateStats(tasks), [updateStats]);
  return <div className="page-wrap dashboard-page">
    <header className="page-heading"><div><div className="eyebrow">A GENTLE PLAN FOR WHAT’S NEXT</div><h1>My Dashboard</h1><p>Keep your tasks moving while your ideas take shape.</p></div><span className="dashboard-date">{new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</span></header>
    <div className="stat-grid"><article className="stat-card"><span className="stat-icon stat-violet"><Icon name="library"/></span><span className="stat-value">{stats.total}</span><span className="stat-label">Total tasks</span></article><article className="stat-card"><span className="stat-icon stat-cyan"><Icon name="sparkle"/></span><span className="stat-value">{stats.active}</span><span className="stat-label">Still in motion</span></article><article className="stat-card"><span className="stat-icon stat-green"><Icon name="chart"/></span><span className="stat-value">{stats.rate}<small>%</small></span><span className="stat-label">Completion rate</span></article></div>
    <section className="dashboard-task-panel"><div className="section-heading compact-heading"><div><div className="eyebrow">YOUR TASKS</div><h2>Make a little progress</h2></div><span className="task-count-pill">{stats.completed} of {stats.total} complete</span></div><TaskList userId={userId} onTasksChange={handleTasksChange}/></section>
    <div className="dashboard-note"><Icon name="help" size={16}/><span>Tasks are stored by the existing backend under the demo workspace identifier. This project does not have sign-in yet.</span></div>
  </div>;
};
export default Dashboard;
