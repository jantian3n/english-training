# English Training - Quick Reference

## 🚀 Essential Commands

### Local Development
```bash
npm install                  # Install dependencies
npx prisma generate         # Generate Prisma client
npx prisma db push          # Push schema to database
npx prisma db seed          # Seed initial data
npm run dev                 # Start dev server
```

### Docker Deployment
```bash
./deploy.sh                 # Full deployment (recommended)
docker-compose up -d        # Start containers
docker-compose down         # Stop containers
docker-compose logs -f      # View logs
docker-compose restart      # Restart containers
docker-compose build        # Rebuild images
```

### Database Management
```bash
./backup.sh                 # Backup database
./restore.sh                # Restore database
sqlite3 ./data/dev.db       # Access database CLI
npx prisma studio           # Visual database editor
```

### Health & Monitoring
```bash
./health-check.sh           # Run health checks
docker stats                # Container resource usage
docker-compose ps           # Container status
```

## 🔑 Environment Variables

**Required:**
- `DATABASE_URL` - SQLite connection string
- `NEXTAUTH_SECRET` - Auth secret (32+ chars)
- `DEEPSEEK_API_KEY` - AI API key
- `NEXTAUTH_URL` - Application URL

**Optional:**
- `ADMIN_EMAIL` - Default admin email
- `ADMIN_PASSWORD` - Default admin password

## 📁 Important Files

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Main deployment config |
| `Dockerfile` | Container build instructions |
| `.env` | Environment variables |
| `prisma/schema.prisma` | Database schema |
| `deploy.sh` | Deployment script |
| `backup.sh` | Database backup script |

## 🐛 Troubleshooting

### Container won't start
```bash
docker-compose logs
# Check for port conflicts or env vars
```

### Database locked
```bash
docker-compose down
docker-compose up -d
```

### Out of disk space
```bash
docker system prune -a      # Clean Docker
rm -rf ./logs/*            # Clear logs
```

### Reset everything
```bash
docker-compose down -v      # Stop and remove volumes
rm -rf ./data/*            # Delete database
./deploy.sh                # Redeploy
```

## 🔐 Default Credentials

**Admin:**
- Email: `admin@example.com`
- Password: `admin123`

**User:**
- Email: `user@example.com`
- Password: `user123`

⚠️ **Change these in production!**

## 📊 Key URLs

| URL | Description |
|-----|-------------|
| `/` | Home (redirects to /learn) |
| `/login` | Login page |
| `/learn` | Learning interface |
| `/dashboard` | User dashboard |
| `/admin/users` | User management |
| `/admin/words` | Word management |
| `/api/health` | Health check |

## 🎯 Common Tasks

### Add a new word
1. Login as admin
2. Go to `/admin/words`
3. Click "Add Word"
4. Enter word and definition
5. AI generates content automatically

### Create a user
1. Login as admin
2. Go to `/admin/users`
3. Click "Add User"
4. Fill in details

### Reset user password
1. Login as admin
2. Go to `/admin/users`
3. Click key icon next to user
4. Enter new password

### Update deployment
```bash
git pull origin main
./deploy.sh
```

## 📈 Monitoring

### View application logs
```bash
docker-compose logs -f web
```

### View all logs
```bash
docker-compose logs -f
```

### Check container health
```bash
docker-compose ps
curl http://localhost:3000/api/health
```

### Database size
```bash
du -h ./data/dev.db
```

## 🔄 Backup Strategy

**Automated:**
- Cron job runs daily at 2 AM
- Keeps last 10 backups

**Manual:**
```bash
./backup.sh
```

**Restore:**
```bash
./restore.sh
# Select backup to restore
```

## 🛡️ Security Checklist

- [ ] Change default passwords
- [ ] Set strong NEXTAUTH_SECRET
- [ ] Setup SSL certificate
- [ ] Configure firewall
- [ ] Regular backups
- [ ] Update system packages
- [ ] Monitor logs

## 📞 Getting Help

1. Check logs: `docker-compose logs -f`
2. Run health check: `./health-check.sh`
3. Review documentation: `README.md`, `ARCHITECTURE.md`
4. Check GitHub issues

## 🔧 Advanced

### Custom port
Edit `docker-compose.yml`:
```yaml
ports:
  - "8080:3000"  # Use port 8080
```

### Enable debug logging
Edit `.env`:
```env
LOG_LEVEL=debug
```

### Database migration
```bash
npx prisma migrate dev
npx prisma migrate deploy
```

### Performance tuning
```bash
# Increase Node memory
NODE_OPTIONS="--max-old-space-size=4096"
```

---

**Version:** 1.0.0
**Last Updated:** 2026-01-08
