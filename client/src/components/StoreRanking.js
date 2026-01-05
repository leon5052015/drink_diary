import React, { useState, useEffect } from 'react';
import './StoreRanking.css';

const API_BASE = process.env.REACT_APP_API_URL 
  ? `${process.env.REACT_APP_API_URL}/api/records`
  : '/api/records';

function StoreRanking({ period }) {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRanking();
  }, [period]);

  const loadRanking = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}?sort=amount_desc`);
      const records = await response.json();
      
      // 按店名分組統計
      const storeMap = {};
      records.forEach(record => {
        if (!storeMap[record.store_name]) {
          storeMap[record.store_name] = {
            name: record.store_name,
            count: 0,
            totalAmount: 0,
          };
        }
        storeMap[record.store_name].count++;
        storeMap[record.store_name].totalAmount += parseFloat(record.amount);
      });

      // 轉換為陣列並按金額排序
      const rankingList = Object.values(storeMap).sort((a, b) => {
        return b.totalAmount - a.totalAmount;
      });

      setRanking(rankingList.slice(0, 5)); // 只顯示前 5 名
    } catch (error) {
      console.error('載入排行榜失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <div className="store-ranking-section">
      <div className="section-header">
        <h3 className="section-title">店家排行榜</h3>
        <span className="sort-label">依金額</span>
      </div>
      
      {ranking.length === 0 ? (
        <div className="empty-box">
          <p>暫無數據</p>
        </div>
      ) : (
        <div className="ranking-list">
          {ranking.map((store, index) => (
            <div key={store.name} className="ranking-item">
              <span className="rank-number">{index + 1}</span>
              <div className="rank-content">
                <div className="rank-name">{store.name}</div>
                <div className="rank-stats">
                  <span>${store.totalAmount.toFixed(0)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StoreRanking;
