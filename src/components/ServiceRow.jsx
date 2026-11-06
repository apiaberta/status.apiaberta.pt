import { COPY } from '../lib/copy.js';
import { currentLabel } from '../lib/status.js';
import UptimeBar from './UptimeBar.jsx';

const STATUS_CLASS = {
    operational: 'text-status-ok-fg',
    degraded: 'text-status-degraded-fg',
    down: 'text-status-down',
    unknown: 'text-muted',
};

const STATUS_TEXT = {
    operational: COPY.operational,
    degraded: COPY.serviceDegraded,
    down: COPY.serviceDown,
    unknown: COPY.checking,
};

export default function ServiceRow({ service }) {
    const label = currentLabel(service.status);

    return (
        <article className="px-[var(--layout-card-padding)] py-5">
            <div className="mb-3 flex items-baseline justify-between gap-4">
                <h3 className="text-base font-medium text-foreground">
                    {service.name}
                </h3>
                <p className={`shrink-0 text-sm font-medium ${STATUS_CLASS[label]}`}>
                    {STATUS_TEXT[label]}
                </p>
            </div>
            <UptimeBar days={service.days} uptime={service.uptime} />
        </article>
    );
}
