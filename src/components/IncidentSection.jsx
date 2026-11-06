import { COPY } from '../lib/copy.js';
import { formatLongDate, formatTime, toIsoDate } from '../lib/dates.js';
import { formatDurationMin } from '../lib/format.js';

function groupByDay(incidents) {
    const groups = new Map();
    for (const incident of incidents) {
        const day = toIsoDate(new Date(incident.startedAt));
        if (!groups.has(day)) groups.set(day, []);
        groups.get(day).push(incident);
    }
    return [...groups.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1));
}

function titleFor(incident) {
    if (incident.status === 'degraded') {
        return `Desempenho degradado em ${incident.service}`;
    }
    return `Falha em ${incident.service}`;
}

export default function IncidentSection({ incidents }) {
    const today = toIsoDate(new Date());
    const groups = groupByDay(incidents);
    const hasToday = groups.some(([day]) => day === today);

    return (
        <section className="mt-[var(--layout-section-gap)]">
            <h2 className="text-lg font-semibold">{COPY.incidents}</h2>

            {!incidents.length && (
                <p className="mt-4 text-sm text-muted">{COPY.noIncidents}</p>
            )}

            <div className="mt-4 divide-y divide-border border-t border-border">
                {!hasToday && incidents.length > 0 && (
                    <DayBlock iso={today}>
                        <p className="text-sm text-muted">{COPY.noIncidentsToday}</p>
                    </DayBlock>
                )}
                {groups.map(([day, items]) => (
                    <DayBlock key={day} iso={day}>
                        <ul className="flex flex-col gap-4">
                            {items.map((incident, index) => (
                                <li key={`${incident.service}-${incident.startedAt}-${index}`}>
                                    <IncidentItem incident={incident} />
                                </li>
                            ))}
                        </ul>
                    </DayBlock>
                ))}
            </div>
        </section>
    );
}

function DayBlock({ iso, children }) {
    return (
        <div className="py-5">
            <h3 className="mb-3 text-sm font-semibold">{formatLongDate(iso)}</h3>
            {children}
        </div>
    );
}

function IncidentItem({ incident }) {
    const ongoing = !incident.resolvedAt;
    return (
        <div>
            <p className="font-medium">{titleFor(incident)}</p>
            <p className="mt-1 text-sm text-muted">
                {ongoing ? COPY.ongoing : COPY.resolved}
                {' — '}
                {ongoing
                    ? `desde ${formatTime(incident.startedAt)} UTC (${formatDurationMin(incident.durationMin)}).`
                    : `durou ${formatDurationMin(incident.durationMin)} (${formatTime(incident.startedAt)} – ${formatTime(incident.resolvedAt)} UTC).`}
            </p>
        </div>
    );
}
