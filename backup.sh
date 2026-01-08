#!/bin/bash

# ============================================
# Database Backup Script
# Run this script regularly to backup your data
# ============================================

set -e

# Configuration
BACKUP_DIR="./backups"
DB_FILE="./data/dev.db"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/dev_$TIMESTAMP.db"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "🔒 Starting database backup..."

# Create backup directory if not exists
mkdir -p "$BACKUP_DIR"

# Check if database exists
if [ ! -f "$DB_FILE" ]; then
    echo -e "${RED}✗ Database file not found: $DB_FILE${NC}"
    exit 1
fi

# Backup database
echo "📦 Backing up database..."
cp "$DB_FILE" "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Backup successful!${NC}"
    echo "📁 Backup location: $BACKUP_FILE"

    # Show file size
    SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo "📊 Backup size: $SIZE"

    # Keep only last 10 backups
    echo "🧹 Cleaning old backups..."
    cd "$BACKUP_DIR"
    ls -t dev_*.db | tail -n +11 | xargs -r rm
    echo -e "${GREEN}✓ Cleanup complete${NC}"

    # List remaining backups
    echo ""
    echo "Available backups:"
    ls -lh dev_*.db 2>/dev/null || echo "No backups found"
else
    echo -e "${RED}✗ Backup failed!${NC}"
    exit 1
fi
