import React from "react";
import ChatBoxClean from "../components/ChatBoxClean";
import ArtGenerator from "../components/ArtGenerator";
import AudioGenerator from "../components/AudioGenerator";
import BrainCanvas from "../components/BrainCanvas";
import MindMapBuilder from "../components/MindMapBuilder";

const ToolHeading = ({ number, title, description, id }) => (
  <div className="tool-heading" id={id}>
    <span className="tool-number">{number}</span>
    <div><h2>{title}</h2><p>{description}</p></div>
  </div>
);

const Home = () => (
  <div className="studio-page">
    <section className="welcome-banner">
      <div className="welcome-copy">
        <div className="eyebrow"><span className="eyebrow-line"/> YOUR CREATIVE STUDIO</div>
        <h1>Make room for<br/><span>big ideas.</span></h1>
        <p>Think, create, and bring your next idea to life with a little help from AI.</p>
        <a className="welcome-action" href="#tools">Explore your tools <span aria-hidden="true">↓</span></a>
      </div>
      <div className="welcome-art" aria-hidden="true">
        <div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="orbit-core"><span>m</span></div>
        <span className="orbit-dot dot-a"/><span className="orbit-dot dot-b"/><span className="orbit-dot dot-c"/>
        <div className="orbit-note note-one">IDEAS</div><div className="orbit-note note-two">CREATE</div>
      </div>
      <div className="banner-foot"><span>01 — 05</span><span>YOUR TOOLS, READY WHEN YOU ARE</span></div>
    </section>

    <div className="section-intro" id="tools"><div><div className="eyebrow">THE TOOLKIT</div><h2>Choose a starting point</h2></div><p>Pick a tool and follow your curiosity.</p></div>

    <section className="tool-grid" aria-label="Creative tools">
      <article className="tool-card chat-card"><ToolHeading number="01" title="AI conversation" description="Work through a thought, question, or rough idea." id="chat"/><ChatBoxClean/></article>
      <article className="tool-card art-card"><ToolHeading number="02" title="Image studio" description="Turn a description into a one-of-a-kind image." id="art"/><ArtGenerator/></article>
      <article className="tool-card audio-card"><ToolHeading number="03" title="Audio maker" description="Shape a script or idea into spoken audio." id="audio"/><AudioGenerator/></article>
      <article className="tool-card canvas-card"><ToolHeading number="04" title="Open canvas" description="Sketch freely, gather notes, and map out your thinking." id="canvas"/><BrainCanvas/></article>
    </section>

    <section className="mindmap-section">
      <div className="mindmap-header"><div><div className="eyebrow">VISUAL THINKING</div><h2>Build a mind map</h2><p>Turn a topic into a connected map of ideas and possibilities.</p></div><span className="mindmap-index">05 / MIND MAP</span></div>
      <div className="mindmap-frame"><MindMapBuilder/></div>
    </section>
    <footer className="studio-footer"><span>MindSpace</span><span>A little space to think out loud.</span></footer>
  </div>
);

export default Home;
