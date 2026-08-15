# Secure AI Career Command Center

> **"A secure, explainable and stress-tested multi-agent career decision intelligence platform."**

[![Phase](https://img.shields.io/badge/Phase-1%20Complete-green)]() [![License](https://img.shields.io/badge/License-MIT-blue)]()

---

## Problem

Students and early-career professionals face critical career decisions with:
- Incomplete market information
- No structured self-assessment
- Recommendations that are never challenged
- No way to know if a recommendation survives uncertainty

## Solution

A **multi-agent career intelligence system** that implements the **"Generate → Verify → Challenge → Stress-Test → Decide"** pipeline.

Not a chatbot. Not a generic recommender. A system where every recommendation is **adversarially challenged**, **evidence-verified**, and **mathematically scored** before it reaches the user.

---

## Five Core Pillars

| Pillar | Description |
|--------|-------------|
| Multi-Agent Intelligence | 9 specialized agents with independent reasoning |
| Adversarial Stress Testing | Every recommendation challenged before acceptance |
| Evidence Verification | Every claim traced to source + date + confidence |
| Explainable Decision Making | User always knows *why* a recommendation was made |
| Adaptive Career Planning | Recommendations update as profile and market change |

---

## Architecture

```
User Profile
    ↓
[Phase 1] Profile Agent
    ↓
[Phase 2, Parallel] Career Agent | Skill Gap Agent | Market Agent | Risk Agent
    ↓
[Phase 3] Learning Roadmap Agent
    ↓
[Phase 4] Adversarial Stress-Test Agent ← Core Innovation
    ↓
[Phase 5] Evidence Verification Agent
    ↓
[Phase 6] Career Comparison Agent
    ↓
[Phase 7] Orchestrator → Final CareerDecision
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + TailwindCSS v3 |
| Backend | Node.js + Express |
| Agent Service | Python FastAPI |
| Database | PostgreSQL + pgvector (RAG) |
| ORM | Prisma |
| AI | Gemini (primary) → OpenAI (fallback) → Demo (offline) |
| Auth | JWT (access + refresh) + bcrypt |

---

## Quick Start

### Prerequisites
- Docker + Docker Compose
- Node.js 20+
- Python 3.11+

### 1. Clone and configure

```bash
git clone <repo>
cd career-command-center
cp .env.example .env
# Edit .env — minimum required: JWT_ACCESS_SECRET, JWT_REFRESH_SECRET
```

### 2. Start database

```bash
docker-compose up postgres -d
```

### 3. Set up backend

```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run dev
```

### 4. Set up agent service

```bash
cd agents
python -m venv venv
# Windows: venv\Scripts\activate
# Linux/Mac: source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python -m uvicorn main:app --reload --port 8000
```

### 5. Set up frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Visit: http://localhost:5173

---

## Demo Mode

The system runs fully **without any API keys** in Demo Mode.

All analysis uses synthetic, clearly labeled data. A persistent banner reads:
> ⚠ Demo Mode — Synthetic data. Not live AI or real market intelligence.

To enable real AI: add `GEMINI_API_KEY` to `.env`.

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `JWT_ACCESS_SECRET` | ✅ | Min 32 chars random secret |
| `JWT_REFRESH_SECRET` | ✅ | Min 32 chars random secret (different) |
| `GEMINI_API_KEY` | ❌ | Enable real AI analysis |
| `OPENAI_API_KEY` | ❌ | OpenAI fallback |
| `DEMO_MODE` | ❌ | true/false (default: true) |

---

## Scoring System

All scores are **system-generated decision-support metrics**. Not scientific probability assessments.

```
CareerSuitability = 0.25×SkillMatch + 0.20×InterestMatch + 0.15×GoalMatch
                  + 0.20×MarketOpportunity + 0.10×LearningFeasibility
                  + 0.10×ExperienceAlignment

StressAdjustedScore = CareerSuitability - Σ(adversarial_scenario_deltas)

OverallConfidence = 0.35×StressAdjusted + 0.25×(100-Risk) 
                  + 0.25×Robustness + 0.10×Stability
                  + 0.05×EvidenceCoverage
```

---

## Running Tests

```bash
cd backend
npm test              # All tests
npm run test:unit     # Unit tests only
npm run test:integration  # Integration tests (requires DB)
```

---

## Security

- JWT access (15m) + refresh (7d, httpOnly cookie)
- bcrypt password hashing (cost 12)
- RBAC: USER | COUNSELOR | ADMIN
- Rate limiting: 100/15min general, 10/15min auth, 5/15min analysis
- Helmet security headers
- CORS whitelist
- MIME type + extension validation on file upload
- Input sanitization + prompt injection protection
- Agent permission isolation
- Immutable audit trail

---

## Project Status

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Scaffold + DB + Auth + Security | ✅ Complete |
| 2 | User Profile + Onboarding | 🔜 |
| 3 | Resume Intelligence | 🔜 |
| 4 | AI Provider Abstraction | 🔜 |
| 5 | Agents 1–4 | 🔜 |
| ... | ... | 🔜 |

---

## Ethical Disclaimer

This system provides career decision **support**, not guaranteed career outcomes.
Scores are decision-support metrics, not probability assessments.
No salary, employment, or career success is guaranteed.
