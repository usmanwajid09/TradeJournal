import React from 'react';
import { Row, Col, Table, Badge } from 'react-bootstrap';
import { Search, ChevronDown, Monitor, Clock, Calendar } from 'lucide-react';

const Dashboard = () => {
    // Current Date string
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const recentTrades = [
        { id: 1, symbol: 'EURUSD', side: 'Long', entry: '1.08520', exit: '1.09240', rr: '1:2.4', profit: '+$720', mood: '😊', status: 'Win' },
        { id: 2, symbol: 'BTCUSDT', side: 'Short', entry: '64,280', exit: '63,120', rr: '1:3.1', profit: '+$1,160', mood: '😎', status: 'Win' },
        { id: 3, symbol: 'GBPUSD', side: 'Long', entry: '1.26400', exit: '1.26120', rr: '1:1.0', profit: '-$280', mood: '😐', status: 'Loss' },
        { id: 4, symbol: 'GOLD', side: 'Long', entry: '2,145.5', exit: '2,178.2', rr: '1:4.2', profit: '+$3,270', mood: '🔥', status: 'Win' },
    ];

    return (
        <div className="dashboard-content">
            {/* TOP BAR */}
            <div className="d-flex justify-content-between align-items-center mb-4 pb-2">
                <div>
                    <h2 className="page-title h4 fw-bold text-white mb-1">Performance Dashboard</h2>
                    <div className="d-flex align-items-center gap-3 text-secondary small">
                        <span className="d-flex align-items-center gap-1"><Calendar size={13}/> {today}</span>
                        <span className="d-flex align-items-center gap-1"><Monitor size={13}/> All Portfolios</span>
                    </div>
                </div>
                <div className="d-flex align-items-center gap-3">
                    <div className="search-box position-relative d-flex align-items-center">
                        <Search size={14} className="position-absolute ms-3 text-secondary" />
                        <input type="text" className="form-input ps-5 py-2 small" placeholder="Search trades..." style={{ width: '220px', borderRadius: '8px' }} />
                    </div>
                    <button className="btn btn-primary d-flex align-items-center gap-2 px-3 py-2 fw-bold" style={{ borderRadius: '8px', fontSize: '13px' }}>
                        Add New Trade
                    </button>
                </div>
            </div>

            {/* METRICS ROW */}
            <Row className="g-4 mb-4">
                <Col lg={3}>
                    <div className="metric-card h-100">
                        <div className="metric-label mb-3">
                            <span className="text-secondary small fw-bold">TOTAL PROFIT</span>
                            <span className="info-icon">i</span>
                        </div>
                        <div className="h3 fw-bold text-success mb-1">+$12,480.50</div>
                        <div className="text-secondary small d-flex align-items-center gap-1">
                            <span className="text-success fw-bold">+18.4%</span> vs last month
                        </div>
                    </div>
                </Col>
                <Col lg={3}>
                    <div className="metric-card h-100 d-flex justify-content-between align-items-center">
                        <div>
                            <div className="metric-label mb-3">
                                <span className="text-secondary small fw-bold">WIN RATE</span>
                            </div>
                            <div className="h3 fw-bold text-white mb-1">68.4%</div>
                            <div className="text-secondary small">26 Wins / 12 Losses</div>
                        </div>
                        <div className="circ-wrap">
                            <svg width="52" height="52">
                                <circle cx="26" cy="26" r="22" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5"/>
                                <circle cx="26" cy="26" r="22" fill="none" stroke="var(--accent-blue)" strokeWidth="5" strokeDasharray="138" strokeDashoffset="44"/>
                            </svg>
                            <div className="circ-center">68</div>
                        </div>
                    </div>
                </Col>
                <Col lg={3}>
                    <div className="metric-card h-100">
                        <div className="metric-label mb-3">
                            <span className="text-secondary small fw-bold">AVG RISK/REWARD</span>
                        </div>
                        <div className="d-flex align-items-baseline gap-2 mb-1">
                            <div className="h3 fw-bold text-white mb-0">1:2.4</div>
                            <span className="text-secondary small">Expected Value</span>
                        </div>
                        <div className="w-100 bg-secondary-subtle mt-2" style={{ height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.05)' }}>
                            <div className="bg-primary h-100" style={{ width: '75%', borderRadius: '2px' }}></div>
                        </div>
                    </div>
                </Col>
                <Col lg={3}>
                    <div className="metric-card h-100">
                        <div className="metric-label mb-3">
                            <span className="text-secondary small fw-bold">TOTAL TRADES</span>
                        </div>
                        <div className="h3 fw-bold text-white mb-1">142</div>
                        <div className="text-secondary small">Avg. 4.2 trades / day</div>
                    </div>
                </Col>
            </Row>

            {/* CHARTS ROW */}
            <Row className="g-4 mb-4">
                <Col lg={8}>
                    <div className="chart-card bg-card p-4 h-100" style={{ borderRadius: '16px' }}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="text-white fw-bold mb-0">Equity Growth</h5>
                            <div className="d-flex gap-2">
                                <Badge bg="secondary" className="px-3 py-2 cursor-pointer" style={{ opacity: 0.5 }}>1W</Badge>
                                <Badge bg="primary" className="px-3 py-2 cursor-pointer">1M</Badge>
                                <Badge bg="secondary" className="px-3 py-2 cursor-pointer" style={{ opacity: 0.5 }}>1Y</Badge>
                            </div>
                        </div>
                        <div className="equity-chart-wrap" style={{ height: '240px' }}>
                            <svg width="100%" height="100%" viewBox="0 0 600 200" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="var(--accent-blue)" stopOpacity="0.4"/>
                                        <stop offset="100%" stopColor="var(--accent-blue)" stopOpacity="0"/>
                                    </linearGradient>
                                </defs>
                                <path d="M0 180 Q 50 160 100 170 T 200 130 T 300 140 T 400 90 T 500 100 T 600 40 V 200 H 0 Z" fill="url(#equityGradient)" />
                                <path d="M0 180 Q 50 160 100 170 T 200 130 T 300 140 T 400 90 T 500 100 T 600 40" stroke="var(--accent-blue)" strokeWidth="3" fill="none" strokeLinecap="round" />
                                <circle cx="600" cy="40" r="5" fill="var(--accent-blue)" />
                                <circle cx="600" cy="40" r="10" fill="var(--accent-blue)" opacity="0.2" />
                            </svg>
                        </div>
                    </div>
                </Col>
                <Col lg={4}>
                    <div className="chart-card bg-card p-4 h-100" style={{ borderRadius: '16px' }}>
                        <h5 className="text-white fw-bold mb-4">Daily P&L</h5>
                        <div className="bar-chart">
                            <div className="bar bg-success" style={{ height: '40%' }}></div>
                            <div className="bar bg-danger" style={{ height: '20%' }}></div>
                            <div className="bar bg-success" style={{ height: '70%' }}></div>
                            <div className="bar bg-success" style={{ height: '55%' }}></div>
                            <div className="bar bg-danger" style={{ height: '35%' }}></div>
                            <div className="bar bg-success" style={{ height: '85%' }}></div>
                            <div className="bar bg-success" style={{ height: '60%' }}></div>
                        </div>
                        <div className="mt-4 pt-2 border-top border-subtle d-flex justify-content-between text-secondary small">
                            <span>MON</span>
                            <span>TUE</span>
                            <span>WED</span>
                            <span>THU</span>
                            <span>FRI</span>
                            <span>SAT</span>
                            <span>SUN</span>
                        </div>
                    </div>
                </Col>
            </Row>

            {/* RECENT TRADES SECTION */}
            <div className="section-card bg-card p-4" style={{ borderRadius: '16px' }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="text-white fw-bold mb-0">Recent Trade Closures</h5>
                    <div className="text-accent small cursor-pointer fw-bold">View Portfolio</div>
                </div>
                <Table responsive hover className="custom-table mb-0">
                    <thead>
                        <tr>
                            <th className="text-secondary small fw-bold">SYMBOL</th>
                            <th className="text-secondary small fw-bold">SIDE</th>
                            <th className="text-secondary small fw-bold">R:R</th>
                            <th className="text-secondary small fw-bold">PROFIT/LOSS</th>
                            <th className="text-secondary small fw-bold">MOOD</th>
                            <th className="text-secondary small fw-bold text-end pe-3">STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentTrades.map((trade) => (
                            <tr key={trade.id} className="align-middle">
                                <td>
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="symbol-icon" style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>
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
                                <td className="text-secondary small">{trade.rr}</td>
                                <td className={`fw-bold ${trade.status === 'Win' ? 'text-success' : 'text-danger'}`}>
                                    {trade.profit}
                                </td>
                                <td style={{ fontSize: '18px' }}>{trade.mood}</td>
                                <td className="text-end pe-3">
                                    <Badge bg={trade.status === 'Win' ? 'success' : 'danger'} className="px-3" style={{ fontSize: '10px' }}>
                                        {trade.status.toUpperCase()}
                                    </Badge>
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

