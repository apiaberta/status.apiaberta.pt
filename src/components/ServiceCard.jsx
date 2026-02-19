import { AlertCircle } from 'lucide-react';
import StatusDot from './StatusDot';
import { latencyBg, relativeTime } from '../utils';

export default function ServiceCard({ service }) {
  const { name, prefix, status, latency_ms, checked_at, error } = service;

  const statusLabel = {
    up: 'Operational',
    down: 'Down',
  }[status] || 'Checking…';

  const statusColor = {
    up: 'text-green-400',
    down: 'text-red-400',
  }[status] || 'text-slate-400';

  const borderColor = {
    up: 'border-slate-700/60 hover:border-slate-600',
    down: 'border-red-800/50 hover:border-red-700',
  }[status] || 'border-slate-700/60';

  return (
    <div className={`rounded-xl border bg-slate-800/40 p-5 flex flex-col gap-3 status-transition transition-colors ${borderColor}`}>
      {/* Top row: dot + name + prefix */}
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          <StatusDot status={status} size="md" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-sm truncate">{name}</h3>
          {prefix && (
            <span className="text-xs font-mono text-slate-500 bg-slate-700/60 px-2 py-0.5 rounded mt-1 inline-block border border-slate-600/40">
              {prefix}
            </span>
          )}
        </div>
      </div>

      {/* Status + latency row */}
      <div className="flex items-center justify-between gap-2">
        <span className={`text-sm font-medium status-transition ${statusColor}`}>
          {statusLabel}
        </span>
        <div className="flex items-center gap-2">
          {latency_ms !== undefined && latency_ms !== null && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-mono font-medium ${latencyBg(latency_ms)}`}>
              {latency_ms}ms
            </span>
          )}
        </div>
      </div>

      {/* Error message */}
      {status === 'down' && error && (
        <div className="flex items-start gap-2 text-xs text-red-400/80 bg-red-900/20 rounded-lg px-3 py-2 border border-red-800/30">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          <span className="break-words">{error}</span>
        </div>
      )}

      {/* Last checked */}
      {checked_at && (
        <p className="text-xs text-slate-600">
          Checked {relativeTime(checked_at)}
        </p>
      )}
    </div>
  );
}
