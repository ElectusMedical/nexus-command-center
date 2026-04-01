export const agents = [
  {
    id: 'agent-zero', name: 'Agent Zero', role: 'Orchestrator',
    model: 'Claude Sonnet 4.6', status: 'active', uptime: '14h 23m',
    lastAction: 'Delegated task to Moltis', currentTask: 'NEXUS Build Phase 1',
    systemPromptSummary: 'Top-level autonomous AI agent with full tool access. Orchestrates sub-agents, manages memory, executes terminal commands, and coordinates complex multi-step tasks across the entire system.',
    color: '#00D4FF', avatar: 'AZ', tasksCompleted: 142, tasksActive: 3,
  },
  {
    id: 'moltis', name: 'Moltis', role: 'Sub-Agent / Browser',
    model: 'Claude Sonnet 4.5', status: 'active', uptime: '8h 11m',
    lastAction: 'Completed web scrape of target site', currentTask: 'Data extraction job #42',
    systemPromptSummary: 'Specialized browser automation agent with Playwright access. Handles web scraping, form submission, authentication flows, and visual page interaction on behalf of Agent Zero.',
    color: '#00FF94', avatar: 'ML', tasksCompleted: 87, tasksActive: 1,
  },
  {
    id: 'n8n-bridge', name: 'n8n Bridge', role: 'Comms Router',
    model: 'n8n Workflow Engine', status: 'idle', uptime: '72h 00m',
    lastAction: 'Routed message #108 to Telegram', currentTask: 'Awaiting trigger',
    systemPromptSummary: 'Workflow automation bridge connecting Agent Zero to external services. Routes messages via Telegram, handles webhooks, transforms data, and triggers external API calls.',
    color: '#FFB800', avatar: 'N8', tasksCompleted: 1089, tasksActive: 0,
  },
];

export const tasks = [
  { id: 't001', title: 'Build NEXUS UI Phase 1', agent: 'agent-zero', status: 'in-progress', created: '10:00', elapsed: '8h 23m', priority: 'critical' },
  { id: 't002', title: 'Scrape competitor pricing data', agent: 'moltis', status: 'in-progress', created: '14:00', elapsed: '4h 12m', priority: 'high' },
  { id: 't003', title: 'Deploy NEXUS to Cloudflare Pages', agent: 'agent-zero', status: 'pending', created: '16:00', elapsed: '0m', priority: 'high' },
  { id: 't004', title: 'Send daily summary to Telegram', agent: 'n8n-bridge', status: 'done', created: '08:00', elapsed: '2m', priority: 'medium' },
  { id: 't005', title: 'Memory consolidation sweep', agent: 'agent-zero', status: 'done', created: '09:00', elapsed: '14m', priority: 'low' },
  { id: 't006', title: 'GitHub repo health check', agent: 'agent-zero', status: 'done', created: '07:30', elapsed: '3m', priority: 'medium' },
  { id: 't007', title: 'Extract product metadata from Amazon', agent: 'moltis', status: 'done', created: '20:00', elapsed: '22m', priority: 'high' },
  { id: 't008', title: 'Generate weekly analytics report', agent: 'n8n-bridge', status: 'pending', created: '17:00', elapsed: '0m', priority: 'medium' },
  { id: 't009', title: 'Refactor Moltis session handler', agent: 'agent-zero', status: 'pending', created: '16:30', elapsed: '0m', priority: 'low' },
  { id: 't010', title: 'Test n8n webhook endpoint', agent: 'n8n-bridge', status: 'failed', created: '12:00', elapsed: '1m', priority: 'high' },
  { id: 't011', title: 'Screenshot landing page variations', agent: 'moltis', status: 'in-progress', created: '15:00', elapsed: '3h 05m', priority: 'medium' },
  { id: 't012', title: 'Update product registry skill', agent: 'agent-zero', status: 'done', created: '11:00', elapsed: '45m', priority: 'medium' },
  { id: 't013', title: 'Route alert: server CPU spike', agent: 'n8n-bridge', status: 'done', created: '13:42', elapsed: '1m', priority: 'critical' },
  { id: 't014', title: 'Draft blog post outline', agent: 'agent-zero', status: 'pending', created: '17:30', elapsed: '0m', priority: 'low' },
  { id: 't015', title: 'Login flow automation test', agent: 'moltis', status: 'failed', created: '11:30', elapsed: '8m', priority: 'high' },
];

