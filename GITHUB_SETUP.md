# 📦 GitHub 設定快速指南

## 方法一：使用 GitHub Desktop（圖形化介面，推薦新手）

### 步驟 1：下載並安裝 GitHub Desktop

1. 前往 [GitHub Desktop 官網](https://desktop.github.com/)
2. 下載並安裝 GitHub Desktop
3. 使用您的 GitHub 帳號登入

### 步驟 2：建立新儲存庫

1. 開啟 GitHub Desktop
2. 點擊「File」→「New Repository」
3. 設定：
   - **Name**: `drink-diary`
   - **Description**: 手搖飲日記 - 跨裝置同步應用
   - **Local Path**: 選擇您的專案資料夾（`C:\Users\user\Desktop\drink`）
   - **勾選**「Initialize this repository with a README」（可選）
4. 點擊「Create Repository」

### 步驟 3：推送檔案到 GitHub

1. 在 GitHub Desktop 中，您會看到所有檔案的變更
2. 在左下角輸入提交訊息：「Initial commit: 手搖飲日記應用」
3. 點擊「Commit to main」
4. 點擊「Publish repository」
5. **重要**：取消勾選「Keep this code private」（GitHub Pages 免費版需要公開）
6. 點擊「Publish Repository」

### 步驟 4：啟用 GitHub Pages

1. 在 GitHub Desktop 中，點擊「Repository」→「View on GitHub」
2. 在 GitHub 網頁上，點擊「Settings」
3. 在左側選單找到「Pages」
4. 在「Source」下選擇：
   - **Branch**: `main`
   - **Folder**: `/ (root)`
5. 點擊「Save」
6. 等待幾分鐘，您的網站網址會顯示在頁面上

---

## 方法二：使用命令列（進階）

### 步驟 1：開啟終端機

在您的專案資料夾中（`C:\Users\user\Desktop\drink`）：
- **Windows**: 按 `Shift + 右鍵` → 選擇「在此處開啟 PowerShell 視窗」
- **Mac/Linux**: 開啟終端機，使用 `cd` 切換到專案資料夾

### 步驟 2：初始化 Git

```bash
# 初始化 Git 儲存庫
git init

# 添加所有檔案
git add .

# 提交變更
git commit -m "Initial commit: 手搖飲日記應用"
```

### 步驟 3：連接到 GitHub

```bash
# 添加遠端儲存庫（將 YOUR_USERNAME 替換為您的 GitHub 使用者名稱）
git remote add origin https://github.com/YOUR_USERNAME/drink-diary.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

**注意**：第一次推送時，GitHub 會要求您輸入帳號密碼。建議使用 Personal Access Token。

### 步驟 4：建立 Personal Access Token（如果需要）

1. 前往 GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. 點擊「Generate new token」
3. 設定：
   - **Note**: `drink-diary-deployment`
   - **Expiration**: 選擇過期時間
   - **勾選** `repo` 權限
4. 點擊「Generate token」
5. **重要**：複製 token（只會顯示一次）
6. 在推送時，使用 token 作為密碼

---

## 方法三：使用 GitHub 網頁介面（最簡單）

### 步驟 1：建立新儲存庫

1. 前往 [GitHub](https://github.com)
2. 點擊右上角「+」→「New repository」
3. 設定：
   - **Repository name**: `drink-diary`
   - **Description**: 手搖飲日記 - 跨裝置同步應用
   - **Public**（GitHub Pages 免費版需要公開）
   - **不要**勾選「Add a README file」
4. 點擊「Create repository」

### 步驟 2：上傳檔案

1. 在儲存庫頁面，點擊「uploading an existing file」
2. 將您的專案資料夾中的所有檔案拖放到頁面上
3. 在下方輸入提交訊息：「Initial commit」
4. 點擊「Commit changes」

### 步驟 3：啟用 GitHub Pages

1. 點擊「Settings」
2. 在左側選單找到「Pages」
3. 在「Source」下選擇：
   - **Branch**: `main`
   - **Folder**: `/ (root)`
4. 點擊「Save」

---

## ✅ 驗證部署

1. 等待 5-10 分鐘讓 GitHub 處理
2. 前往您的網站：`https://YOUR_USERNAME.github.io/drink-diary/`
3. 如果看到應用程式，表示部署成功！

---

## 🔄 更新網站

### 使用 GitHub Desktop：

1. 修改檔案
2. 在 GitHub Desktop 中看到變更
3. 輸入提交訊息
4. 點擊「Commit to main」
5. 點擊「Push origin」

### 使用命令列：

```bash
# 添加變更
git add .

# 提交變更
git commit -m "更新說明"

# 推送到 GitHub
git push
```

---

## 📝 注意事項

1. **公開儲存庫**：GitHub Pages 免費版需要公開儲存庫
2. **檔案大小**：單一檔案建議不超過 100MB
3. **更新延遲**：GitHub Pages 更新可能需要幾分鐘才會生效
4. **HTTPS**：GitHub Pages 自動提供 HTTPS，這是 Service Worker 的要求

---

## 🆘 遇到問題？

- **404 錯誤**：確認 GitHub Pages 已啟用，等待幾分鐘後重試
- **檔案沒有更新**：清除瀏覽器快取，或使用無痕模式
- **推送失敗**：檢查網路連線，確認 GitHub 帳號權限
