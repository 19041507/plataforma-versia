"""Model de usuário customizado para a Plataforma Versia."""
from django.contrib.auth.models import AbstractUser
from django.db import models


class Usuario(AbstractUser):
    """Usuário da plataforma, vinculado a uma empresa (tenant).

    O campo `empresa` é a FK para o tenant. No schema público,
    pode ser nulo (superusers globais). Em schemas de tenant,
    é obrigatório.
    """
    PAPEIS_CHOICES = (
        ('admin', 'Administrador'),
        ('aluno', 'Aluno'),
    )

    papel = models.CharField(
        max_length=10,
        choices=PAPEIS_CHOICES,
        default='aluno',
    )
    telefone = models.CharField(max_length=20, blank=True, default='')
    foto_perfil = models.ImageField(
        upload_to='usuarios/fotos/',
        blank=True,
        null=True,
    )
    empresa = models.ForeignKey(
        'empresas.Empresa',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='usuarios',
        db_index=True,
    )
    criado_em = models.DateTimeField(auto_now_add=True)
    ultimo_acesso = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Usuário'
        verbose_name_plural = 'Usuários'
        indexes = [
            models.Index(
                fields=['empresa', 'username'],
                name='idx_usuario_empresa_username',
            ),
        ]

    def eh_admin(self):
        """Retorna True se o papel do usuário é administrador."""
        return self.papel == 'admin'

    def eh_aluno(self):
        """Retorna True se o papel do usuário é aluno."""
        return self.papel == 'aluno'

    def __str__(self):
        return self.username