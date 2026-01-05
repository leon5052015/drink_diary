const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');
const recordsRouter = require('./routes/records');

const app = express();
const PORT = process.env.PORT || 5000;

// 中間件
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 初始化資料庫
db.init().catch(err => {
  console.error('資料庫初始化失敗:', err);
});

// 路由
app.use('/api/records', recordsRouter);

// 健康檢查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`伺服器運行在 http://0.0.0.0:${PORT}`);
});
