"""Autenticação JWT tenant-aware para a Plataforma Versia.

Garante que tokens JWT só sejam válidos no contexto do tenant
que os emitiu, impedindo acesso cross-tenant.
"""
import logging
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django_tenants.utils import get_public_schema_name

logger = logging.getLogger(__name__)


class TenantAwareJWTAuthentication(JWTAuthentication):
    """Estende JWTAuthentication para validar o tenant_id contido no token.

    Fluxo:
    1. Decodifica e valida o JWT normalmente (via SimpleJWT).
    2. Extrai o `tenant_id` embutido no payload do token.
    3. Compara com o tenant resolvido pelo middleware na requisição atual.
    4. Rejeita se houver divergência (cross-tenant).
    """

    def authenticate(self, request):
        result = super().authenticate(request)
        if result is None:
            return None

        user, token = result
        tenant = getattr(request, 'tenant', None)

        if tenant is None or tenant.schema_name == get_public_schema_name():
            return (user, token)

        token_tenant_id = token.get('tenant_id')
        if token_tenant_id is None:
            logger.warning(
                'Token JWT sem tenant_id para usuario=%s no tenant=%s',
                user.pk, tenant.schema_name,
            )
            raise AuthenticationFailed(
                'Token inválido: não contém identificação de tenant.'
            )

        if int(token_tenant_id) != tenant.pk:
            logger.warning(
                'Token cross-tenant detectado: token.tenant_id=%s, request.tenant.pk=%s, user=%s',
                token_tenant_id, tenant.pk, user.pk,
            )
            raise AuthenticationFailed(
                'Token não pertence a este tenant.'
            )

        if user.empresa_id != tenant.pk:
            logger.warning(
                'Usuário %s (empresa_id=%s) tentou acessar tenant %s',
                user.pk, user.empresa_id, tenant.pk,
            )
            raise AuthenticationFailed(
                'Usuário não pertence a este tenant.'
            )

        return (user, token)
