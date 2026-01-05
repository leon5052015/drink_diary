import React, { useState, useEffect } from 'react';
import './StatsPanel.css';

const API_BASE = process.env.REACT_APP_API_URL 
  ? `${process.env.REACT_APP_API_URL}/api/records`
  : '/api/records';

function StatsPanel({ period, onPeriodChange }) {
  const [stats, setStats] = useState({
    count: 0,
    totalAmount: 0,
    topDrink: null,
    topDrinkCount: 0,
    topStore: null,
    topStoreCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [period]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/stats/summary?period=${period}`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('載入統計失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  const periodLabels = {
    week: '本週',
    month: '本月',
    all: '全部',
  };

  if (loading) {
    return (
      <div className="stats-panel">
        <p>載入中...</p>
      </div>
    );
  }

  return (
    <div className="stats-panel">
      <div className="stats-header">
        <div className="period-selector">
          {['week', 'month', 'all'].map(p => (
            <button
              key={p}
              className={`period-btn ${period === p ? 'active' : ''}`}
              onClick={() => onPeriodChange(p)}
            >
              {periodLabels[p]}
            </button>
          ))}
        </div>
      </div>

      <div className="stats-cards">
        <div className="stat-card-white">
          <div className="stat-content">
            <div className="stat-label">累積杯數</div>
            <div className="stat-value">{stats.count}</div>
          </div>
        </div>

        <div className="stat-card-white">
          <div className="stat-content">
            <div className="stat-label">總花費</div>
            <div className="stat-value">${parseFloat(stats.totalAmount || 0).toFixed(0)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsPanel;
