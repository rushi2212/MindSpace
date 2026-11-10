import React from "react";
import { BrowserRouter, Routes, Route, NavLink, Link } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

const Icon = ({ name }) => {
  const paths = {
    home: <><path d="m3 10 9-7 9 7"/><path d="M5 9v11h14V9M9 20v-6h6v6"/></>,
    chart: <><path d="M4 19V5M4 19h17"/><path d="m7 15 4-4 3 2 6-7"/></>,
    sparkle: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z"/><path d="m19 14 1.2 2.8L23 18l-2.8 1.2L19 22l-1.2-2.8L15 18l2.8-1.2L19 14Z"/></>,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
};

const App = () => (
  <BrowserRouter>
    <div className="app-shell">
      <aside className="sidebar">
        <Link to="/" className="brand-lockup">
          <span className="brand-mark"><Icon name="sparkle" /></span>
          <span className="brand-name">MindSpace<span>CREATIVE WORKSPACE</span></span>
        </Link>
        <div className="nav-caption">WORKSPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}><Icon name="home"/><span>Creative studio</span></NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}><Icon name="chart"/><span>My dashboard</span></NavLink>
        </nav>
        <div className="sidebar-bottom"><span className="online-dot"/>Your ideas, in one place</div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumb"><span>MindSpace</span><span className="crumb-divider">/</span><span className="crumb-current">Workspace</span></div>
          <div className="topbar-status"><span className="online-dot"/>AI workspace</div>
        </header>
        <main className="page-content">
          <Routes><Route path="/" element={<Home />} /><Route path="/dashboard" element={<Dashboard />} /></Routes>
        </main>
      </div>
    </div>
  </BrowserRouter>
);

export default App;
