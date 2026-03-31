import React, { useEffect, useRef } from 'react';
import { Row, Col, Table, Badge } from 'react-bootstrap';
import { Search, Monitor, Calendar, Plus, ArrowUpRight, TrendingUp, Zap, Target, BarChart2, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';

const TICKER_ITEMS = [
    { symbol: 'BTC/USDT', price: '$64,215', change: '+0.85%', up: true },
    { symbol: 'ETH/USDT', price: '$3,482',  change: '+1.23%', up: true },
    { symbol: 'EURUSD',   price: '1.0852',   change: '+0.05%', up: true },
    { symbol: 'GOLD',     price: '$2,158',   change: '+1.10%', up: true },
    { symbol: 'NASDAQ',   price: '18,204',   change: '-0.32%', up: false },
    { symbol: 'TSLA',     price: '$175.05',  change: '-2.15%', up: false },
    { symbol: 'NVDA',     price: '$875.20',  change: '+3.42%', up: true },
    { symbol: 'AAPL',     price: '$182.42',  change: '+1.24%', up: true },
    { symbol: 'GBP/USD',  price: '1.2642',   change: '-0.08%', up: false },
    { symbol: 'S&P 500',  price: '5,218',    change: '+0.44%', up: true },
];

const recentTrades = [
    { id: 1, symbol: 'EURUSD',  side: 'Long',  entry: '1.08520', exit: '1.09240', rr: '1:2.4', profit: '+$720',   mood: '😊', status: 'Win' },
    { id: 2, symbol: 'BTCUSDT', side: 'Short', entry: '64,280',  exit: '63,120',  rr: '1:3.1', profit: '+$1,160', mood: '😎', status: 'Win' },
    { id: 3, symbol: 'GBPUSD',  side: 'Long',  entry: '1.26400', exit: '1.26120', rr: '1:1.0', profit: '-$280',   mood: '😐', status: 'Loss' },
    { id: 4, symbol: 'GOLD',    side: 'Long',  entry: '2,145.5', exit: '2,178.2', rr: '1:4.2', profit: '+$3,270', mood: '🔥', status: 'Win' },
];

const Dashboard = () => {
    const navigate  = useNavigate();
    const today     = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const cardRefs  = useRef([]);
    const profitRef = useRef(null);
    const winRef    = useRef(null);
    const rrRef     = useRef(null);
    const totalRef  = useRef(null);
    const rowRefs   = useRef([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Stagger metric cards
            gsap.fromTo(
                cardRefs.current,
                { opacity: 0, y: 28, scale: 0.97 },
                { opacity: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.55, ease: 'power3.out', delay: 0.1 }
            );

            // Animated profit counter
            if (profitRef.current) {
                gsap.fromTo({ val: 0 }, { val: 12480.50 }, {
                    duration: 1.4, ease: 'power2.out', delay: 0.5,
                    onUpdate: function () {
                        if (profitRef.current)
                            profitRef.current.textContent = `+$${this.targets()[0].val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                    }
                });
            }

            // Win rate counter
            if (winRef.current) {
                gsap.fromTo({ val: 0 }, { val: 68.4 }, {
                    duration: 1.2, ease: 'power2.out', delay: 0.6,
                    onUpdate: function () {
                        if (winRef.current) winRef.current.textContent = `${this.targets()[0].val.toFixed(1)}%`;
                    }
                });
            }

            // Total trades counter
            if (totalRef.current) {
                gsap.fromTo({ val: 0 }, { val: 142 }, {
                    duration: 1.0, ease: 'power2.out', delay: 0.7,
                    onUpdate: function () {
                        if (totalRef.current) totalRef.current.textContent = Math.round(this.targets()[0].val);
                    }
                });
            }

            // Table row stagger
            gsap.fromTo(
                rowRefs.current,
                { opacity: 0, x: -16 },
                { opacity: 1, x: 0, stagger: 0.08, duration: 0.4, ease: 'power2.out', delay: 0.7 }
            );

            // Win rate circle animation
            const circle = document.querySelector('.win-circle');
            if (circle) {
                gsap.fromTo(circle, { strokeDashoffset: 138 }, { strokeDashoffset: 44, duration: 1.4, ease: 'power2.out', delay: 0.8 });
            }
        });
        return () => ctx.revert();
    }, []);

    return (
        <div className="dashboard-content">
            {/* PAGE HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-3 animate-fade-down">
                <div>
                    <h2 className="page-title h4 fw-bold text-white mb-1">Performance Dashboard</h2>
                    <div className="d-flex align-items-center gap-3" style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                        <span className="d-flex align-items-center gap-1"><Calendar size={12}/> {today}</span>
                        <span className="d-flex align-items-center gap-1">
                            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--color-positive)', display: 'inline-block', boxShadow: '0 0 6px var(--color-positive)', animation: 'pulse-dot 1.5s ease-out infinite' }}/>
                            Markets Open
                        </span>
                        <span className="d-flex align-items-center gap-1"><Monitor size={12}/> All Portfolios</span>
                    </div>
                </div>
                <div className="d-flex align-items-center gap-3">
                    <div className="position-relative d-flex align-items-center">
                        <Search size={13} className="position-absolute ms-3" style={{ color: 'var(--text-muted)' }} />
                        <input type="text" className="form-input ps-5 py-2 small" placeholder="Search trades…" style={{ width: '200px' }} />
                    </div>
                    <button
                        id="dashboard-add-trade-btn"
                        className="btn btn-primary d-flex align-items-center gap-2 fw-bold"
                        style={{ fontSize: '13px', padding: '9px 18px', borderRadius: '10px' }}
                        onClick={() => navigate('/add-trade')}
                    >
                        <Plus size={15}/> New Trade
                    </button>
                </div>
            </div>

            {/* MARKET TICKER */}
            <div className="ticker-wrap mb-4 rounded-2" style={{ borderRadius: '10px', overflow: 'hidden' }}>
                <div className="ticker-track py-1">
                    {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                        <div key={i} className="ticker-item">
                            <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '11px' }}>{item.symbol}</span>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>{item.price}</span>
                            <span style={{ color: item.up ? 'var(--color-positive)' : 'var(--color-negative)', fontSize: '11px', fontWeight: 600 }}>
                                {item.up ? '▲' : '▼'} {item.change}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* METRIC CARDS */}
            <Row className="g-4 mb-4">
                {/* Total Profit */}
                <Col lg={3}>
                    <div className="metric-card profit-card h-100" ref={el => cardRefs.current[0] = el}>
                        <div className="metric-label mb-3">
                            <Activity size={12} style={{ color: 'var(--color-positive)' }}/>
                            <span style={{ color: 'var(--color-positive)' }}>TOTAL PROFIT</span>
                        </div>
                        <div ref={profitRef} className="h3 fw-bold mb-1" style={{ color: 'var(--color-positive)', fontVariantNumeric: 'tabular-nums' }}>+$0.00</div>
                        <div className="d-flex align-items-center gap-1" style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                            <span style={{ color: 'var(--color-positive)', fontWeight: 700 }}>▲ 18.4%</span> vs last month
                        </div>
                    </div>
                </Col>

                {/* Win Rate */}
                <Col lg={3}>
                    <div className="metric-card h-100 d-flex justify-content-between align-items-center" ref={el => cardRefs.current[1] = el}>
                        <div>
                            <div className="metric-label mb-3">
                                <Target size={12}/><span>WIN RATE</span>
                            </div>
                            <div ref={winRef} className="h3 fw-bold text-white mb-1" style={{ fontVariantNumeric: 'tabular-nums' }}>0%</div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>26 Wins / 12 Losses</div>
                        </div>
                        <div className="circ-wrap">
                            <svg width="56" height="56">
                                <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5"/>
                                <circle cx="28" cy="28" r="22" fill="none" stroke="var(--accent-blue)" strokeWidth="5"
                                    strokeDasharray="138" strokeDashoffset="138" className="win-circle"
                                    style={{ filter: 'drop-shadow(0 0 4px rgba(79,124,255,0.5))' }}/>
                            </svg>
                            <div className="circ-center gradient-text">68</div>
                        </div>
                    </div>
                </Col>

                {/* Avg R:R */}
                <Col lg={3}>
                    <div className="metric-card h-100" ref={el => cardRefs.current[2] = el}>
                        <div className="metric-label mb-3">
                            <BarChart2 size={12}/><span>AVG RISK / REWARD</span>
                        </div>
                        <div ref={rrRef} className="d-flex align-items-baseline gap-2 mb-2">
                            <div className="h3 fw-bold text-white mb-0">1:2.4</div>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>EV</span>
                        </div>
                        <div style={{ height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                            <div style={{ width: '75%', height: '100%', borderRadius: '2px', background: 'var(--gradient-primary)', animation: 'barGrow 1s ease 0.9s both' }}/>
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '11px', marginTop: '8px' }}>Above benchmark (1:1.5)</div>
                    </div>
                </Col>

                {/* Total Trades */}
                <Col lg={3}>
                    <div className="metric-card h-100" ref={el => cardRefs.current[3] = el}>
                        <div className="metric-label mb-3">
                            <Zap size={12}/><span>TOTAL TRADES</span>
                        </div>
                        <div ref={totalRef} className="h3 fw-bold text-white mb-1">0</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                            Avg. <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>4.2</span> trades / day
                        </div>
                    </div>
                </Col>
            </Row>

            {/* CHARTS ROW */}
            <Row className="g-4 mb-4">
                <Col lg={8}>
                    <div className="chart-card p-4 h-100 animate-fade-up delay-3" style={{ borderRadius: '16px' }}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h5 className="text-white fw-bold mb-0">Equity Growth</h5>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>Monthly performance curve</div>
                            </div>
                            <div className="d-flex gap-2">
                                {['1W', '1M', '1Y'].map((t, i) => (
                                    <button key={t} className={`btn btn-sm ${i === 1 ? 'btn-primary' : ''}`}
                                        style={i !== 1 ? { background: 'rgba(255,255,255,0.04)', color: 'var(--text-secondary)', fontSize: '11px', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '4px 12px' } : { fontSize: '11px', padding: '4px 12px', borderRadius: '6px' }}>
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div style={{ height: '240px' }}>
                            <svg width="100%" height="100%" viewBox="0 0 600 200" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%"   stopColor="#4F7CFF" stopOpacity="0.35"/>
                                        <stop offset="100%" stopColor="#4F7CFF" stopOpacity="0"/>
                                    </linearGradient>
                                    <filter id="glow">
                                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                                        <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                                    </filter>
                                </defs>
                                {/* Grid lines */}
                                {[40, 80, 120, 160].map(y => (
                                    <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
                                ))}
                                <path d="M0 180 Q 50 165 100 168 T 200 130 T 300 138 T 400 88 T 500 98 T 600 38 V 200 H 0 Z" fill="url(#eqGrad)" />
                                <path className="equity-line" d="M0 180 Q 50 165 100 168 T 200 130 T 300 138 T 400 88 T 500 98 T 600 38"
                                    stroke="#4F7CFF" strokeWidth="2.5" fill="none" strokeLinecap="round"
                                    style={{ filter: 'drop-shadow(0 0 4px rgba(79,124,255,0.6))' }}/>
                                <circle cx="600" cy="38" r="5" fill="#4F7CFF" filter="url(#glow)"/>
                                <circle cx="600" cy="38" r="10" fill="#4F7CFF" opacity="0.2" className="animate-pulse-glow"/>
                                {/* Labels */}
                                {['Jan','Feb','Mar','Apr','May','Jun'].map((m, i) => (
                                    <text key={m} x={i * 100 + 50} y="195" textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="9">{m}</text>
                                ))}
                            </svg>
                        </div>
                    </div>
                </Col>

                <Col lg={4}>
                    <div className="chart-card p-4 h-100 animate-fade-up delay-4" style={{ borderRadius: '16px' }}>
                        <div className="d-flex justify-content-between align-items-center mb-1">
                            <h5 className="text-white fw-bold mb-0">Daily P&L</h5>
                            <span style={{ color: 'var(--color-positive)', fontSize: '12px', fontWeight: 700 }}>+$4,190</span>
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '11px', marginBottom: '16px' }}>This week</div>
                        <div className="bar-chart">
                            {[
                                { h: '40%', up: true },
                                { h: '20%', up: false },
                                { h: '70%', up: true },
                                { h: '55%', up: true },
                                { h: '30%', up: false },
                                { h: '85%', up: true },
                                { h: '60%', up: true },
                            ].map((b, i) => (
                                <div key={i} className="bar" style={{
                                    height: b.h,
                                    background: b.up ? 'linear-gradient(180deg, #00E676 0%, #00BFA5 100%)' : 'linear-gradient(180deg, #FF4444 0%, #CC2222 100%)',
                                    opacity: 0.85,
                                }}/>
                            ))}
                        </div>
                        <div className="mt-3 pt-2 d-flex justify-content-between" style={{ borderTop: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', fontSize: '10px', letterSpacing: '0.5px' }}>
                            {['MON','TUE','WED','THU','FRI','SAT','SUN'].map(d => <span key={d}>{d}</span>)}
                        </div>
                    </div>
                </Col>
            </Row>

            {/* RECENT TRADES */}
            <div className="chart-card p-4 animate-fade-up delay-5" style={{ borderRadius: '16px' }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h5 className="text-white fw-bold mb-0">Recent Trade Closures</h5>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>Latest 4 closed positions</div>
                    </div>
                    <button
                        id="dashboard-view-portfolio-btn"
                        className="btn btn-sm d-flex align-items-center gap-1 fw-bold"
                        style={{ background: 'var(--accent-blue-dim)', color: 'var(--accent-blue)', border: '1px solid rgba(79,124,255,0.2)', borderRadius: '8px', fontSize: '12px', padding: '6px 14px' }}
                        onClick={() => navigate('/journal')}
                    >
                        View All <ArrowUpRight size={13}/>
                    </button>
                </div>

                <Table responsive hover className="custom-table mb-0">
                    <thead>
                        <tr>
                            <th>SYMBOL</th>
                            <th>SIDE</th>
                            <th>R:R</th>
                            <th>PROFIT/LOSS</th>
                            <th>MOOD</th>
                            <th className="text-end pe-3">STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentTrades.map((trade, idx) => (
                            <tr
                                key={trade.id}
                                ref={el => rowRefs.current[idx] = el}
                                style={{ cursor: 'pointer' }}
                                onClick={() => navigate('/journal')}
                            >
                                <td>
                                    <div className="d-flex align-items-center gap-2">
                                        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'var(--accent-blue-dim)', border: '1px solid rgba(79,124,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: 'var(--accent-blue)' }}>
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
                                <td style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{trade.rr}</td>
                                <td className={`fw-bold ${trade.status === 'Win' ? 'text-success' : 'text-danger'}`}>{trade.profit}</td>
                                <td style={{ fontSize: '18px' }}>{trade.mood}</td>
                                <td className="text-end pe-3">
                                    <span style={{
                                        fontSize: '10px', fontWeight: 700, padding: '3px 10px', borderRadius: '4px', letterSpacing: '0.5px',
                                        background: trade.status === 'Win' ? 'var(--color-positive-dim)' : 'var(--color-negative-dim)',
                                        color: trade.status === 'Win' ? 'var(--color-positive)' : 'var(--color-negative)',
                                    }}>
                                        {trade.status.toUpperCase()}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>
    );
};

export default Dashboard;
