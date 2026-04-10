/**
 * AICreditsPanel — AI Provider Intelligence
 * Polls /api/ai-credits (Express proxy) — keys NEVER in this file.
 * Polling intervals: OpenRouter=2min | OpenAI=10min | Anthropic=15min | Gemini=10min
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  RefreshCw, Zap, AlertCircle, CheckCircle, Clock,
  TrendingUp, Server, Key, DollarSign, Activity, ChevronDown, ChevronUp
} from 'lucide-react';

// Polling intervals in milliseconds
const INTERVALS = {
  openrouter: 2 * 60 * 1000,
  openai:     10 * 60 * 1000,
  anthropic:  15 * 60 * 1000,
  gemini:     10 * 60 * 1000,
};

const PROVIDER_META = {
  openrouter: { label: 'OpenRouter',  color: '#7C3AED', bg: '#1a0f2e', accent: '#a78bfa' },
  openai:     { label: 'OpenAI',      color: '#10B981', bg: '#0a1f16', accent: '#34d399' },
  anthropic:  { label: 'Anthropic',   color: '#F59E0B', bg: '#1f1700', accent: '#fbbf24' },
  gemini:     { label: 'Gemini',      color: '#3B82F6', bg: '#0a1020', accent: '#60a5fa' },
};

function formatUSD(val) {
  if (val === null || val === undefined) return 'N/A';
  return `$${parseFloat(val).toFixed(4)}`;
}

function formatTimeAgo(iso) {
  if (!iso) return 'Never';
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

function formatCountdown(ms) {
  if (ms <= 0) return 'now';
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

// ── Mini sparkline (SVG) ────────────────────────────────────────────────────
function Sparkline({ data, color }) {
  if (!data || data.length < 2) return <span className="text-xs text-slate-500">No trend data</span>;
  const vals = data.map(d => d.usd);
  const max = Math.max(...vals, 0.001);
  const w = 120, h = 32;
  const pts = vals.map((v, i) => {
    const x = (i / (vals.length - 1)) * w;
    const y = h - (v / max) * h;
    return `${x},${y}`;
  }).join(' ');
  return (
    <div className="flex flex-col gap-1">
      <svg width={w} height={h} className="overflow-visible">
        <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
        {vals.map((v, i) => {
          const x = (i / (vals.length - 1)) * w;
          const y = h - (v / max) * h;
          return <circle key={i} cx={x} cy={y} r="2.5" fill={color} />;
        })}
      </svg>
      <div className="flex justify-between text-xs font-mono" style={{ color }}>
        <span>{data[0]?.date?.slice(5)}</span>
        <span>{data[data.length - 1]?.date?.slice(5)}</span>
      </div>
    </div>
  );
}

// ── Circular gauge ───────────────────────────────────────────────────────────
function GaugeArc({ pct }) {
  const r = 28, cx = 36, cy = 36;
  const circ = 2 * Math.PI * r;
  const p = Math.min(Math.max(pct, 0), 100);
  const color = p < 60 ? '#00FF94' : p < 85 ? '#FFB800' : '#FF3B5C';
  return (
    <svg width="72" height="72">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1e293b" strokeWidth="6" />
      <circle
        cx={cx} cy={cy} r={r} fill="none"
        stroke={color} strokeWidth="6"
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - p / 100)}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: 'stroke-dashoffset 1s ease, stroke 0.5s' }}
      />
      <text x={cx} y={cy + 5} textAnchor="middle" fill={color}
        fontSize="13" fontFamily="'JetBrains Mono', monospace" fontWeight="700">
        {p}%
      </text>
    </svg>
  );
}

// ── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status, keyValid }) {
  if (status === 'ok') {
    return (
      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono"
        style={{ background: '#00FF9420', color: '#00FF94', border: '1px solid #00FF9440' }}>
        <CheckCircle size={10} /> ACTIVE
      </span>
    );
  }
  if (status === 'loading') {
    return (
      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono"
        style={{ background: '#00D4FF20', color: '#00D4FF', border: '1px solid #00D4FF40' }}>
        <Activity size={10} className="animate-spin" /> POLLING
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono"
      style={{ background: '#FF3B5C20', color: '#FF3B5C', border: '1px solid #FF3B5C40' }}>
      <AlertCircle size={10} /> ERROR
    </span>
  );
}

// ── OpenRouter Card ──────────────────────────────────────────────────────────
function OpenRouterCard({ data, onRefresh, nextIn, loading }) {
  const meta = PROVIDER_META.openrouter;
  return (
    <ProviderCard meta={meta} data={data} onRefresh={onRefresh} nextIn={nextIn} loading={loading}
      interval="2 min" renderBody={() => (
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            {data.pct_used !== undefined && <GaugeArc pct={data.pct_used} />}
            <div className="space-y-1.5 flex-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Used</span>
                <span style={{ color: meta.accent }}>{formatUSD(data.used_usd)}</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Limit</span>
                <span className="text-slate-200">{data.limit_usd !== null ? formatUSD(data.limit_usd) : 'Unlimited'}</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Remaining</span>
                <span style={{ color: '#00FF94' }}>{data.balance_usd !== null ? formatUSD(data.balance_usd) : 'Unlimited'}</span>
              </div>
              {data.is_free_tier && (
                <span className="inline-block px-2 py-0.5 rounded text-xs font-mono"
                  style={{ background: '#7C3AED30', color: '#a78bfa' }}>FREE TIER</span>
              )}
            </div>
          </div>
          {data.rate_limit && (
            <div className="pt-2 border-t border-slate-700">
              <div className="text-xs font-mono text-slate-400 mb-1">RATE LIMIT</div>
              <div className="text-xs font-mono" style={{ color: meta.accent }}>
                {data.rate_limit.requests} req / {data.rate_limit.interval}
              </div>
            </div>
          )}
          {data.label && (
            <div className="text-xs font-mono text-slate-500">Key: {data.label}</div>
          )}
        </div>
      )}
    />
  );
}

// ── OpenAI Card ──────────────────────────────────────────────────────────────
function OpenAICard({ data, onRefresh, nextIn, loading }) {
  const meta = PROVIDER_META.openai;
  const [expanded, setExpanded] = useState(false);
  const models = data.available_models ?? {};
  const categories = [
    { key: 'gpt4',       label: 'GPT-4',       list: models.gpt4 ?? [] },
    { key: 'reasoning',  label: 'Reasoning',   list: models.reasoning ?? [] },
    { key: 'gpt3',       label: 'GPT-3.5',     list: models.gpt3 ?? [] },
    { key: 'image',      label: 'Image',        list: models.image ?? [] },
    { key: 'audio',      label: 'Audio',        list: models.audio ?? [] },
    { key: 'embeddings', label: 'Embeddings',   list: models.embeddings ?? [] },
  ].filter(c => c.list.length > 0);
  return (
    <ProviderCard meta={meta} data={data} onRefresh={onRefresh} nextIn={nextIn} loading={loading}
      interval="10 min" renderBody={() => (
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-2 rounded" style={{ background: '#ffffff08' }}>
            <Key size={14} style={{ color: meta.accent }} />
            <div>
              <div className="text-xs font-mono" style={{ color: meta.accent }}>KEY VALID — PROJECT SCOPE</div>
              <div className="text-xs font-mono text-slate-400">Billing API requires Org-level key</div>
            </div>
          </div>
          {data.billing_note && (
            <div className="text-xs font-mono text-slate-500 px-1">{data.billing_note}</div>
          )}
          <div className="pt-2 border-t border-slate-700">
            <button
              onClick={() => setExpanded(e => !e)}
              className="flex items-center gap-1 text-xs font-mono mb-2 hover:opacity-80"
              style={{ color: meta.accent }}
            >
              {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              {data.total_models ?? 0} MODELS AVAILABLE
            </button>
            {expanded && (
              <div className="space-y-2">
                {categories.map(cat => (
                  <div key={cat.key}>
                    <div className="text-xs font-mono text-slate-500 mb-1">{cat.label}</div>
                    <div className="flex flex-wrap gap-1">
                      {cat.list.map(m => (
                        <div key={m} className="text-xs font-mono px-2 py-0.5 rounded"
                          style={{ background: '#10B98110', color: '#34d399' }}>
                          {m}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    />
  );
}

// ── Anthropic Card ───────────────────────────────────────────────────────────
function AnthropicCard({ data, onRefresh, nextIn, loading }) {
  const meta = PROVIDER_META.anthropic;
  const [expanded, setExpanded] = useState(false);
  return (
    <ProviderCard meta={meta} data={data} onRefresh={onRefresh} nextIn={nextIn} loading={loading}
      interval="15 min" renderBody={() => (
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-2 rounded" style={{ background: '#ffffff08' }}>
            <Key size={14} style={{ color: meta.accent }} />
            <div>
              <div className="text-xs font-mono" style={{ color: meta.accent }}>KEY VALID</div>
              <div className="text-xs font-mono text-slate-400">No public billing API</div>
            </div>
          </div>
          <div className="text-xs font-mono text-slate-400">{data.note}</div>
          <div className="pt-2 border-t border-slate-700">
            <button
              onClick={() => setExpanded(e => !e)}
              className="flex items-center gap-1 text-xs font-mono mb-2 hover:opacity-80"
              style={{ color: meta.accent }}
            >
              {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              {data.total_models} MODELS AVAILABLE
            </button>
            {expanded && (
              <div className="space-y-1">
                {(data.available_models ?? []).map(m => (
                  <div key={m} className="text-xs font-mono px-2 py-1 rounded"
                    style={{ background: '#F59E0B10', color: '#fbbf24' }}>
                    {m}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    />
  );
}

// ── Gemini Card ──────────────────────────────────────────────────────────────
function GeminiCard({ data, onRefresh, nextIn, loading }) {
  const meta = PROVIDER_META.gemini;
  const [expandedKey, setExpandedKey] = useState(null);
  return (
    <ProviderCard meta={meta} data={data} onRefresh={onRefresh} nextIn={nextIn} loading={loading}
      interval="10 min" renderBody={() => (
        <div className="space-y-3">
          <div className="text-xs font-mono text-slate-400">{data.note}</div>
          {(data.keys ?? []).map(k => (
            <div key={k.key_index} className="rounded p-2" style={{ background: '#ffffff08', border: '1px solid #ffffff10' }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono" style={{ color: meta.accent }}>KEY {k.key_index}</span>
                {k.status === 'ok'
                  ? <span className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ background: '#00FF9420', color: '#00FF94' }}>✓ VALID</span>
                  : <span className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ background: '#FF3B5C20', color: '#FF3B5C' }}>✗ ERROR {k.code}</span>
                }
              </div>
              {k.status === 'ok' && (
                <>
                  <button
                    onClick={() => setExpandedKey(expandedKey === k.key_index ? null : k.key_index)}
                    className="flex items-center gap-1 text-xs font-mono hover:opacity-80 mt-1"
                    style={{ color: '#60a5fa' }}
                  >
                    {expandedKey === k.key_index ? <ChevronUp size={11}/> : <ChevronDown size={11}/>}
                    {k.total_models} models
                  </button>
                  {expandedKey === k.key_index && (
                    <div className="mt-1 space-y-0.5">
                      {(k.available_models ?? []).map(m => (
                        <div key={m} className="text-xs font-mono px-2 py-0.5 rounded"
                          style={{ background: '#3B82F610', color: '#60a5fa' }}>{m}</div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    />
  );
}

// ── Generic ProviderCard wrapper ─────────────────────────────────────────────
function ProviderCard({ meta, data, onRefresh, nextIn, loading, interval, renderBody }) {
  const isErr = data?.status === 'error';
  const isLoading = loading || data?.status === 'loading';
  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-3 transition-all duration-300"
      style={{
        background: meta.bg,
        border: `1px solid ${meta.color}30`,
        boxShadow: isErr ? `0 0 12px ${meta.color}10` : `0 0 20px ${meta.color}15`,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: meta.color }} />
          <span className="font-mono font-bold text-sm" style={{ color: meta.color }}>
            {meta.label.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={isLoading ? 'loading' : data?.status} />
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-1 rounded hover:opacity-70 transition-opacity"
            style={{ color: meta.accent }}
            title="Refresh now"
          >
            <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Body */}
      {isLoading ? (
        <div className="space-y-2 animate-pulse">
          <div className="h-3 rounded bg-slate-700 w-3/4" />
          <div className="h-3 rounded bg-slate-700 w-1/2" />
          <div className="h-3 rounded bg-slate-700 w-2/3" />
        </div>
      ) : isErr ? (
        <div className="flex items-center gap-2 p-3 rounded" style={{ background: '#FF3B5C15' }}>
          <AlertCircle size={14} className="text-red-400" />
          <div>
            <div className="text-xs font-mono text-red-400">FETCH FAILED</div>
            {data?.code && <div className="text-xs font-mono text-slate-500">HTTP {data.code}</div>}
            {data?.message && <div className="text-xs font-mono text-slate-500">{data.message}</div>}
          </div>
        </div>
      ) : renderBody()}

      {/* Footer: timing */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800">
        <div className="flex items-center gap-1 text-xs font-mono text-slate-500">
          <Clock size={10} />
          <span>Next: <span style={{ color: meta.accent }}>{formatCountdown(nextIn)}</span></span>
        </div>
        <div className="text-xs font-mono text-slate-600">
          Every {interval} · {data?.fetched_at ? formatTimeAgo(data.fetched_at) : '—'}
        </div>
      </div>
    </div>
  );
}

