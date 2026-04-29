import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, TrendingUp, TrendingDown, MousePointer2, Crosshair, Type, Layout, ArrowUpRight, ArrowDownRight, Wifi, WifiOff, Loader, ZoomIn, ZoomOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
    SYMBOLS, subscribeToAllPrices, startMarketData, stopMarketData,
    formatPrice, getLastPrice,
} from '../services/marketData';

// ── Timeframe conversion helpers ─────────────────────────────────────────────
const TIMEFRAMES = ['1m', '5m', '15m', '1h', '4h', 'D'];
const toBinanceInterval  = t => ({ '1m':'1m', '5m':'5m', '15m':'15m', '1h':'1h', '4h':'4h', 'D':'1d' }[t] || '1h');
const toTwelveInterval   = t => ({ '1m':'1min', '5m':'5min', '15m':'15min', '1h':'1h', '4h':'4h', 'D':'1day' }[t] || '1h');

// ── Fetch real OHLC candles ───────────────────────────────────────────────────
async function fetchCandles(symbol, timeframe) {
    const meta = SYMBOLS[symbol];
    if (!meta) return null;

    try {
        if (meta.type === 'crypto') {
            // Binance public klines — no API key needed
            const interval  = toBinanceInterval(timeframe);
            const binanceSym = meta.binance.toUpperCase();
            const url = `https://api.binance.com/api/v3/klines?symbol=${binanceSym}&interval=${interval}&limit=120`;
            const res  = await fetch(url);
            if (!res.ok) return null;
            const data = await res.json();
            return data.map(k => ({
                open:  parseFloat(k[1]),
                high:  parseFloat(k[2]),
                low:   parseFloat(k[3]),
                close: parseFloat(k[4]),
                isUp:  parseFloat(k[4]) >= parseFloat(k[1]),
            }));
        } else {
            // Twelve Data time series
            const apiKey   = import.meta.env.VITE_TWELVE_DATA_KEY || 'demo';
            const interval = toTwelveInterval(timeframe);
            const url = `https://api.twelvedata.com/time_series?symbol=${encodeURIComponent(meta.twelveSymbol)}&interval=${interval}&outputsize=120&apikey=${apiKey}`;
            const res  = await fetch(url);
            if (!res.ok) return null;
            const data = await res.json();
            if (!data.values || data.status === 'error') return null;
            // Twelve Data returns newest-first — reverse so oldest is left
            return [...data.values].reverse().map(k => ({
                open:  parseFloat(k.open),
                high:  parseFloat(k.high),
                low:   parseFloat(k.low),
                close: parseFloat(k.close),
                isUp:  parseFloat(k.close) >= parseFloat(k.open),
            }));
        }
    } catch {
        return null;
    }
}

