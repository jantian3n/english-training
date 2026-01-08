#!/bin/bash

# ============================================
# 简化版 VPS 部署脚本
# 适用于已经 git clone 的情况
# ============================================

set -e  # Exit on error

echo "🚀 Starting deployment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored messages
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check if docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please run: sudo ./init-vps.sh"
    exit 1
fi

# Check if docker compose is available (try both versions)
DOCKER_COMPOSE_CMD=""
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker-compose"
    print_success "Found docker-compose (standalone)"
elif docker compose version &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker compose"
    print_success "Found docker compose (plugin)"
else
    print_error "Docker Compose is not installed."
    echo ""
    echo "Please install Docker Compose:"
    echo "  sudo apt-get update"
    echo "  sudo apt-get install -y docker-compose-plugin"
    echo ""
    echo "Or run the installation script:"
    echo "  sudo ./install-docker-compose.sh"
    exit 1
fi

# Step 1: Check if we're in the project directory
if [ ! -f "docker-compose.yml" ]; then
    print_error "docker-compose.yml not found!"
    echo "Please run this script from the project directory:"
    echo "  cd ~/english-training"
    echo "  ./deploy.sh"
    exit 1
fi

print_success "In project directory"

# Step 2: Pull latest changes (optional, only if git repo exists)
if [ -d ".git" ]; then
    echo "📥 Pulling latest code from Git..."
    git pull origin main || print_warning "Failed to pull, continuing with current code..."
    print_success "Code updated"
else
    print_warning "Not a git repository, using current code"
fi

# Step 3: Ensure .env file exists
if [ ! -f ".env" ]; then
    print_warning ".env file not found!"
    if [ -f ".env.production" ]; then
        cp .env.production .env
        print_warning "Copied .env.production to .env"
        echo ""
        echo "⚠️  IMPORTANT: Edit .env file before deploying:"
        echo "  1. Set DEEPSEEK_API_KEY"
        echo "  2. Set NEXTAUTH_SECRET (run: openssl rand -base64 32)"
        echo "  3. Set NEXTAUTH_URL to your domain"
        echo "  4. Set ADMIN_PASSWORD"
        echo ""
        echo "Edit now:"
        echo "  nano .env"
        echo ""
        echo "Then run deploy.sh again"
        exit 1
    else
        print_error "No .env or .env.production file found. Please create one."
        exit 1
    fi
fi

print_success ".env file exists"

# Step 4: Create data directory for SQLite persistence
echo "📁 Creating data directories..."
mkdir -p ./data
mkdir -p ./logs
mkdir -p ./backups
chmod 755 ./data ./logs ./backups
print_success "Data directories created"

# Step 5: Stop existing containers
echo "🛑 Stopping existing containers..."
$DOCKER_COMPOSE_CMD down || true
print_success "Containers stopped"

# Step 6: Build new images
echo "🔨 Building Docker images..."
$DOCKER_COMPOSE_CMD build --no-cache
print_success "Images built successfully"

# Step 7: Start containers
echo "🚢 Starting containers..."
$DOCKER_COMPOSE_CMD up -d
print_success "Containers started"

# Step 8: Wait for health check
echo "⏳ Waiting for application to be healthy..."
sleep 15

# Check if container is running
if $DOCKER_COMPOSE_CMD ps | grep -q "Up"; then
    print_success "Application is running!"
else
    print_error "Application failed to start. Check logs with:"
    echo "  $DOCKER_COMPOSE_CMD logs"
    exit 1
fi

# Step 9: Show status
echo ""
echo "======================================"
echo "✅ Deployment completed successfully!"
echo "======================================"
echo ""
echo "📊 Container Status:"
$DOCKER_COMPOSE_CMD ps
echo ""

# Get IP address
if command -v hostname &> /dev/null; then
    IP=$(hostname -I | awk '{print $1}')
    echo "🔗 Application URLs:"
    echo "   http://$IP:3000"
    echo "   http://localhost:3000 (if on local machine)"
else
    echo "🔗 Application URL: http://your-vps-ip:3000"
fi

echo ""
echo "📝 Useful Commands:"
echo "  View logs:        $DOCKER_COMPOSE_CMD logs -f"
echo "  Stop app:         $DOCKER_COMPOSE_CMD down"
echo "  Restart app:      $DOCKER_COMPOSE_CMD restart"
echo "  Backup database:  ./backup.sh"
echo "  Health check:     ./health-check.sh"
echo ""
echo "💾 Database Location: $(pwd)/data/dev.db"
echo "📁 Logs Location: $(pwd)/logs"
echo ""

# Show default credentials reminder
echo "🔑 Default Login Credentials:"
echo "   Admin: admin@example.com / admin123"
echo "   User:  user@example.com / user123"
echo ""
echo "⚠️  Remember to change the admin password in production!"
echo ""
