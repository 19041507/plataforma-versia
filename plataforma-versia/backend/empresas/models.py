"""Models de tenant (Empresa) e domínio para a Plataforma Versia."""
from django.db import models
from django_tenants.models import TenantMixin, DomainMixin


class Empresa(TenantMixin):
    """Cada empresa é um tenant com schema próprio no PostgreSQL."""
    nome = models.CharField(max_length=100)
    ativo = models.BooleanField(
        default=True,
        help_text='Desmarque para desativar o acesso deste tenant.',
    )
    plano = models.CharField(
        max_length=30,
        default='basico',
        help_text='Plano de assinatura do tenant.',
    )
    criado_em = models.DateField(auto_now_add=True)

    auto_create_schema = True

    class Meta:
        verbose_name = 'Empresa'
        verbose_name_plural = 'Empresas'

    def __str__(self):
        return self.nome


class Dominio(DomainMixin):
    """Domínio vinculado a um tenant."""

    class Meta:
        verbose_name = 'Domínio'
        verbose_name_plural = 'Domínios'

    def __str__(self):
        return self.domain