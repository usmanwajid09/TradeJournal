import React, { useState } from 'react';
import { Search, Filter, TrendingUp, TrendingDown, Clock, MousePointer2, Crosshair, Type, Layout, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Badge } from 'react-bootstrap';

const LiveTrades = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('All');

    const watchlist = [
        { symbol: 'AAPL', name: 'Apple Inc.', price: '182.42', change: '+1.24%', trend: 'up', logo: '🍎' },
        { symbol: 'TSLA', name: 'Tesla, Inc.', price: '175.05', change: '-2.15%', trend: 'down', logo: '⚡' },
        { symbol: 'BTC', name: 'Bitcoin', price: '64,215', change: '+0.85%', trend: 'up', logo: '₿' },
        { symbol: 'EURUSD', name: 'Euro / US Dollar', price: '1.0852', change: '+0.05%', trend: 'up', logo: '🇪🇺' },
        { symbol: 'GOLD', name: 'Gold Spot', price: '2,158.4', change: '+1.10%', trend: 'up', logo: '🌕' },
        { symbol: 'NVDA', name: 'NVIDIA Corp.', price: '875.20', change: '+3.42%', trend: 'up', logo: '🟢' },
    ];

    const filteredWatchlist = watchlist.filter(item => 
        item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="panels-container" style={{ height: 'calc(100vh - 120px)', margin: '-20px' }}>
            {/* LEFT PANEL: WATCHLIST */}
            <div className="watchlist-panel">
                <div className="p-3 border-bottom border-subtle">
                    <div className="search-box position-relative d-flex align-items-center mb-3">
                        <Search size={14} className="position-absolute ms-3 text-secondary" />
                        <input 
                            type="text" 
                            className="form-input ps-5 py-2 small" 
                            placeholder="Search symbols..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="d-flex gap-2 mb-1 overflow-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                        {['All', 'Stocks', 'Crypto', 'Forex'].map(tab => (
                            <Badge 
                                key={tab} 
                                bg={activeTab === tab ? 'primary' : 'secondary'} 
                                className={`px-3 py-2 cursor-pointer ${activeTab !== tab ? 'opacity-50' : ''}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </Badge>
                        ))}
                    </div>
                </div>
                <div className="flex-grow-1 overflow-auto custom-scrollbar">
                    {filteredWatchlist.map((item, idx) => (
                        <div key={idx} className="watchlist-item d-flex align-items-center justify-content-between p-3 border-bottom border-subtle cursor-pointer hover-bg">
                            <div className="d-flex align-items-center gap-3">
                                <div className="symbol-logo" style={{ fontSize: '20px' }}>{item.logo}</div>
                                <div>
                                    <div className="fw-bold text-white small">{item.symbol}</div>
                                    <div className="text-secondary" style={{ fontSize: '10px' }}>{item.name}</div>
                                </div>
                            </div>
                            <div className="text-end">
                                <div className="fw-bold text-white small">{item.price}</div>
                                <div className={item.trend === 'up' ? 'text-success' : 'text-danger'} style={{ fontSize: '10px' }}>
                                    {item.change}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT PANEL: CHART */}
            <div className="chart-panel">
                {/* CHART HEADER */}
                <div className="d-flex justify-content-between align-items-center p-3 border-bottom border-subtle bg-deep">
                    <div className="d-flex align-items-center gap-4">
                        <div className="d-flex align-items-center gap-2">
                            <span className="h5 fw-bold text-white mb-0">APPLE INC.</span>
                            <Badge bg="secondary" className="small" style={{ opacity: 0.6 }}>NASDAQ</Badge>
                        </div>
                        <div className="d-flex align-items-center gap-3 border-start border-subtle ps-4">
                            <div>
                                <div className="text-secondary" style={{ fontSize: '10px' }}>PRICE</div>
                                <div className="text-success fw-bold">182.42</div>
                            </div>
                            <div>
                                <div className="text-secondary" style={{ fontSize: '10px' }}>CHANGE</div>
                                <div className="text-success">+1.24 (0.68%)</div>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex gap-2">
                        {['1m', '5m', '15m', '1h', '4h', 'D'].map(t => (
                            <button key={t} className={`btn btn-sm ${t === '1h' ? 'btn-primary' : 'btn-outline-secondary border-0 text-secondary'}`} style={{ fontSize: '11px' }}>{t}</button>
                        ))}
                    </div>
                </div>

                {/* CHART TOOLBAR */}
                <div className="d-flex align-items-center gap-1 p-1 border-bottom border-subtle bg-deep">
                    <button className="btn btn-sm text-secondary hover-white p-2"><MousePointer2 size={16}/></button>
                    <button className="btn btn-sm text-secondary hover-white p-2 border-start border-subtle ms-1"><TrendingUp size={16}/></button>
                    <button className="btn btn-sm text-secondary hover-white p-2"><Crosshair size={16}/></button>
                    <button className="btn btn-sm text-secondary hover-white p-2"><Type size={16}/></button>
                    <button className="btn btn-sm text-secondary hover-white p-2 border-start border-subtle ms-1 text-accent"><Layout size={16}/></button>
                </div>

                {/* CHART CANVAS */}
                <div className="chart-canvas-wrap">
                    <svg width="100%" height="100%" className="chart-svg">
                        {/* Grid lines */}
                        {[...Array(8)].map((_, i) => (
                            <line key={i} x1="0" y1={40 * i} x2="100%" y2={40 * i} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                        ))}
                        
                        {/* Candlesticks */}
                        {[...Array(30)].map((_, i) => {
                            const h = 40 + Math.random() * 80;
                            const y = 80 + Math.random() * 60;
                            const isUp = Math.random() > 0.4;
                            return (
                                <g key={i} transform={`translate(${20 + i * 35}, 0)`}>
                                    <line x1="8" y1={y - 15} x2="8" y2={y + h + 15} stroke={isUp ? '#00C853' : '#D32F2F'} strokeWidth="1.5" />
                                    <rect x="0" y={y} width="16" height={h} rx="3" fill={isUp ? '#00C853' : '#D32F2F'} opacity="0.9" />
                                </g>
                            );
                        })}

                        {/* Price Line */}
                        <line x1="0" y1="120" x2="100%" y2="120" stroke="var(--accent-blue)" strokeWidth="1" strokeDasharray="5,5" opacity="0.5" />
                        <rect x="100%" y="108" width="60" height="24" rx="4" fill="var(--accent-blue)" transform="translate(-60, 0)" />
                        <text x="100%" y="125" textAnchor="end" fill="white" fontSize="11" fontWeight="bold" transform="translate(-8, 0)">182.42</text>
                    </svg>

                    {/* Quick Trade Panel */}
                    <div className="position-absolute bottom-0 start-50 translate-middle-x mb-4 bg-card p-2 rounded-pill shadow-lg d-flex gap-2 border border-subtle">
                        <button className="btn btn-success rounded-pill px-4 py-2 d-flex align-items-center gap-2 fw-bold" style={{ fontSize: '13px' }}>
                            <ArrowUpRight size={16}/> BUY 
                        </button>
                        <button className="btn btn-danger rounded-pill px-4 py-2 d-flex align-items-center gap-2 fw-bold" style={{ fontSize: '13px' }}>
                            <ArrowDownRight size={16}/> SELL
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveTrades;
