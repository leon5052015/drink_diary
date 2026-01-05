import React, { useState, useEffect } from 'react';
import './FilterPanel.css';

const API_BASE = process.env.REACT_APP_API_URL 
  ? `${process.env.REACT_APP_API_URL}/api/records`
  : '/api/records';

function FilterPanel({ filters, onFilterChange }) {
  const [stores, setStores] = useState([]);
  const [drinks, setDrinks] = useState([]);

  useEffect(() => {
    // 載入店名選項
    fetch(`${API_BASE}/filters/stores`)
      .then(res => res.json())
      .then(data => setStores(data))
      .catch(err => console.error('載入店名失敗:', err));

    // 載入飲料選項
    fetch(`${API_BASE}/filters/drinks`)
      .then(res => res.json())
      .then(data => setDrinks(data))
      .catch(err => console.error('載入飲料失敗:', err));
  }, []);

  const handleFilterChange = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFilterChange({ store: '', drink: '', sort: '' });
  };

  const hasActiveFilters = filters.store || filters.drink || filters.sort;

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h3>篩選與排序</h3>
        {hasActiveFilters && (
          <button className="btn-clear" onClick={clearFilters}>
            清除
          </button>
        )}
      </div>

      <div className="filter-controls">
        <div className="filter-group">
          <label htmlFor="filter-store">店名</label>
          <select
            id="filter-store"
            value={filters.store}
            onChange={(e) => handleFilterChange('store', e.target.value)}
          >
            <option value="">全部</option>
            {stores.map(store => (
              <option key={store} value={store}>{store}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filter-drink">飲料品項</label>
          <select
            id="filter-drink"
            value={filters.drink}
            onChange={(e) => handleFilterChange('drink', e.target.value)}
          >
            <option value="">全部</option>
            {drinks.map(drink => (
              <option key={drink} value={drink}>{drink}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filter-sort">排序</label>
          <select
            id="filter-sort"
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
          >
            <option value="">預設（日期）</option>
            <option value="amount_asc">金額：低到高</option>
            <option value="amount_desc">金額：高到低</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default FilterPanel;
