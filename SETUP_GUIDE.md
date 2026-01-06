# 🚀 完整設定指南：Google Sheets + Apps Script + GitHub Pages

本指南將協助您完成整個系統的設定，讓手搖飲日記應用程式可以正常運作並支援跨裝置同步。

---

## 📋 目錄

1. [Google Sheets 設定](#1-google-sheets-設定)
2. [Google Apps Script 設定](#2-google-apps-script-設定)
3. [GitHub Pages 部署](#3-github-pages-部署)
4. [測試與驗證](#4-測試與驗證)
5. [常見問題](#5-常見問題)

---

## 1. Google Sheets 設定

### 步驟 1.1：建立新的 Google Sheets

1. 前往 [Google Sheets](https://sheets.google.com)
2. 點擊「建立新的試算表」
3. 將試算表命名為「手搖飲日記」或您喜歡的名稱

### 步驟 1.2：設定資料表結構

在第一行（標題列）輸入以下欄位：

| A | B | C | D | E |
|---|---|---|---|---|
| 日期 | 店家 | 飲料 | 價格 | ID |

**重要**：請確保欄位順序為：
- A 欄：日期
- B 欄：店家
- C 欄：飲料
- D 欄：價格
- E 欄：ID

### 步驟 1.3：設定試算表 ID

1. 查看網址列，找到類似這樣的網址：
   ```
   https://docs.google.com/spreadsheets/d/你的試算表ID/edit
   ```
2. 複製「你的試算表ID」部分（在 `/d/` 和 `/edit` 之間）
3. 稍後在 Apps Script 中會用到

---

## 2. Google Apps Script 設定

### 步驟 2.1：開啟 Apps Script 編輯器

1. 在您的 Google Sheets 中，點擊上方選單「擴充功能」→「Apps Script」
2. 會開啟新的 Apps Script 編輯器視窗

### 步驟 2.2：建立 Apps Script 程式碼

1. 刪除預設的程式碼
2. 複製並貼上以下完整程式碼（請見下方 `apps-script-code.gs` 檔案）

### 步驟 2.3：設定試算表 ID

在程式碼中找到這一行：
```javascript
const SPREADSHEET_ID = '你的試算表ID';
```

將 `'你的試算表ID'` 替換為您在步驟 1.3 中複製的試算表 ID。

### 步驟 2.4：儲存並部署

1. 點擊「儲存」按鈕（或按 `Ctrl+S` / `Cmd+S`）
2. 為專案命名（例如：「手搖飲日記 API」）
3. 點擊「部署」→「新增部署作業」
4. 選擇類型：「網頁應用程式」
5. 設定：
   - **說明**：手搖飲日記 API v1
   - **執行身分**：我
   - **具有存取權的使用者**：任何人（重要！）
6. 點擊「部署」
7. **重要**：複製部署後的網址（類似 `https://script.google.com/macros/s/.../exec`）

### 步驟 2.5：更新前端 API 網址

1. 開啟 `index.html`
2. 找到這一行（約第 561 行）：
   ```javascript
   const API_URL = "https://script.google.com/macros/s/.../exec";
   ```
3. 將網址替換為您在步驟 2.4 中複製的網址

### 步驟 2.6：授權執行（第一次）

1. 第一次執行時，Apps Script 會要求授權
2. 點擊「授權」
3. 選擇您的 Google 帳號
4. 點擊「進階」→「前往手搖飲日記 API（不安全）」
5. 點擊「允許」

---

## 3. GitHub Pages 部署

### 步驟 3.1：建立 GitHub 儲存庫

1. 前往 [GitHub](https://github.com)
2. 登入您的帳號
3. 點擊右上角「+」→「New repository」
4. 設定：
   - **Repository name**：`drink-diary`（或您喜歡的名稱）
   - **Description**：手搖飲日記 - 跨裝置同步應用
   - **Visibility**：Public（GitHub Pages 免費版需要公開）
   - **不要**勾選「Add a README file」（我們已有檔案）
5. 點擊「Create repository」

### 步驟 3.2：安裝 Git（如果尚未安裝）

**Windows：**
1. 下載 [Git for Windows](https://git-scm.com/download/win)
2. 安裝時使用預設選項
3. 安裝完成後，開啟 Git Bash 或命令提示字元

**Mac：**
```bash
# 使用 Homebrew
brew install git
```

**Linux：**
```bash
sudo apt-get install git
```

### 步驟 3.3：初始化 Git 並推送檔案

在您的專案資料夾中（`C:\Users\user\Desktop\drink`），執行以下命令：

```bash
# 初始化 Git 儲存庫
git init

# 添加所有檔案
git add .

# 提交變更
git commit -m "Initial commit: 手搖飲日記應用"

# 添加遠端儲存庫（將 YOUR_USERNAME 替換為您的 GitHub 使用者名稱）
git remote add origin https://github.com/YOUR_USERNAME/drink-diary.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

### 步驟 3.4：啟用 GitHub Pages

1. 前往您的 GitHub 儲存庫頁面
2. 點擊「Settings」（設定）
3. 在左側選單中找到「Pages」
4. 在「Source」下選擇：
   - **Branch**：`main`
   - **Folder**：`/ (root)`
5. 點擊「Save」
6. 等待幾分鐘，GitHub 會提供您的網站網址：
   ```
   https://YOUR_USERNAME.github.io/drink-diary/
   ```

### 步驟 3.5：更新 Service Worker 路徑（如果需要）

如果您的 GitHub Pages 網址不是根路徑，可能需要更新 `sw.js` 中的快取路徑。

---

## 4. 測試與驗證

### 測試 4.1：測試 API 連線

1. 開啟您的 GitHub Pages 網站
2. 開啟瀏覽器開發者工具（F12）
3. 切換到「Console」標籤
4. 檢查是否有錯誤訊息
5. 點擊「同步」按鈕，觀察是否成功載入資料

### 測試 4.2：測試新增功能

1. 點擊右下角的「+」按鈕
2. 填寫表單：
   - 店家：50嵐
   - 飲料：1號
   - 價格：50
   - 日期：今天
3. 點擊「儲存到雲端」
4. 檢查 Google Sheets 是否出現新資料

### 測試 4.3：測試編輯功能

1. 點擊任一筆記錄
2. 修改資料
3. 點擊「更新紀錄」
4. 檢查 Google Sheets 是否更新

### 測試 4.4：測試刪除功能

1. 點擊任一筆記錄
2. 點擊「刪除此筆」
3. 確認刪除
4. 檢查 Google Sheets 是否刪除該筆資料

### 測試 4.5：測試離線功能

1. 開啟開發者工具（F12）
2. 切換到「Network」標籤
3. 選擇「Offline」模式
4. 嘗試新增一筆記錄
5. 恢復連線
6. 檢查是否自動同步

### 測試 4.6：測試多裝置同步

1. 在手機上開啟您的 GitHub Pages 網站
2. 新增一筆記錄
3. 在電腦上重新整理頁面
4. 檢查是否看到新記錄

---

## 5. 常見問題

### Q1：Apps Script 顯示「需要授權」錯誤

**解決方法：**
1. 在 Apps Script 編輯器中，點擊「執行」→「doGet」或「doPost」
2. 選擇您的 Google 帳號
3. 點擊「進階」→「前往...（不安全）」
4. 點擊「允許」

### Q2：GitHub Pages 顯示 404 錯誤

**解決方法：**
1. 確認檔案已正確推送到 GitHub
2. 確認 GitHub Pages 設定正確（Source 選擇 main 分支）
3. 等待 5-10 分鐘讓 GitHub 處理
4. 清除瀏覽器快取後重試

### Q3：API 請求失敗（CORS 錯誤）

**解決方法：**
1. 確認 Apps Script 部署時選擇「任何人」可以存取
2. 確認 API_URL 正確
3. 檢查 Apps Script 執行記錄是否有錯誤

### Q4：資料沒有同步

**解決方法：**
1. 檢查 Google Sheets 是否有資料
2. 檢查 Apps Script 執行記錄
3. 確認試算表 ID 正確
4. 檢查瀏覽器 Console 是否有錯誤

### Q5：Service Worker 沒有註冊

**解決方法：**
1. 確認網站使用 HTTPS（GitHub Pages 自動提供）
2. 確認 `sw.js` 檔案在根目錄
3. 檢查瀏覽器 Console 是否有錯誤訊息

### Q6：離線功能不工作

**解決方法：**
1. 確認 Service Worker 已註冊（檢查 Console）
2. 確認網站使用 HTTPS
3. 清除瀏覽器快取後重試

---

## 📝 檢查清單

完成以下項目後，您的應用程式就可以正常運作了：

- [ ] Google Sheets 已建立並設定欄位
- [ ] Apps Script 程式碼已部署
- [ ] Apps Script 已授權執行
- [ ] 前端 API_URL 已更新
- [ ] GitHub 儲存庫已建立
- [ ] 檔案已推送到 GitHub
- [ ] GitHub Pages 已啟用
- [ ] 測試新增功能
- [ ] 測試編輯功能
- [ ] 測試刪除功能
- [ ] 測試離線功能
- [ ] 測試多裝置同步

---

## 🎉 完成！

恭喜！您已經成功設定好整個系統。現在可以在任何裝置上使用手搖飲日記應用程式，所有資料都會自動同步到 Google Sheets。

如有任何問題，請參考「常見問題」章節或檢查瀏覽器 Console 的錯誤訊息。

---

**需要幫助？**
- 檢查瀏覽器 Console（F12）的錯誤訊息
- 檢查 Apps Script 執行記錄
- 確認所有設定步驟都已完成
