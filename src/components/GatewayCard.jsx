import { Server, Clock, Tag } from 'lucide-react';
import StatusDot from './StatusDot';
import { formatUptime, latencyBg } from '../utils';

export default function GatewayCard({ gateway, checkedAt }) {
  if (!gateway) return null;

  const { status, uptime_s, version, latency_ms } = gateway;

  return (
    <div className="mb-8">
      <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
        Gateway
      </h2>
      <div className="rounded-xl border border-slate-700/60 bg-slate-800/40 p-5 flex flex-col sm:flex-row sm:items-center gap-4 status-transition hover:border-slate-600 transition-colors">
        {/* Status + name */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <StatusDot status={status} size="lg" />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-white font-semibold text-base">Gateway</span>
              {version && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-400 font-mono border border-slate-600">
                  v{version}
                </span>
              )}
            </div>
            <p className={`text-sm mt-0.5 font-medium status-transition ${
              status === 'up' ? 'text-green-400' : 
              status === 'down' ? 'text-red-400' : 'text-slate-400'
            }`}>
              {status === 'up' ? 'Operational' : status === 'down' ? 'Down' : 'Unknown'}
            </p>
          </div>
        </div>

        {/* Uptime */}
        <div className="flex items-center gap-1.5 text-slate-400 text-sm">
          <Clock className="w-3.5 h-3.5" />
          <span className="text-slate-300 font-medium">{formatUptime(uptime_s)}</span>
          <span className="text-slate-500 text-xs">uptime</span>
        </div>

        {/* Latency */}
        {latency_ms !== undefined && latency_ms !== null && (
          <div className={`text-xs px-2.5 py-1 rounded-full font-mono font-medium ${latencyBg(latency_ms)}`}>
            {latency_ms}ms
          </div>
        )}
      </div>
    </div>
  );
}