export const taskFeedEvents = [
  { id: 'e001', timestamp: '18:12:01', type: 'delegated', agent: 'agent-zero', taskName: 'Build NEXUS UI Phase 1', message: 'Task delegated to developer subordinate' },
  { id: 'e002', timestamp: '18:11:55', type: 'in-progress', agent: 'moltis', taskName: 'Screenshot landing page variations', message: 'Capturing viewport at 1440px' },
  { id: 'e003', timestamp: '18:11:40', type: 'created', agent: 'agent-zero', taskName: 'Draft blog post outline', message: 'New task queued from user request' },
  { id: 'e004', timestamp: '18:10:22', type: 'complete', agent: 'n8n-bridge', taskName: 'Send daily summary to Telegram', message: 'Message delivered, 3 recipients notified' },
  { id: 'e005', timestamp: '18:09:11', type: 'failed', agent: 'moltis', taskName: 'Login flow automation test', message: 'CAPTCHA detected, session expired' },
  { id: 'e006', timestamp: '18:08:55', type: 'in-progress', agent: 'agent-zero', taskName: 'Build NEXUS UI Phase 1', message: 'Writing component files to disk' },
  { id: 'e007', timestamp: '18:07:30', type: 'complete', agent: 'agent-zero', taskName: 'Update product registry skill', message: 'SKILL.md updated with 4 new entries' },
  { id: 'e008', timestamp: '18:06:18', type: 'complete', agent: 'n8n-bridge', taskName: 'Route alert: server CPU spike', message: 'Alert forwarded to Telegram channel' },
  { id: 'e009', timestamp: '18:05:00', type: 'delegated', agent: 'agent-zero', taskName: 'Scrape competitor pricing data', message: 'Delegated to Moltis with target URLs' },
  { id: 'e010', timestamp: '18:04:33', type: 'in-progress', agent: 'moltis', taskName: 'Scrape competitor pricing data', message: 'Processing page 12 of 47' },
  { id: 'e011', timestamp: '18:03:10', type: 'created', agent: 'agent-zero', taskName: 'Refactor Moltis session handler', message: 'Backlog task created' },
  { id: 'e012', timestamp: '18:02:44', type: 'complete', agent: 'moltis', taskName: 'Extract product metadata from Amazon', message: '1,247 products extracted and saved' },
  { id: 'e013', timestamp: '18:01:30', type: 'created', agent: 'n8n-bridge', taskName: 'Generate weekly analytics report', message: 'Scheduled task triggered' },
  { id: 'e014', timestamp: '18:00:15', type: 'failed', agent: 'n8n-bridge', taskName: 'Test n8n webhook endpoint', message: 'Connection timeout after 30s' },
  { id: 'e015', timestamp: '17:59:01', type: 'in-progress', agent: 'agent-zero', taskName: 'Memory consolidation sweep', message: 'Pruning low-relevance vectors' },
  { id: 'e016', timestamp: '17:57:44', type: 'complete', agent: 'agent-zero', taskName: 'Memory consolidation sweep', message: '34 memories pruned, 12 consolidated' },
  { id: 'e017', timestamp: '17:56:22', type: 'complete', agent: 'agent-zero', taskName: 'GitHub repo health check', message: 'All 7 repos healthy, 2 PRs pending' },
  { id: 'e018', timestamp: '17:55:00', type: 'delegated', agent: 'agent-zero', taskName: 'Screenshot landing page variations', message: 'Delegated to Moltis with design specs' },
  { id: 'e019', timestamp: '17:54:33', type: 'created', agent: 'agent-zero', taskName: 'Deploy NEXUS to Cloudflare Pages', message: 'Pending NEXUS build completion' },
  { id: 'e020', timestamp: '17:53:10', type: 'in-progress', agent: 'moltis', taskName: 'Screenshot landing page variations', message: 'Loading target URL in headless browser' },
  { id: 'e021', timestamp: '17:51:55', type: 'complete', agent: 'n8n-bridge', taskName: 'Send daily summary', message: 'Daily digest sent successfully' },
  { id: 'e022', timestamp: '17:50:30', type: 'created', agent: 'agent-zero', taskName: 'Build NEXUS UI Phase 1', message: 'Mission-critical task initiated' },
  { id: 'e023', timestamp: '17:48:12', type: 'delegated', agent: 'agent-zero', taskName: 'Test n8n webhook endpoint', message: 'Delegated to n8n Bridge for validation' },
  { id: 'e024', timestamp: '17:46:00', type: 'in-progress', agent: 'n8n-bridge', taskName: 'Route alert: server CPU spike', message: 'Analyzing alert payload' },
  { id: 'e025', timestamp: '17:44:33', type: 'created', agent: 'agent-zero', taskName: 'Memory consolidation sweep', message: 'Routine maintenance task' },
  { id: 'e026', timestamp: '17:43:10', type: 'complete', agent: 'moltis', taskName: 'Login flow automation test', message: 'Auth flow test passed on staging' },
  { id: 'e027', timestamp: '17:41:55', type: 'in-progress', agent: 'agent-zero', taskName: 'GitHub repo health check', message: 'Checking 7 repositories' },
  { id: 'e028', timestamp: '17:40:30', type: 'created', agent: 'moltis', taskName: 'Scrape competitor pricing data', message: 'Browser session initialized' },
  { id: 'e029', timestamp: '17:39:00', type: 'delegated', agent: 'agent-zero', taskName: 'Extract product metadata', message: 'Task package sent to Moltis' },
  { id: 'e030', timestamp: '17:37:44', type: 'complete', agent: 'n8n-bridge', taskName: 'Route alert: server CPU spike', message: 'Incident auto-resolved, normal ops resumed' },
];

