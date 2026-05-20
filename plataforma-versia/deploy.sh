#!/bin/bash
# ============================================
# Script de Deploy — Plataforma Versia
# ============================================
# Execute na VPS após clonar o repositório:
#   chmod +x deploy.sh && ./deploy.sh
# ============================================
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}"
echo "╔══════════════════════════════════════╗"
echo "║   🚀 Deploy — Plataforma Versia     ║"
echo "╚══════════════════════════════════════╝"
echo -e "${NC}"

# ---- 1. Verificar .env ----
if [ ! -f .env ]; then
    echo -e "${RED}❌ Arquivo .env não encontrado!${NC}"
    echo -e "${YELLOW}   Copie o .env.example e preencha os valores:${NC}"
    echo "   cp .env.example .env && nano .env"
    exit 1
fi

# ---- 2. Verificar Docker ----
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker não está instalado!${NC}"
    echo -e "${YELLOW}   Instale com: curl -fsSL https://get.docker.com | sh${NC}"
    exit 1
fi

if ! command -v docker compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose (plugin) não encontrado!${NC}"
    echo -e "${YELLOW}   Instale com: sudo apt install docker-compose-plugin${NC}"
    exit 1
fi

# ---- 3. Carregar variáveis ----
source .env

echo -e "${GREEN}✅ .env carregado${NC}"
echo -e "   Domínio: ${CYAN}${DOMAIN}${NC}"
echo -e "   DEBUG:   ${CYAN}${DEBUG:-False}${NC}"

# ---- 4. Build e Deploy ----
echo ""
echo -e "${YELLOW}📦 Buildando containers...${NC}"
docker compose -f docker-compose.prod.yml build --no-cache

echo ""
echo -e "${YELLOW}🚀 Subindo containers...${NC}"
docker compose -f docker-compose.prod.yml up -d

# ---- 5. Status ----
echo ""
echo -e "${GREEN}✅ Deploy concluído!${NC}"
echo ""
docker compose -f docker-compose.prod.yml ps
echo ""

# ---- 6. SSL (primeira vez) ----
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}🔒 Para ativar HTTPS (primeira vez):${NC}"
echo ""
echo "   docker compose -f docker-compose.prod.yml run --rm certbot certonly \\"
echo "     --webroot --webroot-path=/var/www/certbot \\"
echo "     -d ${DOMAIN} -d www.${DOMAIN} -d api.${DOMAIN} \\"
echo "     --email ${CERTBOT_EMAIL:-seu-email@exemplo.com} \\"
echo "     --agree-tos --no-eff-email"
echo ""
echo -e "${YELLOW}🔄 Para renovar o certificado:${NC}"
echo "   docker compose -f docker-compose.prod.yml run --rm certbot renew"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
