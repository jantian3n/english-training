# ============================================
# Quick Setup Guide
# ============================================

## Local Development Setup

1. Install dependencies:
   npm install

2. Setup environment:
   cp .env.example .env
   # Edit .env with your values

3. Initialize database:
   npx prisma generate
   npx prisma db push
   npx prisma db seed

4. Run development server:
   npm run dev

## VPS Direct Deployment (No Docker)

1. First-time setup on VPS (run as root):

   # Clone repository
   git clone <your-repo> /opt/english-training
   cd /opt/english-training

   # Install system dependencies + Node.js
   sudo bash setup-vps-direct.sh
   # Optional overrides:
   # APP_DIR=/opt/english-training APP_USER=english-training sudo bash setup-vps-direct.sh

2. Configure environment:

   cp .env.vps.example .env
   nano .env

   # MUST CHANGE THESE:
   NEXTAUTH_SECRET="generate-random-32-chars"
   DEEPSEEK_API_KEY="sk-your-key"
   ADMIN_PASSWORD="strong-password"

3. Deploy:

   chmod +x deploy-vps.sh
   ./deploy-vps.sh

   # If you plan to use Nginx, use nginx.conf as a template and close port 3000 in ufw.

## Docker Deployment (Optional)

1. First-time setup on VPS:

   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh

   # Install Docker Compose
   sudo apt-get install docker-compose-plugin

   # Clone repository
   git clone <your-repo> /opt/english-training
   cd /opt/english-training

2. Configure environment:

   cp .env.production .env
   nano .env

   # MUST CHANGE THESE:
   NEXTAUTH_SECRET="generate-random-32-chars"
   DEEPSEEK_API_KEY="sk-your-key"
   ADMIN_PASSWORD="strong-password"

3. Deploy:

   chmod +x deploy.sh
   ./deploy.sh

## Generate NEXTAUTH_SECRET

openssl rand -base64 32

## Useful Commands

### Direct VPS

# View logs
sudo journalctl -u english-training -f

# Restart service
sudo systemctl restart english-training

# Health check
./health-check-vps.sh

# Backup database
./backup.sh

# Restore database
./restore-vps.sh

### Docker

# View logs
docker-compose logs -f

# Restart containers
docker-compose restart

# Stop containers
docker-compose down

# Rebuild after code changes
docker-compose build --no-cache
docker-compose up -d

# Access container shell
docker-compose exec web sh

# Backup database
cp ./data/dev.db ./data/backup-$(date +%Y%m%d).db

## Database Management

# View database with Prisma Studio (local)
npx prisma studio

# View database with SQLite CLI
sqlite3 ./data/dev.db

# Run migrations
npx prisma db push

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
