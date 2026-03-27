import React, { useState } from 'react';
import { Form, Button, Row, Col, Alert, Table } from 'react-bootstrap';
import { ArrowLeft, Plus, Trash2, Star, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AddTrade = () => {
    const [activeTab, setActiveTab] = useState('General');
    const [formData, setFormData] = useState({
        symbol: '',
        side: 'Long',
        timeframe: '1H',
        strategy: 'Trend Following',
        entry: '',
        stopLoss: '',
        takeProfit: '',
        notes: '',
        mood: 'Neutral',
        rating: 3
    });
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    // Calculate R:R
    const calculateRR = () => {
        if (!formData.entry || !formData.stopLoss || !formData.takeProfit) return '0.0';
        const risk = Math.abs(formData.entry - formData.stopLoss);
        const reward = Math.abs(formData.takeProfit - formData.entry);
        if (risk === 0) return '0.0';
        return (reward / risk).toFixed(2);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSuccess(true);
        setTimeout(() => navigate('/journal'), 1500);
    };

    return (
        <div className="form-page mx-auto" style={{ maxWidth: '800px' }}>
            <div className="mb-4 d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-3">
                    <Button variant="transparent" className="p-0 text-secondary" onClick={() => navigate(-1)}>
                        <ArrowLeft size={20} />
                    </Button>
                    <h2 className="page-title h4 mb-0 text-white">Log New Trade</h2>
                </div>
                {success && <div className="text-success small fw-bold d-flex align-items-center gap-2"><CheckCircle2 size={16}/> Saved to Journal</div>}
            </div>

            <div className="bg-card border border-subtle overflow-hidden" style={{ borderRadius: '16px' }}>
                {/* TABS HEADER */}
                <div className="modal-tabs pt-3">
                    {['General', 'Orders', 'Journal'].map(tab => (
                        <div 
                            key={tab} 
                            className={`modal-tab ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </div>
                    ))}
                </div>

                <div className="p-4">
                    <Form onSubmit={handleSubmit}>
                        {/* GENERAL TAB */}
                        {activeTab === 'General' && (
                            <div className="tab-pane fade show active">
                                <Row className="g-3 mb-4">
                                    <Col md={6}>
                                        <label className="form-label text-secondary small fw-bold mb-2">SYMBOL / PAIR</label>
                                        <input 
                                            className="form-input" 
                                            placeholder="e.g. BTCUSDT"
                                            value={formData.symbol}
                                            onChange={(e) => setFormData({...formData, symbol: e.target.value})}
                                            required
                                        />
                                    </Col>
                                    <Col md={6}>
                                        <label className="form-label text-secondary small fw-bold mb-2">SIDE</label>
                                        <select 
                                            className="form-input"
                                            value={formData.side}
                                            onChange={(e) => setFormData({...formData, side: e.target.value})}
                                        >
                                            <option value="Long">Long (Buy)</option>
                                            <option value="Short">Short (Sell)</option>
                                        </select>
                                    </Col>
                                    <Col md={6}>
                                        <label className="form-label text-secondary small fw-bold mb-2">TIMEFRAME</label>
                                        <select 
                                            className="form-input"
                                            value={formData.timeframe}
                                            onChange={(e) => setFormData({...formData, timeframe: e.target.value})}
                                        >
                                            <option>1m</option><option>5m</option><option>15m</option><option>1h</option><option>4h</option><option>D</option>
                                        </select>
                                    </Col>
                                    <Col md={6}>
                                        <label className="form-label text-secondary small fw-bold mb-2">STRATEGY</label>
                                        <input 
                                            className="form-input" 
                                            placeholder="Strategy name"
                                            value={formData.strategy}
                                            onChange={(e) => setFormData({...formData, strategy: e.target.value})}
                                        />
                                    </Col>
                                </Row>
                            </div>
                        )}

                        {/* ORDERS TAB */}
                        {activeTab === 'Orders' && (
                            <div className="tab-pane">
                                <Table responsive borderless className="custom-table mb-4">
                                    <thead>
                                        <tr className="border-bottom border-subtle">
                                            <th className="text-secondary small py-3">ORDER TYPE</th>
                                            <th className="text-secondary small py-3">PRICE</th>
                                            <th className="text-secondary small py-3">RISK/REWARD</th>
                                            <th className="text-end py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="py-3 text-white"><Badge bg="primary" style={{ fontSize: '10px' }}>ENTRY</Badge></td>
                                            <td className="py-2">
                                                <input 
                                                    type="number" 
                                                    className="form-input py-1 text-white border-0 bg-transparent" 
                                                    placeholder="0.00" 
                                                    value={formData.entry}
                                                    onChange={(e) => setFormData({...formData, entry: e.target.value})}
                                                />
                                            </td>
                                            <td className="py-3 text-secondary italic">Main entry point</td>
                                            <td className="text-end"><Trash2 size={16} className="text-secondary cursor-pointer opacity-50"/></td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 text-white"><Badge bg="danger" style={{ fontSize: '10px' }}>STOP LOSS</Badge></td>
                                            <td className="py-2">
                                                <input 
                                                    type="number" 
                                                    className="form-input py-1 text-white border-0 bg-transparent" 
                                                    placeholder="0.00" 
                                                    value={formData.stopLoss}
                                                    onChange={(e) => setFormData({...formData, stopLoss: e.target.value})}
                                                />
                                            </td>
                                            <td className="py-3 text-danger fw-bold">R:R 1:{calculateRR()}</td>
                                            <td className="text-end"><Trash2 size={16} className="text-secondary cursor-pointer opacity-50"/></td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 text-white"><Badge bg="success" style={{ fontSize: '10px' }}>TARGET 1</Badge></td>
                                            <td className="py-2">
                                                <input 
                                                    type="number" 
                                                    className="form-input py-1 text-white border-0 bg-transparent" 
                                                    placeholder="0.00" 
                                                    value={formData.takeProfit}
                                                    onChange={(e) => setFormData({...formData, takeProfit: e.target.value})}
                                                />
                                            </td>
                                            <td className="py-3 text-success">Profit taking</td>
                                            <td className="text-end"><Trash2 size={16} className="text-secondary cursor-pointer opacity-50"/></td>
                                        </tr>
                                    </tbody>
                                </Table>
                                <Button variant="outline-primary" className="btn-secondary w-100 d-flex align-items-center justify-content-center gap-2 py-2 border-dashed" style={{ borderStyle: 'dashed' }}>
                                    <Plus size={16}/> Add TP Target
                                </Button>
                            </div>
                        )}

                        {/* JOURNAL TAB */}
                        {activeTab === 'Journal' && (
                            <div className="tab-pane">
                                <div className="mb-4">
                                    <label className="form-label text-secondary small fw-bold mb-2">TRADE NARRATIVE</label>
                                    <textarea 
                                        className="form-input" 
                                        rows={4} 
                                        placeholder="What's the mindset? Why this trade?..."
                                        value={formData.notes}
                                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                    ></textarea>
                                </div>
                                <div className="row g-4 mb-4">
                                    <div className="col-md-6">
                                        <label className="form-label text-secondary small fw-bold mb-2">TRADING MOOD</label>
                                        <div className="d-flex gap-2">
                                            {['😊', '😐', '😤', '😨', '😎'].map(m => (
                                                <div 
                                                    key={m} 
                                                    className={`mood-pill cursor-pointer p-2 rounded-circle d-flex align-items-center justify-content-center ${formData.mood === m ? 'bg-primary' : 'bg-secondary'}`}
                                                    style={{ width: '40px', height: '40px', opacity: formData.mood === m ? 1 : 0.4 }}
                                                    onClick={() => setFormData({...formData, mood: m})}
                                                >
                                                    {m}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="col-md-6 text-md-end">
                                        <label className="form-label text-secondary small fw-bold mb-2 d-block">EXECUTION QUALITY</label>
                                        <div className="d-flex gap-1 justify-content-md-end">
                                            {[1, 2, 3, 4, 5].map(s => (
                                                <Star 
                                                    key={s} 
                                                    size={20} 
                                                    className={`cursor-pointer ${formData.rating >= s ? 'text-warning fill-warning' : 'text-secondary opacity-25'}`}
                                                    onClick={() => setFormData({...formData, rating: s})}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="d-flex justify-content-between align-items-center mt-5 pt-4 border-top border-subtle">
                            <div className="text-secondary small">Auto-calculated R:R 1:{calculateRR()}</div>
                            <div className="d-flex gap-3">
                                {activeTab !== 'General' && (
                                    <Button variant="outline-secondary" className="px-4 py-2" onClick={() => setActiveTab(activeTab === 'Journal' ? 'Orders' : 'General')}>Back</Button>
                                )}
                                {activeTab !== 'Journal' ? (
                                    <Button variant="primary" className="px-5 py-2 fw-bold" onClick={() => setActiveTab(activeTab === 'General' ? 'Orders' : 'Journal')}>Next Step</Button>
                                ) : (
                                    <Button variant="primary" type="submit" className="px-5 py-2 fw-bold shadow-lg">Complete Log</Button>
                                )}
                            </div>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default AddTrade;