export const n8nMessages = [
  { id: 'm001', timestamp: '18:10:20', sourceAgent: 'Agent Zero', targetAgent: 'Telegram', messageIn: 'Daily summary: 3 tasks completed, 2 active, 1 failed. Moltis scraped 847 records.', workflowApplied: 'daily-digest-v2', output: 'Message sent to @nexus_ops channel', status: 'approved' },
  { id: 'm002', timestamp: '18:06:15', sourceAgent: 'n8n Monitor', targetAgent: 'Agent Zero', messageIn: 'CPU spike detected on srv849550: 94% for 3+ minutes', workflowApplied: 'alert-router-v1', output: 'Alert forwarded with context enrichment', status: 'approved' },
  { id: 'm003', timestamp: '17:58:00', sourceAgent: 'Agent Zero', targetAgent: 'Slack', messageIn: 'GitHub PR #47 requires review: refactor/session-handler', workflowApplied: 'github-notify-v1', output: 'Slack notification sent to #dev channel', status: 'approved' },
  { id: 'm004', timestamp: '17:44:11', sourceAgent: 'Webhook', targetAgent: 'Agent Zero', messageIn: 'Incoming Telegram message: Status update?', workflowApplied: 'tg-inbound-v3', output: 'Message queued for Agent Zero processing', status: 'approved' },
  { id: 'm005', timestamp: '17:30:00', sourceAgent: 'Agent Zero', targetAgent: 'Email', messageIn: 'Weekly analytics report attachment (PDF, 2.4MB)', workflowApplied: 'report-emailer-v1', output: 'HELD: attachment size exceeds limit', status: 'held' },
  { id: 'm006', timestamp: '17:15:44', sourceAgent: 'Moltis', targetAgent: 'Agent Zero', messageIn: 'Scrape complete: 1247 records, 3 errors, dataset at /tmp/scrape_042.json', workflowApplied: 'agent-relay-v2', output: 'Data transferred, Agent Zero notified', status: 'approved' },
  { id: 'm007', timestamp: '16:55:22', sourceAgent: 'Agent Zero', targetAgent: 'Telegram', messageIn: 'ALERT: Login flow automation failed on staging env', workflowApplied: 'urgent-alert-v1', output: 'Priority notification sent', status: 'approved' },
  { id: 'm008', timestamp: '16:30:00', sourceAgent: 'Cron Trigger', targetAgent: 'Agent Zero', messageIn: 'Scheduled: memory consolidation sweep', workflowApplied: 'cron-dispatch-v1', output: 'Task injected into Agent Zero queue', status: 'approved' },
  { id: 'm009', timestamp: '15:45:33', sourceAgent: 'Agent Zero', targetAgent: 'Discord', messageIn: 'Deploy NEXUS: build triggered on Cloudflare Pages', workflowApplied: 'deploy-notify-v1', output: 'HELD: Discord webhook URL not configured', status: 'held' },
  { id: 'm010', timestamp: '15:10:10', sourceAgent: 'Webhook', targetAgent: 'Moltis', messageIn: 'Priority scrape request: 47 target URLs from external source', workflowApplied: 'scrape-intake-v2', output: 'Task package forwarded to Moltis queue', status: 'approved' },
];

