import { Link } from 'react-router-dom';
import { WifiOff } from 'lucide-react';
import IncidentSection from '../components/IncidentSection.jsx';
import Layout from '../components/Layout.jsx';
import Legend from '../components/Legend.jsx';
import ServiceRow from '../components/ServiceRow.jsx';
import StatusBanner from '../components/StatusBanner.jsx';
import { useStatusData } from '../hooks/useStatusData.js';
import { COPY } from '../lib/copy.js';
import { relativeFromNow } from '../lib/format.js';

export default function StatusPage() {
    const {
        services,
        overall,
        incidents,
        loading,
        error,
        lastFetched,
        reload,
        status,
    } = useStatusData();

    return (
        <Layout>
            {error && !status && (
                <ErrorPanel onRetry={reload} />
            )}

            {(status || (!error && loading)) && (
                <>
                    <StatusBanner overall={loading && !status ? 'unknown' : overall} />

                    <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-muted">
                            {lastFetched
                                ? `${COPY.lastChecked} ${relativeFromNow(lastFetched.toISOString())}.`
                                : 'Uptime dos últimos 90 dias.'}
                        </p>
                        <Link
                            to="/uptime"
                            className="text-sm font-medium text-primary underline-offset-2 hover:underline"
                        >
                            {COPY.viewUptime}
                        </Link>
                    </div>

                    {error && status && (
                        <p className="mt-3 text-sm text-status-down" role="status">
                            {COPY.refreshError}
                        </p>
                    )}

                    <div className="mt-6 overflow-hidden rounded-lg border border-border bg-card">
                        {loading && !services.length ? (
                            <LoadingRows />
                        ) : (
                            <div className="divide-y divide-border">
                                {services.map((service) => (
                                    <ServiceRow key={service.key} service={service} />
                                ))}
                            </div>
                        )}
                        <div className="border-t border-border">
                            <Legend />
                        </div>
                    </div>

                    <IncidentSection incidents={incidents} />
                </>
            )}
        </Layout>
    );
}

function LoadingRows() {
    return (
        <div className="divide-y divide-border">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse px-[var(--layout-card-padding)] py-5">
                    <div className="mb-3 h-4 w-40 rounded bg-status-none" />
                    <div className="h-8 rounded bg-status-none" />
                </div>
            ))}
        </div>
    );
}

function ErrorPanel({ onRetry }) {
    return (
        <div role="alert" className="py-16 text-center">
            <WifiOff className="mx-auto size-8 text-muted" aria-hidden="true" />
            <h1 className="mt-4 text-lg font-semibold">{COPY.unreachable}</h1>
            <p className="mt-2 text-sm text-muted">{COPY.retrying}</p>
            <button
                type="button"
                onClick={onRetry}
                className="mt-6 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
                {COPY.retry}
            </button>
        </div>
    );
}
