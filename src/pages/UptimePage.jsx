import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import Legend from '../components/Legend.jsx';
import MonthCalendar from '../components/MonthCalendar.jsx';
import { useDemoLink } from '../hooks/useDemo.js';
import { useStatusData } from '../hooks/useStatusData.js';
import { COPY } from '../lib/copy.js';
import { addMonths, startOfMonth, toIsoDate } from '../lib/dates.js';

export default function UptimePage() {
    const { services, loading } = useStatusData();
    const homeLink = useDemoLink('/');
    const [offset, setOffset] = useState(0);
    const todayIso = toIsoDate(new Date());

    const months = useMemo(() => {
        const end = addMonths(startOfMonth(new Date()), -(offset * 3));
        return [addMonths(end, -2), addMonths(end, -1), end];
    }, [offset]);

    return (
        <Layout>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <h1 className="text-lg font-semibold">{COPY.uptimeHistory}</h1>
                <Link
                    to={homeLink}
                    className="text-sm font-medium text-primary underline-offset-2 hover:underline"
                >
                    {COPY.backToStatus}
                </Link>
            </div>

            <div className="mt-6 flex items-center justify-between gap-3">
                <button
                    type="button"
                    onClick={() => setOffset((value) => value + 1)}
                    className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-3 py-2 text-sm"
                    aria-label={COPY.previousMonths}
                >
                    <ChevronLeft className="icon-cap" aria-hidden="true" />
                    Anteriores
                </button>
                <button
                    type="button"
                    onClick={() => setOffset((value) => Math.max(0, value - 1))}
                    disabled={offset === 0}
                    className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label={COPY.nextMonths}
                >
                    Seguintes
                    <ChevronRight className="icon-cap" aria-hidden="true" />
                </button>
            </div>

            {loading && !services.length ? (
                <p className="mt-8 text-sm text-muted">{COPY.checking}</p>
            ) : (
                <div className="mt-8 flex flex-col gap-10">
                    {services.map((service) => (
                        <ServiceCalendars
                            key={service.key}
                            service={service}
                            months={months}
                            todayIso={todayIso}
                        />
                    ))}
                </div>
            )}

            <div className="mt-10 rounded-lg border border-border bg-card">
                <Legend />
            </div>
        </Layout>
    );
}

function ServiceCalendars({ service, months, todayIso }) {
    const daysByDate = useMemo(() => {
        const map = new Map();
        for (const day of service.historyDays || service.days || []) {
            map.set(day.date, day);
        }
        return map;
    }, [service.historyDays, service.days]);

    return (
        <section>
            <h2 className="mb-4 text-base font-semibold">{service.name}</h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {months.map((monthDate) => (
                    <MonthCalendar
                        key={`${service.key}-${monthDate.getFullYear()}-${monthDate.getMonth()}`}
                        monthDate={monthDate}
                        daysByDate={daysByDate}
                        todayIso={todayIso}
                    />
                ))}
            </div>
        </section>
    );
}
