#!/bin/bash

# ============================================
# VPS 一键初始化脚本 (使用 Docker 官方安装)
# ============================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║   English Training VPS 一键部署        ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_header

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "请使用 root 权限运行: sudo bash setup-vps.sh"
    exit 1
fi

echo "此脚本将:"
echo "  1. 使用 Docker 官方脚本安装 Docker"
echo "  2. 安装必要工具 (git, curl, etc.)"
echo "  3. 配置防火墙"
echo ""
echo "继续? (yes/no)"
read -r confirm

if [ "$confirm" != "yes" ]; then
    echo "已取消"
    exit 0
fi

# Step 1: 更新系统
echo ""
echo "📦 更新系统包..."
apt-get update
apt-get upgrade -y
print_success "系统已更新"

# Step 2: 使用 Docker 官方脚本安装
echo ""
echo "🐳 安装 Docker (使用官方脚本)..."

if command -v docker &> /dev/null; then
    print_warning "Docker 已安装: $(docker --version)"
else
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    print_success "Docker 已安装: $(docker --version)"
fi

# 启动 Docker
systemctl start docker
systemctl enable docker
print_success "Docker 服务已启动并设置为开机自启"

# 验证 Docker 和 Docker Compose
echo ""
echo "🔧 验证安装..."
docker --version
docker compose version || docker-compose --version
print_success "Docker 和 Docker Compose 安装成功"

# Step 3: 安装常用工具
echo ""
echo "🛠️  安装常用工具..."
apt-get install -y \
    git \
    curl \
    wget \
    nano \
    vim \
    htop \
    ufw \
    sqlite3 \
    openssl \
    net-tools

print_success "常用工具已安装"

# Step 4: 配置防火墙
echo ""
echo "🔥 配置防火墙..."
ufw --force enable
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 3000/tcp
ufw allow 80/tcp
ufw allow 443/tcp
print_success "防火墙已配置"

# Step 5: 显示完成信息
echo ""
echo "════════════════════════════════════════"
echo -e "${GREEN}✅ VPS 初始化完成!${NC}"
echo "════════════════════════════════════════"
echo ""
echo "📊 安装信息:"
echo "  Docker: $(docker --version)"
if docker compose version &> /dev/null 2>&1; then
    echo "  Docker Compose: $(docker compose version --short)"
elif command -v docker-compose &> /dev/null; then
    echo "  Docker Compose: $(docker-compose --version | awk '{print $3}')"
fi
echo ""
echo "🔥 防火墙状态:"
ufw status numbered
echo ""
echo "📋 下一步操作:"
echo ""
echo "1. 克隆项目:"
echo "   git clone https://github.com/jantian3n/english-training.git"
echo "   cd english-training"
echo ""
echo "2. 配置环境变量:"
echo "   cp .env.production .env"
echo "   nano .env"
echo ""
echo "   必须设置的变量:"
echo "   - DEEPSEEK_API_KEY=sk-your-api-key"
echo "   - NEXTAUTH_SECRET=\$(openssl rand -base64 32)"
echo "   - NEXTAUTH_URL=http://$(hostname -I | awk '{print $1}'):3000"
echo "   - ADMIN_PASSWORD=your-password"
echo ""
echo "3. 部署应用:"
echo "   chmod +x deploy.sh"
echo "   ./deploy.sh"
echo ""
echo "💡 有用的命令:"
echo "  docker ps                    # 查看容器"
echo "  docker compose logs -f       # 查看日志"
echo "  ufw status                   # 防火墙状态"
echo ""
