/**
 * NEXUS Command Center — Secure API Proxy Server
 * Serves the React dist/ bundle AND proxies AI provider billing APIs.
 * API keys are loaded from .env — NEVER sent to the frontend.
 *
 * Security: Keys live in process.env only. No key ever appears in
 * any response body. CORS restricted. Rate-limit safe polling intervals
 * enforced by frontend (2/10/10/15 min per provider).
 */

import dotenv from 'dotenv';
import { resolve } from 'path';
dotenv.config({ path: resolve('/a0/usr/workdir/.env') });
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 4200;

// ── CORS: allow same-origin + localhost dev ──────────────────────────────────
app.use(cors({
  origin: [
    /localhost/,
    /127\.0\.0\.1/,
    /\.trycloudflare\.com$/,
    /\.pages\.dev$/
  ],
  methods: ['GET'],
}));

// ── Static: serve Vite build ─────────────────────────────────────────────────
app.use(express.static(join(__dirname, 'dist')));

// ── Helper: safe fetch with timeout ──────────────────────────────────────────
async function safeFetch(url, options = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timer);
    return res;
  } catch (e) {
    clearTimeout(timer);
    throw e;
  }
}

// ── OpenRouter ────────────────────────────────────────────────────────────────
async function fetchOpenRouter() {
  try {
    const res = await safeFetch('https://openrouter.ai/api/v1/auth/key', {
      headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}` }
    });
    if (!res.ok) return { status: 'error', code: res.status };
    const json = await res.json();
    const d = json.data || {};
    const used = d.usage ?? 0;
    const limit = d.limit ?? null;  // null = unlimited
    const remaining = limit !== null ? limit - used : null;
    const pct = limit ? Math.round((used / limit) * 100) : 0;
    return {
      status: 'ok',
      provider: 'OpenRouter',
      balance_usd: remaining !== null ? parseFloat(remaining.toFixed(4)) : null,
      used_usd: parseFloat(used.toFixed(4)),
      limit_usd: limit !== null ? parseFloat(limit.toFixed(2)) : null,
      pct_used: pct,
      is_free_tier: d.is_free_tier ?? false,
      rate_limit: d.rate_limit ?? null,
      label: d.label ?? '',
      fetched_at: new Date().toISOString()
    };
  } catch (e) {
    return { status: 'error', provider: 'OpenRouter', message: 'fetch_failed' };
  }
}

// ── OpenAI ────────────────────────────────────────────────────────────────────
async function fetchOpenAI() {
  try {
    const headers = { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` };

    // Subscription (hard/soft limits)
    const subRes = await safeFetch(
      'https://api.openai.com/v1/dashboard/billing/subscription', { headers }
    );

    // Usage for current month
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString().split('T')[0];
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      .toISOString().split('T')[0];
    const usageRes = await safeFetch(
      `https://api.openai.com/v1/dashboard/billing/usage?start_date=${start}&end_date=${end}`,
      { headers }
    );

    if (!subRes.ok) return { status: 'error', provider: 'OpenAI', code: subRes.status };

    const sub = await subRes.json();
    let usageData = null;
    if (usageRes.ok) usageData = await usageRes.json();

    const totalUsageCents = usageData?.total_usage ?? 0;
    const totalUsageUsd = totalUsageCents / 100;
    const hardLimit = sub.hard_limit_usd ?? sub.system_hard_limit_usd ?? null;
    const softLimit = sub.soft_limit_usd ?? null;
    const remaining = hardLimit !== null ? hardLimit - totalUsageUsd : null;
    const pct = hardLimit ? Math.round((totalUsageUsd / hardLimit) * 100) : 0;

    // Build daily cost trend (last 7 days)
    const dailyCosts = (usageData?.daily_costs ?? []).slice(-7).map(d => ({
      date: d.timestamp ? new Date(d.timestamp * 1000).toISOString().split('T')[0] : '?',
      usd: parseFloat(((d.line_items ?? []).reduce((s, li) => s + (li.cost ?? 0), 0) / 100).toFixed(4))
    }));

    return {
      status: 'ok',
      provider: 'OpenAI',
      used_usd: parseFloat(totalUsageUsd.toFixed(4)),
      hard_limit_usd: hardLimit,
      soft_limit_usd: softLimit,
      balance_usd: remaining !== null ? parseFloat(remaining.toFixed(4)) : null,
      pct_used: pct,
      has_payment_method: sub.has_payment_method ?? false,
      plan: sub.plan?.title ?? 'Unknown',
      daily_trend: dailyCosts,
      fetched_at: new Date().toISOString()
    };
  } catch (e) {
    return { status: 'error', provider: 'OpenAI', message: 'fetch_failed' };
  }
}

