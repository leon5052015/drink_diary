# 雲端部署指南

## 推薦平台

### 1. Railway（推薦，最簡單）

1. 前往 https://railway.app/
2. 註冊/登入帳號（可使用 GitHub 登入）
3. 點擊 "New Project" → "Deploy from GitHub repo"
4. 選擇您的專案倉庫
5. Railway 會自動偵測並部署

**優點：**
- 免費額度：每月 $5 免費額度
- 自動部署
- 支援 SQLite
- 簡單易用

---

### 2. Render

1. 前往 https://render.com/
2. 註冊/登入帳號
3. 點擊 "New +" → "Web Service"
4. 連接您的 GitHub 倉庫
5. 設定：
   - **Build Command**: `npm install`
   - **Start Command**: `node server/index.js`
   - **Environment**: Node

**優點：**
- 免費方案可用（但會休眠）
- 支援 SQLite
- 自動部署

---

## 部署後設定

### 1. 取得後端 API URL

部署完成後，您會得到一個 URL，例如：
- Railway: `https://your-app.railway.app`
- Render: `https://your-app.onrender.com`

### 2. 設定前端環境變數

在 `client` 目錄下建立 `.env` 檔案：

```env
REACT_APP_API_URL=https://your-app.railway.app
```

或

```env
REACT_APP_API_URL=https://your-app.onrender.com
```

### 3. 重新建置前端

```bash
cd client
npm run build
```

### 4. 部署前端

#### 選項 A：使用 Vercel（推薦）

1. 前往 https://vercel.com/
2. 連接 GitHub 倉庫
3. 設定：
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Environment Variables**: 新增 `REACT_APP_API_URL` = 您的後端 URL

#### 選項 B：使用 Netlify

1. 前往 https://www.netlify.com/
2. 連接 GitHub 倉庫
3. 設定：
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/build`
   - **Environment variables**: 新增 `REACT_APP_API_URL`

---

## 本地開發設定

如果要在本地開發，在 `client` 目錄建立 `.env`：

```env
REACT_APP_API_URL=http://localhost:5000
```

然後重新啟動開發伺服器。

---

## 注意事項

1. **資料庫持久化**：SQLite 檔案會儲存在雲端平台的檔案系統中
2. **CORS 設定**：後端已設定允許所有來源，適合跨裝置使用
3. **環境變數**：確保在不同環境設定正確的 `REACT_APP_API_URL`

---

## 快速測試

部署完成後，測試 API：

```bash
curl https://your-app.railway.app/api/health
```

應該會回傳：`{"status":"ok"}`