// ── SVG candlestick renderer ──────────────────────────────────────────────────
function CandlestickChart({ candles, loading }) {
    const W = 1060, H = 380;
    const PAD = { top: 16, bottom: 16, left: 8, right: 72 };

    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: '12px' }}>
            <Loader size={28} style={{ color: 'var(--accent-blue)', animation: 'spin 1s linear infinite' }}/>
            <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Loading candles…</span>
        </div>
    );

    if (!candles || candles.length === 0) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No data available for this timeframe</span>
        </div>
    );

    const prices    = candles.flatMap(c => [c.high, c.low]);
    const minPrice  = Math.min(...prices);
    const maxPrice  = Math.max(...prices);
    const range     = (maxPrice - minPrice) || 1;
    const cushion   = range * 0.06;
    const visMin    = minPrice - cushion;
    const visMax    = maxPrice + cushion;
    const visRange  = visMax - visMin;

    const chartW = W - PAD.left - PAD.right;
    const chartH = H - PAD.top  - PAD.bottom;
    const n      = candles.length;
    const slot   = chartW / n;
    const bodyW  = Math.max(2, slot * 0.55);

    const py = price => PAD.top + ((visMax - price) / visRange) * chartH;

    // Price grid lines (5 levels)
    const gridLevels = 5;
    const gridPrices = Array.from({ length: gridLevels }, (_, i) =>
        visMin + (visRange * i) / (gridLevels - 1)
    );

    const lastClose = candles[candles.length - 1]?.close;
    const lastY     = py(lastClose);

    return (
        <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none"
            style={{ display: 'block', overflow: 'visible' }}>

            {/* Grid lines */}
            {gridPrices.map((p, i) => (
                <g key={i}>
                    <line x1={PAD.left} y1={py(p)} x2={W - PAD.right} y2={py(p)}
                        stroke="rgba(255,255,255,0.035)" strokeWidth="1"/>
                    <text x={W - PAD.right + 6} y={py(p) + 4}
                        fill="rgba(255,255,255,0.2)" fontSize="9" fontFamily="Inter,sans-serif">
                        {p.toLocaleString('en-US', { minimumFractionDigits: p < 10 ? 4 : 0, maximumFractionDigits: p < 10 ? 4 : 0 })}
                    </text>
                </g>
            ))}

            {/* Candles */}
            {candles.map((c, i) => {
                const cx     = PAD.left + i * slot + slot / 2;
                const openY  = py(c.open);
                const closeY = py(c.close);
                const highY  = py(c.high);
                const lowY   = py(c.low);
                const bodyTop = Math.min(openY, closeY);
                const bodyH   = Math.max(Math.abs(closeY - openY), 1.5);
                const col     = c.isUp ? '#00E676' : '#FF4444';
                const x       = cx - bodyW / 2;
                return (
                    <g key={i}>
                        {/* Wick */}
                        <line x1={cx} y1={highY} x2={cx} y2={lowY}
                            stroke={col} strokeWidth="1.2" opacity="0.9"/>
                        {/* Body */}
                        <rect x={x} y={bodyTop} width={bodyW} height={bodyH} rx="1"
                            fill={col} opacity={c.isUp ? 0.82 : 0.78}/>
                    </g>
                );
            })}

            {/* Last price dashed line */}
            {lastClose != null && (
                <>
                    <line x1={PAD.left} y1={lastY} x2={W - PAD.right} y2={lastY}
                        stroke="var(--accent-blue)" strokeWidth="1" strokeDasharray="4,4" opacity="0.5"/>
                    <rect x={W - PAD.right} y={lastY - 9} width={PAD.right} height="18" rx="3" fill="var(--accent-blue)"/>
                    <text x={W - PAD.right + 4} y={lastY + 4.5}
                        fill="white" fontSize="9" fontWeight="700" fontFamily="Inter,sans-serif">
                        {lastClose.toLocaleString('en-US', { maximumFractionDigits: lastClose < 10 ? 4 : 0 })}
                    </text>
                </>
            )}
        </svg>
    );
}

