# status.apiaberta.pt

Página de estado da [API Aberta](https://apiaberta.pt): estado actual, barras de uptime a 90 dias e histórico mensal.

Interface em português de Portugal.

## Stack

- React 19 + React Router + Vite
- JavaScript (ES modules), indentação de 4 espaços
- Tailwind CSS v4 (`@import "tailwindcss"`, plugin `@tailwindcss/vite`)
- lucide-react

## Desenvolvimento

```bash
npm install
npm run dev
```

A página principal está em `/`. O histórico de uptime está em `/uptime`.

### Dados de exemplo

Os endpoints de histórico podem ainda não existir. Para ver o visual completo (barras coloridas, incidentes, calendários):

```
http://localhost:5173/?demo=1
http://localhost:5173/uptime?demo=1
```

O modo de exemplo mostra um aviso claro no topo e **não** é o estado real dos serviços. Há também um atalho no rodapé: «Pré-visualizar com dados de exemplo».

## APIs

| Endpoint | Uso |
| --- | --- |
| `GET https://api.apiaberta.pt/v1/status` | Estado actual. Actualização a cada 60 s. |
| `GET https://api.apiaberta.pt/v1/status/history?days=90` | Histórico diário. |
| `GET https://api.apiaberta.pt/v1/status/incidents?days=90` | Incidentes. |

Se o histórico ou os incidentes devolverem 404/erro, a página continua a funcionar: barras cinzentas («sem dados») e lista de incidentes vazia.

## Build e deploy

```bash
npm run build
cp -r dist/. /var/www/apiaberta-status/
systemctl reload nginx
```

`/uptime` é uma rota do SPA. O nginx tem de devolver `index.html` quando o ficheiro não existe:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

Sem esta linha, um acesso directo a `https://status.apiaberta.pt/uptime` resulta em 404.
