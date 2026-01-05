import React, { useState, useEffect } from 'react';
import './App.css';
import RecordList from './components/RecordList';
import RecordForm from './components/RecordForm';
import StatsPanel from './components/StatsPanel';
import FilterPanel from './components/FilterPanel';
import StoreRanking from './components/StoreRanking';

const API_BASE = process.env.REACT_APP_API_URL 
  ? `${process.env.REACT_APP_API_URL}/api/records`
  : '/api/records';

function App() {
  const [records, setRecords] = useState([]);
  const [editingRecord, setEditingRecord] = useState(null);
  const [filters, setFilters] = useState({ store: '', drink: '', sort: '' });
  const [statsPeriod, setStatsPeriod] = useState('month');
  const [showForm, setShowForm] = useState(false);

  // 載入記錄
  const loadRecords = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.store) params.append('store', filters.store);
      if (filters.drink) params.append('drink', filters.drink);
      if (filters.sort) params.append('sort', filters.sort);

      const response = await fetch(`${API_BASE}?${params}`);
      const data = await response.json();
      setRecords(data);
    } catch (error) {
      console.error('載入記錄失敗:', error);
    }
  };

  useEffect(() => {
    loadRecords();
  }, [filters]);

  // 新增記錄
  const handleAdd = async (recordData) => {
    try {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recordData),
      });
      if (response.ok) {
        loadRecords();
        setShowForm(false);
      }
    } catch (error) {
      console.error('新增記錄失敗:', error);
    }
  };

  // 更新記錄
  const handleUpdate = async (id, recordData) => {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recordData),
      });
      if (response.ok) {
        loadRecords();
        setEditingRecord(null);
      }
    } catch (error) {
      console.error('更新記錄失敗:', error);
    }
  };

  // 刪除記錄
  const handleDelete = async (id) => {
    if (window.confirm('確定要刪除這筆記錄嗎？')) {
      try {
        const response = await fetch(`${API_BASE}/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          loadRecords();
        }
      } catch (error) {
        console.error('刪除記錄失敗:', error);
      }
    }
  };

  // 開始編輯
  const handleEdit = (record) => {
    setEditingRecord(record);
    setShowForm(true);
  };

  // 取消編輯
  const handleCancel = () => {
    setEditingRecord(null);
    setShowForm(false);
  };

  const handleSync = () => {
    loadRecords();
    alert('已同步最新資料');
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>手搖日記</h1>
        <button className="btn-sync" onClick={handleSync}>
          同步
        </button>
      </header>

      <main className="app-main">
        <StatsPanel period={statsPeriod} onPeriodChange={setStatsPeriod} />
        
        <StoreRanking period={statsPeriod} />
        
        {/* <FilterPanel
          filters={filters}
          onFilterChange={setFilters}
        /> */}

        {showForm && (
          <RecordForm
            record={editingRecord}
            onSave={editingRecord ? (data) => handleUpdate(editingRecord.id, data) : handleAdd}
            onCancel={handleCancel}
          />
        )}

        <RecordList
          records={records}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>

      {!showForm && (
        <button className="fab" onClick={() => setShowForm(true)} aria-label="新增記錄">
          +
        </button>
      )}
    </div>
  );
}

export default App;
