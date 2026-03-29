import React, { useState, useEffect } from 'react';
import { getTrades, getStats } from '../services/api';
import EquityCurve from '../components/charts/EquityCurve';
import MetricCard from '../components/dashboard/MetricCard';
import './Dashboard.css';

const Dashboard = () => {
  const [trades, setTrades] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tradesData, statsData] = await Promise.all([getTrades(), getStats()]);
        setTrades(tradesData);
        setStats(statsData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading-state">Loading dashboard...</div>;

  const recentTrades = trades.slice(0, 8);

  return (
    <div className="dashboard-grid">
      {/* Left Column (65%) */}
      <div className="dashboard-left">
        <EquityCurve trades={trades} />

        <div className="metric-strip">
          <MetricCard label="Win Rate" value={`${stats?.winRate}%`} delta="2.4%" isPositive={true} />
          <MetricCard label="Avg RR" value={stats?.avgRR} delta="0.2" isPositive={true} />
          <MetricCard label="Drawdown" value={`$${stats?.maxDD}`} delta="15%" isPositive={false} />
          <MetricCard label="Total Trades" value={stats?.totalTrades} />
        </div>

        <div className="recent-trades card">
          <div className="card-header">
            <h3 className="text-md">Recent Activity</h3>
            <button className="text-xs text-blue">View all →</button>
          </div>
          <table className="mini-table">
            <thead>
              <tr>
                <th className="text-left">Pair</th>
                <th className="text-left">Session</th>
                <th className="text-left">Tag</th>
                <th className="text-right">Result</th>
              </tr>
            </thead>
            <tbody>
              {recentTrades.map((t) => (
                <tr key={t.id} className="table-row">
                  <td className="text-sm font-semibold">{t.pair}</td>
                  <td>
                    <span className={`session-pill ${t.session.toLowerCase()}`}>
                      {t.session}
                    </span>
                  </td>
                  <td>
                    {t.tags.map((tag, i) => (
                      <span key={i} className={`badge badge-${tag.toLowerCase()} mr-1`}>{tag}</span>
                    ))}
                  </td>
                  <td className={`text-right text-sm font-medium ${t.result >= 0 ? 'text-green' : 'text-red'}`}>
                    {t.result >= 0 ? '+' : ''}${t.result.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Column (35%) */}
      <div className="dashboard-right">
        <div className="performance-card card">
          <h3 className="text-md mb-4">Session Performance</h3>
          <div className="session-stats-container">
            {['London', 'NY', 'Asian'].map((sess) => {
              const sessTrades = trades.filter(t => t.session === sess);
              const pnl = sessTrades.reduce((sum, t) => sum + t.result, 0);
              const wr = sessTrades.length > 0 ? (sessTrades.filter(t => t.result > 0).length / sessTrades.length) * 100 : 0;
              
              return (
                <div key={sess} className="session-stat-row">
                  <div className="stat-info">
                    <span className="text-sm">{sess}</span>
                    <span className={`text-xs ${pnl >= 0 ? 'text-green' : 'text-red'}`}>
                      {pnl >= 0 ? '+' : ''}${pnl}
                    </span>
                  </div>
                  <div className="stat-bar-bg">
                    <div 
                      className={`stat-bar-fill ${sess.toLowerCase()}`} 
                      style={{ width: `${wr}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="risk-card card mt-4">
          <h3 className="text-md mb-2">Risk Exposure</h3>
          <div className="risk-meter-container">
            <div className="risk-header">
              <span className="text-xs text-tertiary">Daily Risk Limit</span>
              <span className="text-xs font-medium">$500 / $2,000</span>
            </div>
            <div className="risk-track">
              <div className="risk-fill" style={{ width: '25%' }}></div>
            </div>
            <p className="text-xs text-tertiary mt-2">
              You are currently within safe parameters. Liquidation buffer is $15,420.
            </p>
          </div>
        </div>

        <div className="heatmap-card card mt-4">
          <h3 className="text-md mb-2">Best Hours</h3>
          <div className="heatmap-grid">
            {Array.from({ length: 28 }).map((_, i) => (
              <div key={i} className={`heatmap-cell ${i % 7 === 0 ? 'active' : ''}`}></div>
            ))}
          </div>
          <div className="heatmap-labels">
            <span className="text-xs text-tertiary">07:00</span>
            <span className="text-xs text-tertiary">20:00</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
