import { AlertTriangle } from 'lucide-react';

export default function IncidentBanner({ show }) {
  if (!show) return null;

  return (
    <div className="fade-in mb-8 rounded-xl border border-yellow-700/50 bg-yellow-900/20 px-5 py-4 flex items-start gap-3">
      <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-yellow-300 font-semibold text-sm">Incident in Progress</p>
        <p className="text-yellow-500/80 text-sm mt-0.5">
          Some services are experiencing issues. We are investigating.
        </p>
      </div>
    </div>
  );
}