export const agentMemory = {
  'agent-zero': {
    contextSummary: 'Agent Zero is currently leading the NEXUS Command Center build. Active coordination with Moltis for data extraction tasks. n8n bridge handling all outbound communications. Server srv849550 had a CPU spike at 17:44 (resolved). GitHub has 2 open PRs awaiting review.',
    memories: [
      { key: 'nexus_build_status', value: 'Phase 1 component writing in progress. Config files done. Writing components.' },
      { key: 'moltis_session', value: 'Active session on scrape job #42. Playwright browser open on target domain.' },
      { key: 'srv849550_alert', value: 'CPU spike at 94% on 2026-03-31 17:44. Resolved. Root cause: indexing job.' },
      { key: 'n8n_held_messages', value: '2 messages held: email attachment oversized, Discord webhook unconfigured.' },
      { key: 'product_registry_updated', value: 'SKILL.md updated 2026-03-31 11:00 with 4 new product entries.' },
    ],
  },
  'moltis': {
    contextSummary: 'Moltis is running concurrent scrape jobs. Current job #42 targeting competitor pricing pages - 12 of 47 pages processed. Screenshot job for landing pages in queue. Last session expired on staging env due to CAPTCHA.',
    memories: [
      { key: 'active_scrape_job', value: 'Job #42: competitor-prices.com, page 12/47, 847 records extracted so far.' },
      { key: 'captcha_failure', value: 'staging.auth.example.com blocked session at 18:05. CAPTCHA v3 detected.' },
      { key: 'screenshot_specs', value: 'Landing page screenshots: 1440px, 768px, 375px viewports. Full-page capture.' },
      { key: 'amazon_extract', value: '1247 products extracted 2026-03-30. Fields: ASIN, title, price, rating, review_count.' },
      { key: 'proxy_pool', value: 'Rotating proxy pool: 24 IPs active, 3 flagged, last rotation 17:30.' },
    ],
  },
  'n8n-bridge': {
    contextSummary: 'n8n Bridge has processed 1089 messages lifetime. 2 messages currently held pending resolution. Daily digest workflow running successfully. Webhook listener active on port 5678.',
    memories: [
      { key: 'held_messages', value: 'msg-005: email attachment; msg-009: Discord webhook missing.' },
      { key: 'active_workflows', value: 'daily-digest-v2, alert-router-v1, tg-inbound-v3, cron-dispatch-v1 all active.' },
      { key: 'telegram_config', value: 'Bot @nexus_ops_bot active. Channel: @nexus_ops. Token configured.' },
      { key: 'webhook_url', value: 'Public webhook: https://n8n.yourdomain.com/webhook/nexus-intake' },
      { key: 'message_count', value: 'Lifetime: 1089 messages. Today: 42. Held: 2. Failed: 1.' },
    ],
  },
};

export const resources = { cpu: 34, ram: 61, disk: 48, network: 22 };

export const deploymentServices = [
  { id: 'svc1', name: 'Agent Zero', type: 'Dokploy', status: 'running', url: 'https://agent.yourdomain.com', lastChecked: '18:12:01', version: 'v0.8.4' },
  { id: 'svc2', name: 'Moltis', type: 'Dokploy', status: 'running', url: '', lastChecked: '18:12:01', version: 'v0.5.1' },
  { id: 'svc3', name: 'NEXUS UI', type: 'Cloudflare Pages', status: 'deploying', url: 'https://nexus.pages.dev', lastChecked: '18:11:55', version: 'build-042' },
  { id: 'svc4', name: 'n8n', type: 'VPS Service', status: 'running', url: 'https://n8n.yourdomain.com', lastChecked: '18:12:00', version: 'v1.28.0' },
  { id: 'svc5', name: 'PostgreSQL', type: 'Database', status: 'running', url: '', lastChecked: '18:12:01', version: 'v16.2' },
  { id: 'svc6', name: 'CouchDB', type: 'Database', status: 'running', url: '', lastChecked: '18:11:58', version: 'v3.3.3' },
  { id: 'svc7', name: 'FalkorDB', type: 'Graph DB', status: 'running', url: '', lastChecked: '18:12:01', version: 'v4.0.1' },
  { id: 'svc8', name: 'Stirling-PDF', type: 'Dokploy', status: 'running', url: 'https://pdf.yourdomain.com', lastChecked: '18:11:59', version: 'v0.30.1' },
];

