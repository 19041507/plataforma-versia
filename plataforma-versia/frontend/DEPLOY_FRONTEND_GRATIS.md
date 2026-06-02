# Deploy do Frontend da Versia na Vercel

Use este projeto como **frontend**. O backend Django deve ficar separado, por exemplo no Render, e o banco no Neon.

## Configuração na Vercel

- Framework Preset: Next.js
- Install Command: `corepack enable && corepack prepare pnpm@10.34.1 --activate && pnpm install --no-frozen-lockfile`
- Build Command: `corepack enable && corepack prepare pnpm@10.34.1 --activate && pnpm run build`
- Output Directory: `out`

## Variáveis do frontend

```env
NEXT_PUBLIC_API_URL=https://seu-backend.onrender.com
NEXT_PUBLIC_TENANT_SCHEMA=demo
NEXT_PUBLIC_DEMO_LOGIN_ENABLED=true
```

## Observação

Este frontend foi configurado para não depender de backend interno da Vercel. O login tenta usar o backend definido em `NEXT_PUBLIC_API_URL` e mantém login demo quando `NEXT_PUBLIC_DEMO_LOGIN_ENABLED=true`.
