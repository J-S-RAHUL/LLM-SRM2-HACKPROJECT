# 🧠 LLM Cost Router

> **Route every query to the cheapest model that can answer it confidently — with proof.**

A quality-guaranteed LLM cost router that combines **3-tier routing**, **semantic caching**, **confidence-based escalation**, and a **live React dashboard** — all running at $0 actual cost.

---

## ✨ How It Works

```
User Query
    │
    ▼
┌─────────────────────────────────────────────┐
│  1. Semantic Cache Check                     │
│     Vector similarity search — if a similar  │
│     question was asked before, return the    │
│     cached answer instantly. Cost = $0.      │
└────────────────────┬────────────────────────┘
                     │ cache miss
                     ▼
┌─────────────────────────────────────────────┐
│  2. Classifier                               │
│     Heuristic scorer → easy / medium / hard  │
│     Assigns starting tier based on query     │
│     length, keywords, and pattern matching.  │
└────────────────────┬────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────┐
│  3. Ask Assigned Tier                        │
│     Tier 1 → llama3.2:1b  (local, free)     │
│     Tier 2 → llama3.2:3b  (local, free)     │
│     Tier 3 → Gemini Flash  (free API tier)  │
└────────────────────┬────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────┐
│  4. Confidence Gate                          │
│     Self-reported confidence + hedge-language│
│     detection ("I'm not sure", "might be"…) │
│                                              │
│     ✅ Confident enough → return answer      │
│     ❌ Not confident   → escalate ↑ to next │
│                           tier and repeat    │
└────────────────────┬────────────────────────┘
                     │
                     ▼
          Store in cache, log to audit trail, return
```

---

## 🏗️ Architecture

| Tier | Model | Cost | Purpose |
|------|-------|------|---------|
| **Tier 1** | `llama3.2:1b` via Ollama | $0 (local) | Fast, cheap — handles easy/factual queries |
| **Tier 2** | `llama3.2:3b` via Ollama | $0 (local) | Balanced — handles moderate reasoning |
| **Tier 3** | `gemini-flash` (free API) | $0 (free tier) | Frontier — escalation target for hard queries |

**Baseline comparison:** The dashboard also tracks what the same traffic would cost if *every* request went to a paid GPT-4/Claude-class frontier model — that's the real-world cost saving being demonstrated.

