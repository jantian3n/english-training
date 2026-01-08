#!/bin/bash

set -e

BACKUP_DIR="./backups"
DB_FILE="./data/dev.db"

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

echo "Database Restore"
echo "================"

if [ ! -d "$BACKUP_DIR" ]; then
  print_error "Backup directory not found: $BACKUP_DIR"
  exit 1
fi

echo "Available backups:"
ls -lh "$BACKUP_DIR"/dev_*.db 2>/dev/null | awk '{print NR") " $9 " (" $5 ")"}'
if [ $? -ne 0 ]; then
  print_error "No backups found"
  exit 1
fi

echo ""
echo -e "${YELLOW}Enter backup number to restore (or 'q' to quit):${NC}"
read -r choice

if [ "$choice" = "q" ]; then
  echo "Cancelled"
  exit 0
fi

BACKUP_FILE=$(ls -t "$BACKUP_DIR"/dev_*.db | sed -n "${choice}p")

if [ -z "$BACKUP_FILE" ]; then
  print_error "Invalid selection"
  exit 1
fi

echo ""
print_warning "This will replace your current database"
echo "Current database: $DB_FILE"
echo "Restore from: $BACKUP_FILE"
echo ""
echo "Are you sure? (yes/no)"
read -r confirm

if [ "$confirm" != "yes" ]; then
  echo "Cancelled"
  exit 0
fi

SUDO=""
if [ "$(id -u)" -ne 0 ]; then
  if command -v sudo >/dev/null 2>&1; then
    SUDO="sudo"
  fi
fi

SERVICE_NAME="english-training"
if command -v systemctl >/dev/null 2>&1 && systemctl list-unit-files | grep -q "^${SERVICE_NAME}\.service"; then
  echo "Stopping service..."
  $SUDO systemctl stop "$SERVICE_NAME"
fi

if [ -f "$DB_FILE" ]; then
  CURRENT_BACKUP="$BACKUP_DIR/before_restore_$(date +%Y%m%d_%H%M%S).db"
  cp "$DB_FILE" "$CURRENT_BACKUP"
  print_success "Current database backed up to: $CURRENT_BACKUP"
fi

echo "Restoring database..."
cp "$BACKUP_FILE" "$DB_FILE"

print_success "Database restored"

if command -v systemctl >/dev/null 2>&1 && systemctl list-unit-files | grep -q "^${SERVICE_NAME}\.service"; then
  echo "Starting service..."
  $SUDO systemctl start "$SERVICE_NAME"
fi

print_success "Restore complete"
