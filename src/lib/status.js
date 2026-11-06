import { lastNDates } from './dates.js';

function padDay(date, record) {
    return record || {
        date,
        uptime: null,
        checks: 0,
        down: 0,
        degraded: 0,
        avgLatencyMs: null,
    };
}

export function serviceKey(service) {
    const raw = service.id || service.prefix || service.name || '';
    return String(raw)
        .replace(/^\/v1\//, '')
        .replace(/^\//, '')
        .toLowerCase() || String(service.name || '').toLowerCase();
}

export function dayTone(day) {
    if (!day || day.uptime === null || day.uptime === undefined) return 'none';
    if ((day.down ?? 0) > 0 || day.uptime < 0.95) return 'down';
    if ((day.degraded ?? 0) > 0 || day.uptime < 0.999) return 'degraded';
    return 'ok';
}

export function overallFromServices(services, apiStatus) {
    if (!services?.length) {
        if (apiStatus === 'ok') return 'ok';
        if (apiStatus === 'degraded') return 'degraded';
        return 'unknown';
    }
    if (services.some((s) => s.status === 'down')) return 'down';
    if (apiStatus === 'degraded' || services.some((s) => s.status === 'degraded')) {
        return 'degraded';
    }
    if (services.every((s) => s.status === 'up' || s.status === 'ok')) return 'ok';
    return 'unknown';
}

export function currentLabel(status) {
    if (status === 'up' || status === 'ok') return 'operational';
    if (status === 'degraded') return 'degraded';
    if (status === 'down') return 'down';
    return 'unknown';
}

export function computeUptime(days) {
    const known = days.filter((d) => d.uptime !== null && d.uptime !== undefined);
    if (!known.length) return null;
    const sum = known.reduce((acc, d) => acc + d.uptime, 0);
    return sum / known.length;
}

export function mergeServices(statusData, historyData) {
    const historyByKey = new Map();
    for (const svc of historyData?.services || []) {
        historyByKey.set(serviceKey(svc), svc);
    }

    const barDates = lastNDates(90);
    const seen = new Set();
    const list = [];

    const live = [];
    if (statusData?.gateway) {
        live.push({
            id: 'gateway',
            name: 'Gateway',
            prefix: '/',
            status: statusData.gateway.status,
            latency_ms: statusData.gateway.latency_ms,
            version: statusData.gateway.version,
        });
    }
    for (const svc of statusData?.services || []) {
        live.push(svc);
    }

    for (const svc of live) {
        const key = serviceKey(svc);
        seen.add(key);
        const hist = historyByKey.get(key);
        const byDate = new Map((hist?.days || []).map((d) => [d.date, d]));
        const days = barDates.map((date) => padDay(date, byDate.get(date)));
        list.push({
            id: svc.id || svc.prefix || key,
            key,
            name: svc.name,
            prefix: svc.prefix,
            status: svc.status,
            latency_ms: svc.latency_ms,
            version: svc.version,
            error: svc.error,
            days,
            historyDays: hist?.days?.length ? hist.days : days,
            uptime: hist?.uptime ?? computeUptime(days),
        });
    }

    for (const hist of historyData?.services || []) {
        const key = serviceKey(hist);
        if (seen.has(key)) continue;
        const byDate = new Map((hist.days || []).map((d) => [d.date, d]));
        const days = barDates.map((date) => padDay(date, byDate.get(date)));
        list.push({
            id: hist.id || key,
            key,
            name: hist.name,
            status: 'unknown',
            days,
            historyDays: hist.days?.length ? hist.days : days,
            uptime: hist.uptime ?? computeUptime(days),
        });
    }

    return list;
}

export function monthUptime(days, year, monthIndex) {
    const prefix = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
    const inMonth = days.filter((d) => d.date.startsWith(prefix));
    return computeUptime(inMonth);
}
