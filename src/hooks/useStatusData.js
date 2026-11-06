import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchHistory, fetchIncidents, fetchStatus } from '../lib/api.js';
import { buildDemoData } from '../lib/demo.js';
import { mergeServices, overallFromServices } from '../lib/status.js';
import { useDemo } from './useDemo.js';

const POLL_MS = 60_000;

export function useStatusData() {
    const demo = useDemo();
    const [status, setStatus] = useState(null);
    const [history, setHistory] = useState(null);
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastFetched, setLastFetched] = useState(null);

    const load = useCallback(async (initial = false) => {
        if (demo) {
            const sample = buildDemoData();
            setStatus(sample.status);
            setHistory(sample.history);
            setIncidents(sample.incidents);
            setError(null);
            setLastFetched(new Date());
            setLoading(false);
            return;
        }

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
    }, [demo]);

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
        demo,
        status,
        history,
        incidents,
        services,
        overall,
        loading,
        error,
        lastFetched,
        reload: () => load(true),
        historyMissing: !demo && !history,
    };
}
