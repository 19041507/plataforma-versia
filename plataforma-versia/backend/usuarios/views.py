"""Views de autenticação tenant-aware para a Plataforma Versia.

Todos os endpoints de auth validam o contexto do tenant,
garantindo isolamento total entre empresas.
"""
import logging

from django.contrib.auth import authenticate
from django_tenants.utils import get_public_schema_name
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Usuario
from .serializers import SerializadorUsuario, SerializadorRegistro

logger = logging.getLogger(__name__)


def _get_tenant_id(request):
    """Retorna o pk do tenant atual ou None se for schema público."""
    tenant = getattr(request, 'tenant', None)
    if tenant and tenant.schema_name != get_public_schema_name():
        return tenant.pk
    return None


def _build_token_pair(user, tenant_id):
    """Gera par de tokens JWT com tenant_id embutido no payload."""
    refresh = RefreshToken.for_user(user)
    refresh['tenant_id'] = tenant_id
    refresh.access_token['tenant_id'] = tenant_id
    return refresh


class VisaoLogin(APIView):
    """POST /api/auth/login/ — Autentica usuário no contexto do tenant."""
    permission_classes = (AllowAny,)

    def post(self, requisicao):
        nome_usuario = (
            requisicao.data.get('usuario')
            or requisicao.data.get('username')
            or ''
        ).strip()
        senha = requisicao.data.get('senha') or requisicao.data.get('password') or ''

        if not nome_usuario or not senha:
            return Response(
                {'erro': 'Informe usuário e senha.'},
                status=400,
            )

        usuario = authenticate(username=nome_usuario, password=senha)

        if usuario is None:
            return Response({'erro': 'Credenciais inválidas.'}, status=400)

        tenant_id = _get_tenant_id(requisicao)

        if tenant_id is not None and usuario.empresa_id != tenant_id:
            logger.warning(
                'Login cross-tenant bloqueado: user=%s (empresa=%s) tentou logar no tenant=%s',
                usuario.pk, usuario.empresa_id, tenant_id,
            )
            return Response({'erro': 'Credenciais inválidas.'}, status=400)

        refresh = _build_token_pair(usuario, tenant_id)

        return Response({
            'token': str(refresh.access_token),
            'refresh': str(refresh),
            'usuario': SerializadorUsuario(usuario).data,
        })


class VisaoLogout(APIView):
    """POST /api/auth/logout/ — Invalida refresh token (blacklist)."""
    permission_classes = (IsAuthenticated,)

    def post(self, requisicao):
        token_refresh = requisicao.data.get('refresh')
        if not token_refresh:
            return Response({'erro': 'Informe o token de refresh.'}, status=400)

        try:
            token = RefreshToken(token_refresh)
            token.blacklist()
            return Response({'mensagem': 'Logout realizado com sucesso.'})
        except Exception:
            return Response({'erro': 'Token inválido ou já expirado.'}, status=400)


class VisaoUsuarioAtual(APIView):
    """GET/PATCH /api/auth/usuario/ — Dados do usuário autenticado."""
    permission_classes = (IsAuthenticated,)

    def get(self, requisicao):
        return Response(SerializadorUsuario(requisicao.user).data)

    def patch(self, requisicao):
        serializador = SerializadorUsuario(
            requisicao.user,
            data=requisicao.data,
            partial=True,
        )
        serializador.is_valid(raise_exception=True)
        serializador.save()
        return Response(serializador.data)


class VisaoRegistro(APIView):
    """POST /api/auth/registro/ — Cria usuário vinculado ao tenant atual."""
    permission_classes = (AllowAny,)

    def post(self, requisicao):
        tenant_id = _get_tenant_id(requisicao)
        tenant = getattr(requisicao, 'tenant', None)

        serializador = SerializadorRegistro(
            data=requisicao.data,
            context={
                'request': requisicao,
                'tenant': tenant,
                'tenant_id': tenant_id,
            },
        )
        serializador.is_valid(raise_exception=True)
        usuario = serializador.save()

        refresh = _build_token_pair(usuario, tenant_id)

        return Response({
            'token': str(refresh.access_token),
            'refresh': str(refresh),
            'usuario': SerializadorUsuario(usuario).data,
        }, status=201)
