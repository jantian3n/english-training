#!/bin/bash

# ============================================
# First-Time VPS Setup Script
# Run this once on a fresh VPS
# ============================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║   English Training VPS Setup Script   ║${NC}"
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
    print_error "Please run with sudo: sudo ./init-vps.sh"
    exit 1
fi

echo "This script will:"
echo "  1. Update system packages"
echo "  2. Install Docker and Docker Compose"
echo "  3. Setup firewall"
echo "  4. Create project directory"
echo "  5. Install additional tools"
echo ""
echo "Continue? (yes/no)"
read -r confirm

if [ "$confirm" != "yes" ]; then
    echo "Cancelled"
    exit 0
fi

# Step 1: Update system
echo ""
echo "📦 Updating system packages..."
apt-get update
apt-get upgrade -y
print_success "System updated"

# Step 2: Install Docker
echo ""
echo "🐳 Installing Docker..."
if command -v docker &> /dev/null; then
    print_warning "Docker already installed"
else
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    print_success "Docker installed"
fi

# Start Docker service
systemctl start docker
systemctl enable docker
print_success "Docker service enabled"

# Step 3: Install Docker Compose
echo ""
echo "🔧 Installing Docker Compose..."
if command -v docker-compose &> /dev/null; then
    print_warning "Docker Compose already installed"
else
    apt-get install -y docker-compose-plugin
    print_success "Docker Compose installed"
fi

# Step 4: Install additional tools
echo ""
echo "🛠️  Installing additional tools..."
apt-get install -y \
    git \
    curl \
    wget \
    nano \
    htop \
    ufw \
    sqlite3 \
    openssl

print_success "Tools installed"

# Step 5: Setup firewall
echo ""
echo "🔥 Configuring firewall..."
ufw --force enable
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 3000/tcp  # Application port
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
print_success "Firewall configured"

# Step 6: Create project directory
echo ""
echo "📁 Creating project directory..."
PROJECT_DIR="/opt/english-training"
mkdir -p "$PROJECT_DIR"
chmod 755 "$PROJECT_DIR"
print_success "Project directory created: $PROJECT_DIR"

# Step 7: Create backup directory
echo ""
echo "💾 Creating backup directory..."
mkdir -p "$PROJECT_DIR/backups"
mkdir -p "$PROJECT_DIR/data"
mkdir -p "$PROJECT_DIR/logs"
chmod 755 "$PROJECT_DIR/backups"
chmod 755 "$PROJECT_DIR/data"
chmod 755 "$PROJECT_DIR/logs"
print_success "Backup directories created"

# Step 8: Setup cron for daily backups
echo ""
echo "⏰ Setting up automated backups..."
CRON_JOB="0 2 * * * cd $PROJECT_DIR && ./backup.sh >> $PROJECT_DIR/logs/backup.log 2>&1"
(crontab -l 2>/dev/null | grep -v "backup.sh"; echo "$CRON_JOB") | crontab -
print_success "Daily backup scheduled (2 AM)"

# Step 9: Create non-root user for deployment (optional)
echo ""
echo "👤 Do you want to create a deployment user? (yes/no)"
read -r create_user

if [ "$create_user" = "yes" ]; then
    echo "Enter username:"
    read -r username

    if id "$username" &>/dev/null; then
        print_warning "User $username already exists"
    else
        adduser --disabled-password --gecos "" "$username"
        usermod -aG docker "$username"
        print_success "User $username created and added to docker group"

        # Grant access to project directory
        chown -R "$username:$username" "$PROJECT_DIR"
        print_success "Project directory ownership set to $username"
    fi
fi

# Step 10: Display information
echo ""
echo "════════════════════════════════════════"
echo -e "${GREEN}✅ VPS Setup Complete!${NC}"
echo "════════════════════════════════════════"
echo ""
echo "📊 System Information:"
echo "  OS: $(lsb_release -d | cut -f2)"
echo "  Docker: $(docker --version)"
echo "  Docker Compose: $(docker compose version)"
echo ""
echo "📁 Directories:"
echo "  Project: $PROJECT_DIR"
echo "  Backups: $PROJECT_DIR/backups"
echo "  Data: $PROJECT_DIR/data"
echo "  Logs: $PROJECT_DIR/logs"
echo ""
echo "🔥 Firewall Status:"
ufw status numbered
echo ""
echo "📋 Next Steps:"
echo "  1. Clone your repository:"
echo "     cd $PROJECT_DIR"
echo "     git clone <your-repo-url> ."
echo ""
echo "  2. Configure environment:"
echo "     cp .env.production .env"
echo "     nano .env"
echo ""
echo "  3. Generate secrets:"
echo "     openssl rand -base64 32  # For NEXTAUTH_SECRET"
echo ""
echo "  4. Deploy application:"
echo "     ./deploy.sh"
echo ""
echo "  5. Setup SSL (optional):"
echo "     apt-get install certbot python3-certbot-nginx"
echo "     certbot --nginx -d yourdomain.com"
echo ""
echo "💡 Useful Commands:"
echo "  docker ps                    # View running containers"
echo "  docker-compose logs -f       # View logs"
echo "  ufw status                   # Check firewall"
echo "  systemctl status docker      # Check Docker status"
echo "  ./backup.sh                  # Manual backup"
echo ""
