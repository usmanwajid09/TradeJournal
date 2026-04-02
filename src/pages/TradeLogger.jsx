import React, { useState, useEffect, useMemo } from 'react';
import { getTrades, addTrade } from '../services/api';
import AddTradeModal from '../components/modals/AddTradeModal';
import './TradeLogger.css';

const TradeLogger = () => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    session: [],
    pair: '',
    result: 'All'
  });

  useEffect(() => {
    fetchTrades();
  }, []);

  const fetchTrades = async () => {
    const data = await getTrades();
    setTrades(data);
    setLoading(false);
  };

  const handleAddTrade = async (newTrade) => {
    await addTrade(newTrade);
    fetchTrades();
  };

  const filteredTrades = useMemo(() => {
    return trades.filter(t => {
      const matchSession = filters.session.length === 0 || filters.session.includes(t.session);
      const matchPair = !filters.pair || t.pair.toLowerCase().includes(filters.pair.toLowerCase());
      const matchResult = filters.result === 'All' || 
                         (filters.result === 'Win' && t.result > 0) || 
                         (filters.result === 'Loss' && t.result <= 0);
      return matchSession && matchPair && matchResult;
    });
  }, [trades, filters]);

  const toggleSessionFilter = (session) => {
    setFilters(prev => ({
      ...prev,
      session: prev.session.includes(session) 
        ? prev.session.filter(s => s !== session) 
        : [...prev.session, session]
    }));
  };

  if (loading) return <div className="loading-state">Loading trades...</div>;

  return (
    <div className="trade-logger-container">
      <div className="logger-main">
        <div className="logger-header">
          <div className="header-left">
            <h2 className="text-xl">Trading Journal</h2>
            <span className="text-sm text-tertiary">{filteredTrades.length} trades found</span>
          </div>
          <div className="header-actions">
            <button className="button-ghost">Export CSV</button>
            <button className="button-primary" onClick={() => setIsModalOpen(true)}>+ Add Trade</button>
          </div>
        </div>

        <div className="table-container card">
          <table className="trade-table">
            <thead>
              <tr>
                <th className="text-left w-10">#</th>
                <th className="text-left">Date</th>
                <th className="text-left">Pair</th>
                <th className="text-left">Sess</th>
                <th className="text-left">Dir</th>
                <th className="text-left">Tags</th>
                <th className="text-right">Entry</th>
                <th className="text-right">RR</th>
                <th className="text-right">Result</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrades.map((t, i) => (
                <tr key={t.id} className="table-row">
                  <td className="text-xs text-tertiary">#{trades.length - i}</td>
                  <td className="text-sm">{new Date(t.date).toLocaleDateString()}</td>
                  <td className="text-sm font-bold">{t.pair}</td>
                  <td>
                    <span className={`session-pill ${t.session.toLowerCase()}`}>{t.session}</span>
                  </td>
                  <td>
                    <span className={t.direction === 'Long' ? 'text-green' : 'text-red'}>
                      {t.direction === 'Long' ? '↑' : '↓'}
                    </span>
                  </td>
                  <td>
                    <div className="tag-list">
                      {t.tags.map((tag, idx) => (
                        <span key={idx} className={`badge badge-${tag.toLowerCase()}`}>{tag}</span>
                      ))}
                    </div>
                  </td>
                  <td className="text-right text-sm">{t.entry.toLocaleString()}</td>
                  <td className="text-right text-sm font-semibold">{t.rr}</td>
                  <td className={`text-right text-sm font-bold ${t.result >= 0 ? 'text-green' : 'text-red'}`}>
                    {t.result >= 0 ? '+' : ''}${t.result.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTrades.length === 0 && (
            <div className="empty-state">
              <span className="text-sm text-tertiary">No trades found matching your filters.</span>
            </div>
          )}
        </div>
      </div>

      <aside className="logger-sidebar">
        <div className="filter-panel card">
          <h3 className="text-md mb-4 border-b border-default pb-2">Filters</h3>
          
          <div className="filter-group">
            <label className="text-xs text-tertiary uppercase ls-caps mb-2">Search Pair</label>
            <input 
              type="text" className="input" placeholder="e.g. XAUUSD"
              value={filters.pair} onChange={e => setFilters({...filters, pair: e.target.value})}
            />
          </div>

          <div className="filter-group mt-6">
            <label className="text-xs text-tertiary uppercase ls-caps mb-2">Session</label>
            <div className="checkbox-group">
              {['London', 'NY', 'Asian'].map(s => (
                <label key={s} className="checkbox-row">
                  <input 
                    type="checkbox" checked={filters.session.includes(s)}
                    onChange={() => toggleSessionFilter(s)}
                  />
                  <span className="text-sm">{s}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-group mt-6">
            <label className="text-xs text-tertiary uppercase ls-caps mb-2">Outcome</label>
            <div className="radio-group">
              {['All', 'Win', 'Loss'].map(r => (
                <label key={r} className="radio-row">
                  <input 
                    type="radio" name="result" checked={filters.result === r}
                    onChange={() => setFilters({...filters, result: r})}
                  />
                  <span className="text-sm">{r}</span>
                </label>
              ))}
            </div>
          </div>

          <button 
            className="button-ghost w-full mt-8"
            onClick={() => setFilters({ session: [], pair: '', result: 'All' })}
          >Clear Filters</button>
        </div>
      </aside>

      <AddTradeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddTrade} 
      />
    </div>
  );
};

export default TradeLogger;