// ── Anthropic ─────────────────────────────────────────────────────────────────
// No public billing API. We ping /v1/models to confirm key validity + list models.
async function fetchAnthropic() {
  try {
    const res = await safeFetch('https://api.anthropic.com/v1/models', {
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      }
    });
    if (!res.ok) return { status: 'error', provider: 'Anthropic', code: res.status };
    const json = await res.json();
    const models = (json.data ?? []).map(m => m.id);
    const latestClaude = models.filter(m => m.includes('claude')).slice(0, 5);
    return {
      status: 'ok',
      provider: 'Anthropic',
      key_valid: true,
      billing_api: false,
      note: 'No public billing API — key validity and model availability shown',
      available_models: latestClaude,
      total_models: models.length,
      fetched_at: new Date().toISOString()
    };
  } catch (e) {
    return { status: 'error', provider: 'Anthropic', message: 'fetch_failed' };
  }
}

// ── Gemini ────────────────────────────────────────────────────────────────────
// No public billing API. List models to confirm key validity + availability.
async function fetchGemini() {
  try {
    // Try primary key first, then secondary
    const keys = [
      process.env.GEMINI_API_KEY,
      process.env.GEMINI_API_KEY_2
    ].filter(Boolean);

    const results = await Promise.all(keys.map(async (key, idx) => {
      try {
        const res = await safeFetch(
          `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`
        );
        if (!res.ok) return { key_index: idx + 1, status: 'error', code: res.status };
        const json = await res.json();
        const models = (json.models ?? []).map(m => m.name.replace('models/', ''));
        const geminiModels = models.filter(m => m.includes('gemini')).slice(0, 6);
        return {
          key_index: idx + 1,
          status: 'ok',
          key_valid: true,
          available_models: geminiModels,
          total_models: models.length
        };
      } catch (e) {
        return { key_index: idx + 1, status: 'error', message: 'fetch_failed' };
      }
    }));

    return {
      status: 'ok',
      provider: 'Gemini',
      billing_api: false,
      note: 'No public billing API via AI Studio — key validity and model availability shown',
      keys: results,
      fetched_at: new Date().toISOString()
    };
  } catch (e) {
    return { status: 'error', provider: 'Gemini', message: 'fetch_failed' };
  }
}

// ── API Route: /api/ai-credits ────────────────────────────────────────────────
app.get('/api/ai-credits', async (req, res) => {
  try {
    // Fetch all providers in parallel
    const [openrouter, openai, anthropic, gemini] = await Promise.all([
      fetchOpenRouter(),
      fetchOpenAI(),
      fetchAnthropic(),
      fetchGemini()
    ]);
    res.json({
      fetched_at: new Date().toISOString(),
      providers: { openrouter, openai, anthropic, gemini }
    });
  } catch (e) {
    res.status(500).json({ error: 'aggregation_failed' });
  }
});

// ── API Route: /api/health ────────────────────────────────────────────────────
app.get('/api/health', (_, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), ts: new Date().toISOString() });
});

// ── SPA fallback ──────────────────────────────────────────────────────────────
// ── SPA fallback ──────────────────────────────────────────────────────────────
app.use((_, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[NEXUS] Secure proxy running on http://localhost:${PORT}`);
  console.log(`[NEXUS] API keys loaded: OpenAI=${!!process.env.OPENAI_API_KEY} | Anthropic=${!!process.env.ANTHROPIC_API_KEY} | Gemini=${!!process.env.GEMINI_API_KEY} | OpenRouter=${!!process.env.OPENROUTER_API_KEY}`);
});
