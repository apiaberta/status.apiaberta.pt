import { addDays, lastNDates, startOfDay, toIsoDate } from './dates.js';

const SERVICE_DEFS = [
    { id: 'gateway', name: 'Gateway', prefix: '/' },
    { id: 'fuel', name: 'Fuel Prices (DGEG)', prefix: '/v1/fuel' },
    { id: 'ipma', name: 'Weather (IPMA)', prefix: '/v1/ipma' },
    { id: 'base', name: 'Public Contracts (BASE)', prefix: '/v1/base' },
    { id: 'ev', name: 'EV Charging Prices', prefix: '/v1/ev' },
    { id: 'ine', name: 'Portugal Statistics (INE/Eurostat)', prefix: '/v1/ine' },
    { id: 'anpc', name: 'Civil Protection (ANPC)', prefix: '/v1/anpc' },
    { id: 'bdp', name: 'Banco de Portugal (BdP)', prefix: '/v1/bdp' },
    { id: 'geo', name: 'Geographic Data (geoapi.pt)', prefix: '/v1/geo' },
    { id: 'nif', name: 'NIF Validator', prefix: '/v1/nif' },
    { id: 'dre', name: 'DRE Legislation', prefix: '/v1/dre' },
    { id: 'carris', name: 'Carris Metropolitana (realtime)', prefix: '/v1/carris' },
    { id: 'gtfs', name: 'Transport schedules (GTFS)', prefix: '/v1/gtfs' },
    { id: 'parlamento', name: 'Parlamento (Assembleia da República)', prefix: '/v1/parlamento' },
    { id: 'sns', name: 'SNS Transparência', prefix: '/v1/sns' },
];

function hash(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i += 1) {
        h ^= str.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
}

function unit(seed) {
    return (seed % 1000) / 1000;
}

function buildDays(id, dates) {
    return dates.map((date) => {
        const n = unit(hash(`${id}:${date}`));
        if (n > 0.97) {
            return {
                date,
                uptime: 0.91 + n * 0.03,
                checks: 288,
                down: 8 + Math.floor(n * 12),
                degraded: 2,
                avgLatencyMs: 180,
            };
        }
        if (n > 0.93) {
            return {
                date,
                uptime: 0.97 + n * 0.02,
                checks: 288,
                down: 0,
                degraded: 4 + Math.floor(n * 6),
                avgLatencyMs: 90,
            };
        }
        return {
            date,
            uptime: 1,
            checks: 288,
            down: 0,
            degraded: 0,
            avgLatencyMs: 8 + Math.floor(n * 20),
        };
    });
}

function avgUptime(days) {
    const known = days.filter((d) => d.uptime !== null);
    if (!known.length) return 1;
    return known.reduce((acc, d) => acc + d.uptime, 0) / known.length;
}

export function buildDemoData() {
    const now = new Date();
    const dates90 = lastNDates(90, now);
    const dates180 = lastNDates(180, now);
    const today = toIsoDate(startOfDay(now));

    const services = SERVICE_DEFS.map((def, index) => {
        const days = buildDays(def.id, dates180);
        const recent = days.filter((d) => dates90.includes(d.date));
        let status = 'up';
        if (index === 2) status = 'degraded';
        return {
            ...def,
            status,
            latency_ms: status === 'degraded' ? 420 : 8 + index,
            version: '1.0.0',
            checked_at: now.toISOString(),
            days,
            recentDays: recent,
            uptime: avgUptime(recent),
        };
    });

    const status = {
        status: 'degraded',
        gateway: {
            status: 'up',
            uptime_s: 280093,
            version: '0.4.0',
            latency_ms: 5,
        },
        services: services
            .filter((s) => s.id !== 'gateway')
            .map((s) => ({
                name: s.name,
                prefix: s.prefix,
                status: s.status,
                latency_ms: s.latency_ms,
                version: s.version,
                checked_at: s.checked_at,
            })),
        checked_at: now.toISOString(),
    };

    const history = {
        generatedAt: now.toISOString(),
        days: 180,
        overall: { uptime: avgUptime(services.flatMap((s) => s.recentDays)) },
        services: services.map((s) => ({
            id: s.id,
            name: s.name,
            uptime: s.uptime,
            days: s.days,
        })),
    };

    const incidentStart = addDays(now, -9);
    incidentStart.setHours(11, 7, 0, 0);
    const incidentEnd = addDays(now, -9);
    incidentEnd.setHours(11, 49, 0, 0);

    const degradedStart = addDays(now, -2);
    degradedStart.setHours(16, 20, 0, 0);
    const degradedEnd = addDays(now, -2);
    degradedEnd.setHours(17, 5, 0, 0);

    const ongoingStart = new Date(now.getTime() - 38 * 60 * 1000);

    const incidents = [
        {
            service: 'Weather (IPMA)',
            status: 'degraded',
            startedAt: ongoingStart.toISOString(),
            resolvedAt: null,
            durationMin: 38,
        },
        {
            service: 'Carris Metropolitana (realtime)',
            status: 'down',
            startedAt: incidentStart.toISOString(),
            resolvedAt: incidentEnd.toISOString(),
            durationMin: 42,
        },
        {
            service: 'SNS Transparência',
            status: 'degraded',
            startedAt: degradedStart.toISOString(),
            resolvedAt: degradedEnd.toISOString(),
            durationMin: 45,
        },
    ];

    return {
        status,
        history,
        incidents,
        generatedAt: now.toISOString(),
        demoDay: today,
    };
}
