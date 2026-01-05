const express = require('express');
const router = express.Router();
const db = require('../database');

// 取得所有記錄
router.get('/', (req, res) => {
  const { store, drink, sort } = req.query;
  let sql = 'SELECT * FROM records WHERE 1=1';
  const params = [];

  // 按店名篩選
  if (store) {
    sql += ' AND store_name = ?';
    params.push(store);
  }

  // 按飲料品項篩選
  if (drink) {
    sql += ' AND drink_name = ?';
    params.push(drink);
  }

  // 排序
  if (sort === 'amount_asc') {
    sql += ' ORDER BY amount ASC';
  } else if (sort === 'amount_desc') {
    sql += ' ORDER BY amount DESC';
  } else {
    sql += ' ORDER BY date DESC, created_at DESC';
  }

  db.getDb().all(sql, params, (err, rows) => {
    if (err) {
      console.error('查詢錯誤:', err);
      res.status(500).json({ error: '查詢記錄失敗' });
    } else {
      res.json(rows);
    }
  });
});

// 取得單一記錄
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.getDb().get('SELECT * FROM records WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('查詢錯誤:', err);
      res.status(500).json({ error: '查詢記錄失敗' });
    } else if (!row) {
      res.status(404).json({ error: '記錄不存在' });
    } else {
      res.json(row);
    }
  });
});

// 新增記錄
router.post('/', (req, res) => {
  const { store_name, drink_name, amount, date } = req.body;

  if (!store_name || !drink_name || !amount || !date) {
    return res.status(400).json({ error: '請填寫所有必填欄位' });
  }

  const sql = `
    INSERT INTO records (store_name, drink_name, amount, date, updated_at)
    VALUES (?, ?, ?, ?, datetime('now'))
  `;

  db.getDb().run(sql, [store_name, drink_name, amount, date], function(err) {
    if (err) {
      console.error('新增錯誤:', err);
      res.status(500).json({ error: '新增記錄失敗' });
    } else {
      res.status(201).json({ id: this.lastID, ...req.body });
    }
  });
});

// 更新記錄
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { store_name, drink_name, amount, date } = req.body;

  if (!store_name || !drink_name || !amount || !date) {
    return res.status(400).json({ error: '請填寫所有必填欄位' });
  }

  const sql = `
    UPDATE records 
    SET store_name = ?, drink_name = ?, amount = ?, date = ?, updated_at = datetime('now')
    WHERE id = ?
  `;

  db.getDb().run(sql, [store_name, drink_name, amount, date, id], function(err) {
    if (err) {
      console.error('更新錯誤:', err);
      res.status(500).json({ error: '更新記錄失敗' });
    } else if (this.changes === 0) {
      res.status(404).json({ error: '記錄不存在' });
    } else {
      res.json({ id, ...req.body });
    }
  });
});

// 刪除記錄
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.getDb().run('DELETE FROM records WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('刪除錯誤:', err);
      res.status(500).json({ error: '刪除記錄失敗' });
    } else if (this.changes === 0) {
      res.status(404).json({ error: '記錄不存在' });
    } else {
      res.json({ message: '記錄已刪除' });
    }
  });
});

// 取得分類選項
router.get('/filters/stores', (req, res) => {
  db.getDb().all(
    'SELECT DISTINCT store_name FROM records ORDER BY store_name',
    [],
    (err, rows) => {
      if (err) {
        console.error('查詢錯誤:', err);
        res.status(500).json({ error: '查詢失敗' });
      } else {
        res.json(rows.map(row => row.store_name));
      }
    }
  );
});

router.get('/filters/drinks', (req, res) => {
  db.getDb().all(
    'SELECT DISTINCT drink_name FROM records ORDER BY drink_name',
    [],
    (err, rows) => {
      if (err) {
        console.error('查詢錯誤:', err);
        res.status(500).json({ error: '查詢失敗' });
      } else {
        res.json(rows.map(row => row.drink_name));
      }
    }
  );
});

// 取得統計資料
router.get('/stats/summary', (req, res) => {
  const { period } = req.query; // week, month, year, all
  let dateFilter = '';

  const now = new Date();
  if (period === 'week') {
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    dateFilter = `WHERE date >= '${weekAgo.toISOString().split('T')[0]}'`;
  } else if (period === 'month') {
    const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1);
    dateFilter = `WHERE date >= '${monthAgo.toISOString().split('T')[0]}'`;
  } else if (period === 'year') {
    const yearAgo = new Date(now.getFullYear(), 0, 1);
    dateFilter = `WHERE date >= '${yearAgo.toISOString().split('T')[0]}'`;
  }

  const queries = {
    total: `SELECT COUNT(*) as count, SUM(amount) as total FROM records ${dateFilter}`,
    topDrink: `SELECT drink_name, COUNT(*) as count FROM records ${dateFilter} GROUP BY drink_name ORDER BY count DESC LIMIT 1`,
    topStore: `SELECT store_name, COUNT(*) as count FROM records ${dateFilter} GROUP BY store_name ORDER BY count DESC LIMIT 1`
  };

  db.getDb().get(queries.total, [], (err, totalRow) => {
    if (err) {
      console.error('統計查詢錯誤:', err);
      return res.status(500).json({ error: '統計查詢失敗' });
    }

    db.getDb().get(queries.topDrink, [], (err, topDrinkRow) => {
      if (err) {
        console.error('統計查詢錯誤:', err);
        return res.status(500).json({ error: '統計查詢失敗' });
      }

      db.getDb().get(queries.topStore, [], (err, topStoreRow) => {
        if (err) {
          console.error('統計查詢錯誤:', err);
          return res.status(500).json({ error: '統計查詢失敗' });
        }

        res.json({
          count: totalRow.count || 0,
          totalAmount: totalRow.total || 0,
          topDrink: topDrinkRow ? topDrinkRow.drink_name : null,
          topDrinkCount: topDrinkRow ? topDrinkRow.count : 0,
          topStore: topStoreRow ? topStoreRow.store_name : null,
          topStoreCount: topStoreRow ? topStoreRow.count : 0
        });
      });
    });
  });
});

module.exports = router;
