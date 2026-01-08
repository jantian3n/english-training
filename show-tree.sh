#!/bin/bash

# ============================================
# Project Structure Visualization
# Run this to see the file tree
# ============================================

echo "📁 English Training - Project Structure"
echo "========================================"
echo ""

if command -v tree &> /dev/null; then
    # Use tree command if available
    tree -L 3 -I 'node_modules|.next|.git|backups|data|logs' --dirsfirst
else
    # Fallback to find command
    find . -maxdepth 3 -not -path '*/node_modules/*' -not -path '*/.next/*' -not -path '*/.git/*' -not -path '*/backups/*' -not -path '*/data/*' | sort
fi

echo ""
echo "📊 File Statistics:"
echo "==================="

# Count files by type
echo ""
echo "Code files:"
echo "  TypeScript: $(find . -name '*.ts' -o -name '*.tsx' | grep -v node_modules | wc -l)"
echo "  JavaScript: $(find . -name '*.js' | grep -v node_modules | wc -l)"
echo "  Prisma:     $(find . -name 'schema.prisma' | wc -l)"
echo ""

echo "Config files:"
echo "  Docker:     $(find . -name 'Dockerfile' -o -name 'docker-compose*.yml' | wc -l)"
echo "  JSON:       $(find . -name '*.json' | grep -v node_modules | wc -l)"
echo "  ENV:        $(find . -name '.env*' | wc -l)"
echo ""

echo "Scripts:"
echo "  Shell:      $(find . -name '*.sh' | wc -l)"
echo ""

echo "Documentation:"
echo "  Markdown:   $(find . -name '*.md' | wc -l)"
echo ""

# Total lines of code
if command -v cloc &> /dev/null; then
    echo "Lines of Code:"
    cloc . --exclude-dir=node_modules,.next,.git,data,backups --quiet
fi
