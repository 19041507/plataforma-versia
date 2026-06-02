"""Serializers de usuário para a Plataforma Versia."""
from django.contrib.auth.password_validation import validate_password
from django.db import transaction
from rest_framework import serializers

from .models import Usuario


class SerializadorUsuario(serializers.ModelSerializer):
    """Serializer de leitura/atualização do usuário."""

    class Meta:
        model = Usuario
        fields = (
            'id', 'username', 'email', 'first_name', 'last_name',
            'papel', 'telefone', 'foto_perfil', 'empresa',
            'criado_em', 'ultimo_acesso',
        )
        read_only_fields = ('id', 'criado_em', 'ultimo_acesso', 'empresa')


class SerializadorLogin(serializers.Serializer):
    """Serializer para validação dos dados de login."""
    usuario = serializers.CharField()
    senha = serializers.CharField(write_only=True)


class SerializadorRegistro(serializers.ModelSerializer):
    """Serializer de registro com vinculação atômica ao tenant.

    Recebe `tenant` e `tenant_id` via context (injetados pela view).
    Valida unicidade de username dentro do tenant e vincula a empresa
    no mesmo save, sem race condition.
    """
    senha = serializers.CharField(write_only=True, validators=[validate_password])
    confirmacao_senha = serializers.CharField(write_only=True)

    class Meta:
        model = Usuario
        fields = (
            'username', 'email', 'first_name', 'last_name',
            'telefone', 'senha', 'confirmacao_senha',
        )

    def validate_username(self, valor):
        """Valida unicidade do username no contexto do tenant."""
        tenant_id = self.context.get('tenant_id')
        qs = Usuario.objects.filter(username=valor)
        if tenant_id is not None:
            qs = qs.filter(empresa_id=tenant_id)
        if qs.exists():
            raise serializers.ValidationError('Este nome de usuário já está em uso.')
        return valor

    def validate(self, attrs):
        if attrs['senha'] != attrs['confirmacao_senha']:
            raise serializers.ValidationError(
                {'senha': 'As senhas não conferem.'}
            )
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        validated_data.pop('confirmacao_senha')
        senha = validated_data.pop('senha')

        tenant = self.context.get('tenant')
        tenant_id = self.context.get('tenant_id')

        usuario = Usuario(**validated_data)
        usuario.papel = 'aluno'
        if tenant_id is not None:
            usuario.empresa_id = tenant_id
        usuario.set_password(senha)
        usuario.save()

        return usuario
