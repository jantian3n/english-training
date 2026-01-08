#!/bin/bash

# ============================================
# GitHub Repository Setup Script
# This script will help you push to a new GitHub repo
# ============================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   GitHub Repository Setup Script      ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Step 1: Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}✗ Git is not installed. Please install git first.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Git is installed${NC}"

# Step 2: Check if GitHub CLI is installed (optional but helpful)
if command -v gh &> /dev/null; then
    echo -e "${GREEN}✓ GitHub CLI is installed${NC}"
    USE_GH_CLI=true
else
    echo -e "${YELLOW}⚠ GitHub CLI not found (optional)${NC}"
    echo "  Install it for easier setup: https://cli.github.com/"
    USE_GH_CLI=false
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 1: Repository Information"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Get repository name
echo "Enter repository name (default: english-training):"
read -r REPO_NAME
REPO_NAME=${REPO_NAME:-english-training}

# Get GitHub username
echo ""
echo "Enter your GitHub username:"
read -r GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo -e "${RED}✗ GitHub username is required${NC}"
    exit 1
fi

# Repository URL
REPO_URL="https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

echo ""
echo -e "${BLUE}Repository Details:${NC}"
echo "  Name: $REPO_NAME"
echo "  Owner: $GITHUB_USERNAME"
echo "  URL: $REPO_URL"
echo ""

# Confirm
echo "Is this correct? (yes/no)"
read -r confirm
if [ "$confirm" != "yes" ]; then
    echo "Cancelled"
    exit 0
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 2: Initialize Local Git Repository"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if .git exists
if [ -d ".git" ]; then
    echo -e "${YELLOW}⚠ Git repository already exists${NC}"
    echo "Do you want to reinitialize? (yes/no)"
    read -r reinit
    if [ "$reinit" = "yes" ]; then
        rm -rf .git
        echo -e "${GREEN}✓ Removed existing .git directory${NC}"
    else
        echo "Keeping existing repository"
    fi
fi

# Initialize git if needed
if [ ! -d ".git" ]; then
    echo "Initializing Git repository..."
    git init
    echo -e "${GREEN}✓ Git initialized${NC}"
fi

# Configure git user (if not set)
if [ -z "$(git config user.name)" ]; then
    echo ""
    echo "Git user not configured. Enter your name:"
    read -r git_name
    git config user.name "$git_name"
fi

if [ -z "$(git config user.email)" ]; then
    echo "Enter your email:"
    read -r git_email
    git config user.email "$git_email"
fi

echo -e "${GREEN}✓ Git user configured${NC}"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 3: Prepare Files"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Make scripts executable
echo "Making scripts executable..."
chmod +x deploy.sh 2>/dev/null || true
chmod +x backup.sh 2>/dev/null || true
chmod +x restore.sh 2>/dev/null || true
chmod +x init-vps.sh 2>/dev/null || true
chmod +x health-check.sh 2>/dev/null || true
chmod +x init-git.sh 2>/dev/null || true
chmod +x make-executable.sh 2>/dev/null || true
chmod +x show-tree.sh 2>/dev/null || true
echo -e "${GREEN}✓ Scripts are executable${NC}"

# Update deploy.sh with correct repo URL
if [ -f "deploy.sh" ]; then
    echo "Updating deploy.sh with repository URL..."
    sed -i.bak "s|REPO_URL=\".*\"|REPO_URL=\"$REPO_URL\"|g" deploy.sh
    rm -f deploy.sh.bak
    echo -e "${GREEN}✓ deploy.sh updated${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 4: Create Initial Commit"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Add all files
echo "Adding files to git..."
git add .
echo -e "${GREEN}✓ Files staged${NC}"

# Check if there are changes to commit
if git diff --cached --quiet; then
    echo -e "${YELLOW}⚠ No changes to commit${NC}"
else
    # Create commit
    echo "Creating initial commit..."
    git commit -m "Initial commit: English Training App

- Next.js 14 with App Router
- TypeScript + Prisma + SQLite
- Material Design 3 (MUI v6)
- NextAuth.js v5 authentication
- DeepSeek AI integration
- SM-2 spaced repetition algorithm
- Docker deployment ready
- Complete documentation

Features:
- User management (Admin/User roles)
- Word management with AI content generation
- Interactive learning interface
- Progress tracking and statistics
- Automated backups
- One-command deployment

