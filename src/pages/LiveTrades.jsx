import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, TrendingUp, TrendingDown, MousePointer2, Crosshair, Type, Layout, ArrowUpRight, ArrowDownRight, Wifi, WifiOff } from 'lucide-react';
import { Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {
    SYMBOLS, subscribeToAllPrices, startMarketData, stopMarketData,
    formatPrice, getLastPrice,
} from '../services/marketData';

// ── Stable candlestick generator (seeded, never re-randomises on re-render) ──
function seededRand(seed) {
    let s = seed;
    return () => {
        s = (s * 1664525 + 1013904223) & 0xffffffff;
        return (s >>> 0) / 0xffffffff;
    };
}
function generateCandles(symbol) {
    const rand = seededRand(symbol.split('').reduce((a, c) => a + c.charCodeAt(0), 0));
    return Array.from({ length: 30 }, () => ({
        h: 20 + rand() * 70,
        y: 40 + rand() * 80,
        isUp: rand() > 0.38,
    }));
}

// ── Watchlist order ───────────────────────────────────────────────────────────
const WATCHLIST_ORDER = ['BTC', 'ETH', 'BNB', 'AAPL', 'TSLA', 'NVDA', 'EURUSD', 'GOLD'];

// ── Quick-trade modal ─────────────────────────────────────────────────────────
const QuickTradeModal = ({ symbol, price, onClose, navigate }) => (
    <div
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
    >
        <div
            onClick={e => e.stopPropagation()}
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '18px', padding: '32px', width: '380px', maxWidth: '92vw', boxShadow: 'var(--shadow-elevated)', animation: 'scaleIn 0.25s cubic-bezier(.4,0,.2,1)' }}
        >
            <h5 style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: '4px' }}>Log Trade — {symbol}</h5>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '8px' }}>
                Current market price: <strong style={{ color: 'var(--accent-blue)' }}>{formatPrice(symbol, price)}</strong>
            </p>
            <p style={{ color: 'var(--color-positive)', fontSize: '12px', background: 'var(--color-positive-dim)', borderRadius: '8px', padding: '8px 12px', marginBottom: '20px', border: '1px solid rgba(0,230,118,0.15)' }}>
                💰 This uses virtual credits only — no real money involved.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
                <button
                    style={{ flex: 1, padding: '12px', borderRadius: '10px', background: 'var(--gradient-primary)', border: 'none', color: '#fff', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}
                    onClick={() => { onClose(); navigate('/add-trade'); }}
                >
                    Log Trade
                </button>
                <button
                    style={{ flex: 1, padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-input)', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}
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

    // ── State ─────────────────────────────────────────────────────────────────
    const [prices, setPrices]         = useState(() =>
        Object.fromEntries(WATCHLIST_ORDER.map(s => [s, getLastPrice(s)]))
    );
    const [prevPrices, setPrevPrices] = useState({});            // for flash
    const [flashing, setFlashing]     = useState({});            // symbol → 'up'|'down'
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab]   = useState('All');
    const [selected, setSelected]     = useState('BTC');
    const [quickTrade, setQuickTrade] = useState(null);
    const [connected, setConnected]   = useState(false);
    const flashTimers = useRef({});

    // ── Start market data once on mount ─────────────────────────────────────
    useEffect(() => {
        startMarketData();
        setConnected(true);

        const unsub = subscribeToAllPrices((symbol, price) => {
            if (!WATCHLIST_ORDER.includes(symbol)) return;
            setPrices(prev => {
                const old = prev[symbol];
                // Trigger flash
                if (old != null && old !== price) {
                    const dir = price > old ? 'up' : 'down';
                    setFlashing(f => ({ ...f, [symbol]: dir }));
                    if (flashTimers.current[symbol]) clearTimeout(flashTimers.current[symbol]);
                    flashTimers.current[symbol] = setTimeout(() => {
                        setFlashing(f => { const n = { ...f }; delete n[symbol]; return n; });
                    }, 600);
                }
                return { ...prev, [symbol]: price };
            });
        });

        return () => {
            unsub();
            stopMarketData();
            setConnected(false);
            Object.values(flashTimers.current).forEach(clearTimeout);
        };
    }, []);

    // ── Stable candles (memoised per symbol) ─────────────────────────────────
    const candles = useMemo(() => generateCandles(selected), [selected]);

    // ── Filter ───────────────────────────────────────────────────────────────
    const TAB_FILTER = {
        All:    () => true,
        Crypto: s => SYMBOLS[s]?.type === 'crypto',
        Stocks: s => SYMBOLS[s]?.type === 'stock',
        Forex:  s => ['forex','commod'].includes(SYMBOLS[s]?.type),
    };

    const filteredList = WATCHLIST_ORDER.filter(s => {
        const meta    = SYMBOLS[s];
        const matchQ  = s.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        meta.displayName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchT  = (TAB_FILTER[activeTab] || (() => true))(s);
        return matchQ && matchT;
    });

    const selectedMeta  = SYMBOLS[selected];
    const selectedPrice = prices[selected];
    const isCrypto      = selectedMeta?.type === 'crypto';

    return (
        <>
            {quickTrade && (
                <QuickTradeModal
                    symbol={quickTrade}
                    price={prices[quickTrade]}
                    onClose={() => setQuickTrade(null)}
                    navigate={navigate}
                />
            )}

            <div style={{ display: 'flex', height: 'calc(100vh - 120px)', margin: '-24px', overflow: 'hidden' }}>

                {/* ── WATCHLIST ──────────────────────────────────────────────── */}
                <div style={{ width: '280px', flexShrink: 0, borderRight: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', background: 'var(--bg-deep)' }}>
                    <div style={{ padding: '12px', borderBottom: '1px solid var(--border-subtle)' }}>
                        {/* Connection status */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                            {connected
                                ? <><Wifi size={11} style={{ color: 'var(--color-positive)' }}/><span style={{ fontSize: '10px', color: 'var(--color-positive)', fontWeight: 600 }}>LIVE DATA</span></>
                                : <><WifiOff size={11} style={{ color: 'var(--color-negative)' }}/><span style={{ fontSize: '10px', color: 'var(--color-negative)' }}>CONNECTING…</span></>
                            }
                            <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginLeft: 'auto' }}>Crypto: Real-time • Stocks: ~12s</span>
                        </div>

                        {/* Search */}
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            <Search size={12} style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)' }}/>
                            <input
                                type="text"
                                className="form-input"
                                style={{ paddingLeft: '30px', paddingTop: '7px', paddingBottom: '7px', fontSize: '12px' }}
                                placeholder="Search symbols…"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Tabs */}
                        <div style={{ display: 'flex', gap: '4px' }}>
                            {['All', 'Crypto', 'Stocks', 'Forex'].map(tab => (
                                <button key={tab} onClick={() => setActiveTab(tab)}
                                    style={{
                                        flex: 1, padding: '5px 0', borderRadius: '6px', border: 'none', fontSize: '10px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                                        background: activeTab === tab ? 'var(--gradient-primary)' : 'rgba(255,255,255,0.04)',
                                        color: activeTab === tab ? '#fff' : 'var(--text-secondary)',
                                    }}
                                >{tab}</button>
                            ))}
                        </div>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {filteredList.map(symbol => {
                            const meta    = SYMBOLS[symbol];
                            const price   = prices[symbol];
                            const flash   = flashing[symbol];
                            const isSelected = selected === symbol;

                            return (
                                <div key={symbol} onClick={() => setSelected(symbol)}
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        padding: '12px 14px',
                                        borderBottom: '1px solid var(--border-subtle)',
                                        cursor: 'pointer',
                                        background: isSelected ? 'rgba(79,124,255,0.06)' : 'transparent',
                                        borderLeft: isSelected ? '3px solid var(--accent-blue)' : '3px solid transparent',
                                        transition: 'all 0.12s',
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span style={{ fontSize: '18px' }}>{meta.logo}</span>
                                        <div>
                                            <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '13px' }}>{symbol}</div>
                                            <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{meta.displayName}</div>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{
                                            fontWeight: 700, fontSize: '13px', fontVariantNumeric: 'tabular-nums',
                                            color: flash === 'up' ? 'var(--color-positive)' : flash === 'down' ? 'var(--color-negative)' : 'var(--text-primary)',
                                            transition: 'color 0.3s',
                                        }}>
                                            {price != null ? formatPrice(symbol, price) : '—'}
                                        </div>
                                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                                            {isCrypto || meta.type === 'crypto' ? '● live' : '≈ ~12s'}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ── CHART PANEL ─────────────────────────────────────────────── */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {/* Chart header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-sidebar)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '22px' }}>{selectedMeta?.logo}</span>
                                <div>
                                    <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '16px' }}>{selected}</div>
                                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{selectedMeta?.displayName}</div>
                                </div>
                                <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>
                                    {selectedMeta?.exchange}
                                </span>
                                {isCrypto && (
                                    <span style={{ fontSize: '9px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: 'var(--color-positive-dim)', color: 'var(--color-positive)' }}>
                                        ● REAL-TIME
                                    </span>
                                )}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingLeft: '16px', borderLeft: '1px solid var(--border-subtle)' }}>
                                <div>
                                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Live Price</div>
                                    <div style={{
                                        fontWeight: 800, fontSize: '18px', fontVariantNumeric: 'tabular-nums',
                                        color: flashing[selected] === 'up' ? 'var(--color-positive)' : flashing[selected] === 'down' ? 'var(--color-negative)' : 'var(--text-primary)',
                                        transition: 'color 0.3s',
                                    }}>
                                        {selectedPrice != null ? formatPrice(selected, selectedPrice) : '—'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Timeframe buttons */}
                        <div style={{ display: 'flex', gap: '4px' }}>
                            {['1m', '5m', '15m', '1h', '4h', 'D'].map((t, i) => (
                                <button key={t}
                                    style={{
                                        padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                                        background: i === 3 ? 'var(--gradient-primary)' : 'rgba(255,255,255,0.04)',
                                        color: i === 3 ? '#fff' : 'var(--text-secondary)',
                                        border: 'none',
                                    }}
                                >{t}</button>
                            ))}
                        </div>
                    </div>

                    {/* Toolbar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-sidebar)' }}>
                        {[MousePointer2, TrendingUp, Crosshair, Type, Layout].map((Icon, i) => (
                            <button key={i} style={{ width: '30px', height: '30px', borderRadius: '6px', border: 'none', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Icon size={14}/>
                            </button>
                        ))}
                    </div>

                    {/* Chart canvas */}
                    <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: 'var(--bg-deep)' }}>
                        <svg width="100%" height="100%" style={{ display: 'block' }}>
                            {/* Grid */}
                            {[...Array(8)].map((_, i) => (
                                <line key={i} x1="0" y1={`${i * 14}%`} x2="100%" y2={`${i * 14}%`} stroke="rgba(255,255,255,0.025)" strokeWidth="1"/>
                            ))}
                            {/* Candles */}
                            {candles.map((c, i) => (
                                <g key={i} transform={`translate(${20 + i * 35}, 0)`}>
                                    <line x1="8" y1={c.y - 14} x2="8" y2={c.y + c.h + 14}
                                        stroke={c.isUp ? 'var(--color-positive)' : 'var(--color-negative)'} strokeWidth="1.5"/>
                                    <rect x="0" y={c.y} width="16" height={Math.max(c.h, 3)} rx="2"
                                        fill={c.isUp ? 'var(--color-positive)' : 'var(--color-negative)'} opacity="0.85"/>
                                </g>
                            ))}
                            {/* Current price line */}
                            <line x1="0" y1="130" x2="100%" y2="130" stroke="var(--accent-blue)" strokeWidth="1" strokeDasharray="5,5" opacity="0.4"/>
                            <rect x="0" y="118" width="100%" height="24" fill="none"/>
                            <rect x="calc(100% - 80px)" y="118" width="80" height="24" rx="4" fill="var(--accent-blue)" opacity="0.9"/>
                        </svg>

                        {/* Price label overlay */}
                        <div style={{ position: 'absolute', top: '118px', right: '0', width: '80px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: '10px', fontWeight: 700, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>
                                {selectedPrice != null ? formatPrice(selected, selectedPrice) : '—'}
                            </span>
                        </div>

                        {/* BUY / SELL */}
                        <div style={{
                            position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
                            background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '50px',
                            padding: '8px', display: 'flex', gap: '8px', boxShadow: 'var(--shadow-elevated)',
                        }}>
                            <button
                                id="btn-buy"
                                onClick={() => setQuickTrade(selected)}
                                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 24px', borderRadius: '40px', border: 'none', background: 'var(--gradient-success)', color: '#000', fontWeight: 800, fontSize: '13px', cursor: 'pointer', letterSpacing: '0.5px' }}
                            >
                                <ArrowUpRight size={15}/> BUY
                            </button>
                            <button
                                id="btn-sell"
                                onClick={() => setQuickTrade(selected)}
                                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 24px', borderRadius: '40px', border: 'none', background: 'linear-gradient(135deg, #FF4444 0%, #CC2222 100%)', color: '#fff', fontWeight: 800, fontSize: '13px', cursor: 'pointer', letterSpacing: '0.5px' }}
                            >
                                <ArrowDownRight size={15}/> SELL
                            </button>
                        </div>

                        {/* Virtual money disclaimer */}
                        <div style={{ position: 'absolute', bottom: '80px', right: '16px', fontSize: '10px', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.4)', padding: '4px 10px', borderRadius: '6px' }}>
                            💡 Paper trading — virtual credits only
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LiveTrades;
