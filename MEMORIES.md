# MEMORIES.md — NEXUS // AI Agent Command Center
> Agent Zero Context File — Updated: 2026-03-31

## 🎯 Current Sprint Goal
Phase 1: Full UI scaffold with all 13 panels using mock data — COMPLETE ✅
Next: Wire up real data connections starting with Agent Status Cards + Live Task Feed

## ✅ Last Session Summary
2026-03-31: Built complete NEXUS Command Center from scratch.
- React + Vite + Tailwind CSS project created at /a0/usr/workdir/nexus-command-center/
- All 13 panels built with rich mock data
- Production build successful (460KB JS, 35KB CSS)
- GitHub repo created: https://github.com/ElectusMedical/nexus-command-center
- Live preview via cloudflared tunnel (temporary)
- Awaiting Cloudflare Pages deployment (needs CF_API_TOKEN + CF_ACCOUNT_ID)

## 🚧 Active Blockers
- CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID not in environment
- Need to add to /a0/usr/workdir/.env to enable `wrangler pages deploy`
- OR user can connect GitHub repo manually in Cloudflare Pages dashboard

## 🏗️ Architecture Decisions
- Plain JSX (not TypeScript) for faster iteration
- @xyflow/react for Agent Hierarchy node graph
- @dnd-kit for Mission Tracker Kanban drag-and-drop
- Mock data centralized in src/data/mockData.js
- All 13 panels route through App.jsx panel state
- Cloudflare Pages will serve dist/ folder (Vite build output)

## 📋 Backlog (Priority Order)
1. Add CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID to .env → deploy to Pages
2. Wire Agent Status Cards to real Agent Zero API
3. Wire Live Task Feed to real task events (WebSocket or polling)
4. Wire Resource Monitor to real VPS metrics (server-side endpoint needed)
5. Wire n8n Comms Panel to real n8n webhook logs
6. Wire Memory Inspector to real Agent Zero memory API
7. Wire Deployment Launchpad to real Dokploy status API
8. Add GitHub Actions CI/CD: push → Cloudflare Pages auto-deploy

## 🔧 Technical Notes
- Local project: /a0/usr/workdir/nexus-command-center/
- GitHub: https://github.com/ElectusMedical/nexus-command-center (public, main branch)
- Build: cd /a0/usr/workdir/nexus-command-center && npm run build
- Preview: python3 -m http.server 4200 --directory dist/
- Tunnel: cloudflared tunnel --url http://localhost:4200
- Deploy cmd: export CLOUDFLARE_API_TOKEN=xxx && export CLOUDFLARE_ACCOUNT_ID=xxx && wrangler pages deploy dist/ --project-name nexus-command-center
- Design: #0A0E1A bg, #00D4FF cyan accent, JetBrains Mono typography
- Separate from: /a0/usr/workdir/nexus/ (older TypeScript version, different project)

## 📝 Open Questions
- Should we enable GitHub Actions for auto-deploy on push to main?
- Which real API endpoints should Agent Status Cards poll first?
- Should the n8n Comms Panel use webhooks or polling?
