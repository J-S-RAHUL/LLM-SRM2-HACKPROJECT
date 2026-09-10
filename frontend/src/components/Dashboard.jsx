import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Send, Loader2, Zap, DollarSign, Shield, TrendingDown,
  ChevronRight, Cpu, RefreshCw, FlaskConical, BarChart3,
  List, MessageSquare, X, Copy, Check
} from 'lucide-react';
import './Dashboard.css';
import {
  simulateRoute,
  simulateGetStats,
  simulateGetAuditLog,
  simulateGetModelWorkload,
  simulateRunBenchmark
} from '../services/routerSimulator';

const API = window.location.port === '5173' ? 'http://localhost:8000' : '';
const HAS_BACKEND = Boolean(API);

const TIER_META = {
  tier1: { label: 'Tier 1', color: 'var(--accent-emerald)', bg: 'rgba(16,185,129,0.12)', desc: 'Fast / Cheap — Local Ollama' },
  tier2: { label: 'Tier 2', color: 'var(--accent-cyan)',    bg: 'rgba(56,189,248,0.12)',  desc: 'Balanced — Local Ollama' },
  tier3: { label: 'Tier 3', color: 'var(--accent-indigo)',  bg: 'rgba(129,140,248,0.12)', desc: 'Frontier — Gemini' },
};

function TierBadge({ tier }) {
  const m = TIER_META[tier] || { label: tier, color: 'var(--text-muted)', bg: 'var(--pill-bg)' };
  return (
    <span className="tier-badge" style={{ color: m.color, background: m.bg }}>
      {m.label}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <motion.div
      className="stat-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="stat-icon-box" style={{ background: `${color}18`, color }}>
        <Icon size={18} />
      </div>
      <div className="stat-body">
        <span className="stat-label">{label}</span>
        <span className="stat-value font-mono">{value}</span>
        {sub && <span className="stat-sub">{sub}</span>}
      </div>
    </motion.div>
  );
}

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <button className="copy-btn" onClick={handle} title="Copy answer">
      {copied ? <Check size={13} /> : <Copy size={13} />}
    </button>
  );
}

