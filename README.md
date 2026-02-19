# status.apiaberta.pt

Real-time status page for [API Aberta](https://apiaberta.pt).

## Tech

- React 18 + Vite
- Tailwind CSS v3
- Lucide React icons
- Axios

## Development

```bash
npm install
npm run dev
```

## Build & Deploy

```bash
npm run build
cp -r dist/. /var/www/apiaberta-status/
systemctl reload nginx
```

Polls `https://api.apiaberta.pt/v1/status` every 30 seconds.