// ── Main Panel ────────────────────────────────────────────────────────────────
export default function AICreditsPanel() {
  const [providers, setProviders] = useState({});
  const [loading, setLoading] = useState(true);
  const [lastFetch, setLastFetch] = useState(null);
  const [nextRefresh, setNextRefresh] = useState(Object.fromEntries(
    Object.keys(INTERVALS).map(k => [k, INTERVALS[k]])
  ));
  const timers = useRef({});
  const countdownRef = useRef(null);
  const lastFetchTime = useRef({});

  const fetchCredits = useCallback(async (providerKey = null) => {
    if (providerKey) {
      setProviders(p => ({ ...p, [providerKey]: { ...p[providerKey], status: 'loading' } }));
    } else {
      setLoading(true);
    }
    try {
      const res = await fetch('/api/ai-credits');
      if (!res.ok) throw new Error('proxy error');
      const json = await res.json();
      setProviders(json.providers ?? {});
      setLastFetch(json.fetched_at);
      // Reset countdowns
      const now = Date.now();
      Object.keys(INTERVALS).forEach(k => { lastFetchTime.current[k] = now; });
      setNextRefresh(Object.fromEntries(Object.keys(INTERVALS).map(k => [k, INTERVALS[k]])));
    } catch (e) {
      setProviders(p => {
        const out = { ...p };
        ['openrouter','openai','anthropic','gemini'].forEach(k => {
          if (!out[k] || out[k].status !== 'ok') out[k] = { status: 'error', message: 'proxy_unavailable' };
        });
        return out;
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch + per-provider interval timers
  useEffect(() => {
    fetchCredits();
    const now = Date.now();
    Object.keys(INTERVALS).forEach(k => {
      lastFetchTime.current[k] = now;
      timers.current[k] = setInterval(() => fetchCredits(), INTERVALS[k]);
    });
    return () => Object.values(timers.current).forEach(clearInterval);
  }, [fetchCredits]);

  // Countdown tick every second
  useEffect(() => {
    countdownRef.current = setInterval(() => {
      const now = Date.now();
      setNextRefresh(Object.fromEntries(
        Object.keys(INTERVALS).map(k => [
          k,
          Math.max(0, INTERVALS[k] - (now - (lastFetchTime.current[k] ?? now)))
        ])
      ));
    }, 1000);
    return () => clearInterval(countdownRef.current);
  }, []);

  const handleRefresh = (key) => {
    clearInterval(timers.current[key]);
    fetchCredits();
    lastFetchTime.current[key] = Date.now();
    timers.current[key] = setInterval(() => fetchCredits(), INTERVALS[key]);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Panel header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg" style={{ background: '#00D4FF15', border: '1px solid #00D4FF30' }}>
            <DollarSign size={20} style={{ color: '#00D4FF' }} />
          </div>
          <div>
            <h2 className="text-lg font-bold font-mono" style={{ color: '#00D4FF' }}>
              AI PROVIDER INTELLIGENCE
            </h2>
            <p className="text-xs font-mono text-slate-400">
              Credits, usage & availability — polled via secure proxy
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {lastFetch && (
            <span className="text-xs font-mono text-slate-500">
              Last sync: {formatTimeAgo(lastFetch)}
            </span>
          )}
          <button
            onClick={() => fetchCredits()}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all"
            style={{
              background: '#00D4FF15',
              border: '1px solid #00D4FF40',
              color: '#00D4FF'
            }}
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            REFRESH ALL
          </button>
        </div>
      </div>

      {/* Security notice */}
      <div className="flex items-start gap-2 px-4 py-2.5 rounded-lg text-xs font-mono"
        style={{ background: '#00FF9408', border: '1px solid #00FF9420', color: '#00FF9480' }}>
        <CheckCircle size={12} className="mt-0.5 shrink-0" style={{ color: '#00FF94' }} />
        <span>
          API keys are stored server-side only and never transmitted to this browser.
          Data is fetched via a secure local proxy and is not cached in any external service.
        </span>
      </div>

      {/* Provider cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <OpenRouterCard
          data={providers.openrouter ?? {}}
          loading={loading}
          onRefresh={() => handleRefresh('openrouter')}
          nextIn={nextRefresh.openrouter ?? INTERVALS.openrouter}
        />
        <OpenAICard
          data={providers.openai ?? {}}
          loading={loading}
          onRefresh={() => handleRefresh('openai')}
          nextIn={nextRefresh.openai ?? INTERVALS.openai}
        />
        <AnthropicCard
          data={providers.anthropic ?? {}}
          loading={loading}
          onRefresh={() => handleRefresh('anthropic')}
          nextIn={nextRefresh.anthropic ?? INTERVALS.anthropic}
        />
        <GeminiCard
          data={providers.gemini ?? {}}
          loading={loading}
          onRefresh={() => handleRefresh('gemini')}
          nextIn={nextRefresh.gemini ?? INTERVALS.gemini}
        />
      </div>

      {/* Polling schedule legend */}
      <div className="grid grid-cols-4 gap-3">
        {Object.entries(PROVIDER_META).map(([k, m]) => (
          <div key={k} className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono"
            style={{ background: '#ffffff05', border: `1px solid ${m.color}20` }}>
            <span style={{ color: m.color }}>{m.label}</span>
            <span className="text-slate-500">/{k === 'openrouter' ? '2m' : k === 'anthropic' ? '15m' : '10m'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
