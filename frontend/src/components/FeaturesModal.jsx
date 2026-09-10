import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, ArrowRight, ShieldCheck, Zap, Globe, Cpu } from 'lucide-react';
import './FeaturesModal.css';

export default function FeaturesModal({ isOpen, onClose, mode }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-root">
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="modal-card"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="modal-header">
              <div>
                <span className="modal-tag">
                  {mode === 'features' ? 'Cost Router Capabilities' : 'System Architecture'}
                </span>
                <h3 className="modal-title font-light">
                  {mode === 'features' ? 'Intelligent Routing. Guaranteed Quality.' : 'How the Cost Router Works'}
                </h3>
              </div>
              <button className="modal-close" onClick={onClose} aria-label="Close Modal">
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              {mode === 'features' ? (
                <div className="features-list">
                  <div className="feature-row">
                    <div className="icon-badge"><Zap size={18} /></div>
                    <div>
                      <h4>3-Tier Cost Routing</h4>
                      <p>Queries are classified as easy / medium / hard and routed to the cheapest tier that can answer confidently — Tier 1 (local Ollama), Tier 2 (local Ollama), or Tier 3 (Gemini).</p>
                    </div>
                  </div>

                  <div className="feature-row">
                    <div className="icon-badge"><Cpu size={18} /></div>
                    <div>
                      <h4>Semantic Cache</h4>
                      <p>Rewording-aware vector cache catches similar queries before any model is called — serving at $0 cost with a configurable similarity threshold.</p>
                    </div>
                  </div>

                  <div className="feature-row">
                    <div className="icon-badge"><ShieldCheck size={18} /></div>
                    <div>
                      <h4>Confidence Escalation</h4>
                      <p>If a model's self-reported confidence + hedge-language score falls below the threshold, the query is automatically escalated to the next tier — ensuring quality is never sacrificed.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="how-it-works-steps">
                  <div className="step-box">
                    <span className="step-num">01</span>
                    <h4>Classify Query Difficulty</h4>
                    <p>A fast local classifier labels the query as easy, medium, or hard to pick the starting tier.</p>
                  </div>

                  <div className="step-box">
                    <span className="step-num">02</span>
                    <h4>Semantic Cache Check</h4>
                    <p>Vector similarity search catches rewording of cached queries — zero model cost.</p>
                  </div>

                  <div className="step-box">
                    <span className="step-num">03</span>
                    <h4>Confidence Gate &amp; Escalation</h4>
                    <p>If the answer's confidence is too low, the router escalates to the next tier automatically — guaranteeing quality.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="modal-cta-btn" onClick={onClose}>
                <span>Get Started Now</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
