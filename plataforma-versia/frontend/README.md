# Versia — Frontend

Este projeto é o **frontend Next.js** da Versia.

Ele foi ajustado para a arquitetura gratuita recomendada:

```txt
Frontend: Vercel
Backend Django: Render
Banco PostgreSQL: Neon
```

## Rodar localmente

```bash
npm install
npm run dev
```

## Build de produção

```bash
npm run build
npm start
```

O comando `npm start` serve a pasta estática `out/`, que é a mesma pasta usada no deploy da Vercel.

## Variáveis de ambiente

Crie um `.env.local` baseado no `.env.example`:

```txt
NEXT_PUBLIC_API_URL=https://sua-api-do-backend.onrender.com
NEXT_PUBLIC_TENANT_SCHEMA=demo
NEXT_PUBLIC_DEMO_LOGIN_ENABLED=true
```

## Deploy na Vercel

```txt
Framework Preset: Next.js
Install Command: npm install
Build Command: npm run build
Output Directory: out
```

Mais detalhes em `DEPLOY_FRONTEND_GRATIS.md`.
