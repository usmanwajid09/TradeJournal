import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Button } from 'react-bootstrap';
import { User, Shield, Bell, TrendingUp, TrendingDown, RefreshCw, Clock, DollarSign, Activity } from 'lucide-react';
import { getBalance, getHistory, resetBalance, formatBalance } from '../services/virtualBalance';

const Profile = () => {
    const [balanceInfo, setBalanceInfo]   = useState(null);
    const [history, setHistory]           = useState([]);
    const [resetting, setResetting]       = useState(false);

    const refresh = () => {
        setBalanceInfo(getBalance());
        setHistory(getHistory());
    };

    useEffect(() => { refresh(); }, []);

    const handleReset = () => {
        if (!window.confirm('Reset your virtual balance back to $10,000? Your trade history will also be cleared.')) return;
        setResetting(true);
        resetBalance();
        setTimeout(() => { refresh(); setResetting(false); }, 500);
    };

    const balanceUp = balanceInfo ? balanceInfo.balance >= balanceInfo.startingBalance : true;

    return (
        <div className="animate-fade-up">
            <h2 className="page-title mb-4 text-white">Account Profile</h2>

            <Row className="g-4">
                {/* ── LEFT COLUMN ─────────────────────────────────────────── */}
                <Col lg={4}>
                    {/* Avatar card */}
                    <div className="auth-card shadow-lg text-center p-4 border-subtle-custom mb-4">
                        <div className="mb-4">
                            <div className="profile-avatar mx-auto shadow-lg" style={{ width: '80px', height: '80px', fontSize: '26px', boxShadow: '0 0 24px rgba(79,124,255,0.3)' }}>AM</div>
                        </div>
                        <h4 className="fw-bold mb-1 text-white">Ahmad Masood</h4>
                        <p className="text-secondary-custom small mb-1">Professional Trader</p>
                        <p style={{ fontSize: '11px', color: 'var(--accent-blue)', marginBottom: '16px' }}>Pro Member</p>
                        <Button variant="secondary" size="sm" className="px-4 rounded-pill btn-secondary border-subtle-custom text-white">
                            Change Avatar
                        </Button>
                    </div>

                    {/* Security */}
                    <div className="auth-card shadow-lg p-3 border-subtle-custom">
                        <h6 className="fw-bold mb-3 d-flex align-items-center gap-2 text-white">
                            <Shield size={16} className="text-accent" /> Account Security
                        </h6>
                        <div className="d-grid gap-2">
                            <Button variant="secondary" className="btn btn-secondary text-start border-subtle-custom text-white small">Change Security Key</Button>
                            <Button variant="secondary" className="btn btn-secondary text-start border-subtle-custom text-white small">Manage 2FA</Button>
                        </div>
                    </div>
                </Col>

                {/* ── RIGHT COLUMN ─────────────────────────────────────────── */}
                <Col lg={8}>
                    {/* Personal Info */}
                    <div className="auth-card shadow-lg p-4 border-subtle-custom mb-4">
                        <h5 className="fw-bold mb-4 text-white">Personal Information</h5>
                        <Form>
                            <Row className="g-4 mb-4">
                                <Col md={6}>
                                    <Form.Group controlId="firstName">
                                        <Form.Label className="form-label text-secondary-custom">First Name</Form.Label>
                                        <Form.Control defaultValue="Ahmad" className="form-input" />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="lastName">
                                        <Form.Label className="form-label text-secondary-custom">Last Name</Form.Label>
                                        <Form.Control defaultValue="Masood" className="form-input" />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="mb-4" controlId="email">
                                <Form.Label className="form-label text-secondary-custom">Email Address</Form.Label>
                                <Form.Control type="email" defaultValue="ahmad.masood@example.com" className="form-input" />
                            </Form.Group>
                            <Form.Group className="mb-4" controlId="bio">
                                <Form.Label className="form-label text-secondary-custom">Journaling Style / Bio</Form.Label>
                                <Form.Control as="textarea" rows={3} defaultValue="Price Action trader specialising in Forex and Crypto. Focus on supply and demand zones." className="form-input" />
                            </Form.Group>
                            <div className="d-flex justify-content-end pt-3 border-top border-subtle-custom">
                                <Button variant="primary" className="btn btn-primary px-5 py-2 fw-bold">Update Settings</Button>
                            </div>
                        </Form>
                    </div>

                    {/* ── PAPER TRADING ACCOUNT ───────────────────────────── */}
                    <div className="auth-card shadow-lg p-4 border-subtle-custom mb-4"
                        style={{ background: 'linear-gradient(145deg, #0A1218 0%, #080A10 100%)' }}>
                        <div className="d-flex justify-content-between align-items-start mb-4">
                            <div>
                                <h5 className="fw-bold mb-1 d-flex align-items-center gap-2 text-white">
                                    <DollarSign size={18} style={{ color: 'var(--color-positive)' }}/> Paper Trading Account
                                </h5>
                                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                                    Virtual credits — no real money involved. Auto-resets after 30 days.
                                </p>
                            </div>
                            <button id="reset-balance-btn" onClick={handleReset} disabled={resetting}
                                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '8px', border: '1px solid var(--border-input)', background: 'transparent', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(79,124,255,0.4)'; e.currentTarget.style.color = 'var(--accent-blue)'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-input)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                            >
                                <RefreshCw size={13} style={{ animation: resetting ? 'spin 1s linear infinite' : 'none' }}/> Reset to $10,000
                            </button>
                        </div>

                        {/* Balance stats */}
                        {balanceInfo && (
                            <Row className="g-3 mb-4">
                                <Col md={4}>
                                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '14px' }}>
                                        <div style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '6px' }}>Current Balance</div>
                                        <div style={{ fontSize: '22px', fontWeight: 800, color: balanceUp ? 'var(--color-positive)' : 'var(--color-negative)', fontVariantNumeric: 'tabular-nums' }}>
                                            {formatBalance(balanceInfo.balance)}
                                        </div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>Starting: $10,000.00</div>
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '14px' }}>
                                        <div style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '6px' }}>Total P&L</div>
                                        <div style={{ fontSize: '22px', fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: balanceInfo.pnlSinceStart >= 0 ? 'var(--color-positive)' : 'var(--color-negative)' }}>
                                            {balanceInfo.pnlSinceStart >= 0 ? '+' : ''}{formatBalance(balanceInfo.pnlSinceStart)}
                                        </div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                            {balanceInfo.pnlSinceStart >= 0 ? '▲' : '▼'} {Math.abs((balanceInfo.pnlSinceStart / 10000) * 100).toFixed(1)}% vs start
                                        </div>
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '14px' }}>
                                        <div style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Clock size={10}/> Expires In
                                        </div>
                                        <div style={{ fontSize: '22px', fontWeight: 800, color: balanceInfo.daysLeft <= 5 ? 'var(--color-negative)' : 'var(--text-primary)' }}>
                                            {balanceInfo.daysLeft}d
                                        </div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                            {new Date(balanceInfo.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        )}

                        {/* Transaction History */}
                        <div>
                            <h6 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: 'var(--text-secondary)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                                <Activity size={12}/> Transaction History
                            </h6>
                            {history.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '13px' }}>
                                    📭 No transactions yet — log a trade to see your balance change.
                                </div>
                            ) : (
                                <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
                                    {history.map(entry => (
                                        <div key={entry.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.1s' }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{
                                                    width: '28px', height: '28px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    background: entry.type === 'profit' ? 'var(--color-positive-dim)' : 'var(--color-negative-dim)',
                                                }}>
                                                    {entry.type === 'profit'
                                                        ? <TrendingUp size={13} style={{ color: 'var(--color-positive)' }}/>
                                                        : <TrendingDown size={13} style={{ color: 'var(--color-negative)' }}/>
                                                    }
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{entry.reason}</div>
                                                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{entry.date} · {entry.time}</div>
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: '13px', fontWeight: 700, color: entry.type === 'profit' ? 'var(--color-positive)' : 'var(--color-negative)', fontVariantNumeric: 'tabular-nums' }}>
                                                    {entry.change >= 0 ? '+' : ''}{formatBalance(entry.change)}
                                                </div>
                                                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{formatBalance(entry.balance)}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Alerts */}
                    <div className="auth-card shadow-lg p-4 border-subtle-custom">
                        <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 text-white">
                            <Bell size={18} className="text-accent" /> Journal Alerts
                        </h5>
                        <Form.Check type="switch" id="email-notifications" label="Email alerts for weekly summaries" defaultChecked className="mb-3 text-secondary-custom" />
                        <Form.Check type="switch" id="weekly-report"       label="System notifications for trade entry" defaultChecked className="text-secondary-custom" />
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default Profile;
