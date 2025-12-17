import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function Home() {
  return (
    <div className="landing-container">
      {/* 1. Navbar */}
      <nav className="navbar">
        <div className="logo">Fintech.AI</div>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/chat">Live Demo</Link>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <header className="hero">
        <div className="hero-content">
          <h1>
            Loan Approval in <br />
            <span className="highlight">Real-Time</span>
          </h1>
          <p>
            Experience the future of lending. No forms, no waiting. 
            Our Intelligent Orchestrator handles everything from KYC to Sanctioning instantly.
          </p>
          <Link to="/chat">
            <button className="cta-button">Launch Demo 🚀</button>
          </Link>
        </div>
        
        <div className="hero-image">
           💎
        </div>
      </header>

      {/* 3. Features Section */}
      <section className="features">
        <div className="feature-card">
          <div style={{fontSize: '3rem', marginBottom: '10px'}}>⚡</div>
          <h3>Instant Sanction</h3>
          <p>End-to-end approval in minutes, not days.</p>
        </div>
        <div className="feature-card">
          <div style={{fontSize: '3rem', marginBottom: '10px'}}>🧠</div>
          <h3>Intelligent Brain</h3>
          <p>Context-aware Master Agent manages the flow.</p>
        </div>
        <div className="feature-card">
          <div style={{fontSize: '3rem', marginBottom: '10px'}}>📄</div>
          <h3>Auto-Documentation</h3>
          <p>Instant PDF generation and verification.</p>
        </div>
      </section>
    </div>
  );
}

export default Home;