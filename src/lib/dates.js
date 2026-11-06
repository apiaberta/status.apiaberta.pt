const PT = 'pt-PT';

export function toIsoDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

export function parseIsoDate(iso) {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d);
}

export function startOfDay(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}

export function startOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function addMonths(date, count) {
    return new Date(date.getFullYear(), date.getMonth() + count, 1);
}

export function addDays(date, count) {
    const d = new Date(date);
    d.setDate(d.getDate() + count);
    return d;
}

export function lastNDates(n, end = new Date()) {
    const endDay = startOfDay(end);
    const dates = [];
    for (let i = n - 1; i >= 0; i -= 1) {
        dates.push(toIsoDate(addDays(endDay, -i)));
    }
    return dates;
}

export function formatLongDate(iso) {
    return parseIsoDate(iso).toLocaleDateString(PT, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

export function formatMonthTitle(date) {
    const raw = date.toLocaleDateString(PT, { month: 'long', year: 'numeric' });
    return raw.charAt(0).toUpperCase() + raw.slice(1);
}

export function formatTime(iso) {
    return new Date(iso).toLocaleTimeString(PT, {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC',
        hour12: false,
    });
}

export function weekdayLabels() {
    return ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
}

export function mondayIndex(date) {
    return (date.getDay() + 6) % 7;
}

export function daysInMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

export function isoDateFromParts(year, monthIndex, day) {
    return toIsoDate(new Date(year, monthIndex, day));
}
