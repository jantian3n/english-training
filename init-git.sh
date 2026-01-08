#!/bin/bash

# ============================================
# Git Repository Initialization Script
# ============================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}📦 Initializing Git Repository${NC}"
echo ""

# Check if git is initialized
if [ -d ".git" ]; then
    echo -e "${YELLOW}⚠  Git repository already exists${NC}"
    echo "Do you want to reinitialize? (yes/no)"
    read -r confirm
    if [ "$confirm" != "yes" ]; then
        exit 0
    fi
    rm -rf .git
fi

# Initialize git
echo "🔧 Initializing Git..."
git init
echo -e "${GREEN}✓ Git initialized${NC}"

# Make scripts executable
echo "🔐 Making scripts executable..."
chmod +x deploy.sh
chmod +x backup.sh
chmod +x restore.sh
chmod +x init-vps.sh
chmod +x health-check.sh
chmod +x make-executable.sh
echo -e "${GREEN}✓ Scripts are executable${NC}"

# Create initial commit
echo "📝 Creating initial commit..."
git add .
git commit -m "Initial commit: English Training App

- Next.js 14 with App Router
- TypeScript + Prisma + SQLite
- MUI Material Design 3
- NextAuth.js v5
- DeepSeek AI integration
- SM-2 spaced repetition algorithm
- Docker deployment ready
- Complete documentation"

echo -e "${GREEN}✓ Initial commit created${NC}"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ Repository Initialized!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Create a new repository on GitHub/GitLab"
echo ""
echo "2. Add remote:"
echo "   git remote add origin https://github.com/yourusername/english-training.git"
echo ""
echo "3. Push to remote:"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "4. Update deploy.sh with your repository URL:"
echo "   nano deploy.sh"
echo "   # Change REPO_URL to your actual repository"
echo ""
echo "💡 Useful Git Commands:"
echo "   git status                    # Check status"
echo "   git add .                     # Stage all changes"
echo "   git commit -m 'message'       # Commit changes"
echo "   git push                      # Push to remote"
echo "   git pull                      # Pull from remote"
echo "   git log --oneline             # View commit history"
echo ""
