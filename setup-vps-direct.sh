#!/bin/bash

set -e

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

if [ "$(id -u)" -ne 0 ]; then
  print_error "Run as root: sudo bash setup-vps-direct.sh"
  exit 1
fi

APP_DIR="${APP_DIR:-/opt/english-training}"
APP_USER="${APP_USER:-english-training}"

print_success "Updating system packages"
apt-get update
apt-get upgrade -y

print_success "Installing system dependencies"
apt-get install -y curl git nginx ufw sqlite3 ca-certificates openssl

if ! command -v node >/dev/null 2>&1; then
  print_success "Installing Node.js 20"
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
else
  NODE_VERSION=$(node -v | sed 's/^v//')
  NODE_MAJOR=$(echo "$NODE_VERSION" | cut -d. -f1)
  if [ "$NODE_MAJOR" -lt 20 ]; then
    print_warning "Node.js version is $NODE_VERSION. Please upgrade to 20+."
  fi
fi

if ! id -u "$APP_USER" >/dev/null 2>&1; then
  print_success "Creating app user: $APP_USER"
  useradd -m -d "$APP_DIR" -s /bin/bash "$APP_USER"
fi

mkdir -p "$APP_DIR"
chown -R "$APP_USER":"$APP_USER" "$APP_DIR"

if [ ! -f "$APP_DIR/package.json" ]; then
  print_warning "Project not found at $APP_DIR. Clone the repo there before deploying."
fi

SERVICE_TEMPLATE="$APP_DIR/systemd/english-training.service"
SERVICE_PATH="/etc/systemd/system/english-training.service"
if [ -f "$SERVICE_TEMPLATE" ]; then
  print_success "Installing systemd service"
  sed "s|__APP_DIR__|$APP_DIR|g; s|__APP_USER__|$APP_USER|g" \
    "$SERVICE_TEMPLATE" > "$SERVICE_PATH"
  systemctl daemon-reload
  systemctl enable english-training
else
  print_warning "Service template not found at $SERVICE_TEMPLATE"
fi

print_success "Configuring firewall"
ufw --force enable
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 3000/tcp
print_warning "Port 3000 is open. Close it if you are using Nginx as a reverse proxy."

print_success "Setup complete"
