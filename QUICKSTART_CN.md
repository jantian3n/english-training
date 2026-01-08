# 馃殌 蹇€熷紑濮嬫寚鍗?(涓枃鐗?

## 馃搵 鍓嶇疆瑕佹眰

- Node.js 20+
- Git
- DeepSeek API Key ([鑾峰彇鍦板潃](https://platform.deepseek.com/))

---

## 馃捇 鏈湴寮€鍙?
### 1锔忊儯 瀹夎渚濊禆

```bash
npm install
```

### 2锔忊儯 閰嶇疆鐜鍙橀噺

澶嶅埗绀轰緥鏂囦欢骞剁紪杈?

```bash
cp .env.example .env
nano .env
```

**蹇呴』淇敼:**
```env
DEEPSEEK_API_KEY="sk-浣犵殑API瀵嗛挜"
```

### 3锔忊儯 鍒濆鍖栨暟鎹簱

```bash
# 鐢熸垚 Prisma Client
npx prisma generate

# 鍒涘缓鏁版嵁搴撹〃
npx prisma db push

# 濉厖绀轰緥鏁版嵁
npx prisma db seed
```

### 4锔忊儯 鍚姩寮€鍙戞湇鍔″櫒

```bash
npm run dev
```

璁块棶 [http://localhost:3000](http://localhost:3000)

**榛樿璐﹀彿:**
- 绠＄悊鍛? `admin@example.com` / `admin123`
- 鏅€氱敤鎴? `user@example.com` / `user123`

---

## VPS 直接部署 (无 Docker)

### 1. 克隆项目

```bash
git clone https://github.com/jantian3n/english-training.git /opt/english-training
cd /opt/english-training
```

### 2. 首次 VPS 设置

```bash
# 安装系统依赖
sudo bash setup-vps-direct.sh
```

### 3. 配置生产环境

```bash
cp .env.vps.example .env
nano .env
```

### 4. 一键部署

```bash
chmod +x deploy-vps.sh
./deploy-vps.sh
```

使用 systemd 服务名 `english-training`，查看日志:
`sudo journalctl -u english-training -f`。

## 馃惓 Docker 閮ㄧ讲 (VPS)

### 1锔忊儯 棣栨 VPS 璁剧疆

**鏂规硶 A: 浣跨敤涓€閿剼鏈?(鎺ㄨ崘)**

```bash
# 涓嬭浇骞惰繍琛岃缃剼鏈?curl -fsSL https://raw.githubusercontent.com/jantian3n/english-training/main/setup-vps.sh -o setup-vps.sh
sudo bash setup-vps.sh
```

**鏂规硶 B: 鎵嬪姩瀹夎 Docker**

```bash
# 浣跨敤 Docker 瀹樻柟瀹夎鑴氭湰
curl -fsSL https://get.docker.com | sudo sh

# 鍚姩 Docker
sudo systemctl start docker
sudo systemctl enable docker

# 瀹夎鍏朵粬宸ュ叿
sudo apt-get install -y git curl wget nano sqlite3 openssl
```

### 2锔忊儯 鍏嬮殕椤圭洰

```bash
cd ~
git clone https://github.com/jantian3n/english-training.git
cd english-training
```

### 3锔忊儯 閰嶇疆鐢熶骇鐜

```bash
# 澶嶅埗鐢熶骇鐜妯℃澘
cp .env.production .env

# 缂栬緫閰嶇疆
nano .env
```

**蹇呴』淇敼鐨勯厤缃?**

```env
# 鐢熸垚瀹夊叏瀵嗛挜 (杩愯: openssl rand -base64 32)
NEXTAUTH_SECRET="浣犵殑32浣嶅畨鍏ㄥ瘑閽?

# DeepSeek API
DEEPSEEK_API_KEY="sk-浣犵殑API瀵嗛挜"

# 鐢熶骇鍩熷悕
NEXTAUTH_URL="https://浣犵殑鍩熷悕.com"

# 淇敼绠＄悊鍛樺瘑鐮?ADMIN_PASSWORD="寮哄瘑鐮?
```

### 4锔忊儯 涓€閿儴缃?
```bash
# 纭繚鑴氭湰鍙墽琛?chmod +x deploy.sh

# 杩愯閮ㄧ讲
./deploy.sh
```

閮ㄧ讲鑴氭湰浼氳嚜鍔?
1. 鎷夊彇鏈€鏂颁唬鐮?2. 鏋勫缓 Docker 闀滃儚
3. 鍚姩瀹瑰櫒
4. 杩愯鍋ュ悍妫€鏌?
### 5锔忊儯 楠岃瘉閮ㄧ讲

```bash
# 鏌ョ湅瀹瑰櫒鐘舵€?docker-compose ps

# 鏌ョ湅鏃ュ織
docker-compose logs -f

# 杩愯鍋ュ悍妫€鏌?./health-check.sh
```

璁块棶浣犵殑鍩熷悕鎴?`http://VPS_IP:3000`

---

## 馃攧 鏃ュ父缁存姢

### 鏇存柊浠ｇ爜

```bash
# 鎷夊彇鏈€鏂颁唬鐮佸苟閲嶆柊閮ㄧ讲
./deploy.sh
```

### 鏁版嵁搴撳浠?
```bash
# 鎵嬪姩澶囦唤
./backup.sh

# 鑷姩澶囦唤宸查厤缃?(姣忓ぉ鍑屾櫒2鐐?
# 澶囦唤淇濆瓨鍦?./backups/ 鐩綍
```

### 鎭㈠鏁版嵁搴?
```bash
./restore.sh
# 閫夋嫨瑕佹仮澶嶇殑澶囦唤鏂囦欢
```

### 鏌ョ湅鏃ュ織

```bash
# 瀹炴椂鏌ョ湅搴旂敤鏃ュ織
docker-compose logs -f

# 鏌ョ湅鏈€杩?00琛?docker-compose logs --tail=100
```

### 閲嶅惎鏈嶅姟

```bash
# 閲嶅惎鎵€鏈夊鍣?docker-compose restart

# 閲嶅惎鐗瑰畾瀹瑰櫒
docker-compose restart web
```

---

## 馃搳 鍔熻兘浣跨敤

### 绠＄悊鍛樺姛鑳?
1. **鐢ㄦ埛绠＄悊** (`/admin/users`)
   - 鍒涘缓/鍒犻櫎鐢ㄦ埛
   - 閲嶇疆瀵嗙爜
   - 鍒嗛厤瑙掕壊 (ADMIN/USER)

2. **鍗曡瘝绠＄悊** (`/admin/words`)
   - 娣诲姞鍗曡瘝 (AI 鑷姩鐢熸垚渚嬪彞鍜岀炕璇?
   - 鍒犻櫎鍗曡瘝
   - 鏌ョ湅鍗曡瘝鍒楄〃

### 鐢ㄦ埛鍔熻兘

1. **瀛︿範鐣岄潰** (`/learn`)
   - 鏌ョ湅姣忔棩澶嶄範闃熷垪
   - 涓夋瀛︿範娴佺▼:
     1. 鐪嬪崟璇嶅拰渚嬪彞,閫夋嫨姝ｇ‘閲婁箟 (鍥涢€変竴)
     2. 鎷煎啓鍗曡瘝
     3. 鏌ョ湅缁撴灉鍙嶉

2. **鏁版嵁缁熻** (`/dashboard`)
   - 瀛︿範鎬昏瘝鏁?   - 浠婃棩寰呭涔犳暟
   - 姝ｇ‘鐜囩粺璁?   - 瀛︿範杩涘害

---

## 馃敡 甯歌闂

### 瀹瑰櫒鍚姩澶辫触

```bash
# 鏌ョ湅閿欒鏃ュ織
docker-compose logs

# 妫€鏌ョ幆澧冨彉閲?cat .env

# 閲嶆柊鏋勫缓
docker-compose build --no-cache
docker-compose up -d
```

### 鏁版嵁搴撻攣瀹氶敊璇?
```bash
# 閲嶅惎瀹瑰櫒
docker-compose down
docker-compose up -d
```

### 绔彛鍐茬獊 (3000 宸茶鍗犵敤)

缂栬緫 `docker-compose.yml`:

```yaml
ports:
  - "8080:3000"  # 浣跨敤 8080 绔彛
```

### AI API 璋冪敤澶辫触

```bash
# 妫€鏌?API 瀵嗛挜
echo $DEEPSEEK_API_KEY

# 娴嬭瘯 API 杩炴帴
curl -H "Authorization: Bearer $DEEPSEEK_API_KEY" \
  https://api.deepseek.com/v1/models
```

---

## 馃攼 瀹夊叏寤鸿

### 鐢熶骇鐜妫€鏌ユ竻鍗?
- [ ] 淇敼榛樿绠＄悊鍛樺瘑鐮?- [ ] 鐢熸垚寮?NEXTAUTH_SECRET (32+ 瀛楃)
- [ ] 閰嶇疆 HTTPS (SSL 璇佷功)
- [ ] 閰嶇疆闃茬伀澧欒鍒?- [ ] 瀹氭湡澶囦唤鏁版嵁搴?- [ ] 鏇存柊绯荤粺鍖?- [ ] 鐩戞帶鏃ュ織鏂囦欢

### 鐢熸垚瀹夊叏瀵嗛挜

```bash
# NEXTAUTH_SECRET
openssl rand -base64 32

# 绠＄悊鍛樺瘑鐮?(寮哄瘑鐮佺敓鎴?
openssl rand -base64 16
```

---

## 馃搧 閲嶈鏂囦欢浣嶇疆

| 鏂囦欢/鐩綍 | 璇存槑 |
|----------|------|
| `./data/dev.db` | SQLite 鏁版嵁搴?(閲嶈!) |
| `./backups/` | 鏁版嵁搴撳浠?|
| `./logs/` | 搴旂敤鏃ュ織 |
| `.env` | 鐜鍙橀噺閰嶇疆 |
| `docker-compose.yml` | Docker 閰嶇疆 |

---

## 馃啒 鑾峰彇甯姪

1. 鏌ョ湅瀹屾暣鏂囨。:
   - [README.md](README.md) - 涓绘枃妗?   - [ARCHITECTURE.md](ARCHITECTURE.md) - 鎶€鏈灦鏋?   - [CHEATSHEET.md](CHEATSHEET.md) - 鍛戒护閫熸煡

2. 杩愯鍋ュ悍妫€鏌?
   ```bash
   ./health-check.sh
   ```

3. 鏌ョ湅鏃ュ織:
   ```bash
   docker-compose logs -f
   ```

---

## 馃帀 瀹屾垚!

鐜板湪浣犲彲浠?
- 璁块棶搴旂敤骞剁櫥褰?- 娣诲姞鍗曡瘝 (绠＄悊鍛?
- 寮€濮嬪涔?(鐢ㄦ埛)
- 鏌ョ湅瀛︿範杩涘害

**绁濆涔犳剦蹇? 馃帗**

---

## 馃摓 鎶€鏈敮鎸?
閬囧埌闂?
1. 鏌ョ湅鏂囨。
2. 妫€鏌ユ棩蹇?3. 鎻愪氦 GitHub Issue



