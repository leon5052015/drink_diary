import React, { useState, useEffect } from 'react';
import './RecordForm.css';

function RecordForm({ record, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    store_name: '',
    drink_name: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (record) {
      setFormData({
        store_name: record.store_name || '',
        drink_name: record.drink_name || '',
        amount: record.amount || '',
        date: record.date || new Date().toISOString().split('T')[0],
      });
    }
  }, [record]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.store_name || !formData.drink_name || !formData.amount || !formData.date) {
      alert('請填寫所有欄位');
      return;
    }
    onSave({
      ...formData,
      amount: parseFloat(formData.amount),
    });
  };

  return (
    <div className="form-container">
      <form className="record-form" onSubmit={handleSubmit}>
        <h2>{record ? '編輯記錄' : '新增記錄'}</h2>
        
        <div className="form-group">
          <label htmlFor="store_name">店名 *</label>
          <input
            type="text"
            id="store_name"
            name="store_name"
            value={formData.store_name}
            onChange={handleChange}
            placeholder="例如：50嵐、清心福全"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="drink_name">飲料品項 *</label>
          <input
            type="text"
            id="drink_name"
            name="drink_name"
            value={formData.drink_name}
            onChange={handleChange}
            placeholder="例如：珍珠奶茶、四季春"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount">金額 *</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="例如：50"
            min="0"
            step="1"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">日期 *</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={onCancel}>
            取消
          </button>
          <button type="submit" className="btn-save">
            {record ? '更新' : '儲存'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default RecordForm;
