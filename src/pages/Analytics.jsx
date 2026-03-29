import React, { useState, useEffect, useMemo } from 'react';
import { getTrades } from '../services/api';
import './Analytics.css';

const Analytics = () => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTrades().then(data => {
      setTrades(data);
      setLoading(false);
    });
  }, []);

  const stats = useMemo(() => {
    if (trades.length === 0) return null;
    
    // Win Rate by Pair
    const pairs = [...new Set(trades.map(t => t.pair))];
    const pairStats = pairs.map(p => {
      const pTrades = trades.filter(t => t.pair === p);
      const wins = pTrades.filter(t => t.result > 0).length;
      return { pair: p, wr: (wins / pTrades.length) * 100, count: pTrades.length };
    }).sort((a, b) => b.wr - a.wr);

    // RR Distribution
    const rrBuckets = [0, 1, 2, 3, 4, 5];
    const rrDist = rrBuckets.map(b => {
      const count = trades.filter(t => t.rr >= b && t.rr < b + 1).length;
      return { label: `${b}-${b+1}`, count };
    });

    return { pairStats, rrDist };
  }, [trades]);

  if (loading) return <div className="loading-state">Loading analytics...</div>;

  return (
    <div className="analytics-container">
      <div className="analytics-grid">
        {/* Session PnL Breakdown */}
        <div className="analytics-card card">
          <h3 className="text-md mb-6">PnL by Session</h3>
          <div className="bar-chart-container">
            {['Asian', 'London', 'NY'].map(sess => {
              const sessTrades = trades.filter(t => t.session === sess);
              const pnl = sessTrades.reduce((sum, t) => sum + t.result, 0);
              const maxPnL = 10000; // Normalized for demo
              const height = (Math.abs(pnl) / maxPnL) * 100;

              return (
                <div key={sess} className="bar-column">
                  <div className="bar-value text-xs text-tertiary">${pnl.toLocaleString()}</div>
                  <div className="bar-track">
                    <div 
                      className={`bar-fill ${sess.toLowerCase()} ${pnl < 0 ? 'negative' : ''}`} 
                      style={{ height: `${height}%` }}
                    ></div>
                  </div>
                  <div className="bar-label text-sm">{sess}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Win Rate by Pair */}
        <div className="analytics-card card">
          <h3 className="text-md mb-6">Win Rate by Pair</h3>
          <div className="horizontal-bar-list">
            {stats?.pairStats.slice(0, 5).map((p, i) => (
              <div key={p.pair} className="h-bar-row">
                <div className="h-bar-info">
                  <span className="text-sm font-bold">{p.pair}</span>
                  <span className="text-xs text-tertiary">{p.count} trades</span>
                </div>
                <div className="h-bar-track">
                  <div 
                    className="h-bar-fill" 
                    style={{ width: `${p.wr}%`, animationDelay: `${i * 0.1}s` }}
                  ></div>
                  <span className="h-bar-value text-xs">{p.wr.toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RR Distribution */}
        <div className="analytics-card card">
          <h3 className="text-md mb-6">Risk/Reward Distribution</h3>
          <div className="distribution-chart">
            {stats?.rrDist.map((d, i) => {
              const maxHeight = Math.max(...stats.rrDist.map(rd => rd.count));
              const height = (d.count / maxHeight) * 100;
              return (
                <div key={i} className="dist-column">
                   <div className="dist-bar-wrap">
                     <div className="dist-bar" style={{ height: `${height}%` }}></div>
                   </div>
                   <div className="dist-label text-xs text-tertiary">{d.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* System Heatmap Metrics */}
        <div className="analytics-card card">
          <h3 className="text-md mb-6">Tag Performance</h3>
          <div className="tag-stats-list">
            {["BoS", "CHoCH", "FVG", "Liquidity"].map(tag => {
              const tagTrades = trades.filter(t => t.tags.includes(tag));
              const pnl = tagTrades.reduce((sum, t) => sum + t.result, 0);
              const wr = tagTrades.length > 0 ? (tagTrades.filter(t => t.result > 0).length / tagTrades.length) * 100 : 0;
              
              return (
                <div key={tag} className="tag-stat-row">
                  <span className={`badge badge-${tag.toLowerCase()}`}>{tag}</span>
                  <span className="text-sm">{tagTrades.length} Trades</span>
                  <span className="text-sm font-bold">{wr.toFixed(0)}% WR</span>
                  <span className={`text-sm font-bold ${pnl >= 0 ? 'text-green' : 'text-red'}`}>
                    {pnl >= 0 ? '+' : ''}${pnl}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
