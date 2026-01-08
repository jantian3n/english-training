# 📋 GitHub 仓库创建步骤

## 第一步: 创建 GitHub 仓库

1. 打开浏览器,访问: **https://github.com/new**

2. 填写仓库信息:
   ```
   Repository name: english-training
   Description: AI-powered English vocabulary learning app with spaced repetition
   Visibility: ✅ Public

   ⚠️ 重要: 不要勾选以下选项:
   ❌ Add a README file
   ❌ Add .gitignore
   ❌ Choose a license
   ```

3. 点击绿色按钮 **"Create repository"**

---

## 第二步: 推送代码

创建好仓库后,在项目文件夹中运行:

```bash
cd "c:\Users\lan\Desktop\english training"
git push -u origin main
```

**如果提示输入用户名和密码:**

⚠️ **注意**: GitHub 已不再支持密码认证,你需要使用 **Personal Access Token (PAT)**

### 生成 Personal Access Token:

1. 访问: https://github.com/settings/tokens
2. 点击 **"Generate new token"** → **"Generate new token (classic)"**
3. 填写信息:
   - Note: `English Training App`
   - Expiration: `90 days` 或 `No expiration`
   - Select scopes: ✅ **repo** (勾选所有 repo 权限)
4. 点击 **"Generate token"**
5. **立即复制 token** (格式: `ghp_xxxxxxxxxxxx`)

### 使用 Token 推送:

```bash
# 当提示输入密码时,粘贴你的 token (不是 GitHub 密码!)
git push -u origin main
```

**或者使用 GitHub CLI (推荐):**

```bash
# 安装 GitHub CLI
winget install GitHub.cli

# 登录
gh auth login

# 推送
git push -u origin main
```

---

## 第三步: 验证成功

推送成功后,访问:
**https://github.com/jantian3n/english-training**

你应该能看到所有文件和完整的 README!

---

## 🎉 完成后

### 更新 deploy.sh 中的仓库地址

编辑 `deploy.sh` 文件,找到:
```bash
REPO_URL="https://github.com/yourusername/english-training.git"
```

改为:
```bash
REPO_URL="https://github.com/jantian3n/english-training.git"
```

然后提交更新:
```bash
git add deploy.sh
git commit -m "Update repository URL in deploy.sh"
git push
```

### 添加仓库主题标签 (可选)

在 GitHub 仓库页面点击 "About" 旁边的 ⚙️ 图标,添加主题:
- `nextjs`
- `typescript`
- `material-ui`
- `docker`
- `spaced-repetition`
- `english-learning`
- `ai`
- `education`

---

## ❓ 遇到问题?

### 问题 1: 推送被拒绝 (remote: Repository not found)
**解决**: 确保你已在 GitHub 上创建了仓库

### 问题 2: 认证失败
**解决**: 使用 Personal Access Token 替代密码

### 问题 3: 推送超时
**解决**: 检查网络连接,或使用 GitHub Desktop

---

## 📞 需要帮助?

如果遇到任何问题,请告诉我具体的错误信息!
