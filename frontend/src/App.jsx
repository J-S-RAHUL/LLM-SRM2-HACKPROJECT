import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroVideo from './components/HeroVideo';
import HeroFooter from './components/HeroFooter';
import MenuDrawer from './components/MenuDrawer';
import Dashboard from './components/Dashboard';
import FeaturesModal from './components/FeaturesModal';
import './App.css';

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [modalMode, setModalMode] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleSelectSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="app-main-wrapper">
      {/* ── Continuous ambient glow orbs — flow through the entire page ── */}
      <div className="ambient-glow-top" />
      <div className="ambient-glow-mid" />
      <div className="ambient-glow-bottom" />
      <div className="ambient-glow-left" />

      {/* FULL VIEWPORT HERO SECTION */}
      <section className="hero-viewport" id="hero">
        <Navbar
          onToggleMenu={() => setIsMenuOpen(true)}
          theme={theme}
          onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        />
        <HeroVideo />
        <HeroFooter
          onSeeFeatures={() => setModalMode('features')}
          onHowItWorks={() => setModalMode('how-it-works')}
        />
      </section>

      {/* ── Seamless section divider — no hard line ── */}
      <div className="section-blend" />

      {/* DASHBOARD — all backend features */}
      <Dashboard />

      {/* PAGE FOOTER */}
      <footer className="page-footer">
        <div className="page-footer-container">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="footer-logo-wrap">
                <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
                  <g transform="rotate(-35 20 20)">
                    <rect x="6" y="14" width="16" height="24" rx="4" fill="var(--logo-fill)" />
                    <rect x="18" y="2" width="16" height="24" rx="4" fill="var(--accent-cyan)" opacity="0.8" />
                  </g>
                </svg>
                <span className="footer-logo-text">Cost Router</span>
              </div>
              <p className="footer-tagline">
                Quality-guaranteed LLM cost router. Routes every query to the cheapest model that can answer confidently.
              </p>
            </div>

            <div className="footer-nav">
              <a href="#hero">Home</a>
              <a href="#dashboard">Dashboard</a>
              <a href="#" onClick={(e) => { e.preventDefault(); setModalMode('features'); }}>How It Works</a>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© 2026 Cost Router. Quality-guaranteed LLM routing.</span>
            <div className="system-status-chip">
              <span className="live-radar-dot" />
              <span className="font-mono">Router Engine · Active</span>
            </div>
          </div>
        </div>
      </footer>

      {/* INTERACTIVE DRAWERS & MODALS */}
      <MenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onSelectSection={handleSelectSection}
      />
      <FeaturesModal
        isOpen={modalMode !== null}
        onClose={() => setModalMode(null)}
        mode={modalMode}
      />
    </div>
  );
}