---

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- [Ollama](https://ollama.com/download) installed and running
- Free [Gemini API key](https://aistudio.google.com/app/apikey) (no credit card)

---

### 1. Pull local models via Ollama

```bash
ollama pull llama3.2:1b
ollama pull llama3.2:3b
ollama serve       # leave this running
```

### 2. Set up the backend

```bash
cd cost-router

# Create and activate virtual environment
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# → Open .env and paste your Gemini API key into GEMINI_API_KEY
```

### 3. Run the backend

```bash
uvicorn app.main:app --reload --port 8000
```

API is now live at **http://localhost:8000**

---

### 4. Set up and run the frontend

```bash
cd ../frontend
npm install
npm run dev
```

Dashboard is now live at **http://localhost:5173**

---

## 🖥️ Dashboard Features

The React frontend connects to all backend endpoints and provides:

| Tab | What it does |
|-----|-------------|
| **Query Router** | Chat interface — send a query, see which tier answered, why it was routed there, confidence score, cost saved, and classifier reasoning |
| **Stats** | Live cost savings overview — total requests, cache hits, escalations, actual vs baseline costs, tier distribution |
| **Audit Log** | Full table of every request with tier, confidence, latency, cost, escalation and cache flags |
| **Model Workload** | Per-model breakdown — requests, average latency, average confidence, total cost |
| **Benchmark** | Run the 19-question benchmark — router accuracy vs always-frontier accuracy, side by side with costs |

---

## 📁 Project Structure

```
cost-router/                  ← repo root
├── .gitignore
├── README.md                 ← you are here
│
├── cost-router/              ← FastAPI backend
│   ├── .env.example          ← copy to .env and fill in your key
│   ├── requirements.txt
│   ├── app/
│   │   ├── main.py           ← FastAPI app + all endpoints
│   │   ├── router.py         ← core pipeline (classify → call → gate → escalate)
│   │   ├── classifier.py     ← heuristic difficulty classifier (transparent, explainable)
│   │   ├── confidence.py     ← confidence gate: self-report + hedge-language detection
│   │   ├── cache.py          ← semantic cache (catches reworded duplicate questions)
│   │   ├── cost.py           ← cost estimation helpers
│   │   ├── benchmark.py      ← 19-question benchmark, router vs always-frontier baseline
│   │   ├── config.py         ← settings from .env with sane defaults
│   │   ├── models.py         ← Pydantic request/response models
│   │   └── providers/
│   │       ├── ollama_client.py   ← Tier 1 / Tier 2 (local Ollama)
│   │       └── gemini_client.py   ← Tier 3 (Gemini free API)
│   └── static/
│       └── dashboard.html    ← original lightweight HTML dashboard
│
└── frontend/                 ← React + Vite dashboard
    ├── src/
    │   ├── App.jsx
    │   ├── components/
    │   │   ├── Dashboard.jsx       ← all 5 backend-wired tabs
    │   │   ├── Navbar.jsx
    │   │   ├── HeroVideo.jsx
    │   │   ├── HeroFooter.jsx
    │   │   ├── MenuDrawer.jsx
    │   │   └── FeaturesModal.jsx
    │   └── index.css               ← design tokens (black & white theme)
    └── vite.config.js
```

---

## 🔌 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/ask` | Route a query through the cost router |
| `GET` | `/stats` | Cost savings summary statistics |
| `GET` | `/audit-log?limit=50` | Recent request audit log |
| `GET` | `/models` | Per-model workload breakdown |
| `POST` | `/benchmark/run` | Run the 19-question benchmark |
| `GET` | `/health` | Health check |

### POST `/ask`

**Request:**
```json
{ "query": "What is the capital of France?" }
```

**Response:**
```json
{
  "query": "What is the capital of France?",
  "answer": "The capital of France is Paris.",
  "tier_used": "tier1",
  "escalated_from": null,
  "escalation_reason": null,
  "confidence": 0.85,
  "cache_hit": false,
  "cost_usd": 0.0,
  "baseline_cost_usd": 0.00042,
  "latency_ms": 312,
  "classifier_reasoning": "score=-2.0 -> easy (matches a simple factual-question pattern)"
}
```

---

## ⚙️ Configuration

All settings are in `cost-router/.env` (copy from `.env.example`):

```env
GEMINI_API_KEY=your_free_gemini_key_here

OLLAMA_HOST=http://localhost:11434
TIER1_MODEL=llama3.2:1b
TIER2_MODEL=llama3.2:3b
TIER3_MODEL=gemini-1.5-flash

# Confidence below this → escalate to next tier
CONFIDENCE_THRESHOLD=0.65

# Vector similarity above this → serve from cache
CACHE_SIMILARITY_THRESHOLD=0.85
```

---

## 🧪 How the Classifier Works

The classifier uses a **transparent heuristic score** (not a black-box model):

| Signal | Effect on score |
|--------|----------------|
| Query word count | `+min(words/12, 3)` |
| Hard keywords (`prove`, `implement`, `debug`, `algorithm`…) | **+3** |
| Medium keywords (`explain`, `compare`, `summarize`…) | **+1.2** |
| Multiple sub-questions (`?` count or `and`/`;`) | **+1** |
| Simple factual patterns (`who is`, `what is N+N`, `define`)  | **−2.5** |

**Score → Tier:** `≤1.0` → Tier 1 · `≤3.0` → Tier 2 · `>3.0` → Tier 3

Every routing decision is stored in the audit log with the full score and reason.

---

## 💡 Demo Script

1. **Easy query** → Ask `"What is the capital of France?"` — lands on Tier 1, instant, $0
2. **Hard query** → Ask `"Design a rate limiter for 10,000 req/s with trade-offs"` — lands on Tier 3, see the reasoning
3. **Cache hit** → Ask `"France capital city?"` — semantic match (0.89 similarity), served instantly at $0, no model called
4. **Benchmark** → Click "Run Benchmark" — see router accuracy vs always-frontier baseline with costs side by side

---

## 📄 License

MIT

---

> **Total cost to run this: $0.** Local models via Ollama are free. Gemini free tier requires no credit card. The cost numbers in the dashboard are simulated production-equivalent prices showing what the same traffic *would* cost on paid plans — the actual spend building and demoing this is zero.
