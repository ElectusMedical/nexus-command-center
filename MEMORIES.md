# MEMORIES.md — NEXUS Command Center
> Agent Zero Context File — Updated: 2026-04-10

## 🎯 Current Sprint Goal
Phase 1 complete. 14 panels live. AI Provider Intelligence panel wired to real APIs via secure Express proxy.

## ✅ Last Session Summary
**2026-04-10:**
- Added 14th panel: AI Provider Intelligence (AICreditsPanel.jsx)
- Built secure Express proxy server (server.js) serving dist/ + /api/ai-credits + /api/health
- All 4 AI provider APIs integrated: OpenRouter, OpenAI, Anthropic, Gemini (2 keys)
- All endpoints confirmed HTTP 200 through cloudflared tunnel
- New build: index-CIQN_Bm4.css + index-CYqLzQRi.js

## 🌐 Live URLs
- **Cloudflared Tunnel (temp):** https://lung-jeff-importance-chip.trycloudflare.com
- **GitHub Repo:** https://github.com/ElectusMedical/nexus-command-center
- **Local server:** http://localhost:4200

## 🏗️ Architecture

### Stack
- React 18 + Vite 6 + Tailwind CSS (JSX, not TypeScript)
- Express 5.x proxy server (server.js) — reads /a0/usr/workdir/.env
- Served on port 4200 via `node server.js`
- Tunnelled via cloudflared → trycloudflare.com URL

### How to Restart Server
```bash
cd /a0/usr/workdir/nexus-command-center
fuser -k 4200/tcp 2>/dev/null
node server.js &
# Then start cloudflared:
cloudflared tunnel --url http://localhost:4200 > /tmp/nexus_tunnel.log 2>&1 &
grep -o 'https://[a-z0-9-]*.trycloudflare.com' /tmp/nexus_tunnel.log
```

### How to Rebuild
```bash
cd /a0/usr/workdir/nexus-command-center
npm run build
# Restart server after build
```

## 🔐 Security Architecture
- 4 AI provider API keys stored in /a0/usr/workdir/.env ONLY
- Keys are loaded by server.js (server-side) via dotenv
- Frontend (React) polls /api/ai-credits — keys NEVER sent to browser
- Keys must NOT be shared with sub-agents (Moltis, Hermes, or any other agent)
- .env is gitignored — keys never in GitHub

## 🔑 API Keys (names only — values in .env)
- OPENAI_API_KEY ✓
- ANTHROPIC_API_KEY ✓
- GEMINI_API_KEY ✓ (primary)
- GEMINI_API_KEY_2 ✓ (secondary)
- OPENROUTER_API_KEY ✓

## 📊 Panel Inventory (14 panels)
| # | Panel | Component | Data |
|---|-------|-----------|------|
| 1 | Agent Hierarchy | AgentHierarchy.jsx | mock |
| 2 | Live Task Feed | LiveTaskFeed.jsx | mock+sim |
| 3 | Agent Status Cards | AgentStatusCards.jsx | mock+sim |
| 4 | Task Queue Manager | TaskQueueManager.jsx | mock |
| 5 | n8n Comms Bridge | N8nCommsPanel.jsx | mock |
| 6 | Memory Inspector | MemoryInspector.jsx | mock |
| 7 | Resource Monitor | ResourceMonitor.jsx | mock+sim |
| 8 | One-Click Controls | OneClickControls.jsx | actions |
| 9 | Notifications | NotificationSystem.jsx | sim |
| 10 | Deployment Launchpad | DeploymentLaunchpad.jsx | mock |
| 11 | Mission Tracker | MissionTracker.jsx | dnd-kit |
| 12 | Agent Role Display | AgentRoleDisplay.jsx | mock |
| 13 | Cross-Agent Timeline | CrossAgentTimeline.jsx | mock |
| 14 | AI Intelligence | AICreditsPanel.jsx | **LIVE** |

## 🚧 Polling Intervals (AI Credits Panel)
| Provider | Interval | API |
|----------|----------|-----|
| OpenRouter | 2 min | /api/v1/auth/key — credits + usage |
| OpenAI | 10 min | /v1/dashboard/billing/* — limits + usage |
| Anthropic | 15 min | /v1/models — key validity only (no billing API) |
| Gemini | 10 min | /v1beta/models — key validity only (no billing API) |

## 📋 Phase 2 Backlog
1. Wire Agent Status Cards to real Agent Zero API
2. Wire Live Task Feed to real task events (WebSocket/polling)
3. Wire Resource Monitor to VPS metrics endpoint
4. Wire n8n Comms Panel to n8n webhook logs
5. Wire Memory Inspector to Agent Zero memory API
6. Wire Deployment Launchpad to Dokploy status API
7. GitHub Actions CI/CD → auto-deploy to CF Pages on push
8. Add Cloudflare Pages permanent deployment (needs CF_API_TOKEN + CF_ACCOUNT_ID)

## 🔧 Technical Notes
- Node.js v22.22.0 installed
- cloudflared binary: /usr/local/bin/cloudflared (v2026.3.0) — may need redownload on container restart
- Express 5 requires `app.use()` for catch-all SPA fallback (NOT `app.get('*')`)
- Build creates ES modules (type: module in package.json)
- dotenv loaded from explicit path: resolve('/a0/usr/workdir/.env')
- Gemini has 2 API keys (GEMINI_API_KEY + GEMINI_API_KEY_2) shown as KEY 1 / KEY 2 in panel

## 📝 Known Issues
- Cloudflared tunnel URL changes every restart (temporary URLs)
- For permanent URL: connect GitHub repo to Cloudflare Pages via dashboard
- OpenAI billing API: /v1/dashboard/billing/* may require specific plan tier
- Anthropic + Gemini have NO public billing API — only key validity shown
