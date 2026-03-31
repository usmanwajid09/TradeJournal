import React, { useState } from 'react';
import { Form, Button, Row, Col, Table } from 'react-bootstrap';
import { ArrowLeft, Plus, Trash2, Star, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { addTrade } from '../services/api';

const MOODS = ['😊', '😐', '😤', '😨', '😎'];
const TIMEFRAMES = ['1m', '5m', '15m', '1h', '4h', 'D'];

const AddTrade = () => {
    const [activeTab, setActiveTab] = useState('General');
    const [formData, setFormData] = useState({
        symbol:     '',
        side:       'Long',
        timeframe:  '1H',
        strategy:   '',
        entry:      '',
        stopLoss:   '',
        takeProfit: '',
        size:       '',
        notes:      '',
        mood:       '😊',   // ← fixed: emoji not string
        rating:     3,
    });
    const [extraTargets, setExtraTargets] = useState([]);
    const [errors, setErrors]   = useState({});
    const [saving, setSaving]   = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    // ── R:R calc ─────────────────────────────────────────────────────────────
    const calculateRR = () => {
        const e = parseFloat(formData.entry);
        const sl = parseFloat(formData.stopLoss);
        const tp = parseFloat(formData.takeProfit);
        if (!e || !sl || !tp) return '—';
        const risk   = Math.abs(e - sl);
        const reward = Math.abs(tp - e);
        if (risk === 0) return '—';
        return `1:${(reward / risk).toFixed(2)}`;
    };

    // ── Validation ────────────────────────────────────────────────────────────
    const validateGeneral = () => {
        const errs = {};
        if (!formData.symbol.trim())   errs.symbol   = 'Symbol is required';
        if (!formData.strategy.trim()) errs.strategy = 'Strategy is required';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const validateOrders = () => {
        const errs = {};
        if (!formData.entry)    errs.entry    = 'Entry price required';
        if (!formData.stopLoss) errs.stopLoss = 'Stop loss required';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    // ── Tab navigation ────────────────────────────────────────────────────────
    const handleNextTab = () => {
        if (activeTab === 'General' && !validateGeneral()) return;
        if (activeTab === 'Orders'  && !validateOrders())  return;
        setErrors({});
        setActiveTab(activeTab === 'General' ? 'Orders' : 'Journal');
    };

    const handleBackTab = () => {
        setErrors({});
        setActiveTab(activeTab === 'Journal' ? 'Orders' : 'General');
    };

    // ── Submit ────────────────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        const e_  = parseFloat(formData.entry)    || 0;
        const sl_ = parseFloat(formData.stopLoss)  || 0;
        const tp_ = parseFloat(formData.takeProfit)|| 0;
        const rawPnl = formData.side === 'Long'
            ? (tp_ - e_) * (parseFloat(formData.size) || 1)
            : (e_  - tp_) * (parseFloat(formData.size) || 1);
        const pnl = parseFloat(rawPnl.toFixed(2));

        await addTrade({
            ...formData,
            rr:     calculateRR(),
            profit: pnl >= 0 ? `+$${pnl.toFixed(2)}` : `-$${Math.abs(pnl).toFixed(2)}`,
            pnl,
        });

        setSaving(false);
        setSuccess(true);
        setTimeout(() => navigate('/journal'), 1400);
    };

    // ── Extra TP targets ──────────────────────────────────────────────────────
    const addTPTarget = () => {
        setExtraTargets(prev => [...prev, { id: Date.now(), price: '' }]);
    };

    const removeTPTarget = (id) => {
        setExtraTargets(prev => prev.filter(t => t.id !== id));
    };

    const updateTPTarget = (id, value) => {
        setExtraTargets(prev => prev.map(t => t.id === id ? { ...t, price: value } : t));
    };

    // ── Helpers ───────────────────────────────────────────────────────────────
    const field = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));

    return (
        <div className="form-page mx-auto" style={{ maxWidth: '820px' }}>
            {/* PAGE HEADER */}
            <div className="mb-4 d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-3">
                    <button className="btn btn-sm text-secondary border-0 bg-transparent p-0" onClick={() => navigate(-1)}>
                        <ArrowLeft size={20} />
                    </button>
                    <h2 className="page-title h4 mb-0 text-white">Log New Trade</h2>
                </div>
                {success && (
                    <div className="text-success small fw-bold d-flex align-items-center gap-2">
                        <CheckCircle2 size={16}/> Saved to Journal
                    </div>
                )}
            </div>

            <div className="bg-card border border-subtle overflow-hidden" style={{ borderRadius: '16px' }}>
                {/* TABS */}
                <div className="modal-tabs pt-3">
                    {['General', 'Orders', 'Journal'].map(tab => (
                        <div
                            key={tab}
                            id={`tab-${tab.toLowerCase()}`}
                            className={`modal-tab ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </div>
                    ))}
                </div>

                <div className="p-4">
                    <Form onSubmit={handleSubmit}>

                        {/* ── GENERAL TAB ─────────────────────────────────── */}
                        {activeTab === 'General' && (
                            <div>
                                <Row className="g-3 mb-4">
                                    <Col md={6}>
                                        <label className="form-label text-secondary small fw-bold mb-2">SYMBOL / PAIR *</label>
                                        <input
                                            id="field-symbol"
                                            className={`form-input ${errors.symbol ? 'border-danger' : ''}`}
                                            placeholder="e.g. BTCUSDT"
                                            value={formData.symbol}
                                            onChange={e => field('symbol', e.target.value)}
                                        />
                                        {errors.symbol && <div className="text-danger small mt-1 d-flex align-items-center gap-1"><AlertCircle size={12}/>{errors.symbol}</div>}
                                    </Col>
                                    <Col md={6}>
                                        <label className="form-label text-secondary small fw-bold mb-2">SIDE</label>
                                        <select
                                            id="field-side"
                                            className="form-input"
                                            value={formData.side}
                                            onChange={e => field('side', e.target.value)}
                                        >
                                            <option value="Long">Long (Buy)</option>
                                            <option value="Short">Short (Sell)</option>
                                        </select>
                                    </Col>
                                    <Col md={6}>
                                        <label className="form-label text-secondary small fw-bold mb-2">TIMEFRAME</label>
                                        <select
                                            id="field-timeframe"
                                            className="form-input"
                                            value={formData.timeframe}
                                            onChange={e => field('timeframe', e.target.value)}
                                        >
                                            {TIMEFRAMES.map(tf => <option key={tf}>{tf}</option>)}
                                        </select>
                                    </Col>
                                    <Col md={6}>
                                        <label className="form-label text-secondary small fw-bold mb-2">STRATEGY *</label>
                                        <input
                                            id="field-strategy"
                                            className={`form-input ${errors.strategy ? 'border-danger' : ''}`}
                                            placeholder="e.g. Supply & Demand"
                                            value={formData.strategy}
                                            onChange={e => field('strategy', e.target.value)}
                                        />
                                        {errors.strategy && <div className="text-danger small mt-1 d-flex align-items-center gap-1"><AlertCircle size={12}/>{errors.strategy}</div>}
                                    </Col>
                                    <Col md={6}>
                                        <label className="form-label text-secondary small fw-bold mb-2">POSITION SIZE</label>
                                        <input
                                            id="field-size"
                                            type="number"
                                            className="form-input"
                                            placeholder="e.g. 1.0 lot"
                                            value={formData.size}
                                            onChange={e => field('size', e.target.value)}
                                        />
                                    </Col>
                                </Row>
                            </div>
                        )}

                        {/* ── ORDERS TAB ──────────────────────────────────── */}
                        {activeTab === 'Orders' && (
                            <div>
                                <Table responsive borderless className="custom-table mb-4">
                                    <thead>
                                        <tr className="border-bottom border-subtle">
                                            <th className="text-secondary small py-3">ORDER TYPE</th>
                                            <th className="text-secondary small py-3">PRICE</th>
                                            <th className="text-secondary small py-3">NOTE</th>
                                            <th className="text-end py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* Entry */}
                                        <tr>
                                            <td className="py-3"><span className="badge bg-primary" style={{ fontSize: '10px' }}>ENTRY</span></td>
                                            <td className="py-2">
                                                <input
                                                    id="field-entry"
                                                    type="number"
                                                    className={`form-input py-1 ${errors.entry ? 'border-danger' : ''}`}
                                                    placeholder="0.00"
                                                    value={formData.entry}
                                                    onChange={e => field('entry', e.target.value)}
                                                />
                                                {errors.entry && <div className="text-danger" style={{fontSize:'11px'}}>{errors.entry}</div>}
                                            </td>
                                            <td className="py-3 text-secondary small">Main entry point</td>
                                            <td></td>
                                        </tr>
                                        {/* Stop Loss */}
                                        <tr>
                                            <td className="py-3"><span className="badge bg-danger" style={{ fontSize: '10px' }}>STOP LOSS</span></td>
                                            <td className="py-2">
                                                <input
                                                    id="field-stoploss"
                                                    type="number"
                                                    className={`form-input py-1 ${errors.stopLoss ? 'border-danger' : ''}`}
                                                    placeholder="0.00"
                                                    value={formData.stopLoss}
                                                    onChange={e => field('stopLoss', e.target.value)}
                                                />
                                                {errors.stopLoss && <div className="text-danger" style={{fontSize:'11px'}}>{errors.stopLoss}</div>}
                                            </td>
                                            <td className="py-3 text-danger fw-bold">R:R {calculateRR()}</td>
                                            <td></td>
                                        </tr>
                                        {/* Take Profit 1 */}
                                        <tr>
                                            <td className="py-3"><span className="badge bg-success" style={{ fontSize: '10px' }}>TARGET 1</span></td>
                                            <td className="py-2">
                                                <input
                                                    id="field-takeprofit"
                                                    type="number"
                                                    className="form-input py-1"
                                                    placeholder="0.00"
                                                    value={formData.takeProfit}
                                                    onChange={e => field('takeProfit', e.target.value)}
                                                />
                                            </td>
                                            <td className="py-3 text-success small">Primary target</td>
                                            <td></td>
                                        </tr>
                                        {/* Dynamic extra TP targets */}
                                        {extraTargets.map((target, idx) => (
                                            <tr key={target.id}>
                                                <td className="py-3"><span className="badge bg-success" style={{ fontSize: '10px', opacity: 0.7 }}>TARGET {idx + 2}</span></td>
                                                <td className="py-2">
                                                    <input
                                                        type="number"
                                                        className="form-input py-1"
                                                        placeholder="0.00"
                                                        value={target.price}
                                                        onChange={e => updateTPTarget(target.id, e.target.value)}
                                                    />
                                                </td>
                                                <td className="py-3 text-secondary small">Extra target</td>
                                                <td className="text-end">
                                                    <button type="button" className="btn btn-sm text-danger border-0 bg-transparent p-1" onClick={() => removeTPTarget(target.id)}>
                                                        <Trash2 size={15}/>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                                <button
                                    type="button"
                                    id="add-tp-target-btn"
                                    className="btn btn-sm w-100 d-flex align-items-center justify-content-center gap-2 py-2 text-secondary"
                                    style={{ border: '1px dashed var(--border-input)', borderRadius: '8px', background: 'transparent' }}
                                    onClick={addTPTarget}
                                >
                                    <Plus size={15}/> Add TP Target
                                </button>
                            </div>
                        )}

                        {/* ── JOURNAL TAB ─────────────────────────────────── */}
                        {activeTab === 'Journal' && (
                            <div>
                                <div className="mb-4">
                                    <label className="form-label text-secondary small fw-bold mb-2">TRADE NARRATIVE</label>
                                    <textarea
                                        id="field-notes"
                                        className="form-input"
                                        rows={4}
                                        placeholder="What's the mindset? Why this trade?..."
                                        value={formData.notes}
                                        onChange={e => field('notes', e.target.value)}
                                    />
                                </div>
                                <div className="row g-4 mb-4">
                                    <div className="col-md-6">
                                        <label className="form-label text-secondary small fw-bold mb-2">TRADING MOOD</label>
                                        <div className="d-flex gap-2">
                                            {MOODS.map(m => (
                                                <button
                                                    key={m}
                                                    type="button"
                                                    id={`mood-${m}`}
                                                    className="border-0 p-0 d-flex align-items-center justify-content-center rounded-circle"
                                                    style={{
                                                        width: '40px', height: '40px', fontSize: '20px',
                                                        background: formData.mood === m ? 'var(--accent-blue)' : 'rgba(255,255,255,0.06)',
                                                        opacity: formData.mood === m ? 1 : 0.45,
                                                        cursor: 'pointer',
                                                        transition: 'all 0.15s ease',
                                                    }}
                                                    onClick={() => field('mood', m)}
                                                >
                                                    {m}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="col-md-6 text-md-end">
                                        <label className="form-label text-secondary small fw-bold mb-2 d-block">EXECUTION QUALITY</label>
                                        <div className="d-flex gap-1 justify-content-md-end">
                                            {[1, 2, 3, 4, 5].map(s => (
                                                <Star
                                                    key={s}
                                                    size={22}
                                                    id={`star-${s}`}
                                                    style={{ cursor: 'pointer', color: formData.rating >= s ? '#F59E0B' : 'rgba(255,255,255,0.15)', fill: formData.rating >= s ? '#F59E0B' : 'none', transition: 'all 0.15s' }}
                                                    onClick={() => field('rating', s)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── FOOTER ACTIONS ───────────────────────────────── */}
                        <div className="d-flex justify-content-between align-items-center mt-5 pt-4 border-top border-subtle">
                            <div className="text-secondary small">
                                {formData.entry && formData.stopLoss && formData.takeProfit
                                    ? <>Auto-calculated R:R <strong className="text-white">{calculateRR()}</strong></>
                                    : <span>Fill orders tab to calculate R:R</span>
                                }
                            </div>
                            <div className="d-flex gap-3">
                                {activeTab !== 'General' && (
                                    <button type="button" id="btn-back" className="btn btn-secondary px-4 py-2" onClick={handleBackTab}>Back</button>
                                )}
                                {activeTab !== 'Journal' ? (
                                    <button type="button" id="btn-next" className="btn btn-primary px-5 py-2 fw-bold" onClick={handleNextTab}>
                                        Next Step
                                    </button>
                                ) : (
                                    <button type="submit" id="btn-submit" className="btn btn-primary px-5 py-2 fw-bold shadow-lg" disabled={saving}>
                                        {saving ? 'Saving…' : 'Complete Log'}
                                    </button>
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
