#!/usr/bin/env python
"""Aguarda o PostgreSQL (Supabase) ficar acessível — mesma lógica do Django settings."""
from __future__ import annotations

import os
import sys
import time


def _connect_params() -> dict:
    db_url = os.getenv('DATABASE_URL', '').strip()
    if not db_url:
        print('❌ DATABASE_URL não está definida no ambiente.', file=sys.stderr)
        sys.exit(1)

    if db_url.startswith('postgres://'):
        db_url = 'postgresql://' + db_url[len('postgres://') :]

    import dj_database_url

    debug = os.getenv('DEBUG', 'False').lower() in ('1', 'true', 'yes')
    cfg = dj_database_url.parse(db_url, conn_max_age=0, ssl_require=not debug)

    params = {
        'dbname': cfg.get('NAME'),
        'user': cfg.get('USER'),
        'password': cfg.get('PASSWORD'),
        'host': cfg.get('HOST'),
        'port': cfg.get('PORT') or 5432,
        'connect_timeout': 10,
    }
    options = cfg.get('OPTIONS') or {}
    if 'sslmode' in options:
        params['sslmode'] = options['sslmode']
    elif 'pooler.supabase.com' in db_url or not debug:
        params['sslmode'] = 'require'

    return params, db_url


def main() -> None:
    import psycopg2

    params, db_url = _connect_params()
    host_hint = f"{params.get('host')}:{params.get('port')}"

    max_attempts = int(os.getenv('DB_WAIT_MAX_ATTEMPTS', '15'))
    interval = float(os.getenv('DB_WAIT_INTERVAL', '2'))

    print(f'⏳ Aguardando PostgreSQL em {host_hint} (até {max_attempts} tentativas)...')

    last_error: Exception | None = None
    for attempt in range(1, max_attempts + 1):
        try:
            conn = psycopg2.connect(**params)
            conn.close()
            print('✅ PostgreSQL pronto!')
            return
        except Exception as exc:  # noqa: BLE001
            last_error = exc
            print(f'  [{attempt}/{max_attempts}] {exc}', file=sys.stderr)
            if attempt < max_attempts:
                time.sleep(interval)

    print('\n❌ Não foi possível conectar ao Supabase.', file=sys.stderr)
    print(
        '\nRender → Environment → DATABASE_URL (URI Session, porta 5432, ?sslmode=require)\n'
        'Não use banco PostgreSQL do Render — só o Supabase.\n',
        file=sys.stderr,
    )
    if last_error:
        print(f'Último erro: {last_error}', file=sys.stderr)
    sys.exit(1)


if __name__ == '__main__':
    main()
