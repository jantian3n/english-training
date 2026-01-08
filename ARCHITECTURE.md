# English Training Project

## 📚 Overview

Full-stack English vocabulary learning app with AI-powered content generation and spaced repetition.

## 🎯 Key Features

1. **AI Content Generation** (DeepSeek API)
   - Automatic example sentences
   - Chinese translations
   - IPA pronunciation
   - Quiz distractors

2. **Spaced Repetition System (SM-2)**
   - Optimal review intervals
   - Adaptive difficulty
   - Daily review queue

3. **User Management**
   - Admin/User roles
   - Secure authentication
   - Password reset

4. **Modern UI (Material Design 3)**
   - Responsive design
   - Interactive learning cards
   - Progress tracking

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
                              │   (OpenAI)    │
                              └───────────────┘
```

## 🗂️ Database Schema

```
User (users)
├── id: String (PK)
├── email: String (Unique)
├── password: String (Hashed)
├── role: ADMIN | USER
└── Relations: accounts, sessions, learningRecords

Word (words)
├── id: String (PK)
├── word: String (Unique)
├── definition: String
├── definitionCn: String
├── pronunciation: String (IPA)
├── exampleSentence: String (AI-generated)
├── exampleCn: String (AI-generated)
├── difficulty: Int (1-5)
└── Relations: learningRecords, quizOptions

LearningRecord (learning_records)
├── id: String (PK)
├── userId: String (FK)
├── wordId: String (FK)
├── easeFactor: Float (SM-2)
├── interval: Int (Days)
├── repetitions: Int
├── nextReviewDate: DateTime
├── totalReviews: Int
├── correctCount: Int
├── incorrectCount: Int
└── lastQuality: Int (0-5)

QuizOption (quiz_options)
├── id: String (PK)
├── wordId: String (FK)
├── optionText: String (Distractor)
└── isCorrect: Boolean
```

## 🔄 Learning Flow

```
1. User Login
   └──► Dashboard (Shows stats, due words)

2. Start Learning (/learn)
   └──► Get Due Words (SM-2 algorithm)
        │
        ├─► No due words? → Fetch new words
        │
        └─► Due words exist
            │
            └──► Show Learning Card
                 │
                 ├─► Step 1: Display word + example
                 │           User selects definition (4 choices)
                 │
                 ├─► Step 2: Show correct definition
                 │           User types word spelling
                 │
                 └─► Step 3: Calculate quality rating (0-5)
                            Update SM-2 parameters
                            Schedule next review
                            │
                            └──► Next word or complete

3. Admin Panel (/admin)
   ├──► User Management
   │    ├── Create users
   │    ├── Delete users
   │    └── Reset passwords
   │
   └──► Word Management
        ├── Add word (triggers AI generation)
        └── Delete word
```

## 🧮 SM-2 Algorithm Logic

```javascript
// Quality Rating (0-5)
0 = Complete blackout
1 = Incorrect, answer familiar
2 = Incorrect, easy to recall
3 = Correct with serious difficulty
4 = Correct after hesitation
5 = Perfect response

// Calculation
if (quality < 3) {
  repetitions = 0
  interval = 1  // Review tomorrow
} else {
  if (repetitions === 0) interval = 1
  else if (repetitions === 1) interval = 6
  else interval = interval * easeFactor

  repetitions++
}

// Update Ease Factor
easeFactor = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
if (easeFactor < 1.3) easeFactor = 1.3

// Next Review Date
nextReview = today + interval days
```

## 🐳 Docker Configuration

### Dockerfile (Multi-stage)

```
Stage 1: deps     → Install dependencies
Stage 2: builder  → Build Next.js app
Stage 3: runner   → Production runtime
```

### Volume Mounting (Critical!)

```yaml
volumes:
  - ./data:/app/prisma/data  # SQLite persistence
```

**Why this matters:**
- Container filesystem is ephemeral
- Volume mounting persists data on host
- Survives container deletion/recreation
- Easy backup: just copy `./data/dev.db`

## 🔐 Security Checklist

- [x] Bcrypt password hashing (10 rounds)
- [x] JWT session tokens
- [x] CSRF protection (NextAuth.js)
- [x] Role-based access control
- [x] Non-root Docker user (UID 1001)
- [x] Environment variable secrets
- [x] SQL injection prevention (Prisma)
- [x] XSS protection (React escaping)

## 📊 Performance Optimizations

1. **Docker**: Multi-stage build (reduces image size)
2. **Next.js**: Standalone output mode
3. **Database**: Indexed queries (userId, nextReviewDate)
4. **Caching**: Prisma connection pooling
5. **API**: Server Actions (no separate API routes)

## 🛠️ Development Workflow

```bash
# Local development
npm install
npx prisma generate
npx prisma db push
npm run dev

# Production build
docker-compose build
docker-compose up -d

# View logs
docker-compose logs -f

# Database backup
./backup.sh

# Database restore
./restore.sh

# Deploy updates
./deploy.sh
```

## 📦 Deployment Checklist

- [ ] Set strong `NEXTAUTH_SECRET` (32+ chars)
- [ ] Add `DEEPSEEK_API_KEY`
- [ ] Change `ADMIN_PASSWORD`
- [ ] Update `NEXTAUTH_URL` to production domain
- [ ] Setup SSL/TLS certificate
- [ ] Configure firewall (allow port 3000 or 443)
- [ ] Setup automated backups (cron job)
- [ ] Enable health checks
- [ ] Configure logging

## 🔧 Troubleshooting

### Database Locked
```bash
docker-compose down
docker-compose up -d
```

### Container Won't Start
```bash
docker-compose logs
# Check environment variables
```

### AI API Failing
```bash
# Check API key
echo $DEEPSEEK_API_KEY
# Test API endpoint
curl -H "Authorization: Bearer $DEEPSEEK_API_KEY" \
  https://api.deepseek.com/v1/models
```

### Build Errors
```bash
# Clear cache
docker-compose build --no-cache
```

## 📈 Future Enhancements

- [ ] Import words from CSV/Excel
- [ ] Export learning progress
- [ ] Mobile app (React Native)
- [ ] Audio pronunciation (TTS)
- [ ] Social features (leaderboards)
- [ ] Multiple language support
- [ ] Advanced analytics dashboard
- [ ] Spaced repetition visualization

## 📝 API Endpoints

```
GET  /api/auth/[...nextauth]  # NextAuth.js handlers
GET  /api/health              # Health check

Server Actions:
POST addWord                  # Add word with AI generation
POST deleteWord              # Delete word
POST createUser              # Create user
POST deleteUser              # Delete user
POST resetPassword           # Reset user password
POST getDueWordsForUser      # Get review queue
POST submitWordReview        # Submit learning result
POST getUserStats            # Get user statistics
POST getQuizOptions          # Get quiz options
```

## 🧪 Testing

```bash
# Test database connection
npx prisma studio

# Test AI API
curl -X POST http://localhost:3000/api/test-ai

# Test authentication
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

## 📞 Support

For issues or questions:
1. Check logs: `docker-compose logs -f`
2. Review documentation
3. Check GitHub issues
4. Contact maintainer

---

**Built with:** Next.js 14, TypeScript, Prisma, MUI, Docker
**License:** MIT
**Version:** 1.0.0
