/**
 * Format uptime seconds into "Xd Xh Xm"
 */
export function formatUptime(seconds) {
  if (!seconds && seconds !== 0) return '—';
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const parts = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0) parts.push(`${h}h`);
  if (m > 0 || parts.length === 0) parts.push(`${m}m`);
  return parts.join(' ');
}

/**
 * Relative time: "just now", "2 min ago", etc.
 */
export function relativeTime(isoString) {
  if (!isoString) return '—';
  const now = Date.now();
  const then = new Date(isoString).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 10) return 'just now';
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

/**
 * Latency color class
 */
export function latencyColor(ms) {
  if (ms === null || ms === undefined) return 'text-slate-400';
  if (ms < 100) return 'text-green-400';
  if (ms < 500) return 'text-yellow-400';
  return 'text-red-400';
}

/**
 * Latency background badge color
 */
export function latencyBg(ms) {
  if (ms === null || ms === undefined) return 'bg-slate-700 text-slate-400';
  if (ms < 100) return 'bg-green-900/40 text-green-400 border border-green-800/50';
  if (ms < 500) return 'bg-yellow-900/40 text-yellow-400 border border-yellow-800/50';
  return 'bg-red-900/40 text-red-400 border border-red-800/50';
}

/**
 * Format a full timestamp for display
 */
export function formatTimestamp(isoString) {
  if (!isoString) return '—';
  const d = new Date(isoString);
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) +
    ' UTC';
}
