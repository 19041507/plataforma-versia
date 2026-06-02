const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ?? '';
const TENANT_SCHEMA = process.env.NEXT_PUBLIC_TENANT_SCHEMA?.trim().toLowerCase() ?? '';

export function getApiUrl(path: string): string {
  if (!API_URL) {
    throw new Error('NEXT_PUBLIC_API_URL n??o est?? configurada.');
  }
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${API_URL}${normalized}`;
}

export function getTenantHeaders(): HeadersInit {
  if (!TENANT_SCHEMA) {
    return {};
  }
  return { 'X-Tenant': TENANT_SCHEMA };
}

export async function apiFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const headers = new Headers(init.headers);
  const tenantHeaders = getTenantHeaders();
  for (const [key, value] of Object.entries(tenantHeaders)) {
    if (!headers.has(key)) {
      headers.set(key, value);
    }
  }
  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json');
  }

  return fetch(getApiUrl(path), { ...init, headers });
}
