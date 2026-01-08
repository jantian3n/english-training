#!/bin/bash

# ============================================
# VPS Deployment Script
# Git-based Docker Build & Deploy
# ============================================

set -e  # Exit on error

echo "🚀 Starting deployment..."

# Configuration
PROJECT_DIR="/opt/english-training"
REPO_URL="https://github.com/jantian3n/english-training.git"
BRANCH="main"

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

# Check if git is installed
if ! command -v git &> /dev/null; then
    print_error "Git is not installed. Please install git first."
    exit 1
fi

# Check if docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install docker first."
    exit 1
fi

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install docker-compose first."
    exit 1
fi

# Step 1: Navigate to project directory or clone
if [ -d "$PROJECT_DIR" ]; then
    print_success "Project directory exists"
    cd "$PROJECT_DIR"

    # Pull latest changes
    echo "📥 Pulling latest code from Git..."
    git fetch origin
    git reset --hard origin/$BRANCH
    print_success "Code updated to latest version"
else
    print_warning "Project directory not found. Cloning repository..."
    mkdir -p "$PROJECT_DIR"
    git clone -b "$BRANCH" "$REPO_URL" "$PROJECT_DIR"
    cd "$PROJECT_DIR"
    print_success "Repository cloned"
fi

# Step 2: Ensure .env file exists
if [ ! -f ".env" ]; then
    print_warning ".env file not found!"
    if [ -f ".env.production" ]; then
        cp .env.production .env
        print_warning "Copied .env.production to .env - PLEASE UPDATE VALUES!"
        echo "Edit .env and re-run this script:"
        echo "  nano .env"
        exit 1
    else
        print_error "No .env or .env.production file found. Please create one."
        exit 1
    fi
fi

# Step 3: Create data directory for SQLite persistence
echo "📁 Creating data directory for database persistence..."
mkdir -p ./data
mkdir -p ./logs
chmod 755 ./data ./logs
print_success "Data directories created"

# Step 4: Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down || true
print_success "Containers stopped"

# Step 5: Build new images
echo "🔨 Building Docker images..."
docker-compose build --no-cache
print_success "Images built successfully"

# Step 6: Start containers
echo "🚢 Starting containers..."
docker-compose up -d
print_success "Containers started"

# Step 7: Wait for health check
echo "⏳ Waiting for application to be healthy..."
sleep 10

# Check if container is running
if docker-compose ps | grep -q "Up"; then
    print_success "Application is running!"
else
    print_error "Application failed to start. Check logs with: docker-compose logs"
    exit 1
fi

# Step 8: Show status
echo ""
echo "======================================"
echo "✅ Deployment completed successfully!"
echo "======================================"
echo ""
echo "📊 Container Status:"
docker-compose ps
echo ""
echo "🔗 Application URL: http://$(hostname -I | awk '{print $1}'):3000"
echo ""
echo "📝 Useful Commands:"
echo "  View logs:        docker-compose logs -f"
echo "  Stop app:         docker-compose down"
echo "  Restart app:      docker-compose restart"
echo "  Database backup:  cp ./data/dev.db ./data/dev.db.backup"
echo ""
echo "💾 Database Location: $PROJECT_DIR/data/dev.db"
echo "📁 Logs Location: $PROJECT_DIR/logs"
echo ""
