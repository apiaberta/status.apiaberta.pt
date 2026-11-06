const PT = 'pt-PT';

export function formatPercent(value) {
    if (value === null || value === undefined || Number.isNaN(value)) {
        return '—';
    }
    return `${(value * 100).toLocaleString(PT, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}%`;
}

export function formatDurationMin(minutes) {
    if (minutes === null || minutes === undefined) return '—';
    const min = Math.max(0, Math.round(minutes));
    if (min < 60) return `${min} min`;
    const h = Math.floor(min / 60);
    const m = min % 60;
    if (m === 0) return h === 1 ? '1 hora' : `${h} horas`;
    return `${h} h ${m} min`;
}

export function relativeFromNow(iso) {
    if (!iso) return '—';
    const diffSec = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
    if (diffSec < 20) return 'agora mesmo';
    if (diffSec < 60) return `há ${diffSec} s`;
    const min = Math.floor(diffSec / 60);
    if (min < 60) return `há ${min} min`;
    const h = Math.floor(min / 60);
    if (h < 24) return `há ${h} h`;
    const d = Math.floor(h / 24);
    return d === 1 ? 'há 1 dia' : `há ${d} dias`;
}
