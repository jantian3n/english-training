#!/bin/bash

set -e

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$APP_DIR"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_success() {
  echo -e "${GREEN}OK:${NC} $1"
}

print_warning() {
  echo -e "${YELLOW}WARN:${NC} $1"
}

print_error() {
  echo -e "${RED}ERROR:${NC} $1"
}

if ! command -v node >/dev/null 2>&1; then
  print_error "Node.js is not installed."
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  print_error "npm is not installed."
  exit 1
fi

NODE_VERSION=$(node -v | sed 's/^v//')
NODE_MAJOR=$(echo "$NODE_VERSION" | cut -d. -f1)
if [ "$NODE_MAJOR" -lt 20 ]; then
  print_warning "Node.js version is $NODE_VERSION. Please upgrade to 20+."
fi

if [ ! -f "package.json" ]; then
  print_error "package.json not found. Run this script from the project directory."
  exit 1
fi

if [ -d ".git" ]; then
  BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "")
  if [ -n "$BRANCH" ] && [ "$BRANCH" != "HEAD" ]; then
    echo "Pulling latest code for $BRANCH..."
    if ! git pull --ff-only origin "$BRANCH"; then
      print_warning "Git pull failed; using current code."
    fi
  else
    print_warning "Detached HEAD; skipping git pull."
  fi
fi

if [ ! -f ".env" ]; then
  if [ -f ".env.vps.example" ]; then
    cp .env.vps.example .env
    print_warning "Copied .env.vps.example to .env. Please edit .env and re-run."
    exit 1
  elif [ -f ".env.production" ]; then
    cp .env.production .env
    print_warning "Copied .env.production to .env. Please edit .env and re-run."
    exit 1
  else
    print_error "No .env file found."
    exit 1
  fi
fi

if grep -q 'DATABASE_URL="file:/app/prisma/data' .env 2>/dev/null; then
  print_warning "DATABASE_URL looks like a Docker path. For direct VPS use: file:./data/dev.db"
fi

mkdir -p ./data ./logs ./backups
chmod 755 ./data ./logs ./backups

print_success "Installing dependencies"
npm ci --include=dev

print_success "Generating Prisma client"
npx prisma generate

print_success "Syncing database schema"
npx prisma db push

DB_FILE="./data/dev.db"
if [ ! -f "$DB_FILE" ]; then
  print_success "Seeding initial data"
  npx prisma db seed
fi

export NEXT_TELEMETRY_DISABLED=1
export NODE_ENV=production

print_success "Building application"
npm run build

SUDO=""
if [ "$(id -u)" -ne 0 ]; then
  if command -v sudo >/dev/null 2>&1; then
    SUDO="sudo"
  else
    print_warning "sudo not found; cannot manage systemd service."
  fi
fi

SERVICE_NAME="english-training"
if command -v systemctl >/dev/null 2>&1; then
  if systemctl list-unit-files | grep -q "^${SERVICE_NAME}\.service"; then
    $SUDO systemctl daemon-reload
    $SUDO systemctl restart "$SERVICE_NAME"
    $SUDO systemctl status "$SERVICE_NAME" --no-pager
    print_success "Service restarted"
  else
    print_warning "Systemd service not installed. Run setup-vps-direct.sh to install it."
  fi
else
  print_warning "systemctl not available. Start the app with: npm run start"
fi

if command -v hostname >/dev/null 2>&1; then
  IP=$(hostname -I | awk '{print $1}')
  echo "App URL: http://${IP}:3000"
fi
