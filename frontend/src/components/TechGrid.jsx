import React from 'react';
import { motion } from 'motion/react';
import { Cpu, Shield, Zap, Layers, Sparkles, ArrowUpRight } from 'lucide-react';
import './TechGrid.css';

const TECH_ITEMS = [
  {
    id: 1,
    icon: Cpu,
    title: 'Neuromorphic Core v4',
    subtitle: 'Sub-nanometer Architecture',
    desc: '3.2 Billion synaptic interconnects processing neural vectors with zero thermal throttling.',
    badge: '3.2 GHz',
  },
  {
    id: 2,
    icon: Shield,
    title: 'Post-Quantum Lattice',
    subtitle: 'Lattice-Based Encryption',
    desc: 'Military-grade cryptographic shield protecting real-time biometric and neural telemetry.',
    badge: 'AES-512',
  },
  {
    id: 3,
    icon: Zap,
    title: 'Zero Latency Sync',
    subtitle: 'Sub-Millisecond Pipeline',
    desc: 'Direct memory-bus integration achieving under 0.4ms neural signal routing latency.',
    badge: '< 0.4 ms',
  },
  {
    id: 4,
    icon: Layers,
    title: 'Adaptive Cybernetics',
    subtitle: 'Self-Optimizing Mesh',
    desc: 'Continuous real-time calibration learning user intent and workload patterns automatically.',
    badge: 'AI Mesh',
  },
];

export default function TechGrid() {
  return (
    <section className="tech-section" id="specs">
      <div className="tech-container">
        {/* Section Header */}
        <div className="tech-header">
          <div>
            <div className="section-badge">
              <Sparkles size={12} className="badge-sparkle" />
              <span>Bionic Architecture</span>
            </div>
            <h2 className="tech-title font-light tracking-tight">
              Engineered Beyond Human Limits
            </h2>
          </div>
          <p className="tech-desc">
            NeuralKinetics integrates advanced neuromorphic silicon with self-correcting AI models to deliver zero-compromise performance worldwide.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="tech-grid">
          {TECH_ITEMS.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                className="tech-card"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="card-top">
                  <div className="card-icon-box">
                    <Icon size={22} className="card-icon" />
                  </div>
                  <span className="card-badge">{item.badge}</span>
                </div>

                <div className="card-body">
                  <span className="card-subtitle">{item.subtitle}</span>
                  <h3 className="card-title">{item.title}</h3>
                  <p className="card-desc">{item.desc}</p>
                </div>

                <div className="card-footer">
                  <span className="learn-more">Explore Spec</span>
                  <ArrowUpRight size={14} className="card-arrow" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
