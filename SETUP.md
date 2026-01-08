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

## VPS Deployment Setup

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

## Useful Docker Commands

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

## Troubleshooting

### Container won't start
docker-compose logs

### Database locked error
docker-compose down
docker-compose up -d

### Need to recreate database
docker-compose down
rm -rf ./data/dev.db
docker-compose up -d

### Port 3000 already in use
# Change port in docker-compose.yml:
ports:
  - "3001:3000"  # Use port 3001 instead
