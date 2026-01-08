#!/bin/bash

# ============================================
# Database Restore Script
# ============================================

set -e

BACKUP_DIR="./backups"
DB_FILE="./data/dev.db"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "🔄 Database Restore Script"
echo "=========================="
echo ""

# Check if backup directory exists
if [ ! -d "$BACKUP_DIR" ]; then
    echo -e "${RED}✗ Backup directory not found: $BACKUP_DIR${NC}"
    exit 1
fi

# List available backups
echo "Available backups:"
echo ""
ls -lh "$BACKUP_DIR"/dev_*.db 2>/dev/null | awk '{print NR") " $9 " (" $5 ")"}'

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ No backups found${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}Enter the backup number to restore (or 'q' to quit):${NC}"
read -r choice

if [ "$choice" = "q" ]; then
    echo "Cancelled"
    exit 0
fi

# Get the selected backup file
BACKUP_FILE=$(ls -t "$BACKUP_DIR"/dev_*.db | sed -n "${choice}p")

if [ -z "$BACKUP_FILE" ]; then
    echo -e "${RED}✗ Invalid selection${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}⚠️  WARNING: This will replace your current database!${NC}"
echo "Current database: $DB_FILE"
echo "Restore from: $BACKUP_FILE"
echo ""
echo "Are you sure? (yes/no)"
read -r confirm

if [ "$confirm" != "yes" ]; then
    echo "Cancelled"
    exit 0
fi

# Stop containers
echo "🛑 Stopping containers..."
docker-compose down

# Backup current database
if [ -f "$DB_FILE" ]; then
    CURRENT_BACKUP="$BACKUP_DIR/before_restore_$(date +%Y%m%d_%H%M%S).db"
    cp "$DB_FILE" "$CURRENT_BACKUP"
    echo -e "${GREEN}✓ Current database backed up to: $CURRENT_BACKUP${NC}"
fi

# Restore backup
echo "📦 Restoring database..."
cp "$BACKUP_FILE" "$DB_FILE"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Database restored successfully!${NC}"

    # Restart containers
    echo "🚢 Starting containers..."
    docker-compose up -d

    echo -e "${GREEN}✓ Restore complete!${NC}"
else
    echo -e "${RED}✗ Restore failed!${NC}"
    exit 1
fi
