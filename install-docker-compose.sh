#!/bin/bash

# ============================================
# 快速安装 Docker Compose
# ============================================

set -e

echo "🔧 正在安装 Docker Compose..."

# 检查系统类型
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$ID
else
    echo "❌ 无法检测系统类型"
    exit 1
fi

# 安装 Docker Compose
if [ "$OS" = "ubuntu" ] || [ "$OS" = "debian" ]; then
    echo "检测到 Ubuntu/Debian 系统"

    # 更新包列表
    apt-get update

    # 安装 Docker Compose Plugin
    apt-get install -y docker-compose-plugin

    echo "✅ Docker Compose 已安装"

elif [ "$OS" = "centos" ] || [ "$OS" = "rhel" ] || [ "$OS" = "fedora" ]; then
    echo "检测到 CentOS/RHEL/Fedora 系统"

    # 安装 Docker Compose Plugin
    yum install -y docker-compose-plugin

    echo "✅ Docker Compose 已安装"

else
    echo "⚠️  未知系统,尝试通用安装方法..."

    # 下载最新版本的 Docker Compose
    COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep 'tag_name' | cut -d'"' -f4)

    curl -L "https://github.com/docker/compose/releases/download/${COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

    chmod +x /usr/local/bin/docker-compose

    echo "✅ Docker Compose 已安装"
fi

# 验证安装
echo ""
echo "📋 验证安装..."
docker compose version || docker-compose version

echo ""
echo "✅ 安装完成!"
echo ""
echo "现在可以运行部署脚本了:"
echo "  ./deploy.sh"
