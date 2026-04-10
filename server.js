/**
 * NEXUS Command Center — Secure API Proxy Server
 * Serves the React dist/ bundle AND proxies AI provider billing APIs.
 * API keys are loaded from environment variables — NEVER sent to the frontend.
 *
 * Security: Keys live in process.env only. No key ever appears in
 * any response body. CORS restricted. Rate-limit safe polling intervals
 * enforced by frontend (2/10/10/15 min per provider).
 *
 * Deployment: Works locally (reads .env file) and in Docker/Dokploy
 * (reads environment variables set in Dokploy UI — no .env file needed).
 */

import dotenv from 'dotenv';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Try local .env first, then workdir fallback — silently ignore if neither exists
// In Docker/Dokploy, keys come from process.env directly (set in Dokploy UI)
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '.env') });
dotenv.config({ path: resolve('/a0/usr/workdir/.env') });

import express from 'express';
import cors from 'cors';

const app = express();
const PORT = parseInt(process.env.PORT || '4200', 10);

// ── CORS: allow same-origin + localhost dev + Hostinger + Cloudflare ──────────
app.use(cors({
  origin: [
    /localhost/,
    /127\.0\.0\.1/,
    /\.trycloudflare\.com$/,
    /\.pages\.dev$/,
    /\.hstgr\.cloud$/,
    /command\.srv1411591\.hstgr\.cloud/
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
    if (!res.ok) return { status: 'error', provider: 'OpenRouter', code: res.status };
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
// Note: The /v1/dashboard/billing/* endpoints require an Org-level API key.
// Project-scoped keys (sk-proj-...) return HTTP 403 on billing endpoints.
// We use /v1/models to confirm key validity and list available models instead.
async function fetchOpenAI() {
  try {
    const headers = {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    };

    // Use /v1/models — works with project-scoped keys
    const modelsRes = await safeFetch('https://api.openai.com/v1/models', { headers });

    if (!modelsRes.ok) {
      return {
        status: 'error',
        provider: 'OpenAI',
        code: modelsRes.status,
        message: modelsRes.status === 401 ? 'invalid_key' : 'api_error'
      };
    }

    const modelsJson = await modelsRes.json();
    const allModels = (modelsJson.data ?? []).map(m => m.id);

    // Categorize models
    const gpt4Models = allModels.filter(m => m.startsWith('gpt-4')).slice(0, 8);
    const gpt3Models = allModels.filter(m => m.startsWith('gpt-3')).slice(0, 4);
    const o1Models = allModels.filter(m => m.startsWith('o1') || m.startsWith('o3')).slice(0, 4);
    const dallEModels = allModels.filter(m => m.includes('dall-e')).slice(0, 3);
    const whisperModels = allModels.filter(m => m.includes('whisper')).slice(0, 2);
    const embeddingModels = allModels.filter(m => m.includes('embedding')).slice(0, 3);

    return {
      status: 'ok',
      provider: 'OpenAI',
      key_valid: true,
      key_type: 'project',
      billing_api: false,
      billing_note: 'Billing API requires an Org-level key. Showing model access for this project key.',
      total_models: allModels.length,
      available_models: {
        gpt4: gpt4Models,
        gpt3: gpt3Models,
        reasoning: o1Models,
        image: dallEModels,
        audio: whisperModels,
        embeddings: embeddingModels
      },
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
    const latestClaude = models.filter(m => m.includes('claude')).slice(0, 8);
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
// No public billing API via AI Studio. List models to confirm key validity.
async function fetchGemini() {
  try {
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
        const geminiModels = models.filter(m => m.includes('gemini')).slice(0, 8);
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
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    ts: new Date().toISOString(),
    keys_loaded: {
      openai: !!process.env.OPENAI_API_KEY,
      anthropic: !!process.env.ANTHROPIC_API_KEY,
      gemini: !!process.env.GEMINI_API_KEY,
      gemini2: !!process.env.GEMINI_API_KEY_2,
      openrouter: !!process.env.OPENROUTER_API_KEY
    }
  });
});

// ── SPA fallback ──────────────────────────────────────────────────────────────
app.use((_, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[NEXUS] Secure proxy running on http://0.0.0.0:${PORT}`);
  console.log(`[NEXUS] API keys loaded: OpenAI=${!!process.env.OPENAI_API_KEY} | Anthropic=${!!process.env.ANTHROPIC_API_KEY} | Gemini=${!!process.env.GEMINI_API_KEY} | Gemini2=${!!process.env.GEMINI_API_KEY_2} | OpenRouter=${!!process.env.OPENROUTER_API_KEY}`);
});
