import React from 'react';
import { motion } from 'motion/react';
import './MetricsBar.css';

export default function MetricsBar() {
  const metrics = [
    { label: 'Neural Processing Rate', value: '4.8 PFLOPS', detail: 'Sub-millisecond Vector Calculations' },
    { label: 'Active Quantum Nodes', value: '14,280', detail: 'Distributed Worldwide' },
    { label: 'System Uptime SLA', value: '99.999%', detail: 'Zero Unscheduled Downtime' },
    { label: 'Global Latency', value: '0.38 ms', detail: 'Edge Micro-Data Center Sync' },
  ];

  return (
    <section className="metrics-section" id="metrics">
      <div className="metrics-container">
        <div className="metrics-grid">
          {metrics.map((m, i) => (
            <motion.div
              key={i}
              className="metric-box"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="metric-val font-light">{m.value}</span>
              <span className="metric-label">{m.label}</span>
              <span className="metric-sub">{m.detail}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
