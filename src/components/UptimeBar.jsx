import { useEffect, useRef, useState } from 'react';
import { COPY } from '../lib/copy.js';
import { formatLongDate } from '../lib/dates.js';
import { formatPercent } from '../lib/format.js';
import { dayTone } from '../lib/status.js';

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

export default function UptimeBar({ days, uptime }) {
    const [open, setOpen] = useState(null);
    const [instant, setInstant] = useState(false);
    const showTimer = useRef(null);
    const hideTimer = useRef(null);

    useEffect(() => () => {
        clearTimeout(showTimer.current);
        clearTimeout(hideTimer.current);
    }, []);

    function clearTimers() {
        clearTimeout(showTimer.current);
        clearTimeout(hideTimer.current);
    }

    function show(index) {
        clearTimers();
        if (instant) {
            setOpen(index);
            return;
        }
        showTimer.current = setTimeout(() => {
            setOpen(index);
            setInstant(true);
        }, 500);
    }

    function hide() {
        clearTimeout(showTimer.current);
        hideTimer.current = setTimeout(() => {
            setOpen(null);
            setInstant(false);
        }, 80);
    }

    const summary = days
        .filter((day) => dayTone(day) !== 'ok' && dayTone(day) !== 'none')
        .map((day) => `${formatLongDate(day.date)} ${TONE_LABEL[dayTone(day)]}`)
        .join('; ');

    return (
        <div>
            <div
                className="relative flex h-8 items-stretch gap-px"
                role="img"
                aria-label={`Uptime a 90 dias: ${formatPercent(uptime)}.${summary ? ` Dias com falhas ou degradação: ${summary}.` : ''}`}
                onMouseLeave={hide}
            >
                {days.map((day, index) => {
                    const tone = dayTone(day);
                    const failures = (day.down ?? 0) + (day.degraded ?? 0);
                    return (
                        <div
                            key={day.date}
                            className={`relative min-w-0 flex-1 rounded-px ${TONE_CLASS[tone]}`}
                            onMouseEnter={() => show(index)}
                            onClick={() => {
                                setInstant(true);
                                setOpen((current) => (current === index ? null : index));
                            }}
                        >
                            {open === index && (
                                <span
                                    role="tooltip"
                                    className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-max max-w-48 -translate-x-1/2 rounded-md bg-foreground px-3 py-2 text-left text-xs text-background shadow-sm"
                                >
                                    <span className="block font-medium">
                                        {formatLongDate(day.date)}
                                    </span>
                                    <span className="mt-1 block">
                                        Uptime {formatPercent(day.uptime)}
                                    </span>
                                    <span className="block">
                                        Falhas {failures}
                                    </span>
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
            <div className="mt-2 flex items-center justify-between gap-3 text-xs text-muted">
                <span>{COPY.daysAgo}</span>
                <span className="font-medium text-foreground tabular-nums">
                    {formatPercent(uptime)}
                </span>
                <span>{COPY.today}</span>
            </div>
        </div>
    );
}