// ─────────────────────────────────────────
// Chat Panel
// ─────────────────────────────────────────
function ChatPanel({ onNewResult }) {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    const q = query.trim();
    if (!q || loading) return;
    setQuery('');
    setMessages(prev => [...prev, { role: 'user', text: q }]);
    setLoading(true);
    try {
      let data;
      try {
        if (!HAS_BACKEND) throw new Error('No backend configured');
        const res = await fetch(`${API}/ask`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: q }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        data = await res.json();
      } catch (err) {
        // Fallback to client-side router simulator
        data = await simulateRoute(q);
      }
      setMessages(prev => [...prev, { role: 'assistant', data }]);
      onNewResult(data);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'error', text: e.message }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <MessageSquare size={16} className="panel-icon" />
        <span>Query Router</span>
        <span className="panel-sub">Send a query — the router picks the cheapest tier that can answer confidently</span>
      </div>

      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="chat-empty">
            <Cpu size={32} className="empty-icon" />
            <p>Ask anything. The cost router will pick the optimal LLM tier.</p>
            <div className="example-queries">
              {["What is 2 + 2?", "Explain quantum entanglement", "Write a Python async REST client"].map(q => (
                <button key={q} className="example-chip" onClick={() => setQuery(q)}>{q}</button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <AnimatePresence key={i}>
            <motion.div
              className={`chat-msg ${msg.role}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {msg.role === 'user' && (
                <div className="msg-user">
                  <span className="msg-role-label">You</span>
                  <p>{msg.text}</p>
                </div>
              )}
              {msg.role === 'assistant' && (
                <div className="msg-assistant">
                  <div className="msg-assistant-header">
                    <span className="msg-role-label">Router</span>
                    <TierBadge tier={msg.data.tier_used} />
                    {msg.data.cache_hit && <span className="cache-badge">⚡ Cache Hit</span>}
                    {msg.data.escalated_from && (
                      <span className="escalation-badge">
                        ↑ Escalated from {TIER_META[msg.data.escalated_from]?.label || msg.data.escalated_from}
                      </span>
                    )}
                    <CopyBtn text={msg.data.answer} />
                  </div>
                  <p className="msg-answer">{msg.data.answer}</p>
                  <div className="msg-meta-row">
                    <span className="meta-chip">
                      <DollarSign size={11} /> ${msg.data.cost_usd.toFixed(6)}
                    </span>
                    <span className="meta-chip">
                      <Zap size={11} /> {msg.data.latency_ms}ms
                    </span>
                    <span className="meta-chip">
                      <Shield size={11} /> {(msg.data.confidence * 100).toFixed(0)}% conf.
                    </span>
                    <span className="meta-chip saved">
                      <TrendingDown size={11} /> saved ${(msg.data.baseline_cost_usd - msg.data.cost_usd).toFixed(6)}
                    </span>
                  </div>
                  {msg.data.classifier_reasoning && (
                    <details className="classifier-detail">
                      <summary>Classifier reasoning</summary>
                      <p>{msg.data.classifier_reasoning}</p>
                    </details>
                  )}
                  {msg.data.escalation_reason && (
                    <details className="classifier-detail escalation">
                      <summary>Escalation reason</summary>
                      <p>{msg.data.escalation_reason}</p>
                    </details>
                  )}
                </div>
              )}
              {msg.role === 'error' && (
                <div className="msg-error">
                  <X size={14} /> Error: {msg.text}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        ))}

        {loading && (
          <motion.div className="chat-loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Loader2 size={16} className="spin" />
            <span>Routing query…</span>
          </motion.div>
        )}
        <div ref={endRef} />
      </div>

      <div className="chat-input-row">
        <textarea
          id="chat-query-input"
          className="chat-input"
          placeholder="Ask anything — the router will choose the cheapest confident tier…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKey}
          rows={2}
          disabled={loading}
        />
        <button
          id="chat-send-btn"
          className="chat-send-btn"
          onClick={send}
          disabled={!query.trim() || loading}
        >
          {loading ? <Loader2 size={16} className="spin" /> : <Send size={16} />}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Stats Panel
// ─────────────────────────────────────────
function StatsPanel({ stats, loading, onRefresh }) {
  if (loading) return (
    <div className="panel-loading">
      <Loader2 size={20} className="spin" /> Loading stats…
    </div>
  );
  if (!stats) return null;

  const tierEntries = Object.entries(stats.tier_distribution || {});
  const total = stats.total_requests || 1;

  return (
    <div className="stats-panel">
      <div className="panel-header-row">
        <div className="panel-title-group">
          <BarChart3 size={16} className="panel-icon" />
          <span>Cost Savings Overview</span>
        </div>
        <button className="refresh-btn" onClick={onRefresh} title="Refresh">
          <RefreshCw size={14} />
        </button>
      </div>

      <div className="stats-grid">
        <StatCard icon={MessageSquare}  label="Total Requests"   value={stats.total_requests}                             color="var(--accent-cyan)"    />
        <StatCard icon={Zap}            label="Cache Hits"       value={stats.cache_hits}       sub={`${stats.total_requests > 0 ? ((stats.cache_hits/stats.total_requests)*100).toFixed(1) : 0}% of requests`} color="var(--accent-emerald)" />
        <StatCard icon={TrendingDown}   label="Escalations"      value={stats.escalation_count}                           color="var(--accent-amber)"   />
        <StatCard icon={DollarSign}     label="Total Cost"       value={`$${stats.total_cost_usd.toFixed(6)}`}            color="var(--accent-indigo)"  />
        <StatCard icon={Shield}         label="Baseline Cost"    value={`$${stats.baseline_cost_usd.toFixed(6)}`} sub="(always-frontier)"        color="var(--text-muted)"     />
        <StatCard icon={TrendingDown}   label="Savings"          value={`$${stats.savings_usd.toFixed(6)}`}    sub={`${stats.savings_pct.toFixed(1)}% saved`} color="var(--accent-emerald)" />
      </div>

      {tierEntries.length > 0 && (
        <div className="tier-distribution">
          <span className="dist-label">Tier Distribution</span>
          <div className="tier-bars">
            {tierEntries.map(([tier, count]) => {
              const m = TIER_META[tier] || {};
              const pct = ((count / total) * 100).toFixed(1);
              return (
                <div key={tier} className="tier-bar-row">
                  <TierBadge tier={tier} />
                  <div className="bar-track">
                    <motion.div
                      className="bar-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      style={{ background: m.color }}
                    />
                  </div>
                  <span className="bar-pct font-mono">{pct}%</span>
                  <span className="bar-count font-mono">({count})</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// Audit Log Panel
// ─────────────────────────────────────────
function AuditLogPanel({ entries, loading, onRefresh }) {
  return (
    <div className="audit-panel">
      <div className="panel-header-row">
        <div className="panel-title-group">
          <List size={16} className="panel-icon" />
          <span>Audit Log</span>
          <span className="panel-sub">{entries.length} recent entries</span>
        </div>
        <button className="refresh-btn" onClick={onRefresh} title="Refresh">
          <RefreshCw size={14} />
        </button>
      </div>

      {loading ? (
        <div className="panel-loading"><Loader2 size={20} className="spin" /> Loading…</div>
      ) : entries.length === 0 ? (
        <div className="panel-empty">No requests yet. Send a query above to get started.</div>
      ) : (
        <div className="audit-table-wrap">
          <table className="audit-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Query</th>
                <th>Tier</th>
                <th>Conf.</th>
                <th>Cost</th>
                <th>Latency</th>
                <th>Cache</th>
                <th>Escalated</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e, i) => (
                <motion.tr
                  key={e.id ?? i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  className="audit-row"
                >
                  <td className="font-mono text-dim">{e.id}</td>
                  <td className="audit-query" title={e.query}>{e.query}</td>
                  <td><TierBadge tier={e.tier_used} /></td>
                  <td className="font-mono">{(e.confidence * 100).toFixed(0)}%</td>
                  <td className="font-mono">${e.cost_usd.toFixed(6)}</td>
                  <td className="font-mono">{e.latency_ms}ms</td>
                  <td>
                    {e.cache_hit
                      ? <span className="cache-badge small">⚡ yes</span>
                      : <span className="no-badge">—</span>}
                  </td>
                  <td>
                    {e.escalated_from
                      ? <span className="escalation-badge small">↑ {TIER_META[e.escalated_from]?.label || e.escalated_from}</span>
                      : <span className="no-badge">—</span>}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// Model Workload Panel
// ─────────────────────────────────────────
function ModelWorkloadPanel({ data, loading, onRefresh }) {
  return (
    <div className="model-panel">
      <div className="panel-header-row">
        <div className="panel-title-group">
          <Cpu size={16} className="panel-icon" />
          <span>Model Workload</span>
        </div>
        <button className="refresh-btn" onClick={onRefresh} title="Refresh">
          <RefreshCw size={14} />
        </button>
      </div>

      {loading ? (
        <div className="panel-loading"><Loader2 size={20} className="spin" /> Loading…</div>
      ) : !data || data.models?.length === 0 ? (
        <div className="panel-empty">No model data yet.</div>
      ) : (
        <>
          <div className="workload-summary">
            <span className="font-mono">{data.total_model_requests} model calls</span>
            <span className="text-dim"> + </span>
            <span className="font-mono">{data.cache_hits} cache hits</span>
          </div>
          <div className="model-cards">
            {data.models.map((m, i) => (
              <motion.div
                key={m.model_name}
                className="model-card"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="model-card-top">
                  <TierBadge tier={m.tier} />
                  <span className="model-name font-mono">{m.model_name}</span>
                </div>
                <div className="model-stats">
                  <div className="model-stat">
                    <span className="ms-label">Requests</span>
                    <span className="ms-val font-mono">{m.requests} <span className="ms-pct">({m.pct_of_total}%)</span></span>
                  </div>
                  <div className="model-stat">
                    <span className="ms-label">Avg Latency</span>
                    <span className="ms-val font-mono">{m.avg_latency_ms}ms</span>
                  </div>
                  <div className="model-stat">
                    <span className="ms-label">Avg Confidence</span>
                    <span className="ms-val font-mono">{(m.avg_confidence * 100).toFixed(0)}%</span>
                  </div>
                  <div className="model-stat">
                    <span className="ms-label">Total Cost</span>
                    <span className="ms-val font-mono">${m.total_cost_usd.toFixed(6)}</span>
                  </div>
                </div>
                <div className="model-bar-track">
                  <motion.div
                    className="model-bar-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${m.pct_of_total}%` }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    style={{ background: TIER_META[m.tier]?.color || 'var(--accent-cyan)' }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// Benchmark Panel
// ─────────────────────────────────────────
function BenchmarkPanelComp() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const run = async () => {
    setLoading(true);
    setError(null);
    try {
      let data;
      try {
        if (!HAS_BACKEND) throw new Error('No backend configured');
        const res = await fetch(`${API}/benchmark/run`, { method: 'POST' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        data = await res.json();
      } catch (err) {
        // Fallback to client-side benchmark simulation
        const summary = await simulateRunBenchmark();
        data = {
          router_accuracy_pct: summary.router_accuracy,
          baseline_accuracy_pct: summary.frontier_accuracy,
          router_total_cost_usd: summary.total_router_cost_usd,
          baseline_total_cost_usd: summary.total_frontier_cost_usd,
          savings_pct: summary.cost_reduction_pct,
          rows: summary.results.map(r => ({
            question_id: r.id,
            question: r.query,
            difficulty: r.expected_tier === 'tier1' ? 'easy' : r.expected_tier === 'tier2' ? 'medium' : 'hard',
            router_tier: r.tier_used,
            router_correct: r.router_correct,
            router_cost_usd: r.router_cost_usd,
            baseline_correct: r.frontier_correct,
            baseline_cost_usd: r.frontier_cost_usd
          }))
        };
      }
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="benchmark-panel">
      <div className="panel-header-row">
        <div className="panel-title-group">
          <FlaskConical size={16} className="panel-icon" />
          <span>Benchmark</span>
          <span className="panel-sub">Router vs Always-Frontier comparison</span>
        </div>
        <button
          id="run-benchmark-btn"
          className="run-bench-btn"
          onClick={run}
          disabled={loading}
        >
          {loading ? <><Loader2 size={14} className="spin" /> Running…</> : <><FlaskConical size={14} /> Run Benchmark</>}
        </button>
      </div>

      {error && <div className="bench-error"><X size={14} /> {error}</div>}

      {result && !loading && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="bench-summary-cards">
            <div className="bench-card router">
              <span className="bench-card-label">Router Accuracy</span>
              <span className="bench-card-value font-mono">{result.router_accuracy_pct.toFixed(1)}%</span>
              <span className="bench-card-cost font-mono">${result.router_total_cost_usd.toFixed(6)}</span>
            </div>
            <div className="bench-card baseline">
              <span className="bench-card-label">Baseline Accuracy</span>
              <span className="bench-card-value font-mono">{result.baseline_accuracy_pct.toFixed(1)}%</span>
              <span className="bench-card-cost font-mono">${result.baseline_total_cost_usd.toFixed(6)}</span>
            </div>
            <div className="bench-card savings">
              <span className="bench-card-label">Cost Savings</span>
              <span className="bench-card-value font-mono">{result.savings_pct.toFixed(1)}%</span>
              <span className="bench-card-cost">vs always-frontier</span>
            </div>
          </div>

          <div className="bench-table-wrap">
            <table className="bench-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Question</th>
                  <th>Difficulty</th>
                  <th>Router Tier</th>
                  <th>Router ✓</th>
                  <th>Router $</th>
                  <th>Baseline ✓</th>
                  <th>Baseline $</th>
                </tr>
              </thead>
              <tbody>
                {result.rows.map((row) => (
                  <tr key={row.question_id} className="bench-row">
                    <td className="font-mono text-dim">{row.question_id}</td>
                    <td className="bench-q" title={row.question}>{row.question}</td>
                    <td>
                      <span className={`diff-badge ${row.difficulty}`}>{row.difficulty}</span>
                    </td>
                    <td><TierBadge tier={row.router_tier} /></td>
                    <td>{row.router_correct ? '✅' : '❌'}</td>
                    <td className="font-mono">${row.router_cost_usd.toFixed(6)}</td>
                    <td>{row.baseline_correct ? '✅' : '❌'}</td>
                    <td className="font-mono">${row.baseline_cost_usd.toFixed(6)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {!result && !loading && !error && (
        <div className="bench-placeholder">
          <FlaskConical size={36} className="empty-icon" />
          <p>Run the benchmark to compare the cost router against an always-frontier baseline across easy, medium, and hard questions.</p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// Main Dashboard Export
// ─────────────────────────────────────────
const TABS = [
  { id: 'chat',      icon: MessageSquare, label: 'Query Router' },
  { id: 'stats',     icon: BarChart3,     label: 'Stats' },
  { id: 'audit',     icon: List,          label: 'Audit Log' },
  { id: 'models',    icon: Cpu,           label: 'Model Workload' },
  { id: 'benchmark', icon: FlaskConical,  label: 'Benchmark' },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('chat');
  const [stats, setStats]         = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [auditLog, setAuditLog]   = useState([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const [modelData, setModelData] = useState(null);
  const [modelLoading, setModelLoading] = useState(false);

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      if (!HAS_BACKEND) throw new Error('No backend configured');
      const r = await fetch(`${API}/stats`);
      if (!r.ok) throw new Error();
      setStats(await r.json());
    } catch {
      setStats(simulateGetStats());
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchAudit = async () => {
    setAuditLoading(true);
    try {
      if (!HAS_BACKEND) throw new Error('No backend configured');
      const r = await fetch(`${API}/audit-log?limit=50`);
      if (!r.ok) throw new Error();
      setAuditLog(await r.json());
    } catch {
      setAuditLog(simulateGetAuditLog());
    } finally {
      setAuditLoading(false);
    }
  };

  const fetchModels = async () => {
    setModelLoading(true);
    try {
      if (!HAS_BACKEND) throw new Error('No backend configured');
      const r = await fetch(`${API}/models`);
      if (!r.ok) throw new Error();
      setModelData(await r.json());
    } catch {
      setModelData(simulateGetModelWorkload());
    } finally {
      setModelLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchAudit();
    fetchModels();
  }, []);

  const handleNewResult = () => {
    fetchStats();
    fetchAudit();
    fetchModels();
  };

  const handleTabChange = (id) => {
    setActiveTab(id);
    if (id === 'stats')  fetchStats();
    if (id === 'audit')  fetchAudit();
    if (id === 'models') fetchModels();
  };

  return (
    <section className="dashboard-section" id="dashboard">
      {/* Section Header */}
      <div className="dash-section-header">
        <div className="section-badge-db">
          <Zap size={12} />
          <span>Live Dashboard</span>
        </div>
        <h2 className="dash-section-title font-light tracking-tight">
          LLM Cost Router — Control Panel
        </h2>
        <p className="dash-section-desc">
          Query the router, inspect cost savings, audit every decision, compare model workloads, and run accuracy benchmarks — all from one place.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="dash-tabs">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              className={`dash-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => handleTabChange(tab.id)}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          className="dash-tab-content"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {activeTab === 'chat'      && <ChatPanel onNewResult={handleNewResult} />}
          {activeTab === 'stats'     && <StatsPanel stats={stats} loading={statsLoading} onRefresh={fetchStats} />}
          {activeTab === 'audit'     && <AuditLogPanel entries={auditLog} loading={auditLoading} onRefresh={fetchAudit} />}
          {activeTab === 'models'    && <ModelWorkloadPanel data={modelData} loading={modelLoading} onRefresh={fetchModels} />}
          {activeTab === 'benchmark' && <BenchmarkPanelComp />}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
