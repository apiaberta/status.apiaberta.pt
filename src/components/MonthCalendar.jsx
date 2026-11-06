import { COPY } from '../lib/copy.js';
import {
    daysInMonth,
    formatLongDate,
    formatMonthTitle,
    isoDateFromParts,
    mondayIndex,
    weekdayLabels,
} from '../lib/dates.js';
import { formatPercent } from '../lib/format.js';
import { dayTone, monthUptime } from '../lib/status.js';

const TONE_CLASS = {
    ok: 'bg-status-ok',
    degraded: 'bg-status-degraded',
    down: 'bg-status-down',
    none: 'bg-status-none',
};

const TONE_LABEL = {
    ok: COPY.legendOk,
    degraded: COPY.legendDegraded,
    down: COPY.legendDown,
    none: COPY.legendNone,
};

export default function MonthCalendar({ monthDate, daysByDate, todayIso }) {
    const year = monthDate.getFullYear();
    const monthIndex = monthDate.getMonth();
    const total = daysInMonth(monthDate);
    const lead = mondayIndex(new Date(year, monthIndex, 1));
    const days = Array.from({ length: total }, (_, i) => i + 1);
    const uptime = monthUptime([...daysByDate.values()], year, monthIndex);

    return (
        <section className="min-w-0">
            <div className="mb-3 flex items-baseline justify-between gap-3">
                <h4 className="text-sm font-semibold">{formatMonthTitle(monthDate)}</h4>
                <p className="text-sm tabular-nums text-muted">{formatPercent(uptime)}</p>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
                {weekdayLabels().map((label, index) => (
                    <div key={`${label}-${index}`} className="text-[11px] text-muted">
                        {label}
                    </div>
                ))}
                {Array.from({ length: lead }).map((_, i) => (
                    <div key={`lead-${i}`} className="aspect-square" aria-hidden="true" />
                ))}
                {days.map((day) => {
                    const iso = isoDateFromParts(year, monthIndex, day);
                    const future = iso > todayIso;
                    const record = daysByDate.get(iso);
                    const tone = future ? 'none' : dayTone(record);
                    const failures = record
                        ? (record.down ?? 0) + (record.degraded ?? 0)
                        : 0;
                    return (
                        <div
                            key={iso}
                            title={
                                future
                                    ? undefined
                                    : `${formatLongDate(iso)}: ${TONE_LABEL[tone]}. Uptime ${formatPercent(record?.uptime ?? null)}. Falhas ${failures}.`
                            }
                            className={`flex aspect-square items-center justify-center rounded-sm text-xs tabular-nums ${
                                future
                                    ? 'text-muted/40'
                                    : `${TONE_CLASS[tone]} ${tone === 'none' || tone === 'degraded' ? 'text-foreground' : 'text-white'}`
                            }`}
                        >
                            {day}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
