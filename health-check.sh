#!/bin/bash

# ============================================
# Health Check Script
# Run this to verify system is working
# ============================================

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🏥 System Health Check"
echo "======================"
echo ""

# Check 1: Docker running
echo -n "Checking Docker service... "
if systemctl is-active --quiet docker; then
    echo -e "${GREEN}✓ Running${NC}"
else
    echo -e "${RED}✗ Not running${NC}"
    exit 1
fi

# Check 2: Containers running
echo -n "Checking containers... "
CONTAINER_COUNT=$(docker-compose ps -q | wc -l)
if [ "$CONTAINER_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✓ $CONTAINER_COUNT container(s) running${NC}"
else
    echo -e "${RED}✗ No containers running${NC}"
    exit 1
fi

# Check 3: Application responding
echo -n "Checking application health... "
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/health || echo "000")
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ Healthy (HTTP $HTTP_CODE)${NC}"
else
    echo -e "${RED}✗ Unhealthy (HTTP $HTTP_CODE)${NC}"
    exit 1
fi

# Check 4: Database exists
echo -n "Checking database... "
if [ -f "./data/dev.db" ]; then
    DB_SIZE=$(du -h ./data/dev.db | cut -f1)
    echo -e "${GREEN}✓ Found ($DB_SIZE)${NC}"
else
    echo -e "${RED}✗ Not found${NC}"
    exit 1
fi

# Check 5: Disk space
echo -n "Checking disk space... "
DISK_USAGE=$(df -h . | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -lt 80 ]; then
    echo -e "${GREEN}✓ ${DISK_USAGE}% used${NC}"
elif [ "$DISK_USAGE" -lt 90 ]; then
    echo -e "${YELLOW}⚠ ${DISK_USAGE}% used${NC}"
else
    echo -e "${RED}✗ ${DISK_USAGE}% used (Critical!)${NC}"
fi

# Check 6: Memory usage
echo -n "Checking memory... "
MEM_USAGE=$(free | awk 'NR==2 {printf "%.0f", $3/$2*100}')
if [ "$MEM_USAGE" -lt 80 ]; then
    echo -e "${GREEN}✓ ${MEM_USAGE}% used${NC}"
elif [ "$MEM_USAGE" -lt 90 ]; then
    echo -e "${YELLOW}⚠ ${MEM_USAGE}% used${NC}"
else
    echo -e "${RED}✗ ${MEM_USAGE}% used (High!)${NC}"
fi

# Check 7: Recent backups
echo -n "Checking backups... "
BACKUP_COUNT=$(ls -1 ./backups/dev_*.db 2>/dev/null | wc -l)
if [ "$BACKUP_COUNT" -gt 0 ]; then
    LATEST_BACKUP=$(ls -t ./backups/dev_*.db 2>/dev/null | head -1)
    BACKUP_AGE=$(( ($(date +%s) - $(stat -c %Y "$LATEST_BACKUP")) / 86400 ))
    if [ "$BACKUP_AGE" -lt 2 ]; then
        echo -e "${GREEN}✓ $BACKUP_COUNT backup(s), latest: ${BACKUP_AGE}d ago${NC}"
    else
        echo -e "${YELLOW}⚠ Latest backup is ${BACKUP_AGE}d old${NC}"
    fi
else
    echo -e "${YELLOW}⚠ No backups found${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✓ All checks passed!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Display container stats
echo "📊 Container Stats:"
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"

echo ""
echo "🔗 Quick Links:"
echo "  Application: http://localhost:3000"
echo "  Health Check: http://localhost:3000/api/health"
echo ""