Tech Stack:
- Framework: Next.js 14
- Language: TypeScript
- UI: MUI v6 (MD3)
- Database: SQLite + Prisma
- Auth: NextAuth.js v5
- AI: DeepSeek API
- Deployment: Docker + Docker Compose"

    echo -e "${GREEN}✓ Initial commit created${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 5: Create GitHub Repository"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ "$USE_GH_CLI" = true ]; then
    echo "Would you like to create the GitHub repository using GitHub CLI? (yes/no)"
    read -r use_cli

    if [ "$use_cli" = "yes" ]; then
        echo ""
        echo "Repository visibility:"
        echo "  1) Public (recommended)"
        echo "  2) Private"
        read -r visibility_choice

        if [ "$visibility_choice" = "2" ]; then
            VISIBILITY="--private"
        else
            VISIBILITY="--public"
        fi

        echo ""
        echo "Creating GitHub repository..."
        gh repo create "$REPO_NAME" $VISIBILITY --source=. --remote=origin --description="AI-powered English vocabulary learning app with spaced repetition (SM-2), built with Next.js 14, Material Design 3, and Docker"

        echo -e "${GREEN}✓ GitHub repository created${NC}"
        REPO_CREATED=true
    else
        REPO_CREATED=false
    fi
else
    REPO_CREATED=false
fi

if [ "$REPO_CREATED" = false ]; then
    echo -e "${YELLOW}Please create a GitHub repository manually:${NC}"
    echo ""
    echo "1. Go to https://github.com/new"
    echo "2. Repository name: $REPO_NAME"
    echo "3. Description: AI-powered English vocabulary learning app"
    echo "4. Choose Public or Private"
    echo "5. Do NOT initialize with README, .gitignore, or license"
    echo "6. Click 'Create repository'"
    echo ""
    echo "Press Enter when you've created the repository..."
    read -r
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 6: Push to GitHub"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Add remote if not exists
if ! git remote | grep -q "origin"; then
    echo "Adding remote origin..."
    git remote add origin "$REPO_URL"
    echo -e "${GREEN}✓ Remote added${NC}"
else
    echo "Updating remote origin..."
    git remote set-url origin "$REPO_URL"
    echo -e "${GREEN}✓ Remote updated${NC}"
fi

# Rename branch to main
echo "Setting default branch to main..."
git branch -M main
echo -e "${GREEN}✓ Branch renamed to main${NC}"

# Push to GitHub
echo ""
echo "Pushing to GitHub..."
echo -e "${YELLOW}You may be prompted to enter your GitHub credentials${NC}"
echo ""

if git push -u origin main; then
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${GREEN}✅ SUCCESS! Repository pushed to GitHub${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "🔗 Repository URL:"
    echo "   https://github.com/$GITHUB_USERNAME/$REPO_NAME"
    echo ""
    echo "📋 Next Steps:"
    echo ""
    echo "1. Visit your repository:"
    echo "   https://github.com/$GITHUB_USERNAME/$REPO_NAME"
    echo ""
    echo "2. Add repository topics (optional):"
    echo "   - nextjs"
    echo "   - typescript"
    echo "   - material-ui"
    echo "   - docker"
    echo "   - spaced-repetition"
    echo "   - english-learning"
    echo ""
    echo "3. Update README badges:"
    echo "   Edit README.md and replace 'yourusername' with '$GITHUB_USERNAME'"
    echo ""
    echo "4. Setup GitHub Actions (optional):"
    echo "   Add CI/CD workflows in .github/workflows/"
    echo ""
    echo "5. Deploy to VPS:"
    echo "   ssh your-vps"
    echo "   git clone https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
    echo "   cd $REPO_NAME"
    echo "   ./deploy.sh"
    echo ""
    echo "💡 Useful Git Commands:"
    echo "   git status                    # Check status"
    echo "   git add .                     # Stage changes"
    echo "   git commit -m 'message'       # Commit"
    echo "   git push                      # Push to GitHub"
    echo "   git pull                      # Pull from GitHub"
    echo ""
else
    echo ""
    echo -e "${RED}✗ Failed to push to GitHub${NC}"
    echo ""
    echo "Common issues:"
    echo ""
    echo "1. Authentication required:"
    echo "   - Use GitHub Personal Access Token"
    echo "   - Generate at: https://github.com/settings/tokens"
    echo "   - Use token as password when prompted"
    echo ""
    echo "2. Repository doesn't exist:"
    echo "   - Create it at: https://github.com/new"
    echo "   - Then run: git push -u origin main"
    echo ""
    echo "3. Already exists but different history:"
    echo "   - Force push (careful!): git push -u origin main --force"
    echo ""
    exit 1
fi
