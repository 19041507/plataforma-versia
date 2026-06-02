"""Middleware de resolução de tenant para a Plataforma Versia.

Suporta duas estratégias de resolução:
1. Header HTTP `X-Tenant` — usado em deploy de domínio único (Vercel/Railway)
2. Subdomínio/hostname — fallback clássico do django-tenants (dev local)
"""
import logging

from django.conf import settings
from django.db import connection
from django.http import JsonResponse
from django_tenants.middleware.main import TenantMainMiddleware
from django_tenants.utils import get_tenant_model, get_public_schema_name

logger = logging.getLogger(__name__)


class HeaderOrDomainTenantMiddleware(TenantMainMiddleware):
    """Middleware híbrido para resolução de tenant.

    Prioridade:
    1. Header `X-Tenant` (schema_name) → deploy em domínio único (Vercel)
    2. Hostname da requisição → django-tenants padrão (dev local com subdomínios)

    Se o header `X-Tenant` contiver um schema inexistente, retorna HTTP 400
    em vez de cair para o fallback por domínio, evitando comportamento
    inesperado em produção.
    """

    def process_request(self, request):
        tenant_header = (request.headers.get('X-Tenant') or '').strip().lower()

        if tenant_header:
            return self._resolve_by_header(request, tenant_header)

        return super().process_request(request)

    def _resolve_by_header(self, request, schema_name):
        """Resolve tenant pelo header X-Tenant."""
        tenant_model = get_tenant_model()

        try:
            tenant = tenant_model.objects.get(schema_name=schema_name)
        except tenant_model.DoesNotExist:
            logger.warning(
                'Tenant "%s" especificado no header X-Tenant nao existe.',
                schema_name,
            )
            return JsonResponse(
                {'erro': f'Tenant "{schema_name}" não encontrado.'},
                status=400,
            )

        if hasattr(tenant, 'ativo') and not tenant.ativo:
            logger.warning('Tentativa de acesso a tenant inativo: %s', schema_name)
            return JsonResponse(
                {'erro': 'Este tenant está desativado.'},
                status=403,
            )

        request.tenant = tenant
        connection.set_tenant(tenant)

        if tenant.schema_name == get_public_schema_name():
            request.urlconf = settings.PUBLIC_SCHEMA_URLCONF
        else:
            request.urlconf = settings.ROOT_URLCONF

        logger.debug('Tenant resolvido via header X-Tenant: %s', tenant.schema_name)
        return None