// ── Quick trade modal ─────────────────────────────────────────────────────────
const QuickTradeModal = ({ symbol, price, onClose, navigate }) => (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
        <div onClick={e => e.stopPropagation()} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '18px', padding: '32px', width: '380px', maxWidth: '92vw', boxShadow: 'var(--shadow-elevated)', animation: 'scaleIn 0.25s cubic-bezier(.4,0,.2,1)' }}>
            <h5 style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: '4px' }}>Log Trade — {symbol}</h5>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '8px' }}>
                Current price: <strong style={{ color: 'var(--accent-blue)' }}>{formatPrice(symbol, price)}</strong>
            </p>
            <p style={{ color: 'var(--color-positive)', fontSize: '12px', background: 'var(--color-positive-dim)', borderRadius: '8px', padding: '8px 12px', marginBottom: '20px', border: '1px solid rgba(0,230,118,0.15)' }}>
                💰 Virtual credits only — no real money involved.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => { onClose(); navigate('/add-trade'); }} style={{ flex: 1, padding: '12px', borderRadius: '10px', background: 'var(--gradient-primary)', border: 'none', color: '#fff', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
                    Log Trade
                </button>
                <button onClick={onClose} style={{ flex: 1, padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-input)', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
                    Cancel
                </button>
            </div>
        </div>
    </div>
);

// ── Watchlist order ───────────────────────────────────────────────────────────
const WATCHLIST_ORDER = ['BTC', 'ETH', 'BNB', 'AAPL', 'TSLA', 'NVDA', 'EURUSD', 'GOLD'];

// ── Main component ────────────────────────────────────────────────────────────
const LiveTrades = () => {
    const navigate = useNavigate();

    const [prices, setPrices]           = useState(() =>
        Object.fromEntries(WATCHLIST_ORDER.map(s => [s, getLastPrice(s)]))
    );
    const [flashing, setFlashing]       = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab]     = useState('All');
    const [selected, setSelected]       = useState('BTC');
    const [quickTrade, setQuickTrade]   = useState(null);
    const [activeTool, setActiveTool]   = useState(0);
    const [activeTimeframe, setActiveTimeframe] = useState('1h');
    const [connected, setConnected]     = useState(false);

    // Real OHLC candle data
    const [candles, setCandles]         = useState([]);
    const [candlesLoading, setCandlesLoading] = useState(true);
    const [zoom, setZoom]               = useState(60); // Number of visible candles

    const flashTimers = useRef({});

    // ── Start live price feed ────────────────────────────────────────────────
    useEffect(() => {
        startMarketData();
        setConnected(true);

        const unsub = subscribeToAllPrices((symbol, price) => {
            if (!WATCHLIST_ORDER.includes(symbol)) return;
            setPrices(prev => {
                const old = prev[symbol];
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

    // ── Fetch real OHLC candles when symbol or timeframe changes ─────────────
    useEffect(() => {
        let cancelled = false;
        setCandlesLoading(true);
        fetchCandles(selected, activeTimeframe).then(data => {
            if (!cancelled) {
                setCandles(data || []);
                setCandlesLoading(false);
            }
        });
        return () => { cancelled = true; };
    }, [selected, activeTimeframe]);

    // ── Filter watchlist ─────────────────────────────────────────────────────
    const TAB_FILTER = {
        All:    () => true,
        Crypto: s => SYMBOLS[s]?.type === 'crypto',
        Stocks: s => SYMBOLS[s]?.type === 'stock',
        Forex:  s => ['forex', 'commod'].includes(SYMBOLS[s]?.type),
    };

    const filteredList = WATCHLIST_ORDER.filter(s => {
        const meta   = SYMBOLS[s];
        const matchQ = s.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       meta.displayName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchT = (TAB_FILTER[activeTab] || (() => true))(s);
        return matchQ && matchT;
    });

    const selectedMeta  = SYMBOLS[selected];
    const selectedPrice = prices[selected];
    const isCrypto      = selectedMeta?.type === 'crypto';
    const TOOL_LABELS   = ['Cursor', 'Trend Line', 'Crosshair', 'Text Label', 'Layout'];

    return (
        <>
            {quickTrade && (
                <QuickTradeModal
                    symbol={quickTrade} price={prices[quickTrade]}
                    onClose={() => setQuickTrade(null)} navigate={navigate}
                />
            )}

            <div style={{ display: 'flex', height: 'calc(100vh - 120px)', margin: '-24px', overflow: 'hidden' }}>

                {/* ── WATCHLIST ─────────────────────────────────────────────── */}
                <div style={{ width: '280px', flexShrink: 0, borderRight: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', background: 'var(--bg-deep)' }}>
                    <div style={{ padding: '12px', borderBottom: '1px solid var(--border-subtle)' }}>
                        {/* Connection status */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                            {connected
                                ? <><Wifi size={11} style={{ color: 'var(--color-positive)' }}/><span style={{ fontSize: '10px', color: 'var(--color-positive)', fontWeight: 600 }}>LIVE DATA</span></>
                                : <><WifiOff size={11} style={{ color: 'var(--color-negative)' }}/><span style={{ fontSize: '10px', color: 'var(--color-negative)' }}>CONNECTING…</span></>
                            }
                            <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginLeft: 'auto' }}>Crypto: RT • Stocks: ~12s</span>
                        </div>

                        {/* Search */}
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            <Search size={12} style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)' }}/>
                            <input type="text" className="form-input"
                                style={{ paddingLeft: '30px', paddingTop: '7px', paddingBottom: '7px', fontSize: '12px' }}
                                placeholder="Search symbols…"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Tabs */}
                        <div style={{ display: 'flex', gap: '4px' }}>
                            {['All', 'Crypto', 'Stocks', 'Forex'].map(tab => (
                                <button key={tab} onClick={() => setActiveTab(tab)} style={{
                                    flex: 1, padding: '5px 0', borderRadius: '6px', border: 'none', fontSize: '10px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                                    background: activeTab === tab ? 'var(--gradient-primary)' : 'rgba(255,255,255,0.04)',
                                    color: activeTab === tab ? '#fff' : 'var(--text-secondary)',
                                }}>{tab}</button>
                            ))}
                        </div>
                    </div>

                    {/* Symbol list */}
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {filteredList.map(symbol => {
                            const meta = SYMBOLS[symbol];
                            const price = prices[symbol];
                            const flash = flashing[symbol];
                            const isSelected = selected === symbol;
                            return (
                                <div key={symbol} onClick={() => setSelected(symbol)}
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        padding: '12px 14px', borderBottom: '1px solid var(--border-subtle)',
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
                                            {meta.type === 'crypto' ? '● live' : '≈ ~12s'}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ── CHART PANEL ───────────────────────────────────────────── */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

                    {/* Chart header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-sidebar)', flexShrink: 0 }}>
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
                                {candles.length > 1 && !candlesLoading && (() => {
                                    const first = candles[0].close;
                                    const last  = candles[candles.length - 1].close;
                                    const pct   = ((last - first) / first * 100).toFixed(2);
                                    const up    = last >= first;
                                    return (
                                        <div style={{ background: up ? 'var(--color-positive-dim)' : 'var(--color-negative-dim)', border: `1px solid ${up ? 'rgba(0,230,118,0.2)' : 'rgba(255,68,68,0.2)'}`, borderRadius: '8px', padding: '4px 10px' }}>
                                            <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{activeTimeframe} Change</div>
                                            <div style={{ fontSize: '13px', fontWeight: 700, color: up ? 'var(--color-positive)' : 'var(--color-negative)' }}>
                                                {up ? '+' : ''}{pct}%
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>

                        {/* Timeframe buttons */}
                        <div style={{ display: 'flex', gap: '4px' }}>
                            {TIMEFRAMES.map(t => (
                                <button key={t} onClick={() => setActiveTimeframe(t)} style={{
                                    padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                                    background: activeTimeframe === t ? 'var(--gradient-primary)' : 'rgba(255,255,255,0.04)',
                                    color: activeTimeframe === t ? '#fff' : 'var(--text-secondary)',
                                    border: 'none',
                                }}>{t}</button>
                            ))}
                        </div>
                    </div>

                    {/* Drawing toolbar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', padding: '4px 8px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-sidebar)', flexShrink: 0 }}>
                        {[MousePointer2, TrendingUp, Crosshair, Type, Layout].map((Icon, i) => (
                            <button key={i} title={TOOL_LABELS[i]} onClick={() => setActiveTool(i)} style={{
                                width: '30px', height: '30px', borderRadius: '6px', border: 'none',
                                background: activeTool === i ? 'var(--accent-blue-dim)' : 'transparent',
                                color: activeTool === i ? 'var(--accent-blue)' : 'var(--text-secondary)',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: activeTool === i ? '0 0 0 1px rgba(79,124,255,0.3)' : 'none',
                                transition: 'all 0.15s',
                            }}
                            onMouseEnter={e => { if (activeTool !== i) { e.currentTarget.style.background='rgba(255,255,255,0.06)'; }}}
                            onMouseLeave={e => { if (activeTool !== i) { e.currentTarget.style.background='transparent'; }}}
                            >
                                <Icon size={14}/>
                            </button>
                        ))}
                        <div style={{ width: '1px', height: '20px', background: 'var(--border-subtle)', margin: '0 4px' }}/>
                        <button title="Zoom In" onClick={() => setZoom(z => Math.max(z - 10, 20))} style={{ width: '30px', height: '30px', borderRadius: '6px', border: 'none', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ZoomIn size={14}/>
                        </button>
                        <button title="Zoom Out" onClick={() => setZoom(z => Math.min(z + 10, 120))} style={{ width: '30px', height: '30px', borderRadius: '6px', border: 'none', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ZoomOut size={14}/>
                        </button>
                        <div style={{ width: '1px', height: '20px', background: 'var(--border-subtle)', margin: '0 4px' }}/>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{TOOL_LABELS[activeTool]}</span>
                    </div>

                    {/* Chart canvas — real OHLC candlesticks */}
                    <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: 'var(--bg-deep)' }}>
                        <CandlestickChart candles={candles.slice(-zoom)} loading={candlesLoading}/>

                        {/* BUY / SELL */}
                        <div style={{
                            position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
                            background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '50px',
                            padding: '8px', display: 'flex', gap: '8px', boxShadow: 'var(--shadow-elevated)',
                        }}>
                            <button id="btn-buy" onClick={() => setQuickTrade(selected)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 24px', borderRadius: '40px', border: 'none', background: 'var(--gradient-success)', color: '#000', fontWeight: 800, fontSize: '13px', cursor: 'pointer', letterSpacing: '0.5px' }}>
                                <ArrowUpRight size={15}/> BUY
                            </button>
                            <button id="btn-sell" onClick={() => setQuickTrade(selected)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 24px', borderRadius: '40px', border: 'none', background: 'linear-gradient(135deg, #FF4444 0%, #CC2222 100%)', color: '#fff', fontWeight: 800, fontSize: '13px', cursor: 'pointer', letterSpacing: '0.5px' }}>
                                <ArrowDownRight size={15}/> SELL
                            </button>
                        </div>

                        {/* Disclaimer */}
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
