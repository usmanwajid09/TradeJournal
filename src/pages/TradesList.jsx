import React, { useState, useEffect, useCallback } from 'react';
import { Table, Badge } from 'react-bootstrap';
import { Search, Download, Calendar, Trash2, RefreshCw } from 'lucide-react';
import { getTrades, deleteTrade } from '../services/api';

const TradesList = () => {
    const [trades, setTrades]           = useState([]);
    const [searchTerm, setSearchTerm]   = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [loading, setLoading]         = useState(true);
    const [deleting, setDeleting]       = useState(null);

    const loadTrades = useCallback(async () => {
        setLoading(true);
        const data = await getTrades();
        setTrades(data);
        setLoading(false);
    }, []);

    useEffect(() => { loadTrades(); }, [loadTrades]);

    // ── Filtering ─────────────────────────────────────────────────────────────
    const filtered = trades.filter(t => {
        const matchSearch = t.symbol.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = statusFilter === 'All' || t.status === statusFilter;
        return matchSearch && matchStatus;
    });

    // ── Summary stats for filtered set ────────────────────────────────────────
    const totalPnl = filtered.reduce((s, t) => s + (t.pnl || 0), 0);
    const wins     = filtered.filter(t => t.status === 'Profit').length;

    // ── CSV Export ────────────────────────────────────────────────────────────
    const exportCSV = () => {
        const cols = ['Date', 'Symbol', 'Side', 'Timeframe', 'Strategy', 'Entry', 'Exit', 'Size', 'R:R', 'P&L', 'Status', 'Mood', 'Rating', 'Notes'];
        const rows = filtered.map(t => [
            t.date, t.symbol, t.side, t.timeframe || '', t.strategy || '',
            t.entry, t.exit || '', t.size || '',
            t.rr, t.profit, t.status, t.mood || '', t.rating || '', `"${(t.notes || '').replace(/"/g, '""')}"`
        ]);
        const csv = [cols.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url  = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href     = url;
        link.download = `trade-journal-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    // ── Delete ─────────────────────────────────────────────────────────────────
    const handleDelete = async (id) => {
        if (!window.confirm('Remove this trade from your journal?')) return;
        setDeleting(id);
        await deleteTrade(id);
        setTrades(prev => prev.filter(t => t.id !== id));
        setDeleting(null);
    };

    return (
        <div className="trades-list-content">
            {/* PAGE HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="page-title h4 fw-bold text-white mb-1">Trading Journal</h2>
                    <p className="text-secondary small mb-0">Maintain a record of your past executions and strategies.</p>
                </div>
                <div className="d-flex gap-2">
                    <button
                        id="refresh-trades-btn"
                        className="btn btn-sm text-secondary d-flex align-items-center gap-2 border-subtle px-3 py-2 fw-bold"
                        style={{ border: '1px solid var(--border-subtle)', borderRadius: '8px', background: 'transparent' }}
                        onClick={loadTrades}
                    >
                        <RefreshCw size={14} /> Refresh
                    </button>
                    <button
                        id="export-csv-btn"
                        className="btn btn-sm text-secondary d-flex align-items-center gap-2 border-subtle px-3 py-2 fw-bold"
                        style={{ border: '1px solid var(--border-subtle)', borderRadius: '8px', background: 'transparent' }}
                        onClick={exportCSV}
                        disabled={filtered.length === 0}
                    >
                        <Download size={14} /> Export CSV
                    </button>
                </div>
            </div>

            {/* SUMMARY BAR */}
            <div className="d-flex gap-4 mb-3 px-1">
                <div className="small">
                    <span className="text-secondary">Showing </span>
                    <strong className="text-white">{filtered.length}</strong>
                    <span className="text-secondary"> of {trades.length} trades</span>
                </div>
                <div className="small">
                    <span className="text-secondary">Wins: </span>
                    <strong className="text-success">{wins}</strong>
                </div>
                <div className="small">
                    <span className="text-secondary">Total P&L: </span>
                    <strong className={totalPnl >= 0 ? 'text-success' : 'text-danger'}>
                        {totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(2)}
                    </strong>
                </div>
            </div>

            <div className="section-card bg-card border border-subtle overflow-hidden" style={{ borderRadius: '16px' }}>
                {/* FILTERS TOOLBAR */}
                <div className="p-3 border-bottom border-subtle bg-deep">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                        <div className="d-flex gap-2">
                            {['All', 'Profit', 'Loss'].map(f => (
                                <Badge
                                    key={f}
                                    bg={statusFilter === f ? 'primary' : 'secondary'}
                                    className={`px-3 py-2 cursor-pointer ${statusFilter !== f ? 'opacity-50' : ''}`}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => setStatusFilter(f)}
                                >
                                    {f === 'All' ? 'All Trades' : f === 'Profit' ? 'Winners' : 'Losers'}
                                </Badge>
                            ))}
                        </div>
                        <div className="search-box position-relative d-flex align-items-center">
                            <Search size={14} className="position-absolute ms-3 text-secondary" />
                            <input
                                id="search-trades-input"
                                type="text"
                                className="form-input ps-5 py-2 small"
                                placeholder="Search by symbol..."
                                style={{ width: '240px' }}
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* TRADES TABLE */}
                {loading ? (
                    <div className="text-center py-5 text-secondary">Loading trades…</div>
                ) : (
                    <Table responsive hover className="custom-table mb-0">
                        <thead>
                            <tr>
                                <th className="text-secondary small fw-bold ps-4">DATE</th>
                                <th className="text-secondary small fw-bold">SYMBOL</th>
                                <th className="text-secondary small fw-bold">SIDE</th>
                                <th className="text-secondary small fw-bold">ENTRY</th>
                                <th className="text-secondary small fw-bold">EXIT</th>
                                <th className="text-secondary small fw-bold">R:R</th>
                                <th className="text-secondary small fw-bold">PROFIT/LOSS</th>
                                <th className="text-secondary small fw-bold">MOOD</th>
                                <th className="text-secondary small fw-bold text-end pe-4">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(trade => (
                                <tr key={trade.id} className="align-middle" style={{ opacity: deleting === trade.id ? 0.4 : 1, transition: 'opacity 0.3s' }}>
                                    <td className="ps-4">
                                        <div className="d-flex align-items-center gap-2">
                                            <Calendar size={13} className="text-secondary" />
                                            <span className="text-secondary small">{trade.date}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center gap-2">
                                            <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700 }}>
                                                {trade.symbol[0]}
                                            </div>
                                            <span className="fw-bold text-white">{trade.symbol}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`trade-side ${trade.side === 'Long' ? 'long' : 'short'}`}>
                                            {trade.side.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="text-white small">{trade.entry}</td>
                                    <td className="text-white small">{trade.exit || '—'}</td>
                                    <td className="text-secondary small">{trade.rr}</td>
                                    <td className={`fw-bold small ${trade.status === 'Profit' ? 'text-success' : 'text-danger'}`}>
                                        {trade.profit}
                                    </td>
                                    <td style={{ fontSize: '16px' }}>{trade.mood || '—'}</td>
                                    <td className="text-end pe-4">
                                        <button
                                            id={`delete-trade-${trade.id}`}
                                            className="btn btn-sm text-danger border-0 bg-transparent p-1"
                                            title="Delete trade"
                                            onClick={() => handleDelete(trade.id)}
                                            disabled={deleting === trade.id}
                                        >
                                            <Trash2 size={15}/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}

                {!loading && filtered.length === 0 && (
                    <div className="text-center py-5">
                        <p className="text-secondary">No trades match your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TradesList;
