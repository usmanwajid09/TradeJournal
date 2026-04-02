import React, { useState, useEffect, useMemo } from 'react';
import { getTrades } from '../services/api';
import './ChartGallery.css';

const ChartGallery = () => {
  const [trades, setTrades] = useState([]);
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTrades().then(data => {
      setTrades(data);
      setLoading(false);
    });
  }, []);

  const tradesWithCharts = useMemo(() => {
    // For demo, we'll show all trades but use placeholders if no screenshot
    return trades;
  }, [trades]);

  if (loading) return <div className="loading-state">Loading gallery...</div>;

  return (
    <div className="gallery-container">
      <div className="gallery-header">
        <h2 className="text-xl">Chart Gallery</h2>
        <div className="filter-chips">
          <button className="chip active">All</button>
          <button className="chip">Wins</button>
          <button className="chip">Losses</button>
          <button className="chip">XAUUSD</button>
          <button className="chip">EURUSD</button>
        </div>
      </div>

      <div className="masonry-grid">
        {tradesWithCharts.map((t) => (
          <div key={t.id} className="gallery-card card" onClick={() => setSelectedTrade(t)}>
            <div className="image-placeholder">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-20">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              <div className="overlay-info">
                <span className="text-white font-bold">{t.pair}</span>
                <span className={`text-xs ${t.result >= 0 ? 'text-green' : 'text-red'}`}>
                  {t.result >= 0 ? '+' : ''}${t.result}
                </span>
              </div>
            </div>
            <div className="card-footer">
               <div className="footer-left">
                 <span className={`session-pill tiny ${t.session.toLowerCase()}`}>{t.session}</span>
                 <span className="text-xs text-tertiary ml-2">{new Date(t.date).toLocaleDateString()}</span>
               </div>
               <div className="footer-right">
                 {t.rr} RR
               </div>
            </div>
          </div>
        ))}
      </div>

      {selectedTrade && (
        <div className="lightbox-overlay" onClick={() => setSelectedTrade(null)}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <div className="lightbox-main">
              <div className="image-full-placeholder">
                <span className="text-tertiary">Chart Screenshot: {selectedTrade.pair}</span>
              </div>
            </div>
            <div className="lightbox-sidebar">
              <div className="sidebar-header">
                 <h3 className="text-md">{selectedTrade.pair} - {selectedTrade.direction}</h3>
                 <button className="close-btn" onClick={() => setSelectedTrade(null)}>&times;</button>
              </div>
              <div className="sidebar-details">
                <section>
                  <label className="text-xs text-tertiary uppercase ls-caps">Trade Info</label>
                  <div className="detail-row">
                    <span>Entry</span>
                    <span>{selectedTrade.entry}</span>
                  </div>
                  <div className="detail-row">
                    <span>Result</span>
                    <span className={selectedTrade.result >= 0 ? 'text-green' : 'text-red'}>
                      ${selectedTrade.result}
                    </span>
                  </div>
                </section>
                
                <section className="mt-6">
                  <label className="text-xs text-tertiary uppercase ls-caps">Market Structure</label>
                  <div className="tag-list mt-2">
                    {selectedTrade.tags.map(tag => (
                      <span key={tag} className={`badge badge-${tag.toLowerCase()}`}>{tag}</span>
                    ))}
                  </div>
                </section>

                <section className="mt-6">
                  <label className="text-xs text-tertiary uppercase ls-caps">Notes</label>
                  <p className="text-sm text-secondary mt-2">
                    {selectedTrade.notes || "No notes for this trade."}
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartGallery;
