import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Table } from 'react-bootstrap';
import { ArrowLeft, Plus, Trash2, Star, CheckCircle2, AlertCircle, ChevronRight, ChevronLeft, TrendingUp, FileText, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { addTrade } from '../services/api';
import { applyTrade } from '../services/virtualBalance';

const MOODS = ['😊', '😐', '😤', '😨', '😎'];
const TIMEFRAMES = ['1m', '5m', '15m', '1h', '4h', 'D'];

const TABS = [
    { id: 'General', label: 'General',  Icon: TrendingUp  },
    { id: 'Orders',  label: 'Orders',   Icon: FileText    },
    { id: 'Journal', label: 'Journal',  Icon: BookOpen    },
];

// Success toast
const SuccessToast = () => (
    <div style={{
        position: 'fixed', bottom: '32px', right: '32px', zIndex: 9999,
        background: 'linear-gradient(135deg, #0A1A10 0%, #0A1415 100%)',
        border: '1px solid rgba(0,230,118,0.3)',
        borderRadius: '14px', padding: '16px 20px',
        display: 'flex', alignItems: 'center', gap: '12px',
        boxShadow: '0 12px 40px rgba(0,0,0,0.5), 0 0 30px rgba(0,230,118,0.1)',
        animation: 'fadeInRight 0.35s cubic-bezier(.4,0,.2,1)',
        minWidth: '280px',
    }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(0,230,118,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={18} style={{ color: 'var(--color-positive)' }} />
        </div>
        <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>Trade Logged!</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Redirecting to your journal…</div>
        </div>
    </div>
);

const AddTrade = () => {
    const [activeTab, setActiveTab] = useState('General');
    const [formData, setFormData] = useState({
        symbol: '', side: 'Long', timeframe: '1h', strategy: '',
        entry: '', stopLoss: '', takeProfit: '', size: '',
        notes: '', mood: '😊', rating: 3,
    });
    const [extraTargets, setExtraTargets] = useState([]);
    const [errors, setErrors]   = useState({});
    const [saving, setSaving]   = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const field = (key, val) => setFormData(p => ({ ...p, [key]: val }));

    const calculateRR = () => {
        const e = parseFloat(formData.entry), sl = parseFloat(formData.stopLoss), tp = parseFloat(formData.takeProfit);
        if (!e || !sl || !tp) return null;
        const risk = Math.abs(e - sl), reward = Math.abs(tp - e);
        if (!risk) return null;
        return (reward / risk).toFixed(2);
    };
    const rr = calculateRR();

    const validateGeneral = () => {
        const e = {};
        if (!formData.symbol.trim())   e.symbol   = 'Symbol is required';
        if (!formData.strategy.trim()) e.strategy = 'Strategy is required';
        setErrors(e); return !Object.keys(e).length;
    };
    const validateOrders = () => {
        const e = {};
        if (!formData.entry)    e.entry    = 'Entry price required';
        if (!formData.stopLoss) e.stopLoss = 'Stop loss required';
        setErrors(e); return !Object.keys(e).length;
    };

    const handleNext = () => {
        if (activeTab === 'General' && !validateGeneral()) return;
        if (activeTab === 'Orders'  && !validateOrders())  return;
        setErrors({});
        setActiveTab(activeTab === 'General' ? 'Orders' : 'Journal');
    };
    const handleBack = () => { setErrors({}); setActiveTab(activeTab === 'Journal' ? 'Orders' : 'General'); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        const e_  = parseFloat(formData.entry)     || 0;
        const sl_ = parseFloat(formData.stopLoss)   || 0;
        const tp_ = parseFloat(formData.takeProfit) || 0;
        const rawPnl = formData.side === 'Long'
            ? (tp_ - e_) * (parseFloat(formData.size) || 1)
            : (e_ - tp_) * (parseFloat(formData.size) || 1);
        const pnl = parseFloat(rawPnl.toFixed(2));

        await addTrade({
            ...formData,
            rr:     rr ? `1:${rr}` : '—',
            profit: pnl >= 0 ? `+$${pnl.toFixed(2)}` : `-$${Math.abs(pnl).toFixed(2)}`,
            pnl,
        });

        // Update virtual balance with trade result
        if (tp_) {
            const reason = `${formData.symbol} ${formData.side} (${pnl >= 0 ? '+' : ''}$${Math.abs(pnl).toFixed(2)})`;
            applyTrade(pnl, reason);
        }

        setSaving(false); setSuccess(true);
        setTimeout(() => navigate('/journal'), 1600);
    };

    const addTPTarget = () => setExtraTargets(p => [...p, { id: Date.now(), price: '' }]);
    const removeTP    = (id) => setExtraTargets(p => p.filter(t => t.id !== id));
    const updateTP    = (id, val) => setExtraTargets(p => p.map(t => t.id === id ? { ...t, price: val } : t));

    const tabIdx = TABS.findIndex(t => t.id === activeTab);

    return (
        <>
            {success && <SuccessToast />}

            <div className="form-page mx-auto animate-fade-up" style={{ maxWidth: '840px' }}>
                {/* HEADER */}
                <div className="mb-4 d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-3">
                        <button
                            className="d-flex align-items-center justify-content-center border-0"
                            style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.15s' }}
                            onClick={() => navigate(-1)}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                        >
                            <ArrowLeft size={16} />
                        </button>
                        <div>
                            <h2 className="page-title h4 mb-0 text-white">Log New Trade</h2>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Step {tabIdx + 1} of 3 — {activeTab}</div>
                        </div>
                    </div>
                    {/* Progress */}
                    <div style={{ width: '140px', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{
                            width: `${((tabIdx + 1) / 3) * 100}%`, height: '100%',
                            background: 'var(--gradient-primary)', borderRadius: '2px',
                            transition: 'width 0.4s cubic-bezier(.4,0,.2,1)',
                        }}/>
                    </div>
                </div>

                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '18px', overflow: 'hidden' }}>
                    {/* TABS */}
                    <div className="d-flex border-bottom" style={{ borderColor: 'var(--border-subtle)', background: 'rgba(255,255,255,0.01)' }}>
                        {TABS.map(({ id, label, Icon }) => (
                            <button
                                key={id}
                                id={`tab-${id.toLowerCase()}`}
                                type="button"
                                onClick={() => setActiveTab(id)}
                                style={{
                                    flex: 1, padding: '16px', border: 'none', cursor: 'pointer',
                                    background: 'transparent',
                                    color: activeTab === id ? 'var(--text-primary)' : 'var(--text-secondary)',
                                    fontWeight: activeTab === id ? 700 : 500,
                                    fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    borderBottom: activeTab === id ? '2px solid var(--accent-blue)' : '2px solid transparent',
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                <Icon size={15} style={{ color: activeTab === id ? 'var(--accent-blue)' : 'var(--text-muted)' }}/>
                                {label}
                            </button>
                        ))}
                    </div>

                    <div className="p-4 p-lg-5">
                        <Form onSubmit={handleSubmit}>

                            {/* ── GENERAL ── */}
                            {activeTab === 'General' && (
                                <div className="animate-scale-in">
                                    <Row className="g-3">
                                        <Col md={6}>
                                            <label className="form-label">SYMBOL / PAIR *</label>
                                            <input id="field-symbol" className={`form-input ${errors.symbol ? 'border-danger' : ''}`}
                                                placeholder="e.g. BTCUSDT, EURUSD" value={formData.symbol}
                                                onChange={e => field('symbol', e.target.value.toUpperCase())} />
                                            {errors.symbol && <div className="d-flex align-items-center gap-1 mt-1" style={{ color: 'var(--color-negative)', fontSize: '11px' }}><AlertCircle size={11}/>{errors.symbol}</div>}
                                        </Col>
                                        <Col md={6}>
                                            <label className="form-label">DIRECTION</label>
                                            <div className="d-flex gap-2">
                                                {['Long', 'Short'].map(s => (
                                                    <button key={s} type="button"
                                                        style={{
                                                            flex: 1, padding: '11px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '13px', transition: 'all 0.15s',
                                                            background: formData.side === s
                                                                ? s === 'Long' ? 'var(--color-positive-dim)' : 'var(--color-negative-dim)'
                                                                : 'rgba(255,255,255,0.04)',
                                                            color: formData.side === s
                                                                ? s === 'Long' ? 'var(--color-positive)' : 'var(--color-negative)'
                                                                : 'var(--text-secondary)',
                                                            border: formData.side === s
                                                                ? `1px solid ${s === 'Long' ? 'rgba(0,230,118,0.3)' : 'rgba(255,68,68,0.3)'}`
                                                                : '1px solid var(--border-subtle)',
                                                        }}
                                                        onClick={() => field('side', s)}
                                                    >
                                                        {s === 'Long' ? '▲ Long' : '▼ Short'}
                                                    </button>
                                                ))}
                                            </div>
                                        </Col>
                                        <Col md={4}>
                                            <label className="form-label">TIMEFRAME</label>
                                            <div className="d-flex gap-1 flex-wrap">
                                                {TIMEFRAMES.map(tf => (
                                                    <button key={tf} type="button"
                                                        style={{
                                                            padding: '7px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600, transition: 'all 0.15s',
                                                            background: formData.timeframe === tf ? 'var(--accent-blue-dim)' : 'rgba(255,255,255,0.04)',
                                                            color: formData.timeframe === tf ? 'var(--accent-blue)' : 'var(--text-secondary)',
                                                            border: formData.timeframe === tf ? '1px solid rgba(79,124,255,0.3)' : '1px solid var(--border-subtle)',
                                                        }}
                                                        onClick={() => field('timeframe', tf)}
                                                    >{tf}</button>
                                                ))}
                                            </div>
                                        </Col>
                                        <Col md={4}>
                                            <label className="form-label">STRATEGY *</label>
                                            <input id="field-strategy" className={`form-input ${errors.strategy ? 'border-danger' : ''}`}
                                                placeholder="e.g. Supply & Demand" value={formData.strategy}
                                                onChange={e => field('strategy', e.target.value)} />
                                            {errors.strategy && <div className="d-flex align-items-center gap-1 mt-1" style={{ color: 'var(--color-negative)', fontSize: '11px' }}><AlertCircle size={11}/>{errors.strategy}</div>}
                                        </Col>
                                        <Col md={4}>
                                            <label className="form-label">POSITION SIZE (LOTS)</label>
                                            <input id="field-size" type="number" step="0.01" className="form-input"
                                                placeholder="e.g. 1.0" value={formData.size}
                                                onChange={e => field('size', e.target.value)} />
                                        </Col>
                                    </Row>
                                </div>
                            )}

                            {/* ── ORDERS ── */}
                            {activeTab === 'Orders' && (
                                <div className="animate-scale-in">
                                    <Row className="g-3 mb-4">
                                        <Col md={4}>
                                            <label className="form-label">ENTRY PRICE *</label>
                                            <input id="field-entry" type="number" className={`form-input ${errors.entry ? 'border-danger' : ''}`}
                                                placeholder="0.00" value={formData.entry}
                                                onChange={e => field('entry', e.target.value)} />
                                            {errors.entry && <div style={{ color: 'var(--color-negative)', fontSize: '11px', marginTop: '4px' }}>{errors.entry}</div>}
                                        </Col>
                                        <Col md={4}>
                                            <label className="form-label">STOP LOSS *</label>
                                            <input id="field-stoploss" type="number" className={`form-input ${errors.stopLoss ? 'border-danger' : ''}`}
                                                placeholder="0.00" value={formData.stopLoss}
                                                onChange={e => field('stopLoss', e.target.value)} />
                                            {errors.stopLoss && <div style={{ color: 'var(--color-negative)', fontSize: '11px', marginTop: '4px' }}>{errors.stopLoss}</div>}
                                        </Col>
                                        <Col md={4}>
                                            <label className="form-label">TAKE PROFIT 1</label>
                                            <input id="field-takeprofit" type="number" className="form-input"
                                                placeholder="0.00" value={formData.takeProfit}
                                                onChange={e => field('takeProfit', e.target.value)} />
                                        </Col>
                                    </Row>

                                    {/* R:R display */}
                                    {rr && (
                                        <div className="mb-4 p-3 d-flex align-items-center gap-3 animate-scale-in" style={{ background: 'rgba(79,124,255,0.07)', border: '1px solid rgba(79,124,255,0.2)', borderRadius: '10px' }}>
                                            <div>
                                                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Risk / Reward Ratio</div>
                                                <div className="gradient-text fw-bold" style={{ fontSize: '22px' }}>1:{rr}</div>
                                            </div>
                                            <div style={{ width: '1px', height: '40px', background: 'var(--border-subtle)' }}/>
                                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                                {parseFloat(rr) >= 2 ? '✅ Good setup — reward exceeds 2x risk' : '⚠️ Consider a better entry or target'}
                                            </div>
                                        </div>
                                    )}

                                    {/* Extra TP targets */}
                                    {extraTargets.map((target, idx) => (
                                        <div key={target.id} className="d-flex align-items-center gap-3 mb-3 animate-fade-up">
                                            <div style={{ flex: '0 0 auto' }}>
                                                <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: 'var(--color-positive-dim)', color: 'var(--color-positive)' }}>
                                                    TARGET {idx + 2}
                                                </span>
                                            </div>
                                            <input type="number" className="form-input py-2" placeholder="0.00"
                                                value={target.price} style={{ maxWidth: '200px' }}
                                                onChange={e => updateTP(target.id, e.target.value)} />
                                            <button type="button" className="border-0 bg-transparent" style={{ color: 'var(--color-negative)', cursor: 'pointer' }} onClick={() => removeTP(target.id)}>
                                                <Trash2 size={15}/>
                                            </button>
                                        </div>
                                    ))}

                                    <button type="button" id="add-tp-target-btn" onClick={addTPTarget}
                                        className="d-flex align-items-center justify-content-center gap-2 w-100 py-2 border-0"
                                        style={{ background: 'transparent', borderRadius: '10px', border: '1px dashed var(--border-input) !important', outline: '1px dashed var(--border-input)', color: 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer', transition: 'all 0.15s' }}
                                        onMouseEnter={e => { e.currentTarget.style.outlineColor = 'var(--accent-blue)'; e.currentTarget.style.color = 'var(--accent-blue)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.outlineColor = 'var(--border-input)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                                    >
                                        <Plus size={14}/> Add TP Target
                                    </button>
                                </div>
                            )}

                            {/* ── JOURNAL ── */}
                            {activeTab === 'Journal' && (
                                <div className="animate-scale-in">
                                    <div className="mb-4">
                                        <label className="form-label">TRADE NARRATIVE</label>
                                        <textarea id="field-notes" className="form-input" rows={4}
                                            placeholder="What's the setup? Why this trade? What's the plan if it goes wrong?…"
                                            value={formData.notes} onChange={e => field('notes', e.target.value)} />
                                    </div>
                                    <Row className="g-4">
                                        <Col md={6}>
                                            <label className="form-label mb-3">TRADING MOOD</label>
                                            <div className="d-flex gap-2">
                                                {MOODS.map(m => (
                                                    <button key={m} type="button" id={`mood-${m}`}
                                                        onClick={() => field('mood', m)}
                                                        style={{
                                                            width: '44px', height: '44px', borderRadius: '12px', border: 'none',
                                                            fontSize: '20px', cursor: 'pointer', transition: 'all 0.2s',
                                                            background: formData.mood === m ? 'var(--accent-blue-dim)' : 'rgba(255,255,255,0.04)',
                                                            border: formData.mood === m ? '1px solid rgba(79,124,255,0.4)' : '1px solid transparent',
                                                            transform: formData.mood === m ? 'scale(1.15)' : 'scale(1)',
                                                            boxShadow: formData.mood === m ? '0 0 12px rgba(79,124,255,0.2)' : 'none',
                                                        }}
                                                    >{m}</button>
                                                ))}
                                            </div>
                                        </Col>
                                        <Col md={6}>
                                            <label className="form-label mb-3 d-block">EXECUTION QUALITY</label>
                                            <div className="d-flex gap-1">
                                                {[1, 2, 3, 4, 5].map(s => (
                                                    <Star key={s} id={`star-${s}`} size={24}
                                                        style={{
                                                            cursor: 'pointer', transition: 'all 0.15s',
                                                            color: formData.rating >= s ? '#F59E0B' : 'rgba(255,255,255,0.12)',
                                                            fill: formData.rating >= s ? '#F59E0B' : 'none',
                                                            transform: formData.rating >= s ? 'scale(1.1)' : 'scale(1)',
                                                            filter: formData.rating >= s ? 'drop-shadow(0 0 4px rgba(245,158,11,0.4))' : 'none',
                                                        }}
                                                        onClick={() => field('rating', s)}
                                                    />
                                                ))}
                                            </div>
                                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                                                {['', 'Poor', 'Below avg', 'Average', 'Good', 'Perfect'][formData.rating]} execution
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            )}

                            {/* FOOTER */}
                            <div className="d-flex justify-content-between align-items-center mt-5 pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                    {rr ? <span>R:R <strong style={{ color: 'var(--text-primary)' }}>1:{rr}</strong></span> : 'Complete all steps to calculate R:R'}
                                </div>
                                <div className="d-flex gap-3">
                                    {activeTab !== 'General' && (
                                        <button type="button" id="btn-back"
                                            className="d-flex align-items-center gap-1"
                                            style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid var(--border-input)', background: 'transparent', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '13px', cursor: 'pointer', transition: 'all 0.15s' }}
                                            onClick={handleBack}
                                        >
                                            <ChevronLeft size={15}/> Back
                                        </button>
                                    )}
                                    {activeTab !== 'Journal' ? (
                                        <button type="button" id="btn-next"
                                            className="btn btn-primary d-flex align-items-center gap-1"
                                            style={{ padding: '10px 28px', borderRadius: '10px', fontSize: '13px' }}
                                            onClick={handleNext}
                                        >
                                            Next <ChevronRight size={15}/>
                                        </button>
                                    ) : (
                                        <button type="submit" id="btn-submit"
                                            className="btn btn-primary"
                                            style={{ padding: '10px 32px', borderRadius: '10px', fontSize: '13px' }}
                                            disabled={saving}
                                        >
                                            {saving ? 'Saving…' : '✓ Complete Log'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddTrade;
