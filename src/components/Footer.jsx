import { Github, RefreshCw } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 mt-16 py-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
        <div className="flex items-center gap-1">
          <span>Powered by</span>
          <a
            href="https://apiaberta.pt"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:text-green-400 transition-colors font-medium ml-1"
          >
            API Aberta
          </a>
        </div>

        <div className="flex items-center gap-1.5 text-slate-600">
          <RefreshCw className="w-3 h-3" />
          <span>Status updates every 30 seconds</span>
        </div>

        <a
          href="https://github.com/apiaberta"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-slate-600 hover:text-slate-400 transition-colors"
        >
          <Github className="w-3.5 h-3.5" />
          <span>apiaberta</span>
        </a>
      </div>
    </footer>
  );
}
