# 🚀 快速开始指南 (中文版)

## 📋 前置要求

- Node.js 20+
- Docker & Docker Compose
- Git
- DeepSeek API Key ([获取地址](https://platform.deepseek.com/))

---

## 💻 本地开发

### 1️⃣ 安装依赖

```bash
npm install
```

### 2️⃣ 配置环境变量

复制示例文件并编辑:

```bash
cp .env.example .env
nano .env
```

**必须修改:**
```env
DEEPSEEK_API_KEY="sk-你的API密钥"
```

### 3️⃣ 初始化数据库

```bash
# 生成 Prisma Client
npx prisma generate

# 创建数据库表
npx prisma db push

# 填充示例数据
npx prisma db seed
```

### 4️⃣ 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

**默认账号:**
- 管理员: `admin@example.com` / `admin123`
- 普通用户: `user@example.com` / `user123`

---

## 🐳 Docker 部署 (VPS)

### 1️⃣ 首次 VPS 设置

```bash
# 在 VPS 上运行初始化脚本
sudo ./init-vps.sh
```

这会安装:
- Docker & Docker Compose
- Git 和其他工具
- 配置防火墙
- 设置自动备份

### 2️⃣ 克隆项目

```bash
cd /opt/english-training
git clone <你的仓库地址> .
```

### 3️⃣ 配置生产环境

```bash
# 复制生产环境模板
cp .env.production .env

# 编辑配置
nano .env
```

**必须修改的配置:**

```env
# 生成安全密钥 (运行: openssl rand -base64 32)
NEXTAUTH_SECRET="你的32位安全密钥"

# DeepSeek API
DEEPSEEK_API_KEY="sk-你的API密钥"

# 生产域名
NEXTAUTH_URL="https://你的域名.com"

# 修改管理员密码
ADMIN_PASSWORD="强密码"
```

### 4️⃣ 一键部署

```bash
# 确保脚本可执行
chmod +x deploy.sh

# 运行部署
./deploy.sh
```

部署脚本会自动:
1. 拉取最新代码
2. 构建 Docker 镜像
3. 启动容器
4. 运行健康检查

### 5️⃣ 验证部署

```bash
# 查看容器状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 运行健康检查
./health-check.sh
```

访问你的域名或 `http://VPS_IP:3000`

---

## 🔄 日常维护

### 更新代码

```bash
# 拉取最新代码并重新部署
./deploy.sh
```

### 数据库备份

```bash
# 手动备份
./backup.sh

# 自动备份已配置 (每天凌晨2点)
# 备份保存在 ./backups/ 目录
```

### 恢复数据库

```bash
./restore.sh
# 选择要恢复的备份文件
```

### 查看日志

```bash
# 实时查看应用日志
docker-compose logs -f

# 查看最近100行
docker-compose logs --tail=100
```

### 重启服务

```bash
# 重启所有容器
docker-compose restart

# 重启特定容器
docker-compose restart web
```

---

## 📊 功能使用

### 管理员功能

1. **用户管理** (`/admin/users`)
   - 创建/删除用户
   - 重置密码
   - 分配角色 (ADMIN/USER)

2. **单词管理** (`/admin/words`)
   - 添加单词 (AI 自动生成例句和翻译)
   - 删除单词
   - 查看单词列表

### 用户功能

1. **学习界面** (`/learn`)
   - 查看每日复习队列
   - 三步学习流程:
     1. 看单词和例句,选择正确释义 (四选一)
     2. 拼写单词
     3. 查看结果反馈

2. **数据统计** (`/dashboard`)
   - 学习总词数
   - 今日待复习数
   - 正确率统计
   - 学习进度

---

## 🔧 常见问题

### 容器启动失败

```bash
# 查看错误日志
docker-compose logs

# 检查环境变量
cat .env

# 重新构建
docker-compose build --no-cache
docker-compose up -d
```

### 数据库锁定错误

```bash
# 重启容器
docker-compose down
docker-compose up -d
```

### 端口冲突 (3000 已被占用)

编辑 `docker-compose.yml`:

```yaml
ports:
  - "8080:3000"  # 使用 8080 端口
```

### AI API 调用失败

```bash
# 检查 API 密钥
echo $DEEPSEEK_API_KEY

# 测试 API 连接
curl -H "Authorization: Bearer $DEEPSEEK_API_KEY" \
  https://api.deepseek.com/v1/models
```

---

## 🔐 安全建议

### 生产环境检查清单

- [ ] 修改默认管理员密码
- [ ] 生成强 NEXTAUTH_SECRET (32+ 字符)
- [ ] 配置 HTTPS (SSL 证书)
- [ ] 配置防火墙规则
- [ ] 定期备份数据库
- [ ] 更新系统包
- [ ] 监控日志文件

### 生成安全密钥

```bash
# NEXTAUTH_SECRET
openssl rand -base64 32

# 管理员密码 (强密码生成)
openssl rand -base64 16
```

---

## 📁 重要文件位置

| 文件/目录 | 说明 |
|----------|------|
| `./data/dev.db` | SQLite 数据库 (重要!) |
| `./backups/` | 数据库备份 |
| `./logs/` | 应用日志 |
| `.env` | 环境变量配置 |
| `docker-compose.yml` | Docker 配置 |

---

## 🆘 获取帮助

1. 查看完整文档:
   - [README.md](README.md) - 主文档
   - [ARCHITECTURE.md](ARCHITECTURE.md) - 技术架构
   - [CHEATSHEET.md](CHEATSHEET.md) - 命令速查

2. 运行健康检查:
   ```bash
   ./health-check.sh
   ```

3. 查看日志:
   ```bash
   docker-compose logs -f
   ```

---

## 🎉 完成!

现在你可以:
- 访问应用并登录
- 添加单词 (管理员)
- 开始学习 (用户)
- 查看学习进度

**祝学习愉快! 🎓**

---

## 📞 技术支持

遇到问题?
1. 查看文档
2. 检查日志
3. 提交 GitHub Issue
