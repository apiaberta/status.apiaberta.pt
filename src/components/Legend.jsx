import { COPY } from '../lib/copy.js';

const ITEMS = [
    { tone: 'ok', label: COPY.legendOk, className: 'bg-status-ok' },
    { tone: 'degraded', label: COPY.legendDegraded, className: 'bg-status-degraded' },
    { tone: 'down', label: COPY.legendDown, className: 'bg-status-down' },
    { tone: 'none', label: COPY.legendNone, className: 'bg-status-none' },
];

export default function Legend() {
    return (
        <ul className="flex flex-wrap gap-x-4 gap-y-2 px-[var(--layout-card-padding)] py-4 text-xs text-muted">
            {ITEMS.map((item) => (
                <li key={item.tone} className="flex items-center gap-2">
                    <span
                        className={`h-2.5 w-2.5 rounded-px ${item.className}`}
                        aria-hidden="true"
                    />
                    {item.label}
                </li>
            ))}
        </ul>
    );
}
