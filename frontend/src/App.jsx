import React, { useState } from "react";
import { BrowserRouter, Routes, Route, NavLink, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import StudioPage from "./pages/StudioPage";
import Explore from "./pages/Explore";
import Creations from "./pages/Creations";
import Activity from "./pages/Activity";
import Workflows from "./pages/Workflows";
import Settings from "./pages/Settings";
import CreationsProvider from "./components/CreationsContext";
import { Icon } from "./components/Icon";

const navGroups = [
  { label: "Workspace", items: [{ to: "/", icon: "home", title: "Home" }, { to: "/explore", icon: "explore", title: "Explore" }, { to: "/creations", icon: "library", title: "My Creations" }, { to: "/activity", icon: "clock", title: "Recent Activity" }] },
  { label: "AI Studio", items: [{ to: "/studio/chat", icon: "chat", title: "AI Chat" }, { to: "/studio/image", icon: "image", title: "Image Studio" }, { to: "/studio/audio", icon: "audio", title: "Audio Studio" }, { to: "/studio/mindmap", icon: "map", title: "Mind Map Studio" }, { to: "/studio/canvas", icon: "canvas", title: "Idea Canvas" }] },
];

function AppShell() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const pageName = [...navGroups.flatMap((group) => group.items), { to: "/dashboard", title: "My Dashboard" }, { to: "/workflows", title: "Workflow Builder" }, { to: "/settings", title: "Settings & help" }].find((item) => item.to === location.pathname)?.title || ({
    "/studio/chat": "AI Chat",
    "/studio/image": "Image Studio",
    "/studio/audio": "Audio Studio",
    "/studio/mindmap": "Mind Map Studio",
    "/studio/canvas": "Idea Canvas",
  }[location.pathname] || "Mindpace");

  return <div className={`app-shell${collapsed ? " sidebar-collapsed" : ""}`}>
    {mobileOpen && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
    <aside className={`sidebar${mobileOpen ? " mobile-open" : ""}`}>
      <Link to="/" className="brand-lockup" onClick={() => setMobileOpen(false)}>
        <span className="brand-mark"><Icon name="sparkle" size={22}/></span>
        <span className="brand-name">Mindpace<span>YOUR CREATIVE SPACE</span></span>
      </Link>
      <button className="collapse-button" title={collapsed ? "Expand sidebar" : "Collapse sidebar"} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} onClick={() => setCollapsed(!collapsed)}><Icon name="panel"/></button>
      <nav className="sidebar-nav" aria-label="Main navigation">
        {navGroups.map((group) => <div className="nav-group" key={group.label}>
          <div className="nav-caption">{group.label}</div>
          {group.items.map((item) => <NavLink key={item.to} to={item.to} end={item.to === "/"} title={collapsed ? item.title : undefined} onClick={() => setMobileOpen(false)} className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}><Icon name={item.icon}/><span>{item.title}</span></NavLink>)}
        </div>)}
        <div className="nav-group">
          <div className="nav-caption">More</div>
          <NavLink to="/workflows" title={collapsed ? "Workflow Builder" : undefined} onClick={() => setMobileOpen(false)} className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}><Icon name="sparkle"/><span>Workflow Builder</span><span className="nav-soon">Preview</span></NavLink>
          <NavLink to="/dashboard" title={collapsed ? "My Dashboard" : undefined} onClick={() => setMobileOpen(false)} className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}><Icon name="chart"/><span>My Dashboard</span></NavLink>
        </div>
      </nav>
      <div className="sidebar-bottom">
        <NavLink to="/settings" title={collapsed ? "Settings & help" : undefined} onClick={() => setMobileOpen(false)} className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}><Icon name="settings"/><span>Settings & help</span></NavLink>
        <div className="profile-card"><div className="profile-avatar">M</div><div className="profile-copy"><strong>Local workspace</strong><span>No account connected</span></div><span className="profile-menu">···</span></div>
      </div>
    </aside>
    <div className="main-shell">
      <header className="topbar">
        <button className="mobile-menu" aria-label="Open navigation" onClick={() => setMobileOpen(true)}><Icon name="menu"/></button>
        <div className="breadcrumb"><Link to="/">Mindpace</Link><span className="crumb-divider">/</span><span className="crumb-current">{pageName}</span></div>
        <div className="topbar-right"><span className="workspace-status"><span className="online-dot"/> Workspace ready</span><Link className="topbar-avatar" to="/settings" title="Local workspace settings">M</Link></div>
      </header>
      <main className="page-content"><Routes>
        <Route path="/" element={<Home/>}/><Route path="/explore" element={<Explore/>}/><Route path="/creations" element={<Creations/>}/><Route path="/activity" element={<Activity/>}/><Route path="/studio/:tool" element={<StudioPage/>}/><Route path="/workflows" element={<Workflows/>}/><Route path="/dashboard" element={<Dashboard/>}/><Route path="/settings" element={<Settings/>}/><Route path="*" element={<Home/>}/>
      </Routes></main>
    </div>
  </div>;
}

const App = () => <BrowserRouter><CreationsProvider><AppShell/></CreationsProvider></BrowserRouter>;
export default App;
