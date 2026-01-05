import React from 'react';
import './RecordList.css';

function RecordList({ records, onEdit, onDelete }) {
  return (
    <div className="recent-records-section">
      <h3 className="section-title">近期紀錄</h3>
      {records.length === 0 ? (
        <div className="empty-box">
          <p>暫無數據</p>
          <p className="empty-hint">點擊右下角 + 開始記錄</p>
        </div>
      ) : (
        <div className="record-list">
          {records.map(record => (
            <div key={record.id} className="record-card">
              <div className="record-header">
                <h3 className="record-store">{record.store_name}</h3>
                <div className="record-actions">
                  <button
                    className="btn-edit"
                    onClick={() => onEdit(record)}
                    aria-label="編輯"
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => onDelete(record.id)}
                    aria-label="刪除"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <div className="record-body">
                <div className="record-item">
                  <span className="record-label">飲料：</span>
                  <span className="record-value">{record.drink_name}</span>
                </div>
                <div className="record-item">
                  <span className="record-label">金額：</span>
                  <span className="record-amount">${parseFloat(record.amount).toFixed(0)}</span>
                </div>
                <div className="record-item">
                  <span className="record-label">日期：</span>
                  <span className="record-value">{record.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecordList;
