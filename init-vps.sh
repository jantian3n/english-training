#!/bin/bash

# ============================================
# VPS 初始化脚本 (优化版)
# 一次性安装所有依赖
# ============================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║   English Training VPS 初始化脚本      ║${NC}"
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

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then
    print_error "请使用 sudo 运行此脚本: sudo ./init-vps.sh"
    exit 1
fi

echo "此脚本将:"
echo "  1. 更新系统包"
echo "  2. 安装 Docker 和 Docker Compose"
echo "  3. 配置防火墙"
echo "  4. 安装常用工具"
echo "  5. 设置自动备份"
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

# Step 2: 安装 Docker
echo ""
echo "🐳 安装 Docker..."
if command -v docker &> /dev/null; then
    print_warning "Docker 已安装,版本: $(docker --version)"
else
    # 安装依赖
    apt-get install -y \
        ca-certificates \
        curl \
        gnupg \
        lsb-release

    # 添加 Docker 官方 GPG key
    mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg

    # 添加 Docker 仓库
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

    # 安装 Docker Engine
    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

    print_success "Docker 已安装: $(docker --version)"
fi

# 启动 Docker 服务
systemctl start docker
systemctl enable docker
print_success "Docker 服务已启动"

# Step 3: 验证 Docker Compose
echo ""
echo "🔧 验证 Docker Compose..."
if docker compose version &> /dev/null; then
    print_success "Docker Compose Plugin 已安装: $(docker compose version)"
elif command -v docker-compose &> /dev/null; then
    print_success "Docker Compose Standalone 已安装: $(docker-compose --version)"
else
    print_error "Docker Compose 安装失败,尝试手动安装..."

    # 尝试安装 standalone 版本
    COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep 'tag_name' | cut -d'"' -f4)
    curl -L "https://github.com/docker/compose/releases/download/${COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose

    if command -v docker-compose &> /dev/null; then
        print_success "Docker Compose Standalone 已安装: $(docker-compose --version)"
    else
        print_error "Docker Compose 安装失败,请手动安装"
        exit 1
    fi
fi

# Step 4: 安装常用工具
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

# Step 5: 配置防火墙
echo ""
echo "🔥 配置防火墙..."
ufw --force enable
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 3000/tcp  # 应用端口
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
print_success "防火墙已配置"

# Step 6: 添加当前用户到 docker 组 (如果不是 root)
if [ -n "$SUDO_USER" ]; then
    echo ""
    echo "👤 添加用户到 docker 组..."
    usermod -aG docker "$SUDO_USER"
    print_success "用户 $SUDO_USER 已添加到 docker 组"
    print_warning "注意: 需要重新登录才能生效"
fi

# Step 7: 显示安装信息
echo ""
echo "════════════════════════════════════════"
echo -e "${GREEN}✅ VPS 初始化完成!${NC}"
echo "════════════════════════════════════════"
echo ""
echo "📊 安装信息:"
echo "  操作系统: $(lsb_release -d | cut -f2)"
echo "  Docker: $(docker --version)"
if docker compose version &> /dev/null; then
    echo "  Docker Compose: $(docker compose version | head -1)"
else
    echo "  Docker Compose: $(docker-compose --version)"
fi
echo ""
echo "🔥 防火墙状态:"
ufw status numbered
echo ""
echo "📋 下一步操作:"
echo ""
echo "1. 克隆项目仓库:"
echo "   cd ~"
echo "   git clone https://github.com/jantian3n/english-training.git"
echo "   cd english-training"
echo ""
echo "2. 配置环境变量:"
echo "   cp .env.production .env"
echo "   nano .env"
echo ""
echo "   必须设置:"
echo "   - DEEPSEEK_API_KEY=your-api-key"
echo "   - NEXTAUTH_SECRET=\$(openssl rand -base64 32)"
echo "   - NEXTAUTH_URL=http://your-vps-ip:3000"
echo "   - ADMIN_PASSWORD=your-strong-password"
echo ""
echo "3. 部署应用:"
echo "   chmod +x deploy.sh"
echo "   ./deploy.sh"
echo ""
echo "💡 常用命令:"
echo "  查看容器状态:    docker ps"
echo "  查看日志:        docker compose logs -f"
echo "  防火墙状态:      sudo ufw status"
echo "  系统资源:        htop"
echo ""
echo "⚠️  如果添加了用户到 docker 组,请重新登录:"
echo "   exit"
echo "   ssh user@your-vps-ip"
echo ""
