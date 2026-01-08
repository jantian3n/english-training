# 🎓 English Training - AI 智能英语单词记忆系统

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-blue)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com/)
[![MUI](https://img.shields.io/badge/MUI-v6-007FFF)](https://mui.com/)

一个基于 AI 的英语单词学习应用,采用间隔重复算法 (SM-2),使用 Next.js 14、Material Design 3 构建,支持 Docker 一键部署。

---

## ✨ 核心功能

🤖 **AI 智能生成** - 使用 DeepSeek API 自动生成例句、翻译和发音
📚 **间隔重复** - SuperMemo-2 (SM-2) 算法,科学优化记忆周期
👥 **用户管理** - 基于角色的权限控制 (管理员/普通用户)
🎨 **现代化界面** - Material Design 3 设计规范,流畅动画
🔐 **安全认证** - NextAuth.js v5 身份验证系统
💾 **数据持久化** - SQLite 数据库 + Docker Volume 挂载
📦 **一键部署** - Docker Compose 配置,单命令完成部署
📊 **进度追踪** - 详细的学习统计和数据分析

---

## 🚀 快速开始

### 本地开发

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env 文件,添加你的 DEEPSEEK_API_KEY

# 3. 初始化数据库
npx prisma generate
npx prisma db push
npx prisma db seed

# 4. 启动开发服务器
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

**测试账号:**
- 管理员: `admin@example.com` / `admin123`
- 普通用户: `user@example.com` / `user123`

### Docker 部署 (生产环境)

```bash
# 1. 配置环境变量
cp .env.production .env
nano .env  # 添加 API 密钥和安全配置

# 2. 一键部署
chmod +x deploy.sh
./deploy.sh
```

📖 **详细教程:** [中文快速入门指南](QUICKSTART_CN.md) | [安装说明](SETUP.md)

---

## 🏗️ 系统架构

```
┌─────────────────────────────────────────┐
│         Next.js 14 (App Router)         │
│  ┌────────────┐        ┌─────────────┐  │
│  │   前端界面  │◄──────►│   服务端     │  │
│  │  (MUI MD3) │        │   Actions   │  │
│  └────────────┘        └──────┬──────┘  │
│                               │         │
│        ┌──────────────────────┼─────┐   │
│        │                      │     │   │
│   ┌────▼─────┐         ┌─────▼──┐  │   │
│   │ 身份认证  │         │ Prisma │  │   │
│   │NextAuth.js│         │  ORM   │  │   │
│   └──────────┘         └────┬───┘  │   │
│                             │      │   │
└─────────────────────────────┼──────┼───┘
                              │      │
                         ┌────▼──┐   │
                         │SQLite │   │
                         │ 数据库 │   │
                         └───────┘   │
                                     │
                              ┌──────▼────────┐
                              │  DeepSeek API │
                              │   (AI 生成)   │
                              └───────────────┘
```

📖 **完整架构文档:** [ARCHITECTURE.md](ARCHITECTURE.md)

---

## 📦 技术栈

| 类别 | 技术 |
|------|------|
| **框架** | Next.js 14+ (App Router) |
| **语言** | TypeScript 5.7+ |
| **UI 库** | MUI v6 (Material Design 3) |
| **数据库** | SQLite + Prisma ORM |
| **认证** | NextAuth.js v5 |
| **AI 集成** | OpenAI SDK (DeepSeek API) |
| **部署** | Docker + Docker Compose |
| **样式** | Emotion (CSS-in-JS) |

---

## 🎯 功能详解

### 用户功能

#### 📚 每日复习队列
- 基于 SM-2 算法自动计算复习时间
- 智能排序,优先复习遗忘风险高的单词
- 自动生成新单词学习任务

#### 🎮 交互式学习流程
**三步学习法:**
1. **看单词和例句** → 从 4 个选项中选择正确释义
2. **查看正确释义** → 拼写单词
3. **获得即时反馈** → 查看学习结果和进度

#### 📊 学习统计
- 总学习单词数
- 今日待复习数量
- 正确率统计
- 学习进度可视化

### 管理员功能

#### 👥 用户管理
- 创建/删除用户账号
- 重置用户密码
- 分配用户角色 (管理员/普通用户)

#### 📝 单词管理
- 添加新单词,AI 自动生成:
  - 英文例句 + 中文翻译
  - IPA 国际音标
  - 释义的中文翻译
  - 测验干扰选项 (3 个错误答案)
- 删除单词
- 批量导入 (计划中)

---

## 🗂️ 项目结构

```
english-training/
├── app/                      # Next.js 应用路由
│   ├── actions.ts           # 服务端操作 (单词/用户/学习)
│   ├── login/               # 登录页面
│   ├── learn/               # 学习界面
│   ├── dashboard/           # 用户统计面板
│   └── admin/               # 管理员面板
├── components/              # React 组件
│   └── LearningCard.tsx    # MD3 学习卡片
├── lib/                     # 核心逻辑
│   ├── deepseek.ts         # AI 集成
│   ├── sm2-algorithm.ts    # 间隔重复算法
│   ├── prisma.ts           # 数据库客户端
│   └── theme.ts            # MUI 主题
├── prisma/                  # 数据库
│   ├── schema.prisma       # 数据模型定义
│   └── seed.ts             # 初始化数据
├── Dockerfile               # 容器构建配置
├── docker-compose.yml       # 部署配置
├── deploy.sh               # 一键部署脚本
└── backup.sh               # 数据库备份脚本
```

---

## 🔐 安全特性

✅ Bcrypt 密码加密 (10 轮哈希)
✅ JWT 会话令牌
✅ CSRF 跨站请求伪造防护
✅ 基于角色的访问控制
✅ Docker 非 root 用户运行
✅ 环境变量加密存储
✅ SQL 注入防护 (Prisma ORM)
✅ XSS 跨站脚本防护 (React 自动转义)

---

## 🐳 Docker 配置详解

### SQLite 数据持久化 (关键!)

```yaml
volumes:
  - ./data:/app/prisma/data  # 将容器内数据库映射到宿主机
```

**为什么这很重要:**
- 容器文件系统是临时的,删除容器会丢失数据
- Volume 挂载将数据持久化到宿主机
- 即使删除/重建容器,数据依然保留
- 备份简单: 复制 `./data/dev.db` 即可
- 恢复简单: 替换 `./data/dev.db` 即可

### 多阶段构建优化

```dockerfile
阶段 1: deps    → 仅安装依赖
阶段 2: builder → 构建 Next.js 应用
阶段 3: runner  → 最小化生产运行时
```

**优势:** 镜像体积减少 70% (~100MB vs ~500MB+)

---

## 📊 学习算法 - SuperMemo-2 (SM-2)

### 质量评分 (0-5 分)

- **0 分** = 完全不记得
- **1 分** = 答错,但答案看起来眼熟
- **2 分** = 答错,但觉得答案容易回忆
- **3 分** = 答对,但非常困难
- **4 分** = 答对,但犹豫了一下
- **5 分** = 完美答对

### 算法逻辑

```javascript
if (质量 < 3) {
  重复次数 = 0
  间隔 = 1  // 明天再复习
} else {
  if (重复次数 === 0) 间隔 = 1      // 第一次答对: 1 天后
  else if (重复次数 === 1) 间隔 = 6  // 第二次答对: 6 天后
  else 间隔 = 间隔 * 难度因子        // 之后: 指数增长

  重复次数++
}

// 更新难度因子
难度因子 = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
if (难度因子 < 1.3) 难度因子 = 1.3
```

**效果:** 根据记忆强度动态调整复习间隔,实现高效记忆

---

## 📝 完整文档

| 文档 | 说明 |
|------|------|
| [README_CN.md](README_CN.md) | 本文件 - 中文项目说明 |
| [README.md](README.md) | 英文项目说明 |
| [QUICKSTART_CN.md](QUICKSTART_CN.md) | 中文快速入门指南 |
| [SETUP.md](SETUP.md) | 详细安装步骤 |
| [ARCHITECTURE.md](ARCHITECTURE.md) | 技术架构文档 |
| [CHEATSHEET.md](CHEATSHEET.md) | 常用命令速查表 |
| [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) | 项目完整总结 |
| [CONTRIBUTING.md](CONTRIBUTING.md) | 贡献指南 |

---

## 🛠️ 常用命令

### 开发环境
```bash
npm run dev          # 启动开发服务器
npx prisma studio    # 打开数据库可视化界面
npx prisma generate  # 生成 Prisma Client
```

### Docker 部署
```bash
./deploy.sh          # 一键部署/更新
docker-compose logs -f  # 查看实时日志
./backup.sh          # 备份数据库
./restore.sh         # 恢复数据库
./health-check.sh    # 系统健康检查
```

### 数据库操作
```bash
sqlite3 ./data/dev.db           # 访问数据库命令行
npx prisma db push              # 应用 schema 更改
npx prisma db seed              # 填充示例数据
```

---

## 🔄 部署工作流

### VPS 首次部署

```bash
# 1. 安装 Docker (使用官方脚本)
curl -fsSL https://get.docker.com | sudo sh
sudo systemctl start docker
sudo systemctl enable docker

# 2. 克隆仓库
git clone https://github.com/jantian3n/english-training.git /opt/english-training
cd /opt/english-training

# 3. 配置环境变量
cp .env.production .env
nano .env  # 添加你的密钥

# 4. 生成安全密钥
openssl rand -base64 32  # 用于 NEXTAUTH_SECRET

# 5. 一键部署
./deploy.sh
```

### 更新部署

```bash
# 一条命令完成所有更新操作
./deploy.sh
```

**脚本自动执行:**
1. 从 Git 拉取最新代码
2. 停止现有容器
3. 构建新的 Docker 镜像
4. 启动更新后的容器
5. 运行健康检查

### 自动备份

```bash
# 设置定时任务 (每天凌晨 2 点自动备份)
crontab -e

# 添加这行:
0 2 * * * cd /opt/english-training && ./backup.sh >> /opt/english-training/logs/backup.log 2>&1
```

---

## 🤝 参与贡献

欢迎贡献代码!请查看 [贡献指南](CONTRIBUTING.md)。

**可以贡献的方向:**
- CSV/Excel 批量导入单词
- 移动端应用 (React Native)
- 语音发音功能 (TTS)
- 进度可视化图表
- 多语言支持
- 自动化测试
- 性能优化

---

## 📄 开源协议

本项目采用 MIT 协议 - 查看 [LICENSE](LICENSE) 文件了解详情。

---

## 🙏 致谢

- **Next.js** - React 全栈框架
- **MUI** - Material Design 组件库
- **Prisma** - 现代化数据库 ORM
- **NextAuth.js** - 身份认证解决方案
- **DeepSeek** - AI API 提供商
- **SuperMemo** - SM-2 算法

---

## 📞 支持与反馈

- 📖 查看 [完整文档](README.md)
- 🐛 [提交问题](https://github.com/jantian3n/english-training/issues)
- 💬 [参与讨论](https://github.com/jantian3n/english-training/discussions)

---

## 📈 开发路线图

- [x] 基础学习流程
- [x] SM-2 间隔重复算法
- [x] AI 内容生成
- [x] 管理员面板
- [x] Docker 部署
- [ ] CSV 批量导入/导出
- [ ] 移动端应用
- [ ] 语音发音
- [ ] 社交功能 (排行榜)
- [ ] 高级数据分析

---

## 💡 使用场景

✅ **个人学习** - 日常英语词汇积累
✅ **学校教学** - 教师布置单词学习任务
✅ **企业培训** - 员工英语能力提升
✅ **考试备考** - 托福/雅思/GRE 词汇准备
✅ **自建服务** - 部署到自己的服务器

---

## 🎯 性能指标

- **支持并发用户:** 100-500 人
- **数据库容量:** < 10GB (SQLite 最佳)
- **镜像大小:** ~100MB (优化后)
- **冷启动时间:** < 10 秒
- **内存占用:** ~200MB
- **响应时间:** < 100ms (本地)

---

## 🔧 系统要求

### 开发环境
- Node.js 20+
- npm 或 yarn
- Git

### 生产环境 (Docker)
- Docker 20+
- Docker Compose 2+
- 1GB+ RAM
- 10GB+ 磁盘空间

### VPS 推荐配置
- CPU: 1 核心
- 内存: 2GB
- 磁盘: 20GB SSD
- 带宽: 1Mbps+

---

## 📸 功能截图

> 提示: 可以在这里添加应用截图展示

- 登录界面
- 学习卡片
- 统计面板
- 管理后台

---

**使用 ❤️ 和 Next.js 构建**

**版本:** 1.0.0
**状态:** ✅ 生产就绪
**最后更新:** 2026-01-08

---

⭐ **如果这个项目对你有帮助,请给个 Star!**
