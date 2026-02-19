import { WifiOff } from 'lucide-react';

export default function ErrorState({ error }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center fade-in">
      <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mb-4">
        <WifiOff className="w-7 h-7 text-slate-500" />
      </div>
      <h2 className="text-white font-semibold text-lg mb-2">Unable to reach API</h2>
      <p className="text-slate-500 text-sm max-w-sm">
        The status API is currently unreachable. Retrying automatically…
      </p>
      {error && (
        <p className="mt-3 text-xs text-slate-600 font-mono bg-slate-800/60 px-3 py-2 rounded-lg border border-slate-700">
          {error}
        </p>
      )}
    </div>
  );
}
