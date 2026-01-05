# 手搖飲料記錄應用

一個跨裝置的手搖飲料記錄應用，支援在不同裝置之間同步記錄。

## 功能特色

- 📱 響應式設計，手機優先
- 🔄 跨裝置資料同步
- 📝 記錄店名、飲料品項、金額、日期
- ✏️ 編輯和刪除記錄
- 🏷️ 按店名、飲料品項分類
- 📊 按金額排序
- 📈 統計功能（本周/本月/本年/總計）

## 安裝步驟

1. 安裝所有依賴：
```bash
npm run install-all
```

2. 啟動開發伺服器（同時啟動前端和後端）：
```bash
npm run dev
```

3. 或分別啟動：
```bash
# 後端
npm run server

# 前端（新終端）
npm run client
```

## 技術棧

- **前端**: React, CSS3 (響應式設計)
- **後端**: Node.js, Express
- **資料庫**: SQLite

## API 端點

- `GET /api/records` - 取得所有記錄
- `POST /api/records` - 新增記錄
- `PUT /api/records/:id` - 更新記錄
- `DELETE /api/records/:id` - 刪除記錄
- `GET /api/records/stats` - 取得統計資料
