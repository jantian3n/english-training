# 馃帗 English Training - Complete Project

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-blue)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com/)
[![MUI](https://img.shields.io/badge/MUI-v6-007FFF)](https://mui.com/)

> **[涓枃鏂囨。](README_CN.md)** | **English Documentation**

An AI-powered English vocabulary learning application with spaced repetition (SM-2 algorithm), built with Next.js 14, Material Design 3, and deployed via Docker or direct VPS.

---

## 鉁?Features

馃 **AI-Powered Content** - Automatic example sentence and translation generation using DeepSeek API
馃摎 **Spaced Repetition** - SuperMemo-2 (SM-2) algorithm for optimal learning intervals
馃懃 **User Management** - Role-based access control (Admin/User)
馃帹 **Modern UI** - Material Design 3 with MUI v6
馃攼 **Secure Auth** - NextAuth.js v5 with credentials provider
馃捑 **Data Persistence** - SQLite with file-based persistence
馃摝 **Easy Deployment** - One-command VPS deployment scripts
馃搳 **Progress Tracking** - Detailed learning statistics and analytics

---

## 馃殌 Quick Start

### Local Development

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env and add your DEEPSEEK_API_KEY

# 3. Initialize database
npx prisma generate
npx prisma db push
npx prisma db seed

# 4. Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

**Default credentials:**
- Admin: `admin@example.com` / `admin123`
- User: `user@example.com` / `user123`

### VPS Direct Deployment (No Docker)

```bash
# 1. Clone repository
git clone <your-repo> /opt/english-training
cd /opt/english-training

# 2. Install server dependencies (first time)
sudo bash setup-vps-direct.sh

# 3. Configure environment
cp .env.vps.example .env
nano .env

# 4. Deploy
chmod +x deploy-vps.sh
./deploy-vps.sh
```

This uses a systemd service named `english-training`. For logs run:
`sudo journalctl -u english-training -f`. For HTTPS, see `nginx.conf`.

### Direct VPS
```bash
./deploy-vps.sh          # Deploy/update
sudo journalctl -u english-training -f  # View logs
./health-check-vps.sh    # Health check
./backup.sh              # Backup database
./restore-vps.sh         # Restore database
```
### Docker Deployment

```bash
# 1. Configure environment
cp .env.production .env
nano .env  # Add your API keys and secrets

# 2. Deploy
chmod +x deploy.sh
./deploy.sh
```

馃摉 **Detailed guides:** [QUICKSTART_CN.md](QUICKSTART_CN.md) | [SETUP.md](SETUP.md)

---

## 馃彈锔?Architecture

```
鈹屸攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹?鈹?        Next.js 14 (App Router)         鈹?鈹? 鈹屸攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹?       鈹屸攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹? 鈹?鈹? 鈹? Frontend  鈹傗梽鈹€鈹€鈹€鈹€鈹€鈹€鈻衡攤   Server    鈹? 鈹?鈹? 鈹? (MUI MD3) 鈹?       鈹?  Actions   鈹? 鈹?鈹? 鈹斺攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹?       鈹斺攢鈹€鈹€鈹€鈹€鈹€鈹攢鈹€鈹€鈹€鈹€鈹€鈹? 鈹?鈹?                              鈹?        鈹?鈹?       鈹屸攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹尖攢鈹€鈹€鈹€鈹€鈹?  鈹?鈹?       鈹?                     鈹?    鈹?  鈹?鈹?  鈹屸攢鈹€鈹€鈹€鈻尖攢鈹€鈹€鈹€鈹€鈹?        鈹屸攢鈹€鈹€鈹€鈹€鈻尖攢鈹€鈹? 鈹?  鈹?鈹?  鈹?NextAuth 鈹?        鈹?Prisma 鈹? 鈹?  鈹?鈹?  鈹?  (v5)   鈹?        鈹? ORM   鈹? 鈹?  鈹?鈹?  鈹斺攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹?        鈹斺攢鈹€鈹€鈹€鈹攢鈹€鈹€鈹? 鈹?  鈹?鈹?                            鈹?     鈹?  鈹?鈹斺攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹尖攢鈹€鈹€鈹€鈹€鈹€鈹尖攢鈹€鈹€鈹?                              鈹?     鈹?                         鈹屸攢鈹€鈹€鈹€鈻尖攢鈹€鈹?  鈹?                         鈹係QLite 鈹?  鈹?                         鈹?(DB)  鈹?  鈹?                         鈹斺攢鈹€鈹€鈹€鈹€鈹€鈹€鈹?  鈹?                                     鈹?                              鈹屸攢鈹€鈹€鈹€鈹€鈹€鈻尖攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹?                              鈹? DeepSeek API 鈹?                              鈹斺攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹?```

馃摉 **Full architecture details:** [ARCHITECTURE.md](ARCHITECTURE.md)

---

## 馃摝 Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 14+ (App Router) |
| **Language** | TypeScript 5.7+ |
| **UI Library** | MUI v6 (Material Design 3) |
| **Database** | SQLite + Prisma ORM |
| **Authentication** | NextAuth.js v5 |
| **AI Integration** | OpenAI SDK (DeepSeek API) |
| **Deployment** | Direct VPS (systemd) or Docker |
| **Styling** | Emotion (CSS-in-JS) |

---

## 馃幆 Core Features

### For Users

- **Daily Review Queue** - Automatic scheduling based on SM-2 algorithm
- **Interactive Learning** - Three-step learning flow:
  1. See word + example 鈫?Choose correct definition (4 options)
  2. View definition 鈫?Type word spelling
  3. Get instant feedback with performance tracking
- **Progress Dashboard** - Track learning statistics and accuracy
- **Spaced Repetition** - Optimal review intervals for long-term retention

### For Admins

- **User Management** - Create, delete users, reset passwords
- **Word Management** - Add words with AI-generated content:
  - Example sentences (English + Chinese)
  - IPA pronunciation
  - Quiz distractor options
- **Bulk Operations** - Import/export (planned)

---

## 馃梻锔?Project Structure

```
english-training/
鈹溾攢鈹€ app/                      # Next.js App Router
鈹?  鈹溾攢鈹€ actions.ts           # Server Actions
鈹?  鈹溾攢鈹€ login/               # Authentication
鈹?  鈹溾攢鈹€ learn/               # Learning interface
鈹?  鈹溾攢鈹€ dashboard/           # User stats
鈹?  鈹斺攢鈹€ admin/               # Admin panel
鈹溾攢鈹€ components/              # React components
鈹?  鈹斺攢鈹€ LearningCard.tsx    # MD3 learning UI
鈹溾攢鈹€ lib/                     # Core logic
鈹?  鈹溾攢鈹€ deepseek.ts         # AI integration
鈹?  鈹溾攢鈹€ sm2-algorithm.ts    # Spaced repetition
鈹?  鈹溾攢鈹€ prisma.ts           # Database client
鈹?  鈹斺攢鈹€ theme.ts            # MUI theme
鈹溾攢鈹€ prisma/                  # Database
鈹?  鈹溾攢鈹€ schema.prisma       # Schema definition
鈹?  鈹斺攢鈹€ seed.ts             # Initial data
鈹溾攢鈹€ Dockerfile               # Container build
鈹溾攢鈹€ docker-compose.yml       # Deployment config
鈹溾攢鈹€ deploy.sh               # Deployment script
鈹斺攢鈹€ backup.sh               # Backup script
```

---

## 馃攼 Security

鉁?Bcrypt password hashing (10 rounds)
鉁?JWT session tokens
鉁?CSRF protection
鉁?Role-based access control
鉁?Non-root Docker user
鉁?Environment variable secrets
鉁?SQL injection prevention (Prisma ORM)
鉁?XSS protection (React auto-escaping)

---

## 馃惓 Docker Configuration

### SQLite Data Persistence (Critical!)

```yaml
volumes:
  - ./data:/app/prisma/data  # Maps container DB to host
```

**Why this matters:**
- Container filesystem is ephemeral
- Volume mounting persists data on host
- Data survives container deletion/recreation
- Easy backup: copy `./data/dev.db`
- Easy restore: replace `./data/dev.db`

### Multi-stage Build

```dockerfile
Stage 1: deps    鈫?Install dependencies only
Stage 2: builder 鈫?Build Next.js application
Stage 3: runner  鈫?Minimal production runtime
```

**Benefits:** 70% smaller image size (~100MB vs ~500MB+)

---

## 馃搳 Learning Algorithm

### SuperMemo-2 (SM-2)

**Quality Ratings (0-5):**
- 0 = Complete blackout
- 1 = Incorrect, answer seemed familiar
- 2 = Incorrect, answer seemed easy to recall
- 3 = Correct with serious difficulty
- 4 = Correct after hesitation
- 5 = Perfect response

**Calculation Logic:**
```javascript
if (quality < 3) {
  repetitions = 0
  interval = 1  // Review tomorrow
} else {
  if (repetitions === 0) interval = 1
  else if (repetitions === 1) interval = 6
  else interval = interval * easeFactor

  repetitions++
}

easeFactor = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
if (easeFactor < 1.3) easeFactor = 1.3
```

---

## 馃摑 Documentation

| Document | Description |
|----------|-------------|
| [README.md](README.md) | This file - project overview |
| [QUICKSTART_CN.md](QUICKSTART_CN.md) | 涓枃蹇€熷紑濮嬫寚鍗?|
| [SETUP.md](SETUP.md) | Detailed setup instructions |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Technical architecture |
| [CHEATSHEET.md](CHEATSHEET.md) | Command reference |
| [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) | Complete project summary |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contribution guidelines |

---

## 馃洜锔?Useful Commands

### Development
```bash
npm run dev          # Start dev server
npx prisma studio    # Database GUI
npx prisma generate  # Generate Prisma client
```

### Direct VPS
```bash
./deploy-vps.sh          # Deploy/update
sudo journalctl -u english-training -f  # View logs
./health-check-vps.sh    # Health check
./backup.sh              # Backup database
./restore-vps.sh         # Restore database
```
### Docker
```bash
./deploy.sh          # Deploy/update
docker-compose logs -f  # View logs
./backup.sh          # Backup database
./restore.sh         # Restore database
./health-check.sh    # System health check
```

### Database
```bash
sqlite3 ./data/dev.db           # Access DB CLI
npx prisma db push              # Apply schema changes
npx prisma db seed              # Seed data
```

---

## 馃攧 Deployment Workflow

### VPS Direct Deployment

```bash
# 1. Install server dependencies (first time)
sudo bash setup-vps-direct.sh

# 2. Deploy/update
./deploy-vps.sh
```

### VPS First-Time Setup

```bash
# 1. Initialize VPS
sudo ./init-vps.sh

# 2. Clone repository
git clone <your-repo> /opt/english-training
cd /opt/english-training

# 3. Configure environment
cp .env.production .env
nano .env  # Add your secrets

# 4. Deploy
./deploy.sh
```

### Update Deployment

```bash
# One command to update everything
./deploy.sh
```

The script automatically:
1. Pulls latest code from Git
2. Stops existing containers
3. Builds new Docker images
4. Starts updated containers
5. Runs health checks

---

## 馃 Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**Areas for contribution:**
- CSV/Excel word import
- Mobile app (React Native)
- Audio pronunciation (TTS)
- Progress visualization charts
- Multiple language support
- Automated tests

---

## 馃搫 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## 馃檹 Acknowledgments

- **Next.js** - React framework
- **MUI** - Material Design components
- **Prisma** - Database ORM
- **NextAuth.js** - Authentication
- **DeepSeek** - AI API provider
- **SuperMemo** - SM-2 algorithm

---

## 馃摓 Support

- 馃摉 Check [Documentation](README.md)
- 馃悰 [Report Issues](https://github.com/yourusername/english-training/issues)
- 馃挰 [Discussions](https://github.com/yourusername/english-training/discussions)

---

## 馃搱 Roadmap

- [x] Basic learning flow
- [x] SM-2 algorithm
- [x] AI content generation
- [x] Admin panel
- [x] Docker deployment
- [ ] CSV import/export
- [ ] Mobile app
- [ ] Audio pronunciation
- [ ] Social features
- [ ] Analytics dashboard

---

**Built with 鉂わ笍 using Next.js and Claude Code**

**Version:** 1.0.0
**Status:** Production Ready
**Last Updated:** 2026-01-08











