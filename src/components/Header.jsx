import { CheckCircle2, AlertTriangle, XCircle, RefreshCw } from 'lucide-react';
import { formatTimestamp } from '../utils';

function OverallBadge({ status }) {
  if (status === 'ok') {
    return (
      <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-green-900/40 border border-green-700/50 status-transition">
        <CheckCircle2 className="w-5 h-5 text-green-400" />
        <span className="text-green-300 font-semibold text-sm tracking-wide uppercase">
          All Systems Operational
        </span>
      </div>
    );
  }
  if (status === 'degraded') {
    return (
      <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-yellow-900/40 border border-yellow-700/50 status-transition">
        <AlertTriangle className="w-5 h-5 text-yellow-400" />
        <span className="text-yellow-300 font-semibold text-sm tracking-wide uppercase">
          Degraded Performance
        </span>
      </div>
    );
  }
  if (status === 'error') {
    return (
      <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-900/40 border border-red-700/50 status-transition">
        <XCircle className="w-5 h-5 text-red-400" />
        <span className="text-red-300 font-semibold text-sm tracking-wide uppercase">
          Major Outage
        </span>
      </div>
    );
  }
  // Loading / unknown
  return (
    <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-700/50 border border-slate-600 status-transition">
      <span className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full spin inline-block" />
      <span className="text-slate-400 font-semibold text-sm tracking-wide uppercase">
        Checking…
      </span>
    </div>
  );
}

export default function Header({ status, lastFetched, refreshing, countdown }) {
  return (
    <header className="py-12 text-center">
      {/* Logo */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          <span className="text-green-400">API</span> Aberta
        </h1>
        <p className="text-slate-400 text-sm mt-1 font-medium tracking-widest uppercase">
          System Status
        </p>
      </div>

      {/* Overall status badge */}
      <div className="flex justify-center mb-6">
        <OverallBadge status={status} />
      </div>

      {/* Last checked + countdown */}
      <div className="flex items-center justify-center gap-3 text-slate-500 text-xs">
        {refreshing ? (
          <span className="flex items-center gap-1.5 text-slate-400">
            <RefreshCw className="w-3 h-3 spin" />
            Refreshing…
          </span>
        ) : (
          <>
            {lastFetched && (
              <span>
                Last checked: <span className="text-slate-400">{formatTimestamp(lastFetched.toISOString())}</span>
              </span>
            )}
            <span className="text-slate-700">•</span>
            <span>Next check in <span className="text-slate-400 font-medium">{countdown}s</span></span>
          </>
        )}
      </div>
    </header>
  );
}
