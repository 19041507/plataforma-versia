# Deploy do Frontend Versia na Vercel

Use este projeto como a pasta `frontend` do repositório.

## Configurações na Vercel

Root Directory:

```txt
plataforma-versia/frontend
```

Install Command:

```txt
npm install --legacy-peer-deps --no-audit --no-fund
```

Build Command:

```txt
npm run build
```

Output Directory:

```txt
out
```

## Variáveis de ambiente

```txt
NEXT_PUBLIC_API_URL=https://seu-backend.onrender.com
NEXT_PUBLIC_TENANT_SCHEMA=demo
NEXT_PUBLIC_DEMO_LOGIN_ENABLED=true
```

Depois de alterar as configurações, faça Redeploy com Clear Build Cache.
