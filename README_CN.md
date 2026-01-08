# 馃帗 English Training - AI 鏅鸿兘鑻辫鍗曡瘝璁板繂绯荤粺

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-blue)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com/)
[![MUI](https://img.shields.io/badge/MUI-v6-007FFF)](https://mui.com/)

涓€涓熀浜?AI 鐨勮嫳璇崟璇嶅涔犲簲鐢?閲囩敤闂撮殧閲嶅绠楁硶 (SM-2),浣跨敤 Next.js 14銆丮aterial Design 3 鏋勫缓,鏀寔 Docker 涓€閿儴缃层€?
---

## 鉁?鏍稿績鍔熻兘

馃 **AI 鏅鸿兘鐢熸垚** - 浣跨敤 DeepSeek API 鑷姩鐢熸垚渚嬪彞銆佺炕璇戝拰鍙戦煶
馃摎 **闂撮殧閲嶅** - SuperMemo-2 (SM-2) 绠楁硶,绉戝浼樺寲璁板繂鍛ㄦ湡
馃懃 **鐢ㄦ埛绠＄悊** - 鍩轰簬瑙掕壊鐨勬潈闄愭帶鍒?(绠＄悊鍛?鏅€氱敤鎴?
馃帹 **鐜颁唬鍖栫晫闈?* - Material Design 3 璁捐瑙勮寖,娴佺晠鍔ㄧ敾
馃攼 **瀹夊叏璁よ瘉** - NextAuth.js v5 韬唤楠岃瘉绯荤粺
馃捑 **鏁版嵁鎸佷箙鍖?* - SQLite 鏁版嵁搴?+ Docker Volume 鎸傝浇
馃摝 **涓€閿儴缃?* - Docker Compose 閰嶇疆,鍗曞懡浠ゅ畬鎴愰儴缃?馃搳 **杩涘害杩借釜** - 璇︾粏鐨勫涔犵粺璁″拰鏁版嵁鍒嗘瀽

---

## 馃殌 蹇€熷紑濮?
### 鏈湴寮€鍙?
```bash
# 1. 瀹夎渚濊禆
npm install

# 2. 閰嶇疆鐜鍙橀噺
cp .env.example .env
# 缂栬緫 .env 鏂囦欢,娣诲姞浣犵殑 DEEPSEEK_API_KEY

# 3. 鍒濆鍖栨暟鎹簱
npx prisma generate
npx prisma db push
npx prisma db seed

# 4. 鍚姩寮€鍙戞湇鍔″櫒
npm run dev
```

璁块棶 [http://localhost:3000](http://localhost:3000)

**娴嬭瘯璐﹀彿:**
- 绠＄悊鍛? `admin@example.com` / `admin123`
- 鏅€氱敤鎴? `user@example.com` / `user123`

### VPS 直接部署 (无 Docker)

```bash
# 1. 克隆项目
git clone <your-repo> /opt/english-training
cd /opt/english-training

# 2. 安装系统依赖(首次)
sudo bash setup-vps-direct.sh

# 3. 配置环境变量
cp .env.vps.example .env
nano .env

# 4. 部署
chmod +x deploy-vps.sh
./deploy-vps.sh
```

使用 systemd 服务名 `english-training`，查看日志:
`sudo journalctl -u english-training -f`。HTTPS 配置可参考 `nginx.conf`。

### Docker 閮ㄧ讲 (鐢熶骇鐜)

```bash
# 1. 閰嶇疆鐜鍙橀噺
cp .env.production .env
nano .env  # 娣诲姞 API 瀵嗛挜鍜屽畨鍏ㄩ厤缃?
# 2. 涓€閿儴缃?chmod +x deploy.sh
./deploy.sh
```

馃摉 **璇︾粏鏁欑▼:** [涓枃蹇€熷叆闂ㄦ寚鍗梋(QUICKSTART_CN.md) | [瀹夎璇存槑](SETUP.md)

---

## 馃彈锔?绯荤粺鏋舵瀯

```
鈹屸攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹?鈹?        Next.js 14 (App Router)         鈹?鈹? 鈹屸攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹?       鈹屸攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹? 鈹?鈹? 鈹?  鍓嶇鐣岄潰  鈹傗梽鈹€鈹€鈹€鈹€鈹€鈹€鈻衡攤   鏈嶅姟绔?    鈹? 鈹?鈹? 鈹? (MUI MD3) 鈹?       鈹?  Actions   鈹? 鈹?鈹? 鈹斺攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹?       鈹斺攢鈹€鈹€鈹€鈹€鈹€鈹攢鈹€鈹€鈹€鈹€鈹€鈹? 鈹?鈹?                              鈹?        鈹?鈹?       鈹屸攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹尖攢鈹€鈹€鈹€鈹€鈹?  鈹?鈹?       鈹?                     鈹?    鈹?  鈹?鈹?  鈹屸攢鈹€鈹€鈹€鈻尖攢鈹€鈹€鈹€鈹€鈹?        鈹屸攢鈹€鈹€鈹€鈹€鈻尖攢鈹€鈹? 鈹?  鈹?鈹?  鈹?韬唤璁よ瘉  鈹?        鈹?Prisma 鈹? 鈹?  鈹?鈹?  鈹侼extAuth.js鈹?        鈹? ORM   鈹? 鈹?  鈹?鈹?  鈹斺攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹?        鈹斺攢鈹€鈹€鈹€鈹攢鈹€鈹€鈹? 鈹?  鈹?鈹?                            鈹?     鈹?  鈹?鈹斺攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹尖攢鈹€鈹€鈹€鈹€鈹€鈹尖攢鈹€鈹€鈹?                              鈹?     鈹?                         鈹屸攢鈹€鈹€鈹€鈻尖攢鈹€鈹?  鈹?                         鈹係QLite 鈹?  鈹?                         鈹?鏁版嵁搴?鈹?  鈹?                         鈹斺攢鈹€鈹€鈹€鈹€鈹€鈹€鈹?  鈹?                                     鈹?                              鈹屸攢鈹€鈹€鈹€鈹€鈹€鈻尖攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹?                              鈹? DeepSeek API 鈹?                              鈹?  (AI 鐢熸垚)   鈹?                              鈹斺攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹?```

馃摉 **瀹屾暣鏋舵瀯鏂囨。:** [ARCHITECTURE.md](ARCHITECTURE.md)

---

## 馃摝 鎶€鏈爤

| 绫诲埆 | 鎶€鏈?|
|------|------|
| **妗嗘灦** | Next.js 14+ (App Router) |
| **璇█** | TypeScript 5.7+ |
| **UI 搴?* | MUI v6 (Material Design 3) |
| **鏁版嵁搴?* | SQLite + Prisma ORM |
| **璁よ瘉** | NextAuth.js v5 |
| **AI 闆嗘垚** | OpenAI SDK (DeepSeek API) |
| **閮ㄧ讲** | VPS 直接部署 或 Docker |
| **鏍峰紡** | Emotion (CSS-in-JS) |

---

## 馃幆 鍔熻兘璇﹁В

### 鐢ㄦ埛鍔熻兘

#### 馃摎 姣忔棩澶嶄範闃熷垪
- 鍩轰簬 SM-2 绠楁硶鑷姩璁＄畻澶嶄範鏃堕棿
- 鏅鸿兘鎺掑簭,浼樺厛澶嶄範閬楀繕椋庨櫓楂樼殑鍗曡瘝
- 鑷姩鐢熸垚鏂板崟璇嶅涔犱换鍔?
#### 馃幃 浜や簰寮忓涔犳祦绋?**涓夋瀛︿範娉?**
1. **鐪嬪崟璇嶅拰渚嬪彞** 鈫?浠?4 涓€夐」涓€夋嫨姝ｇ‘閲婁箟
2. **鏌ョ湅姝ｇ‘閲婁箟** 鈫?鎷煎啓鍗曡瘝
3. **鑾峰緱鍗虫椂鍙嶉** 鈫?鏌ョ湅瀛︿範缁撴灉鍜岃繘搴?
#### 馃搳 瀛︿範缁熻
- 鎬诲涔犲崟璇嶆暟
- 浠婃棩寰呭涔犳暟閲?- 姝ｇ‘鐜囩粺璁?- 瀛︿範杩涘害鍙鍖?
### 绠＄悊鍛樺姛鑳?
#### 馃懃 鐢ㄦ埛绠＄悊
- 鍒涘缓/鍒犻櫎鐢ㄦ埛璐﹀彿
- 閲嶇疆鐢ㄦ埛瀵嗙爜
- 鍒嗛厤鐢ㄦ埛瑙掕壊 (绠＄悊鍛?鏅€氱敤鎴?

#### 馃摑 鍗曡瘝绠＄悊
- 娣诲姞鏂板崟璇?AI 鑷姩鐢熸垚:
  - 鑻辨枃渚嬪彞 + 涓枃缈昏瘧
  - IPA 鍥介檯闊虫爣
  - 閲婁箟鐨勪腑鏂囩炕璇?  - 娴嬮獙骞叉壈閫夐」 (3 涓敊璇瓟妗?
- 鍒犻櫎鍗曡瘝
- 鎵归噺瀵煎叆 (璁″垝涓?

---

## 馃梻锔?椤圭洰缁撴瀯

```
english-training/
鈹溾攢鈹€ app/                      # Next.js 搴旂敤璺敱
鈹?  鈹溾攢鈹€ actions.ts           # 鏈嶅姟绔搷浣?(鍗曡瘝/鐢ㄦ埛/瀛︿範)
鈹?  鈹溾攢鈹€ login/               # 鐧诲綍椤甸潰
鈹?  鈹溾攢鈹€ learn/               # 瀛︿範鐣岄潰
鈹?  鈹溾攢鈹€ dashboard/           # 鐢ㄦ埛缁熻闈㈡澘
鈹?  鈹斺攢鈹€ admin/               # 绠＄悊鍛橀潰鏉?鈹溾攢鈹€ components/              # React 缁勪欢
鈹?  鈹斺攢鈹€ LearningCard.tsx    # MD3 瀛︿範鍗＄墖
鈹溾攢鈹€ lib/                     # 鏍稿績閫昏緫
鈹?  鈹溾攢鈹€ deepseek.ts         # AI 闆嗘垚
鈹?  鈹溾攢鈹€ sm2-algorithm.ts    # 闂撮殧閲嶅绠楁硶
鈹?  鈹溾攢鈹€ prisma.ts           # 鏁版嵁搴撳鎴风
鈹?  鈹斺攢鈹€ theme.ts            # MUI 涓婚
鈹溾攢鈹€ prisma/                  # 鏁版嵁搴?鈹?  鈹溾攢鈹€ schema.prisma       # 鏁版嵁妯″瀷瀹氫箟
鈹?  鈹斺攢鈹€ seed.ts             # 鍒濆鍖栨暟鎹?鈹溾攢鈹€ Dockerfile               # 瀹瑰櫒鏋勫缓閰嶇疆
鈹溾攢鈹€ docker-compose.yml       # 閮ㄧ讲閰嶇疆
鈹溾攢鈹€ deploy.sh               # 涓€閿儴缃茶剼鏈?鈹斺攢鈹€ backup.sh               # 鏁版嵁搴撳浠借剼鏈?```

---

## 馃攼 瀹夊叏鐗规€?
鉁?Bcrypt 瀵嗙爜鍔犲瘑 (10 杞搱甯?
鉁?JWT 浼氳瘽浠ょ墝
鉁?CSRF 璺ㄧ珯璇锋眰浼€犻槻鎶?鉁?鍩轰簬瑙掕壊鐨勮闂帶鍒?鉁?Docker 闈?root 鐢ㄦ埛杩愯
鉁?鐜鍙橀噺鍔犲瘑瀛樺偍
鉁?SQL 娉ㄥ叆闃叉姢 (Prisma ORM)
鉁?XSS 璺ㄧ珯鑴氭湰闃叉姢 (React 鑷姩杞箟)

---

## 馃惓 Docker 閰嶇疆璇﹁В

### SQLite 鏁版嵁鎸佷箙鍖?(鍏抽敭!)

```yaml
volumes:
  - ./data:/app/prisma/data  # 灏嗗鍣ㄥ唴鏁版嵁搴撴槧灏勫埌瀹夸富鏈?```

**涓轰粈涔堣繖寰堥噸瑕?**
- 瀹瑰櫒鏂囦欢绯荤粺鏄复鏃剁殑,鍒犻櫎瀹瑰櫒浼氫涪澶辨暟鎹?- Volume 鎸傝浇灏嗘暟鎹寔涔呭寲鍒板涓绘満
- 鍗充娇鍒犻櫎/閲嶅缓瀹瑰櫒,鏁版嵁渚濈劧淇濈暀
- 澶囦唤绠€鍗? 澶嶅埗 `./data/dev.db` 鍗冲彲
- 鎭㈠绠€鍗? 鏇挎崲 `./data/dev.db` 鍗冲彲

### 澶氶樁娈垫瀯寤轰紭鍖?
```dockerfile
闃舵 1: deps    鈫?浠呭畨瑁呬緷璧?闃舵 2: builder 鈫?鏋勫缓 Next.js 搴旂敤
闃舵 3: runner  鈫?鏈€灏忓寲鐢熶骇杩愯鏃?```

**浼樺娍:** 闀滃儚浣撶Н鍑忓皯 70% (~100MB vs ~500MB+)

---

## 馃搳 瀛︿範绠楁硶 - SuperMemo-2 (SM-2)

### 璐ㄩ噺璇勫垎 (0-5 鍒?

- **0 鍒?* = 瀹屽叏涓嶈寰?- **1 鍒?* = 绛旈敊,浣嗙瓟妗堢湅璧锋潵鐪肩啛
- **2 鍒?* = 绛旈敊,浣嗚寰楃瓟妗堝鏄撳洖蹇?- **3 鍒?* = 绛斿,浣嗛潪甯稿洶闅?- **4 鍒?* = 绛斿,浣嗙姽璞簡涓€涓?- **5 鍒?* = 瀹岀編绛斿

### 绠楁硶閫昏緫

```javascript
if (璐ㄩ噺 < 3) {
  閲嶅娆℃暟 = 0
  闂撮殧 = 1  // 鏄庡ぉ鍐嶅涔?} else {
  if (閲嶅娆℃暟 === 0) 闂撮殧 = 1      // 绗竴娆＄瓟瀵? 1 澶╁悗
  else if (閲嶅娆℃暟 === 1) 闂撮殧 = 6  // 绗簩娆＄瓟瀵? 6 澶╁悗
  else 闂撮殧 = 闂撮殧 * 闅惧害鍥犲瓙        // 涔嬪悗: 鎸囨暟澧為暱

  閲嶅娆℃暟++
}

// 鏇存柊闅惧害鍥犲瓙
闅惧害鍥犲瓙 = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
if (闅惧害鍥犲瓙 < 1.3) 闅惧害鍥犲瓙 = 1.3
```

**鏁堟灉:** 鏍规嵁璁板繂寮哄害鍔ㄦ€佽皟鏁村涔犻棿闅?瀹炵幇楂樻晥璁板繂

---

## 馃摑 瀹屾暣鏂囨。

| 鏂囨。 | 璇存槑 |
|------|------|
| [README_CN.md](README_CN.md) | 鏈枃浠?- 涓枃椤圭洰璇存槑 |
| [README.md](README.md) | 鑻辨枃椤圭洰璇存槑 |
| [QUICKSTART_CN.md](QUICKSTART_CN.md) | 涓枃蹇€熷叆闂ㄦ寚鍗?|
| [SETUP.md](SETUP.md) | 璇︾粏瀹夎姝ラ |
| [ARCHITECTURE.md](ARCHITECTURE.md) | 鎶€鏈灦鏋勬枃妗?|
| [CHEATSHEET.md](CHEATSHEET.md) | 甯哥敤鍛戒护閫熸煡琛?|
| [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) | 椤圭洰瀹屾暣鎬荤粨 |
| [CONTRIBUTING.md](CONTRIBUTING.md) | 璐＄尞鎸囧崡 |

---

## 馃洜锔?甯哥敤鍛戒护

### 寮€鍙戠幆澧?```bash
npm run dev          # 鍚姩寮€鍙戞湇鍔″櫒
npx prisma studio    # 鎵撳紑鏁版嵁搴撳彲瑙嗗寲鐣岄潰
npx prisma generate  # 鐢熸垚 Prisma Client
```

### Docker 閮ㄧ讲
```bash
./deploy.sh          # 涓€閿儴缃?鏇存柊
docker-compose logs -f  # 鏌ョ湅瀹炴椂鏃ュ織
./backup.sh          # 澶囦唤鏁版嵁搴?./restore.sh         # 鎭㈠鏁版嵁搴?./health-check.sh    # 绯荤粺鍋ュ悍妫€鏌?```

### 鏁版嵁搴撴搷浣?```bash
sqlite3 ./data/dev.db           # 璁块棶鏁版嵁搴撳懡浠よ
npx prisma db push              # 搴旂敤 schema 鏇存敼
npx prisma db seed              # 濉厖绀轰緥鏁版嵁
```

---

## 馃攧 閮ㄧ讲宸ヤ綔娴?
### VPS 棣栨閮ㄧ讲

```bash
# 1. 瀹夎 Docker (浣跨敤瀹樻柟鑴氭湰)
curl -fsSL https://get.docker.com | sudo sh
sudo systemctl start docker
sudo systemctl enable docker

# 2. 鍏嬮殕浠撳簱
git clone https://github.com/jantian3n/english-training.git /opt/english-training
cd /opt/english-training

# 3. 閰嶇疆鐜鍙橀噺
cp .env.production .env
nano .env  # 娣诲姞浣犵殑瀵嗛挜

# 4. 鐢熸垚瀹夊叏瀵嗛挜
openssl rand -base64 32  # 鐢ㄤ簬 NEXTAUTH_SECRET

# 5. 涓€閿儴缃?./deploy.sh
```

### 鏇存柊閮ㄧ讲

```bash
# 涓€鏉″懡浠ゅ畬鎴愭墍鏈夋洿鏂版搷浣?./deploy.sh
```

**鑴氭湰鑷姩鎵ц:**
1. 浠?Git 鎷夊彇鏈€鏂颁唬鐮?2. 鍋滄鐜版湁瀹瑰櫒
3. 鏋勫缓鏂扮殑 Docker 闀滃儚
4. 鍚姩鏇存柊鍚庣殑瀹瑰櫒
5. 杩愯鍋ュ悍妫€鏌?
### 鑷姩澶囦唤

```bash
# 璁剧疆瀹氭椂浠诲姟 (姣忓ぉ鍑屾櫒 2 鐐硅嚜鍔ㄥ浠?
crontab -e

# 娣诲姞杩欒:
0 2 * * * cd /opt/english-training && ./backup.sh >> /opt/english-training/logs/backup.log 2>&1
```

---

## 馃 鍙備笌璐＄尞

娆㈣繋璐＄尞浠ｇ爜!璇锋煡鐪?[璐＄尞鎸囧崡](CONTRIBUTING.md)銆?
**鍙互璐＄尞鐨勬柟鍚?**
- CSV/Excel 鎵归噺瀵煎叆鍗曡瘝
- 绉诲姩绔簲鐢?(React Native)
- 璇煶鍙戦煶鍔熻兘 (TTS)
- 杩涘害鍙鍖栧浘琛?- 澶氳瑷€鏀寔
- 鑷姩鍖栨祴璇?- 鎬ц兘浼樺寲

---

## 馃搫 寮€婧愬崗璁?
鏈」鐩噰鐢?MIT 鍗忚 - 鏌ョ湅 [LICENSE](LICENSE) 鏂囦欢浜嗚В璇︽儏銆?
---

## 馃檹 鑷磋阿

- **Next.js** - React 鍏ㄦ爤妗嗘灦
- **MUI** - Material Design 缁勪欢搴?- **Prisma** - 鐜颁唬鍖栨暟鎹簱 ORM
- **NextAuth.js** - 韬唤璁よ瘉瑙ｅ喅鏂规
- **DeepSeek** - AI API 鎻愪緵鍟?- **SuperMemo** - SM-2 绠楁硶

---

## 馃摓 鏀寔涓庡弽棣?
- 馃摉 鏌ョ湅 [瀹屾暣鏂囨。](README.md)
- 馃悰 [鎻愪氦闂](https://github.com/jantian3n/english-training/issues)
- 馃挰 [鍙備笌璁ㄨ](https://github.com/jantian3n/english-training/discussions)

---

## 馃搱 寮€鍙戣矾绾垮浘

- [x] 鍩虹瀛︿範娴佺▼
- [x] SM-2 闂撮殧閲嶅绠楁硶
- [x] AI 鍐呭鐢熸垚
- [x] 绠＄悊鍛橀潰鏉?- [x] Docker 閮ㄧ讲
- [ ] CSV 鎵归噺瀵煎叆/瀵煎嚭
- [ ] 绉诲姩绔簲鐢?- [ ] 璇煶鍙戦煶
- [ ] 绀句氦鍔熻兘 (鎺掕姒?
- [ ] 楂樼骇鏁版嵁鍒嗘瀽

---

## 馃挕 浣跨敤鍦烘櫙

鉁?**涓汉瀛︿範** - 鏃ュ父鑻辫璇嶆眹绉疮
鉁?**瀛︽牎鏁欏** - 鏁欏笀甯冪疆鍗曡瘝瀛︿範浠诲姟
鉁?**浼佷笟鍩硅** - 鍛樺伐鑻辫鑳藉姏鎻愬崌
鉁?**鑰冭瘯澶囪€?* - 鎵樼/闆呮€?GRE 璇嶆眹鍑嗗
鉁?**鑷缓鏈嶅姟** - 閮ㄧ讲鍒拌嚜宸辩殑鏈嶅姟鍣?
---

## 馃幆 鎬ц兘鎸囨爣

- **鏀寔骞跺彂鐢ㄦ埛:** 100-500 浜?- **鏁版嵁搴撳閲?** < 10GB (SQLite 鏈€浣?
- **闀滃儚澶у皬:** ~100MB (浼樺寲鍚?
- **鍐峰惎鍔ㄦ椂闂?** < 10 绉?- **鍐呭瓨鍗犵敤:** ~200MB
- **鍝嶅簲鏃堕棿:** < 100ms (鏈湴)

---

## 馃敡 绯荤粺瑕佹眰

### 寮€鍙戠幆澧?- Node.js 20+
- npm 鎴?yarn
- Git

### 鐢熶骇鐜 (Docker)
- Docker 20+
- Docker Compose 2+
- 1GB+ RAM
- 10GB+ 纾佺洏绌洪棿

### VPS 鎺ㄨ崘閰嶇疆
- CPU: 1 鏍稿績
- 鍐呭瓨: 2GB
- 纾佺洏: 20GB SSD
- 甯﹀: 1Mbps+

---

## 馃摳 鍔熻兘鎴浘

> 鎻愮ず: 鍙互鍦ㄨ繖閲屾坊鍔犲簲鐢ㄦ埅鍥惧睍绀?
- 鐧诲綍鐣岄潰
- 瀛︿範鍗＄墖
- 缁熻闈㈡澘
- 绠＄悊鍚庡彴

---

**浣跨敤 鉂わ笍 鍜?Next.js 鏋勫缓**

**鐗堟湰:** 1.0.0
**鐘舵€?** 鉁?鐢熶骇灏辩华
**鏈€鍚庢洿鏂?** 2026-01-08

---

猸?**濡傛灉杩欎釜椤圭洰瀵逛綘鏈夊府鍔?璇风粰涓?Star!**





