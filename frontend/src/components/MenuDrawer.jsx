import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowUpRight, Cpu, Shield, Zap, Sparkles } from 'lucide-react';
import './MenuDrawer.css';

export default function MenuDrawer({ isOpen, onClose, onSelectSection }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <motion.div
            className="menu-drawer-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header */}
            <div className="drawer-header">
              <span className="drawer-title">System Navigation</span>
              <button className="drawer-close-btn" onClick={onClose} aria-label="Close Menu">
                <X size={18} />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="drawer-links">
              <a
                href="#hero"
                className="drawer-link-item"
                onClick={() => {
                  onSelectSection('hero');
                  onClose();
                }}
              >
                <span className="link-number">01</span>
                <span className="link-text">Home</span>
                <ArrowUpRight size={18} className="link-arrow" />
              </a>

              <a
                href="#dashboard"
                className="drawer-link-item"
                onClick={() => {
                  onSelectSection('dashboard');
                  onClose();
                }}
              >
                <span className="link-number">02</span>
                <span className="link-text">Dashboard</span>
                <ArrowUpRight size={18} className="link-arrow" />
              </a>
            </div>

            {/* Feature Cards Grid inside Menu */}
            <div className="drawer-features">
              <div className="mini-card">
                <Zap size={20} className="mini-card-icon" />
                <h4>Tier Routing</h4>
                <p>Tier 1 (local) → Tier 2 (local) → Tier 3 (Gemini frontier)</p>
              </div>

              <div className="mini-card">
                <Shield size={20} className="mini-card-icon" />
                <h4>Semantic Cache</h4>
                <p>Rewording-aware cache — similar queries served instantly at $0</p>
              </div>
            </div>

            {/* Drawer Footer CTA */}
            <div className="drawer-footer">
              <div className="system-health">
                <span className="health-dot" />
                <span>Router Engine Active · Live</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
