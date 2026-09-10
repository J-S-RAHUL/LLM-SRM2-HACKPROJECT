import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import './HeroFooter.css';

const cubicEase = [0.16, 1, 0.3, 1];

export default function HeroFooter({ onSeeFeatures, onHowItWorks }) {
  return (
    <motion.footer
      className="hero-footer"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.0, delay: 0.5, ease: cubicEase }}
    >
      <div className="hero-footer-content">
        {/* Left Block */}
        <div className="footer-left">
          {/* Subtitle Line */}
          <motion.div
            className="subtitle-line"
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: cubicEase }}
          >
            <span className="subtitle-dot" />
            <span className="subtitle-text">Quality-guaranteed LLM cost routing</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            className="hero-heading font-light tracking-tight"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8, ease: cubicEase }}
          >
            Smarter LLMs,<br />Fraction of the Cost.
          </motion.h1>

          {/* Buttons */}
          <motion.div
            className="hero-actions"
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.0, ease: cubicEase }}
          >
            <button className="btn-primary" onClick={() => {
              const el = document.getElementById('dashboard');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}>
              <span>Open Dashboard</span>
              <ArrowUpRight size={14} className="btn-icon" />
            </button>
            <button className="btn-secondary" onClick={onHowItWorks}>
              <span>How It Works</span>
            </button>
          </motion.div>
        </div>

        {/* Right Block */}
        <motion.div
          className="footer-right"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1, ease: cubicEase }}
        >
          <div className="feature-tags-group">
            <span className="tag-pill">Tier Routing</span>
            <span className="tag-pill">Semantic Cache</span>
            <span className="tag-pill">Cost Savings</span>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}
