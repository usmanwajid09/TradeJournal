import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, TrendingUp, TrendingDown, MousePointer2, Crosshair, Type, Layout, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

// Seeded pseudo-random so candlesticks don't change on re-render
function seededRand(seed) {
    let s = seed;
    return () => {
        s = (s * 1664525 + 1013904223) & 0xffffffff;
        return (s >>> 0) / 0xffffffff;
    };
}

// Pre-generate stable candlestick data once per symbol
function generateCandles(symbol) {
    const rand = seededRand(symbol.split('').reduce((a, c) => a + c.charCodeAt(0), 0));
    return Array.from({ length: 30 }, () => {
        const h = 30 + rand() * 80;
        const y = 50 + rand() * 70;
        const isUp = rand() > 0.38;
        return { h, y, isUp };
    });
}

const WATCHLIST = [
    { symbol: 'AAPL',   name: 'Apple Inc.',        basePrice: 182.42, change: '+1.24%', trend: 'up',   logo: '🍎', exchange: 'NASDAQ' },
    { symbol: 'TSLA',   name: 'Tesla, Inc.',        basePrice: 175.05, change: '-2.15%', trend: 'down', logo: '⚡', exchange: 'NASDAQ' },
    { symbol: 'BTC',    name: 'Bitcoin',            basePrice: 64215,  change: '+0.85%', trend: 'up',   logo: '₿',  exchange: 'CRYPTO' },
    { symbol: 'EURUSD', name: 'Euro / US Dollar',   basePrice: 1.0852, change: '+0.05%', trend: 'up',   logo: '🇪🇺', exchange: 'FOREX'  },
    { symbol: 'GOLD',   name: 'Gold Spot',          basePrice: 2158.4, change: '+1.10%', trend: 'up',   logo: '🌕', exchange: 'COMMOD' },
    { symbol: 'NVDA',   name: 'NVIDIA Corp.',       basePrice: 875.20, change: '+3.42%', trend: 'up',   logo: '🟢', exchange: 'NASDAQ' },
];

const QuickTradeModal = ({ symbol, onClose, navigate }) => (
    <div
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        onClick={onClose}
    >
        <div
            className="bg-card border border-subtle"
            style={{ borderRadius: '16px', padding: '32px', width: '360px', maxWidth: '90vw' }}
            onClick={e => e.stopPropagation()}
        >
            <h5 className="text-white fw-bold mb-1">Quick Trade — {symbol}</h5>
            <p className="text-secondary small mb-4">Log this trade to your journal to track P&L, notes, and strategy.</p>
            <div className="d-flex gap-3">
                <button
                    className="btn btn-primary flex-grow-1 fw-bold py-2"
                    onClick={() => { onClose(); navigate('/add-trade'); }}
                >
                    Log Trade
                </button>
                <button
                    className="btn btn-secondary flex-grow-1 py-2"
                    onClick={onClose}
                >
                    Cancel
                </button>
            </div>
        </div>
    </div>
);

