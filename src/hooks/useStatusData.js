import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchHistory, fetchIncidents, fetchStatus } from '../lib/api.js';
import { mergeServices, overallFromServices } from '../lib/status.js';

const POLL_MS = 60_000;

export function useStatusData() {
    const [status, setStatus] = useState(null);
    const [history, setHistory] = useState(null);
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastFetched, setLastFetched] = useState(null);

    const load = useCallback(async (initial = false) => {
        if (initial) setLoading(true);

        try {
            const [live, hist, inc] = await Promise.all([
                fetchStatus(),
                fetchHistory(90),
                fetchIncidents(90),
            ]);
            setStatus(live);
            setHistory(hist);
            setIncidents(inc);
            setError(null);
            setLastFetched(new Date());
        } catch (err) {
            setError(err?.message || 'network');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load(true);
        const id = setInterval(() => load(false), POLL_MS);
        return () => clearInterval(id);
    }, [load]);

    const services = useMemo(
        () => mergeServices(status, history),
        [status, history],
    );

    const overall = overallFromServices(services, status?.status);

    return {
        status,
        history,
        incidents,
        services,
        overall,
        loading,
        error,
        lastFetched,
        reload: () => load(true),
        historyMissing: !history,
    };
}
