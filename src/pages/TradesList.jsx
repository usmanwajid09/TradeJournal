import React, { useState } from 'react';
import { Table, Badge, Button } from 'react-bootstrap';
import { Search, Download, Filter, Calendar, MoreHorizontal } from 'lucide-react';

const TradesList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const trades = [
        { id: 1, symbol: 'EURUSD', side: 'Long', entry: '1.0850', exit: '1.0920', rr: '1:2.1', profit: '+$700', status: 'Profit', date: '2024-03-20' },
        { id: 2, symbol: 'BTCUSDT', side: 'Short', entry: '64,200', exit: '63,500', rr: '1:3.4', profit: '+$1,200', status: 'Profit', date: '2024-03-22' },
        { id: 3, symbol: 'GBPUSD', side: 'Long', entry: '1.2620', exit: '1.2580', rr: '1:1.2', profit: '-$350', status: 'Loss', date: '2024-03-21' },
        { id: 4, symbol: 'GOLD', side: 'Long', entry: '2,150', exit: '2,180', rr: '1:4.5', profit: '+$1,500', status: 'Profit', date: '2024-03-23' },
        { id: 5, symbol: 'NASDAQ', side: 'Short', entry: '18,200', exit: '18,350', rr: '1:1.0', profit: '-$250', status: 'Loss', date: '2024-03-22' },
        { id: 6, symbol: 'USDJPY', side: 'Short', entry: '151.20', exit: '150.80', rr: '1:2.0', profit: '+$400', status: 'Profit', date: '2024-03-19' },
    ];

    const filteredTrades = trades.filter(trade => {
        const matchesSearch = trade.symbol.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || trade.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="trades-list-content">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="page-title h4 fw-bold text-white mb-1">Trading Journal</h2>
                    <p className="text-secondary small">Maintain a record of your past executions and strategies.</p>
                </div>
                <Button variant="outline-secondary" className="d-flex align-items-center gap-2 border-subtle px-3 py-2 text-white small fw-bold">
                    <Download size={16} /> Export CSV
                </Button>
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
                                    onClick={() => setStatusFilter(f)}
                                >
                                    {f === 'All' ? 'All Trades' : f === 'Profit' ? 'Winners' : 'Losers'}
                                </Badge>
                            ))}
                        </div>
                        <div className="search-box position-relative d-flex align-items-center">
                            <Search size={14} className="position-absolute ms-3 text-secondary" />
                            <input 
                                type="text" 
                                className="form-input ps-5 py-2 small" 
                                placeholder="Search by symbol..." 
                                style={{ width: '240px' }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                
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
                            <th className="text-secondary small fw-bold text-end pe-4">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTrades.map((trade) => (
                            <tr key={trade.id} className="align-middle">
                                <td className="ps-4">
                                    <div className="d-flex align-items-center gap-2">
                                        <Calendar size={13} className="text-secondary" />
                                        <span className="text-secondary small">{trade.date}</span>
                                    </div>
                                </td>
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
                                <td className="text-white small">{trade.entry}</td>
                                <td className="text-white small">{trade.exit}</td>
                                <td className="text-secondary small">{trade.rr}</td>
                                <td className={`fw-bold ${trade.status === 'Profit' ? 'text-success' : 'text-danger'}`}>
                                    {trade.profit}
                                </td>
                                <td className="text-end pe-4">
                                    <button className="btn btn-sm text-secondary p-1"><MoreHorizontal size={18}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                {filteredTrades.length === 0 && (
                    <div className="text-center py-5">
                        <p className="text-secondary">No trades found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TradesList;

