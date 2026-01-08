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

echo "System Health Check"
echo "===================="

SERVICE_NAME="english-training"
if command -v systemctl >/dev/null 2>&1 && systemctl list-unit-files | grep -q "^${SERVICE_NAME}\.service"; then
  echo -n "Checking service... "
  if systemctl is-active --quiet "$SERVICE_NAME"; then
    print_success "running"
  else
    print_error "not running"
    exit 1
  fi
fi

echo -n "Checking application health... "
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/health || echo "000")
if [ "$HTTP_CODE" = "200" ]; then
  print_success "HTTP $HTTP_CODE"
else
  print_error "HTTP $HTTP_CODE"
  exit 1
fi

echo -n "Checking database... "
if [ -f "./data/dev.db" ]; then
  DB_SIZE=$(du -h ./data/dev.db | cut -f1)
  print_success "found ($DB_SIZE)"
else
  print_error "not found"
  exit 1
fi

echo -n "Checking disk space... "
DISK_USAGE=$(df -h . | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -lt 80 ]; then
  print_success "${DISK_USAGE}% used"
elif [ "$DISK_USAGE" -lt 90 ]; then
  print_warning "${DISK_USAGE}% used"
else
  print_error "${DISK_USAGE}% used (high)"
fi

echo -n "Checking memory... "
MEM_USAGE=$(free | awk 'NR==2 {printf "%.0f", $3/$2*100}')
if [ "$MEM_USAGE" -lt 80 ]; then
  print_success "${MEM_USAGE}% used"
elif [ "$MEM_USAGE" -lt 90 ]; then
  print_warning "${MEM_USAGE}% used"
else
  print_error "${MEM_USAGE}% used (high)"
fi

echo -n "Checking backups... "
BACKUP_COUNT=$(ls -1 ./backups/dev_*.db 2>/dev/null | wc -l)
if [ "$BACKUP_COUNT" -gt 0 ]; then
  LATEST_BACKUP=$(ls -t ./backups/dev_*.db 2>/dev/null | head -1)
  BACKUP_AGE=$(( ($(date +%s) - $(stat -c %Y "$LATEST_BACKUP")) / 86400 ))
  if [ "$BACKUP_AGE" -lt 2 ]; then
    print_success "$BACKUP_COUNT backup(s), latest ${BACKUP_AGE}d ago"
  else
    print_warning "latest backup ${BACKUP_AGE}d ago"
  fi
else
  print_warning "no backups found"
fi

print_success "All checks passed"