const LiveTrades = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab]     = useState('All');
    const [selected, setSelected]       = useState(WATCHLIST[0]);
    const [prices, setPrices]           = useState(() =>
        Object.fromEntries(WATCHLIST.map(w => [w.symbol, w.basePrice]))
    );
    const [quickTrade, setQuickTrade]   = useState(null); // symbol or null
    const tickRef = useRef(null);

    // ── Live price simulation (±0.05% every 2s) ───────────────────────────────
    useEffect(() => {
        tickRef.current = setInterval(() => {
            setPrices(prev => {
                const next = { ...prev };
                WATCHLIST.forEach(w => {
                    const delta = 1 + (Math.random() - 0.5) * 0.001;
                    next[w.symbol] = parseFloat((prev[w.symbol] * delta).toFixed(
                        w.symbol === 'EURUSD' ? 4 : w.symbol === 'GOLD' || w.symbol === 'BTC' ? 1 : 2
                    ));
                });
                return next;
            });
        }, 2000);
        return () => clearInterval(tickRef.current);
    }, []);

    // ── Stable candles per selected symbol ────────────────────────────────────
    const candles = useMemo(() => generateCandles(selected.symbol), [selected.symbol]);

    const filteredList = WATCHLIST.filter(item =>
        item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const currentPrice = prices[selected.symbol];
    const priceStr = selected.symbol === 'EURUSD'
        ? currentPrice.toFixed(4)
        : selected.symbol === 'GOLD' || selected.symbol === 'BTC'
            ? currentPrice.toLocaleString('en-US', { minimumFractionDigits: 1 })
            : currentPrice.toFixed(2);

    return (
        <>
            {quickTrade && (
                <QuickTradeModal
                    symbol={quickTrade}
                    onClose={() => setQuickTrade(null)}
                    navigate={navigate}
                />
            )}

            <div className="panels-container" style={{ height: 'calc(100vh - 120px)', margin: '-20px' }}>
                {/* ── LEFT: WATCHLIST ─────────────────────────────────────── */}
                <div className="watchlist-panel">
                    <div className="p-3 border-bottom border-subtle">
                        <div className="search-box position-relative d-flex align-items-center mb-3">
                            <Search size={14} className="position-absolute ms-3 text-secondary" />
                            <input
                                type="text"
                                className="form-input ps-5 py-2 small"
                                placeholder="Search symbols..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="d-flex gap-2 mb-1 overflow-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                            {['All', 'Stocks', 'Crypto', 'Forex'].map(tab => (
                                <Badge
                                    key={tab}
                                    bg={activeTab === tab ? 'primary' : 'secondary'}
                                    className={`px-3 py-2 cursor-pointer ${activeTab !== tab ? 'opacity-50' : ''}`}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab}
                                </Badge>
                            ))}
                        </div>
                    </div>
                    <div className="flex-grow-1 overflow-auto">
                        {filteredList.map(item => {
                            const livePrice = prices[item.symbol];
                            const up = item.trend === 'up';
                            const isSelected = selected.symbol === item.symbol;
                            return (
                                <div
                                    key={item.symbol}
                                    className="d-flex align-items-center justify-content-between p-3 border-bottom border-subtle"
                                    style={{
                                        cursor: 'pointer',
                                        background: isSelected ? 'var(--bg-card)' : 'transparent',
                                        borderLeft: isSelected ? '3px solid var(--accent-blue)' : '3px solid transparent',
                                        transition: 'all 0.15s',
                                    }}
                                    onClick={() => setSelected(item)}
                                >
                                    <div className="d-flex align-items-center gap-3">
                                        <div style={{ fontSize: '20px' }}>{item.logo}</div>
                                        <div>
                                            <div className="fw-bold text-white small">{item.symbol}</div>
                                            <div className="text-secondary" style={{ fontSize: '10px' }}>{item.name}</div>
                                        </div>
                                    </div>
                                    <div className="text-end">
                                        <div className="fw-bold text-white small" style={{ fontVariantNumeric: 'tabular-nums' }}>
                                            {livePrice?.toLocaleString()}
                                        </div>
                                        <div className={up ? 'text-success' : 'text-danger'} style={{ fontSize: '10px' }}>
                                            {item.change}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ── RIGHT: CHART PANEL ──────────────────────────────────── */}
                <div className="chart-panel">
                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-center p-3 border-bottom border-subtle bg-deep">
                        <div className="d-flex align-items-center gap-4">
                            <div className="d-flex align-items-center gap-2">
                                <span style={{ fontSize: '22px' }}>{selected.logo}</span>
                                <span className="h5 fw-bold text-white mb-0">{selected.name.toUpperCase()}</span>
                                <Badge bg="secondary" className="small" style={{ opacity: 0.6 }}>{selected.exchange}</Badge>
                            </div>
                            <div className="d-flex align-items-center gap-3 border-start border-subtle ps-4">
                                <div>
                                    <div className="text-secondary" style={{ fontSize: '10px' }}>PRICE</div>
                                    <div className="text-success fw-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>{priceStr}</div>
                                </div>
                                <div>
                                    <div className="text-secondary" style={{ fontSize: '10px' }}>CHANGE</div>
                                    <div className={selected.trend === 'up' ? 'text-success' : 'text-danger'}>{selected.change}</div>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            {['1m', '5m', '15m', '1h', '4h', 'D'].map(t => (
                                <button key={t} className={`btn btn-sm ${t === '1h' ? 'btn-primary' : 'btn-outline-secondary border-0 text-secondary'}`} style={{ fontSize: '11px' }}>{t}</button>
                            ))}
                        </div>
                    </div>

                    {/* Toolbar */}
                    <div className="d-flex align-items-center gap-1 p-1 border-bottom border-subtle bg-deep">
                        <button className="btn btn-sm text-secondary p-2"><MousePointer2 size={16}/></button>
                        <button className="btn btn-sm text-secondary p-2 border-start border-subtle ms-1"><TrendingUp size={16}/></button>
                        <button className="btn btn-sm text-secondary p-2"><Crosshair size={16}/></button>
                        <button className="btn btn-sm text-secondary p-2"><Type size={16}/></button>
                        <button className="btn btn-sm p-2 border-start border-subtle ms-1 text-accent"><Layout size={16}/></button>
                    </div>

                    {/* Chart canvas */}
                    <div className="chart-canvas-wrap">
                        <svg width="100%" height="100%" className="chart-svg">
                            {[...Array(8)].map((_, i) => (
                                <line key={i} x1="0" y1={40 * i} x2="100%" y2={40 * i} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                            ))}
                            {candles.map((c, i) => (
                                <g key={i} transform={`translate(${20 + i * 35}, 0)`}>
                                    <line x1="8" y1={c.y - 12} x2="8" y2={c.y + c.h + 12} stroke={c.isUp ? 'var(--color-positive)' : 'var(--color-negative)'} strokeWidth="1.5" />
                                    <rect x="0" y={c.y} width="16" height={c.h} rx="3" fill={c.isUp ? 'var(--color-positive)' : 'var(--color-negative)'} opacity="0.9" />
                                </g>
                            ))}
                            <line x1="0" y1="120" x2="100%" y2="120" stroke="var(--accent-blue)" strokeWidth="1" strokeDasharray="5,5" opacity="0.5" />
                            <rect x="100%" y="108" width="70" height="24" rx="4" fill="var(--accent-blue)" transform="translate(-70, 0)" />
                            <text x="100%" y="125" textAnchor="end" fill="white" fontSize="11" fontWeight="bold" transform="translate(-8, 0)">{priceStr}</text>
                        </svg>

                        {/* BUY / SELL actions */}
                        <div className="position-absolute bottom-0 start-50 translate-middle-x mb-4 bg-card p-2 rounded-pill shadow-lg d-flex gap-2 border border-subtle">
                            <button
                                id="btn-buy"
                                className="btn btn-success rounded-pill px-4 py-2 d-flex align-items-center gap-2 fw-bold"
                                style={{ fontSize: '13px' }}
                                onClick={() => setQuickTrade(selected.symbol)}
                            >
                                <ArrowUpRight size={16}/> BUY
                            </button>
                            <button
                                id="btn-sell"
                                className="btn btn-danger rounded-pill px-4 py-2 d-flex align-items-center gap-2 fw-bold"
                                style={{ fontSize: '13px' }}
                                onClick={() => setQuickTrade(selected.symbol)}
                            >
                                <ArrowDownRight size={16}/> SELL
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LiveTrades;
