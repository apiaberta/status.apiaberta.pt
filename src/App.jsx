import { useStatus } from './hooks/useStatus';
import Header from './components/Header';
import IncidentBanner from './components/IncidentBanner';
import GatewayCard from './components/GatewayCard';
import ServicesGrid from './components/ServicesGrid';
import ErrorState from './components/ErrorState';
import Footer from './components/Footer';

function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-8">
        <div className="h-3 w-20 bg-slate-700 rounded mb-3" />
        <div className="h-20 bg-slate-800/60 rounded-xl border border-slate-700/60" />
      </div>
      <div className="mb-8">
        <div className="h-3 w-16 bg-slate-700 rounded mb-3" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-slate-800/60 rounded-xl border border-slate-700/60" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const { data, error, loading, refreshing, countdown, lastFetched } = useStatus();

  // Determine overall display status
  const hasOutage = data?.services?.some((s) => s.status === 'down');
  const displayStatus =
    loading && !data
      ? 'loading'
      : error && !data
      ? 'error'
      : data?.status === 'degraded' || hasOutage
      ? 'degraded'
      : data?.status === 'ok'
      ? 'ok'
      : 'loading';

  const showIncident =
    !loading && !error && data && (data.status === 'degraded' || hasOutage);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0F172A' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Header
          status={displayStatus === 'loading' ? null : displayStatus}
          lastFetched={lastFetched}
          refreshing={refreshing}
          countdown={countdown}
        />

        {/* Main content */}
        <main>
          {/* Incident banner */}
          <IncidentBanner show={showIncident} />

          {/* Error state — no data at all */}
          {error && !data && <ErrorState error={error} />}

          {/* Loading skeleton — first load */}
          {loading && !data && <LoadingSkeleton />}

          {/* Data available */}
          {data && (
            <>
              <GatewayCard gateway={data.gateway} checkedAt={data.checked_at} />
              <ServicesGrid services={data.services} />
            </>
          )}

          {/* Error banner when we have stale data */}
          {error && data && (
            <div className="mb-6 rounded-xl border border-red-800/40 bg-red-900/10 px-4 py-3 flex items-center gap-2 text-sm text-red-400 fade-in">
              <span className="inline-block w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
              Unable to refresh — showing last known state
            </div>
          )}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
