# 🎓 English Training - Complete Project

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-blue)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com/)
[![MUI](https://img.shields.io/badge/MUI-v6-007FFF)](https://mui.com/)

An AI-powered English vocabulary learning application with spaced repetition (SM-2 algorithm), built with Next.js 14, Material Design 3, and deployed via Docker.

---

## ✨ Features

🤖 **AI-Powered Content** - Automatic example sentence and translation generation using DeepSeek API
📚 **Spaced Repetition** - SuperMemo-2 (SM-2) algorithm for optimal learning intervals
👥 **User Management** - Role-based access control (Admin/User)
🎨 **Modern UI** - Material Design 3 with MUI v6
🔐 **Secure Auth** - NextAuth.js v5 with credentials provider
💾 **Data Persistence** - SQLite with Docker volume mounting
📦 **Easy Deployment** - One-command Docker deployment script
📊 **Progress Tracking** - Detailed learning statistics and analytics

---

## 🚀 Quick Start

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

### Docker Deployment

```bash
# 1. Configure environment
cp .env.production .env
nano .env  # Add your API keys and secrets

# 2. Deploy
chmod +x deploy.sh
./deploy.sh
```

📖 **Detailed guides:** [QUICKSTART_CN.md](QUICKSTART_CN.md) | [SETUP.md](SETUP.md)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│         Next.js 14 (App Router)         │
│  ┌────────────┐        ┌─────────────┐  │
│  │  Frontend  │◄──────►│   Server    │  │
│  │  (MUI MD3) │        │   Actions   │  │
│  └────────────┘        └──────┬──────┘  │
│                               │         │
│        ┌──────────────────────┼─────┐   │
│        │                      │     │   │
│   ┌────▼─────┐         ┌─────▼──┐  │   │
│   │ NextAuth │         │ Prisma │  │   │
│   │   (v5)   │         │  ORM   │  │   │
│   └──────────┘         └────┬───┘  │   │
│                             │      │   │
└─────────────────────────────┼──────┼───┘
                              │      │
                         ┌────▼──┐   │
                         │SQLite │   │
                         │ (DB)  │   │
                         └───────┘   │
                                     │
                              ┌──────▼────────┐
                              │  DeepSeek API │
                              └───────────────┘
```

📖 **Full architecture details:** [ARCHITECTURE.md](ARCHITECTURE.md)

---

## 📦 Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 14+ (App Router) |
| **Language** | TypeScript 5.7+ |
| **UI Library** | MUI v6 (Material Design 3) |
| **Database** | SQLite + Prisma ORM |
| **Authentication** | NextAuth.js v5 |
| **AI Integration** | OpenAI SDK (DeepSeek API) |
| **Deployment** | Docker + Docker Compose |
| **Styling** | Emotion (CSS-in-JS) |

---

## 🎯 Core Features

### For Users

- **Daily Review Queue** - Automatic scheduling based on SM-2 algorithm
- **Interactive Learning** - Three-step learning flow:
  1. See word + example → Choose correct definition (4 options)
  2. View definition → Type word spelling
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

## 🗂️ Project Structure

```
english-training/
├── app/                      # Next.js App Router
│   ├── actions.ts           # Server Actions
│   ├── login/               # Authentication
│   ├── learn/               # Learning interface
│   ├── dashboard/           # User stats
│   └── admin/               # Admin panel
├── components/              # React components
│   └── LearningCard.tsx    # MD3 learning UI
├── lib/                     # Core logic
│   ├── deepseek.ts         # AI integration
│   ├── sm2-algorithm.ts    # Spaced repetition
│   ├── prisma.ts           # Database client
│   └── theme.ts            # MUI theme
├── prisma/                  # Database
│   ├── schema.prisma       # Schema definition
│   └── seed.ts             # Initial data
├── Dockerfile               # Container build
├── docker-compose.yml       # Deployment config
├── deploy.sh               # Deployment script
└── backup.sh               # Backup script
```

---

## 🔐 Security

✅ Bcrypt password hashing (10 rounds)
✅ JWT session tokens
✅ CSRF protection
✅ Role-based access control
✅ Non-root Docker user
✅ Environment variable secrets
✅ SQL injection prevention (Prisma ORM)
✅ XSS protection (React auto-escaping)

---

## 🐳 Docker Configuration

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
Stage 1: deps    → Install dependencies only
Stage 2: builder → Build Next.js application
Stage 3: runner  → Minimal production runtime
```

**Benefits:** 70% smaller image size (~100MB vs ~500MB+)

---

## 📊 Learning Algorithm

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

## 📝 Documentation

| Document | Description |
|----------|-------------|
| [README.md](README.md) | This file - project overview |
| [QUICKSTART_CN.md](QUICKSTART_CN.md) | 中文快速开始指南 |
| [SETUP.md](SETUP.md) | Detailed setup instructions |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Technical architecture |
| [CHEATSHEET.md](CHEATSHEET.md) | Command reference |
| [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) | Complete project summary |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contribution guidelines |

---

## 🛠️ Useful Commands

### Development
```bash
npm run dev          # Start dev server
npx prisma studio    # Database GUI
npx prisma generate  # Generate Prisma client
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

## 🔄 Deployment Workflow

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

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**Areas for contribution:**
- CSV/Excel word import
- Mobile app (React Native)
- Audio pronunciation (TTS)
- Progress visualization charts
- Multiple language support
- Automated tests

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Next.js** - React framework
- **MUI** - Material Design components
- **Prisma** - Database ORM
- **NextAuth.js** - Authentication
- **DeepSeek** - AI API provider
- **SuperMemo** - SM-2 algorithm

---

## 📞 Support

- 📖 Check [Documentation](README.md)
- 🐛 [Report Issues](https://github.com/yourusername/english-training/issues)
- 💬 [Discussions](https://github.com/yourusername/english-training/discussions)

---

## 📈 Roadmap

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

**Built with ❤️ using Next.js and Claude Code**

**Version:** 1.0.0
**Status:** Production Ready
**Last Updated:** 2026-01-08
