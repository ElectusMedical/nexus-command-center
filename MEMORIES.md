# MEMORIES.md — NEXUS Command Center
> Agent Zero Context File — Updated: 2026-04-10

## 🎯 Current Status
**DEPLOYED & LIVE at https://command.srv1411591.hstgr.cloud**

---

## ✅ Last Session Summary

### 2026-04-10 — Session 3: Hostinger/Dokploy Production + AI Intelligence Panel
- Stopped cloudflared tunnel (no longer needed)
- Confirmed production deployment at **https://command.srv1411591.hstgr.cloud** (Hostinger/Dokploy)
- Fixed OpenAI HTTP 403: billing API not accessible with project-scoped keys (sk-proj-...)
  → Switched to /v1/models endpoint — shows key validity + all model categories
- Updated OpenAICard component to show model categories (GPT-4, Reasoning, GPT-3, Image, Audio, Embeddings)
- Added CORS for `*.hstgr.cloud` domain in server.js
- Updated PORT to read from `process.env.PORT` (Dokploy can assign any port)
- Updated dotenv to try local `.env` first, then fallback — works in Docker without any file
- Created **Dockerfile** (multi-stage build) for Dokploy deployment
- Created **.dockerignore** (excludes node_modules, .env, .git)
- Rebuilt dist/ — 0 errors, 475KB JS + 36KB CSS
- Updated product registry: item #10 → 🟢 Deployed, Hostinger/Dokploy
- Pushed all changes to GitHub

### 2026-04-09 — Session 2: AI Provider Intelligence Panel (Panel 14)
- Added secure Express 5 proxy (server.js) replacing Python http.server
- Added AICreditsPanel.jsx — Panel 14 with 4 provider cards
- API keys stored in /a0/usr/workdir/.env — NEVER in GitHub or frontend
- Polling: OpenRouter=2min | OpenAI=10min | Anthropic=15min | Gemini=10min
- Two Gemini keys: GEMINI_API_KEY + GEMINI_API_KEY_2
- Keys must NOT be shared with Moltis, Hermes, or any other sub-agent

### 2026-04-08 — Session 1: Initial Build
- Built all 13 panels with mock data
- React 18 + Vite 6 + Tailwind CSS stack
- GitHub repo created: ElectusMedical/nexus-command-center

---

## 🚀 Deployment

### Production
- **URL:** https://command.srv1411591.hstgr.cloud
- **Platform:** Hostinger VPS → Dokploy
- **GitHub:** https://github.com/ElectusMedical/nexus-command-center
- **Branch:** main
- **Method:** Dokploy pulls from GitHub, builds Docker image, runs container

### How Dokploy Runs This App
```
Dockerfile (multi-stage):
  Stage 1 (builder): node:20-alpine → npm ci → npm run build → /app/dist
  Stage 2 (production): node:20-alpine → npm ci --omit=dev → node server.js
  EXPOSE 4200
  CMD ["node", "server.js"]
```

### 🔐 Required Environment Variables in Dokploy UI
> Go to Dokploy → nexus-command-center → Environment Variables
> Add ALL of the following — do NOT put these in code or GitHub:

```
OPENAI_API_KEY=sk-proj-...
ANTHROPIC_API_KEY=sk-ant-api03-...
GEMINI_API_KEY=AIzaSy...
GEMINI_API_KEY_2=AIzaSy...
OPENROUTER_API_KEY=sk-or-v1-...
PORT=4200
NODE_ENV=production
```

### Redeploy After Code Changes
```bash
# From local / Agent Zero:
git -C /a0/usr/workdir/nexus-command-center add -A
git -C /a0/usr/workdir/nexus-command-center commit -m "<message>"
git -C /a0/usr/workdir/nexus-command-center push origin main
# Then in Dokploy UI: click Redeploy
```

---

## 🏗️ Architecture

```
BROWSER (React SPA — served from dist/)
     ↓ polls /api/ai-credits every 2–15 min
Express 5 server.js (port 4200)
     ├── GET /api/ai-credits  → fetches all 4 providers server-side
     ├── GET /api/health      → uptime + keys_loaded status
     └── /*                  → serves dist/index.html (SPA fallback)
          ↓ uses process.env (from Dokploy env vars)
  OpenRouter | OpenAI | Anthropic | Gemini
```

---

## 📁 Key Files

| File | Purpose |
|---|---|
| `server.js` | Secure Express proxy + static file server |
| `Dockerfile` | Multi-stage Docker build for Dokploy |
| `.dockerignore` | Excludes .env, node_modules, .git |
| `src/components/AICreditsPanel.jsx` | Panel 14 — AI provider cards |
| `src/data/mockData.js` | Mock data for all other panels |
| `dist/` | Production build (committed to GitHub) |
| `wrangler.toml` | CF Pages config (kept for future use) |

---

## 🧩 All 14 Panels

| # | Panel | Status |
|---|---|---|
| 1 | Agent Hierarchy Visualizer | ✅ Mock data |
| 2 | Live Task Feed | ✅ Mock data (auto-generates events) |
| 3 | Agent Status Cards | ✅ Mock data (uptime ticker) |
| 4 | Task Queue Manager | ✅ Mock data + input |
| 5 | n8n Comms Bridge Panel | ✅ Mock data |
| 6 | Memory & Context Inspector | ✅ Mock data |
| 7 | Resource Monitor | ✅ Mock data (animated gauges) |
| 8 | One-Click Controls | ✅ Mock data + confirm dialogs |
| 9 | Notification & Alert System | ✅ Toast system |
| 10 | Deployment Launchpad | ✅ Mock data |
| 11 | Mission Tracker | ✅ Drag-and-drop Kanban |
| 12 | Agent Role Display | ✅ Mock data |
| 13 | Cross-Agent Timeline | ✅ Mock data |
| 14 | AI Intelligence | ✅ **LIVE — real API data** |

---

## 🔜 Phase 2 Backlog (Priority Order)

1. Wire Agent Status Cards → real Agent Zero API
2. Wire Live Task Feed → WebSocket or polling real events
3. Wire Resource Monitor → VPS metrics endpoint
4. Wire n8n Comms Panel → real n8n webhook logs
5. Wire Memory Inspector → real Agent Zero memory API
6. Wire Deployment Launchpad → Dokploy status API (:3000)
7. GitHub Actions CI/CD → auto-deploy on push to main
8. OpenAI org-level key → unlock real billing data

---

## ⚠️ Known Constraints

| Provider | Billing API | Notes |
|---|---|---|
| OpenRouter | ✅ Full | Real $ balance + usage via /api/v1/auth/key |
| OpenAI | ❌ Blocked | sk-proj keys return 403 on billing endpoints. Shows models only. Org-level key needed for billing. |
| Anthropic | ❌ None | No public billing API. Key validity + models only. |
| Gemini | ❌ None | No billing via AI Studio. Key validity + models only. |

---

## 🔐 Security Rules

1. API keys → Dokploy env vars ONLY (never in code, never in GitHub)
2. `.env` is gitignored — never commit it
3. Keys must NOT be shared with Moltis, Hermes, or any other sub-agent
4. server.js CORS restricted to: localhost, *.hstgr.cloud, *.trycloudflare.com, *.pages.dev
5. API routes return computed data only — keys never echoed in responses
