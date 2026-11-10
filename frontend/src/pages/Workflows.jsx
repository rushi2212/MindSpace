import React from "react";
import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";

const Workflows = () => <div className="page-wrap narrow-page">
  <div className="page-heading"><div><div className="eyebrow">AUTOMATION STUDIO</div><h1>Workflow Builder</h1><p>Connect ideas into repeatable, intelligent workflows.</p></div><span className="status-pill muted-pill">Not connected</span></div>
  <section className="feature-notice"><div className="notice-icon"><Icon name="sparkle" size={22}/></div><div><h2>Workflow execution isn’t part of this project yet</h2><p>The current app includes an AI mind map editor, but no workflow runner or automation engine. You can map out a process in the visual editor today; this page will become an automation builder when execution support is added.</p><Link className="button button-primary" to="/studio/mindmap">Open mind map studio <span>↗</span></Link></div></section>
  <div className="capability-grid"><div className="capability-card"><span className="capability-state state-live"/><strong>AI generated mind maps</strong><span>Available now</span></div><div className="capability-card"><span className="capability-state state-off"/><strong>Workflow triggers</strong><span>Not implemented</span></div><div className="capability-card"><span className="capability-state state-off"/><strong>Workflow runs</strong><span>Not implemented</span></div></div>
</div>;
export default Workflows;
