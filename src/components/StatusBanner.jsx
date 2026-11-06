import { AlertTriangle, CheckCircle2, LoaderCircle, XCircle } from 'lucide-react';
import { COPY } from '../lib/copy.js';

const TONES = {
    ok: {
        label: COPY.allOk,
        className: 'bg-status-ok text-white',
        Icon: CheckCircle2,
    },
    degraded: {
        label: COPY.degraded,
        className: 'bg-status-degraded text-status-degraded-fg',
        Icon: AlertTriangle,
    },
    down: {
        label: COPY.down,
        className: 'bg-status-down text-white',
        Icon: XCircle,
    },
    unknown: {
        label: COPY.unknown,
        className: 'bg-zinc-200 text-foreground',
        Icon: LoaderCircle,
    },
};

export default function StatusBanner({ overall }) {
    const tone = TONES[overall] || TONES.unknown;
    const Icon = tone.Icon;

    return (
        <div
            role="status"
            aria-live="polite"
            className={`flex items-center justify-center gap-3 rounded-md px-4 py-5 text-center ${tone.className}`}
        >
            <Icon
                className={`icon-cap shrink-0 ${overall === 'unknown' ? 'animate-spin' : ''}`}
                aria-hidden="true"
            />
            <h1 className="text-xl font-semibold sm:text-2xl">{tone.label}</h1>
        </div>
    );
}
