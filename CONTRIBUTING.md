# Contributing to English Training

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/yourusername/english-training.git
   cd english-training
   ```
3. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📝 Development Setup

```bash
# Install dependencies
npm install

# Setup database
npx prisma generate
npx prisma db push
npx prisma db seed

# Run development server
npm run dev
```

## 🔧 Making Changes

### Code Style

- Use TypeScript for all new code
- Follow existing code structure
- Use meaningful variable/function names
- Add comments for complex logic
- Follow Material Design 3 guidelines for UI

### Commit Messages

Use clear, descriptive commit messages:

```
feat: Add word import from CSV
fix: Correct SM-2 calculation for quality < 3
docs: Update deployment instructions
style: Format code with prettier
refactor: Extract quiz logic to separate hook
test: Add tests for SM-2 algorithm
```

### Testing

Before submitting a PR:

```bash
# Test local build
npm run build
npm run start

# Test Docker build
docker-compose build
docker-compose up

# Run health check
./health-check.sh
```

## 📬 Submitting Changes

1. Push your changes:
   ```bash
   git push origin feature/your-feature-name
   ```

2. Create a Pull Request with:
   - Clear description of changes
   - Screenshots (for UI changes)
   - Test results
   - Breaking changes (if any)

## 🐛 Reporting Bugs

Include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment (OS, Node version, Docker version)
- Screenshots/logs

## 💡 Feature Requests

- Describe the feature
- Explain use case
- Provide examples
- Consider implementation approach

## 📋 Code Review Process

1. All PRs require review
2. Address feedback
3. Squash commits if needed
4. Merge after approval

## 🎯 Areas for Contribution

- [ ] CSV/Excel word import
- [ ] Mobile responsive improvements
- [ ] Audio pronunciation (TTS)
- [ ] Progress charts/analytics
- [ ] Multiple language support
- [ ] Automated tests
- [ ] Performance optimizations
- [ ] Documentation improvements

## 📞 Questions?

Open an issue for discussion!

Thank you for contributing! 🙏
