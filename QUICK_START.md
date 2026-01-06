# ⚡ 快速開始指南

這是一個簡化版的設定指南，適合想要快速上手的用戶。

---

## 🎯 5 分鐘快速設定

### 1️⃣ 建立 Google Sheets（2 分鐘）

1. 前往 [Google Sheets](https://sheets.google.com)
2. 建立新試算表
3. 在第一行輸入：`日期 | 店家 | 飲料 | 價格 | ID`
4. 複製試算表 ID（從網址中，在 `/d/` 和 `/edit` 之間）

### 2️⃣ 設定 Apps Script（2 分鐘）

1. 在 Google Sheets 中，點擊「擴充功能」→「Apps Script」
2. 刪除預設程式碼，貼上 `apps-script-code.gs` 的內容
3. 將 `SPREADSHEET_ID` 替換為您的試算表 ID
4. 點擊「部署」→「新增部署作業」
5. 選擇「網頁應用程式」，設定「任何人」可存取
6. 複製部署網址

### 3️⃣ 更新前端（30 秒）

1. 開啟 `index.html`
2. 找到 `API_URL`（約第 561 行）
3. 替換為您的 Apps Script 網址

### 4️⃣ 部署到 GitHub（30 秒）

**最簡單方法：**

1. 前往 [GitHub](https://github.com) 建立新儲存庫
2. 點擊「uploading an existing file」
3. 上傳所有檔案
4. 在 Settings → Pages 啟用 GitHub Pages

**完成！** 🎉

---

## 📋 檔案清單

確保您有以下檔案：

- ✅ `index.html` - 主應用程式
- ✅ `sw.js` - Service Worker
- ✅ `manifest.json` - PWA 設定
- ✅ `apps-script-code.gs` - Apps Script 程式碼（需要複製到 Google）

---

## 🔗 重要連結

- **Google Sheets**: https://sheets.google.com
- **Apps Script**: https://script.google.com
- **GitHub**: https://github.com
- **GitHub Pages**: https://pages.github.com

---

## ⚠️ 常見錯誤

| 錯誤 | 解決方法 |
|------|---------|
| API 無法連線 | 確認 Apps Script 已部署且設定「任何人」可存取 |
| 資料沒有顯示 | 檢查試算表 ID 是否正確 |
| GitHub Pages 404 | 等待 5-10 分鐘，確認 Pages 已啟用 |
| 離線功能不工作 | 確認網站使用 HTTPS（GitHub Pages 自動提供） |

---

## 📚 詳細說明

如需更詳細的說明，請參考：
- `SETUP_GUIDE.md` - 完整設定指南
- `GITHUB_SETUP.md` - GitHub 詳細設定
- `IMPROVEMENTS.md` - 功能改進說明

---

**需要幫助？** 檢查瀏覽器 Console（F12）的錯誤訊息！
