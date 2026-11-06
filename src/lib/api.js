const API = 'https://api.apiaberta.pt/v1';

async function getJson(url) {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
        const error = new Error(`HTTP ${res.status}`);
        error.status = res.status;
        throw error;
    }
    return res.json();
}

export async function fetchStatus() {
    return getJson(`${API}/status`);
}

export async function fetchHistory(days = 90) {
    try {
        return await getJson(`${API}/status/history?days=${days}`);
    } catch {
        return null;
    }
}

export async function fetchIncidents(days = 90) {
    try {
        const data = await getJson(`${API}/status/incidents?days=${days}`);
        return data?.incidents || [];
    } catch {
        return [];
    }
}
