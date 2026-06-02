"""Permissões customizadas tenant-aware para a Plataforma Versia."""
from rest_framework.permissions import BasePermission
from django_tenants.utils import get_public_schema_name


class IsTenantUser(BasePermission):
    """Garante que o usuário autenticado pertence ao tenant da requisição.

    Deve ser usado em conjunto com IsAuthenticated.
    No schema público, a permissão é sempre concedida.
    """
    message = 'Você não tem permissão para acessar este tenant.'

    def has_permission(self, request, view):
        tenant = getattr(request, 'tenant', None)
        if tenant is None or tenant.schema_name == get_public_schema_name():
            return True

        user = request.user
        if not user or not user.is_authenticated:
            return False

        return user.empresa_id == tenant.pk


class IsTenantAdmin(BasePermission):
    """Garante que o usuário é admin do tenant atual."""
    message = 'Acesso restrito a administradores do tenant.'

    def has_permission(self, request, view):
        tenant = getattr(request, 'tenant', None)
        if tenant is None or tenant.schema_name == get_public_schema_name():
            return request.user and request.user.is_staff

        user = request.user
        if not user or not user.is_authenticated:
            return False

        return user.empresa_id == tenant.pk and user.papel == 'admin'