export const timelineEvents = [
  { id: 'tl01', timestamp: '17:37', agent: 'agent-zero', type: 'task', title: 'Extract Amazon metadata', triggeredBy: null },
  { id: 'tl02', timestamp: '17:39', agent: 'agent-zero', type: 'delegation', title: 'Delegate to Moltis', triggeredBy: 'tl01' },
  { id: 'tl03', timestamp: '17:40', agent: 'moltis', type: 'task', title: 'Start Amazon scrape', triggeredBy: 'tl02' },
  { id: 'tl04', timestamp: '17:41', agent: 'agent-zero', type: 'task', title: 'GitHub repo check', triggeredBy: null },
  { id: 'tl05', timestamp: '17:43', agent: 'moltis', type: 'complete', title: 'Auth test passed', triggeredBy: null },
  { id: 'tl06', timestamp: '17:44', agent: 'n8n-bridge', type: 'alert', title: 'CPU spike alert', triggeredBy: null },
  { id: 'tl07', timestamp: '17:46', agent: 'n8n-bridge', type: 'task', title: 'Route CPU alert', triggeredBy: 'tl06' },
  { id: 'tl08', timestamp: '17:50', agent: 'agent-zero', type: 'task', title: 'NEXUS UI created', triggeredBy: null },
  { id: 'tl09', timestamp: '17:53', agent: 'moltis', type: 'task', title: 'Screenshot job start', triggeredBy: null },
  { id: 'tl10', timestamp: '17:54', agent: 'agent-zero', type: 'task', title: 'Deploy NEXUS queued', triggeredBy: 'tl08' },
  { id: 'tl11', timestamp: '17:55', agent: 'agent-zero', type: 'delegation', title: 'Delegate screenshots', triggeredBy: 'tl09' },
  { id: 'tl12', timestamp: '17:56', agent: 'agent-zero', type: 'complete', title: 'GitHub check done', triggeredBy: 'tl04' },
  { id: 'tl13', timestamp: '17:57', agent: 'agent-zero', type: 'complete', title: 'Memory sweep done', triggeredBy: null },
  { id: 'tl14', timestamp: '17:58', agent: 'n8n-bridge', type: 'complete', title: 'CPU alert resolved', triggeredBy: 'tl07' },
  { id: 'tl15', timestamp: '18:00', agent: 'n8n-bridge', type: 'failed', title: 'Webhook test timeout', triggeredBy: null },
  { id: 'tl16', timestamp: '18:02', agent: 'moltis', type: 'complete', title: 'Amazon extract done', triggeredBy: 'tl03' },
  { id: 'tl17', timestamp: '18:05', agent: 'moltis', type: 'failed', title: 'Login CAPTCHA block', triggeredBy: null },
  { id: 'tl18', timestamp: '18:06', agent: 'agent-zero', type: 'task', title: 'Write NEXUS files', triggeredBy: 'tl08' },
  { id: 'tl19', timestamp: '18:10', agent: 'n8n-bridge', type: 'complete', title: 'Daily digest sent', triggeredBy: null },
  { id: 'tl20', timestamp: '18:12', agent: 'agent-zero', type: 'delegation', title: 'Delegate build task', triggeredBy: 'tl18' },
];

export const missionCards = [
  { id: 'mc01', title: 'Define NEXUS architecture', agent: 'agent-zero', column: 'done', priority: 'critical' },
  { id: 'mc02', title: 'Write config files', agent: 'agent-zero', column: 'done', priority: 'high' },
  { id: 'mc03', title: 'Write mock data layer', agent: 'agent-zero', column: 'done', priority: 'high' },
  { id: 'mc04', title: 'Build AgentHierarchy panel', agent: 'agent-zero', column: 'done', priority: 'high' },
  { id: 'mc05', title: 'Build LiveTaskFeed panel', agent: 'agent-zero', column: 'review', priority: 'high' },
  { id: 'mc06', title: 'Build ResourceMonitor gauges', agent: 'agent-zero', column: 'review', priority: 'medium' },
  { id: 'mc07', title: 'Scrape competitor pricing batch 1', agent: 'moltis', column: 'in-progress', priority: 'high' },
  { id: 'mc08', title: 'Screenshot landing page variants', agent: 'moltis', column: 'in-progress', priority: 'medium' },
  { id: 'mc09', title: 'Deploy NEXUS to Cloudflare Pages', agent: 'agent-zero', column: 'in-progress', priority: 'critical' },
  { id: 'mc10', title: 'Configure Discord webhook', agent: 'n8n-bridge', column: 'briefed', priority: 'medium' },
  { id: 'mc11', title: 'Fix email attachment limit', agent: 'n8n-bridge', column: 'briefed', priority: 'low' },
  { id: 'mc12', title: 'Refactor session handler', agent: 'agent-zero', column: 'briefed', priority: 'low' },
];
