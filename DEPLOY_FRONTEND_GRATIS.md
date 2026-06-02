# Deploy gratuito recomendado para a Versia

Este pacote é apenas o **frontend** da Versia.

Use a estrutura abaixo:

- Frontend Next.js: **Vercel**
- Backend Django: **Render**
- Banco PostgreSQL: **Neon**

## 1. Configurar o frontend na Vercel

Na Vercel, crie um projeto apontando para esta pasta do frontend.

Configuração recomendada:

```txt
Framework Preset: Next.js
Install Command: npm install
Build Command: npm run build
Output Directory: out
```

Variáveis de ambiente do frontend:

```txt
NEXT_PUBLIC_API_URL=https://sua-api-do-backend.onrender.com
NEXT_PUBLIC_TENANT_SCHEMA=demo
NEXT_PUBLIC_DEMO_LOGIN_ENABLED=true
```

Depois que o backend estiver funcionando, você pode trocar:

```txt
NEXT_PUBLIC_DEMO_LOGIN_ENABLED=false
```

Assim o login passa a depender somente do backend real.

## 2. Backend no Render

No backend Django, configure as variáveis:

```txt
SECRET_KEY=sua_chave_grande
DEBUG=False
DATABASE_URL=sua_url_do_neon
ALLOWED_HOSTS=sua-api-do-backend.onrender.com
CORS_ALLOWED_ORIGINS=https://seu-front.vercel.app
CSRF_TRUSTED_ORIGINS=https://seu-front.vercel.app
BASE_DOMAIN=onrender.com
SECURE_SSL_REDIRECT=False
```

## 3. Banco no Neon

Crie o banco PostgreSQL no Neon e copie a connection string para o Render em `DATABASE_URL`.

## 4. Importante

O backend da Versia é multi-tenant. O frontend envia o header:

```txt
X-Tenant: demo
```

Por isso, o backend precisa ter um tenant/schema chamado `demo`, ou você deve mudar `NEXT_PUBLIC_TENANT_SCHEMA` para o nome correto.

## 5. Login empresarial de apresentação

O acesso de demonstração continua disponível:

```txt
Email: Motiron@gmail.com
Senha: 123456
```

Se o backend estiver dormindo no Render, esse login ainda funciona enquanto `NEXT_PUBLIC_DEMO_LOGIN_ENABLED=true`.
