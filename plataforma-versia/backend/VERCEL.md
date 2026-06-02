# Deploy backend na Vercel (Opção A)

## Configuração do projeto

| Campo | Valor |
|-------|--------|
| **Root Directory** | `plataforma-versia/backend` |
| **Branch** | `dev` |
| **Framework** | Other |

## Variáveis de ambiente (mínimo)

- `SECRET_KEY`, `DEBUG=False`, `DATABASE_URL`
- `ALLOWED_HOSTS` = seu domínio `.vercel.app`
- `CORS_ALLOWED_ORIGINS`, `CSRF_TRUSTED_ORIGINS` = URL do frontend
- `SECURE_SSL_REDIRECT=False`

## Log de build esperado

- `Installing ... requirements.txt` (sem prefixo `plataforma-versia/backend/`)
- `Running "bash build_files.sh"` ou `Coletando arquivos estáticos`
- **Sem** `WARNING! Due to builds existing`
- **Sem** `uv lock` em `vercel_postbuild`

Guia completo: `../DEPLOY_VERCEL.md`
