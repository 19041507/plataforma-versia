from django_tenants.middleware.main import TenantMainMiddleware
from django_tenants.utils import get_tenant_model, get_public_schema_name
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class HeaderOrDomainTenantMiddleware(TenantMainMiddleware):
    """
    Middleware híbrido que tenta resolver o tenant de duas formas:
    1. Pelo header HTTP 'X-Tenant' (útil para deploy em domínio único como Railway/Vercel)
    2. Pelo subdomínio/domínio padrão (fallback clássico de django-tenants para desenvolvimento local)
    """
    def process_request(self, request):
        # 1. Tenta obter o schema_name do header X-Tenant
        # Nota: request.headers está disponível no Django 2.2+
        tenant_header = request.headers.get('X-Tenant') or request.META.get('HTTP_X_TENANT')
        
        if tenant_header:
            tenant_header = tenant_header.strip().lower()
            tenant_model = get_tenant_model()
            try:
                # Busca o tenant pelo schema_name
                tenant = tenant_model.objects.get(schema_name=tenant_header)
                
                # Configura o tenant no request e na conexão ativa do banco
                request.tenant = tenant
                connection = self.get_connection()
                connection.set_tenant(request.tenant)
                
                # Define a URLconf correta
                if request.tenant.schema_name == get_public_schema_name():
                    request.urlconf = settings.PUBLIC_SCHEMA_URLCONF
                else:
                    request.urlconf = settings.ROOT_URLCONF
                
                logger.info(f"Tenant resolvido via Header 'X-Tenant': {tenant.schema_name}")
                return None  # Continua para o próximo middleware
                
            except tenant_model.DoesNotExist:
                # Se o schema fornecido no header não existir, loga o aviso e deixa
                # o processo cair para a busca clássica baseada em domínio.
                logger.warning(f"Tenant especificado no header X-Tenant '{tenant_header}' não existe. Caindo para fallback por domínio.")
                pass
        
        # 2. Se não houver header ou falhar, usa a busca padrão do django-tenants (por hostname)
        return super().process_request(request)
