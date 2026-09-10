import React from 'react';
import { motion } from 'motion/react';
import { Plus, Grid, Sun, Moon } from 'lucide-react';
import './Navbar.css';

export default function Navbar({ onToggleMenu, theme, onToggleTheme }) {
  return (
    <motion.nav
      className="navbar"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Left Block */}
      <div className="nav-left">
        {/* Brand Logo */}
        <a href="#hero" className="brand-logo" aria-label="Cost Router Home">
          <svg className="logo-svg" viewBox="0 0 40 40" fill="none">
            <g transform="rotate(-35 20 20)">
              <rect x="6" y="14" width="16" height="24" rx="4" fill="var(--logo-fill)" />
              <rect x="18" y="2" width="16" height="24" rx="4" fill="var(--accent-cyan)" opacity="0.8" />
            </g>
          </svg>
          <span className="brand-text">Cost Router</span>
        </a>

        {/* Menu Button */}
        <button className="menu-btn" onClick={onToggleMenu} aria-label="Toggle Navigation Menu">
          <span className="plus-circle">
            <Plus size={13} strokeWidth={3} className="plus-icon" />
          </span>
          <span className="menu-text">Menu</span>
        </button>

        {/* Tags Pill */}
        <div className="tags-pill">
          <span className="tag-label">Tier 1 · Tier 2 · Tier 3</span>
          <span className="tag-divider">•</span>
          <span className="tag-label">Semantic Cache</span>
        </div>
      </div>

      {/* Right Block */}
      <div className="nav-right">
        {/* System Status Pill */}
        <div className="status-pill">
          <span className="live-radar-dot" />
          <span className="status-label">Router Active</span>
          <span className="status-latency font-mono">Live</span>
        </div>

        {/* Theme Switcher Toggle */}
        <button
          className="theme-toggle-btn"
          onClick={onToggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? (
            <Sun size={15} className="theme-icon" />
          ) : (
            <Moon size={15} className="theme-icon" />
          )}
        </button>
      </div>
    </motion.nav>
  );
}
