import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Download, Calendar, Trash2, Edit2, RefreshCw, TrendingUp, TrendingDown, BarChart2 } from 'lucide-react';
import { getTrades, deleteTrade } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';

const TradesList = () => {
    const navigate = useNavigate();
    const [trades, setTrades]             = useState([]);
    const [searchTerm, setSearchTerm]     = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [loading, setLoading]           = useState(true);
    const [deleting, setDeleting]         = useState(null);
    const rowsRef = useRef([]);

    const loadTrades = useCallback(async () => {
        setLoading(true);
        const data = await getTrades();
        setTrades(data);
        setLoading(false);
    }, []);

    useEffect(() => { loadTrades(); }, [loadTrades]);

    // Animate rows in after load
    useEffect(() => {
        if (!loading && rowsRef.current.length) {
            gsap.fromTo(
                rowsRef.current.filter(Boolean),
                { opacity: 0, x: -12 },
                { opacity: 1, x: 0, stagger: 0.05, duration: 0.35, ease: 'power2.out' }
            );
        }
    }, [loading, statusFilter, searchTerm]);

    // ── Filter ────────────────────────────────────────────────────────────────
    const filtered = trades.filter(t => {
        const matchS = t.symbol.toLowerCase().includes(searchTerm.toLowerCase());
        const matchF = statusFilter === 'All' || t.status === statusFilter;
        return matchS && matchF;
    });

    const totalPnl   = filtered.reduce((s, t) => s + (t.pnl || 0), 0);
    const wins       = filtered.filter(t => t.status === 'Profit').length;
    const losses     = filtered.length - wins;
    const winRate    = filtered.length ? ((wins / filtered.length) * 100).toFixed(0) : 0;

    // ── CSV Export ─────────────────────────────────────────────────────────────
    const exportCSV = () => {
        const cols = ['Date','Symbol','Side','Timeframe','Strategy','Entry','Exit','Size','R:R','P&L','Status','Mood','Rating','Notes'];
        const rows = filtered.map(t => [
            t.date, t.symbol, t.side, t.timeframe||'', t.strategy||'',
            t.entry, t.exit||'', t.size||'', t.rr, t.profit, t.status, t.mood||'', t.rating||'',
            `"${(t.notes||'').replace(/"/g,'""')}"`
        ]);
        const csv  = [cols.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href = url; a.download = `trade-journal-${new Date().toISOString().split('T')[0]}.csv`;
        a.click(); URL.revokeObjectURL(url);
    };

    // ── Delete ────────────────────────────────────────────────────────────────
    const handleDelete = async (id) => {
        if (!window.confirm('Remove this trade from your journal?')) return;
        setDeleting(id);
        await deleteTrade(id);
        setTrades(prev => prev.filter(t => t.id !== id));
        setDeleting(null);
    };

    const FILTERS = [
        { key: 'All',    label: 'All Trades' },
        { key: 'Profit', label: '✅ Winners' },
        { key: 'Loss',   label: '❌ Losers'  },
    ];

    return (
        <div className="trades-list-content animate-fade-up">
            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="page-title h4 fw-bold text-white mb-1">Trading Journal</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: 0 }}>
                        Record, review and learn from every execution.
                    </p>
                </div>
                <div className="d-flex gap-2">
                    <button id="refresh-trades-btn"
                        onClick={loadTrades}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'transparent', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(79,124,255,0.4)'; e.currentTarget.style.color = 'var(--accent-blue)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                    >
                        <RefreshCw size={13} /> Refresh
                    </button>
                    <button id="export-csv-btn"
                        onClick={exportCSV}
                        disabled={!filtered.length}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'transparent', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600, cursor: filtered.length ? 'pointer' : 'default', opacity: filtered.length ? 1 : 0.4, transition: 'all 0.15s' }}
                        onMouseEnter={e => filtered.length && (e.currentTarget.style.borderColor = 'rgba(0,230,118,0.3)', e.currentTarget.style.color = 'var(--color-positive)')}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-subtle)', e.currentTarget.style.color = 'var(--text-secondary)')}
                    >
                        <Download size={13} /> Export CSV
                    </button>
                </div>
            </div>

            {/* STATS STRIP */}
            <div className="d-flex gap-3 mb-4 flex-wrap">
                {[
                    { Icon: BarChart2, label: 'Trades', value: `${filtered.length} / ${trades.length}`, color: 'var(--text-primary)' },
                    { Icon: TrendingUp, label: 'Wins', value: wins, color: 'var(--color-positive)' },
                    { Icon: TrendingDown, label: 'Losses', value: losses, color: 'var(--color-negative)' },
                    { Icon: null, label: 'Win Rate', value: `${winRate}%`, color: parseInt(winRate) >= 50 ? 'var(--color-positive)' : 'var(--color-negative)' },
                    { Icon: null, label: 'Total P&L', value: `${totalPnl >= 0 ? '+' : ''}$${totalPnl.toFixed(2)}`, color: totalPnl >= 0 ? 'var(--color-positive)' : 'var(--color-negative)' },
                ].map(({ Icon, label, value, color }, i) => (
                    <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {Icon && <Icon size={14} style={{ color: 'var(--text-secondary)' }}/>}
                        <div>
                            <div style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
                            <div style={{ fontSize: '15px', fontWeight: 700, color, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* MAIN TABLE CARD */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', overflow: 'hidden' }}>
                {/* TOOLBAR */}
                <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-deep)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div className="d-flex gap-2">
                        {FILTERS.map(f => (
                            <button key={f.key} onClick={() => setStatusFilter(f.key)}
                                style={{
                                    padding: '6px 14px', borderRadius: '8px', border: 'none', fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                                    background: statusFilter === f.key ? 'var(--gradient-primary)' : 'rgba(255,255,255,0.04)',
                                    color: statusFilter === f.key ? '#fff' : 'var(--text-secondary)',
                                    boxShadow: statusFilter === f.key ? '0 2px 12px rgba(79,124,255,0.25)' : 'none',
                                }}
                            >{f.label}</button>
                        ))}
                    </div>
                    <div className="position-relative d-flex align-items-center">
                        <Search size={13} className="position-absolute ms-3" style={{ color: 'var(--text-muted)' }} />
                        <input id="search-trades-input" type="text" className="form-input ps-5 py-2 small"
                            placeholder="Search symbol…" style={{ width: '220px' }}
                            value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    </div>
                </div>

                {/* TABLE */}
                {loading ? (
                    <div className="text-center py-5" style={{ color: 'var(--text-secondary)' }}>
                        <div style={{ fontSize: '24px', marginBottom: '12px', animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</div>
                        <div>Loading trades…</div>
                    </div>
                ) : (
                    <table className="custom-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                {['DATE', 'SYMBOL', 'SIDE', 'ENTRY', 'EXIT', 'R:R', 'P&L', 'MOOD', ''].map((col, i) => (
                                    <th key={i} style={{ padding: '12px 16px', textAlign: i === 8 ? 'right' : 'left', paddingLeft: i === 0 ? '20px' : undefined, paddingRight: i === 8 ? '20px' : undefined }}>
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((trade, idx) => (
                                <tr key={trade.id} ref={el => rowsRef.current[idx] = el}
                                    style={{ opacity: deleting === trade.id ? 0.3 : 1, transition: 'opacity 0.3s' }}>
                                    <td style={{ paddingLeft: '20px' }}>
                                        <div className="d-flex align-items-center gap-2">
                                            <Calendar size={12} style={{ color: 'var(--text-muted)' }} />
                                            <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{trade.date}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center gap-2">
                                            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'var(--accent-blue-dim)', border: '1px solid rgba(79,124,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: 'var(--accent-blue)' }}>
                                                {trade.symbol[0]}
                                            </div>
                                            <span style={{ fontWeight: 700 }}>{trade.symbol}</span>
                                        </div>
                                    </td>
                                    <td><span className={`trade-side ${trade.side === 'Long' ? 'long' : 'short'}`}>{trade.side.toUpperCase()}</span></td>
                                    <td style={{ fontSize: '12px' }}>{trade.entry}</td>
                                    <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{trade.exit || '—'}</td>
                                    <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{trade.rr}</td>
                                    <td style={{ fontWeight: 700, fontSize: '13px', color: trade.status === 'Profit' ? 'var(--color-positive)' : 'var(--color-negative)' }}>
                                        {trade.profit}
                                    </td>
                                    <td style={{ fontSize: '18px' }}>{trade.mood || '—'}</td>
                                    <td style={{ textAlign: 'right', paddingRight: '20px' }}>
                                        <div className="d-flex justify-content-end gap-1">
                                            <button id={`edit-trade-${trade.id}`} onClick={() => navigate(`/edit-trade/${trade.id}`)}
                                                style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px', borderRadius: '6px', transition: 'all 0.15s' }}
                                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(79,124,255,0.1)'; e.currentTarget.style.color = 'var(--accent-blue)'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                                            ><Edit2 size={14}/></button>
                                            <button id={`delete-trade-${trade.id}`} onClick={() => handleDelete(trade.id)} disabled={deleting === trade.id}
                                                style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px', borderRadius: '6px', transition: 'all 0.15s' }}
                                                onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-negative-dim)'; e.currentTarget.style.color = 'var(--color-negative)'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                                            ><Trash2 size={14}/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {!loading && !filtered.length && (
                    <div className="text-center py-5">
                        <div style={{ fontSize: '32px', marginBottom: '12px' }}>📭</div>
                        <div style={{ color: 'var(--text-secondary)' }}>No trades match your criteria.</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TradesList;
