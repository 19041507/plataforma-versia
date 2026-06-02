#!/usr/bin/env python
"""Aguarda o PostgreSQL ficar acessível (Render + Supabase)."""
from __future__ import annotations

import os
import sys
import time


def main() -> None:
    db_url = os.getenv('DATABASE_URL', '').strip()
    if not db_url:
        print('❌ DATABASE_URL não está definida no ambiente.', file=sys.stderr)
        sys.exit(1)

    if db_url.startswith('postgres://'):
        db_url = 'postgresql://' + db_url[len('postgres://') :]

    max_attempts = int(os.getenv('DB_WAIT_MAX_ATTEMPTS', '30'))
    interval = float(os.getenv('DB_WAIT_INTERVAL', '2'))

    import psycopg2

    print(f'⏳ Aguardando PostgreSQL (até {max_attempts} tentativas)...')

    last_error: Exception | None = None
    for attempt in range(1, max_attempts + 1):
        try:
            conn = psycopg2.connect(db_url, connect_timeout=10)
            conn.close()
            print('✅ PostgreSQL pronto!')
            return
        except Exception as exc:  # noqa: BLE001 — log de conexão
            last_error = exc
            host_hint = ''
            if '@' in db_url:
                host_hint = db_url.split('@', 1)[1].split('/')[0].split('?')[0]
            print(
                f'  [{attempt}/{max_attempts}] indisponível'
                f'{f" ({host_hint})" if host_hint else ""}: {exc}',
                file=sys.stderr,
            )
            if attempt < max_attempts:
                time.sleep(interval)

    print('\n❌ Não foi possível conectar ao banco.', file=sys.stderr)
    print(
        '\nSupabase + Render — confira:\n'
        '  1. Supabase → Settings → Database → URI (modo Session, porta 5432)\n'
        '  2. Adicione ?sslmode=require no final da URL\n'
        '  3. Senha com @ # % etc. deve estar URL-encoded na URI\n'
        '  4. Projeto Supabase pausado? Abra o dashboard e retome o banco\n'
        '  5. Em Render → Environment, DATABASE_URL sem aspas extras\n',
        file=sys.stderr,
    )
    if last_error:
        print(f'Último erro: {last_error}', file=sys.stderr)
    sys.exit(1)


if __name__ == '__main__':
    main()
