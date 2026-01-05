const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'drink_records.db');

let db = null;

const init = () => {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('資料庫連接錯誤:', err);
        reject(err);
      } else {
        console.log('已連接到 SQLite 資料庫');
        createTable().then(resolve).catch(reject);
      }
    });
  });
};

const createTable = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      CREATE TABLE IF NOT EXISTS records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        store_name TEXT NOT NULL,
        drink_name TEXT NOT NULL,
        amount REAL NOT NULL,
        date TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    db.run(sql, (err) => {
      if (err) {
        console.error('建立資料表錯誤:', err);
        reject(err);
      } else {
        console.log('資料表已準備就緒');
        resolve();
      }
    });
  });
};

const getDb = () => {
  if (!db) {
    throw new Error('資料庫尚未初始化');
  }
  return db;
};

const close = () => {
  return new Promise((resolve, reject) => {
    if (db) {
      db.close((err) => {
        if (err) {
          reject(err);
        } else {
          console.log('資料庫連接已關閉');
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
};

module.exports = {
  init,
  getDb,
  close
};
