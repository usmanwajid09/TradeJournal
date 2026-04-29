import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { Shield, Bell, TrendingUp, TrendingDown, RefreshCw, Clock, DollarSign, Activity, CheckCircle, Save } from 'lucide-react';
import { getBalance, getHistory, resetBalance, formatBalance } from '../services/virtualBalance';

const getProfileKey = () => `tradejournal_profile_${JSON.parse(localStorage.getItem('user') || '{}').id || 'guest'}`;

function loadProfile() {
    try { return JSON.parse(localStorage.getItem(getProfileKey())) || {}; } catch { return {}; }
}
function saveProfile(data) {
    try { localStorage.setItem(getProfileKey(), JSON.stringify(data)); } catch {}
}

const Profile = () => {
    const saved = loadProfile();

    const loggedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const [firstName, setFirstName] = useState(saved.firstName || loggedUser.name?.split(' ')[0] || 'Trader');
    const [lastName,  setLastName]  = useState(saved.lastName  || loggedUser.name?.split(' ')[1] || '');
    const [email,     setEmail]     = useState(saved.email     || loggedUser.email || 'trader@example.com');
    const [bio,       setBio]       = useState(saved.bio       || 'Active trader focusing on price action and technical analysis.');
    const [saveToast, setSaveToast] = useState(false);

    const [balanceInfo, setBalanceInfo] = useState(null);
    const [history,     setHistory]     = useState([]);
    const [resetting,   setResetting]   = useState(false);
    const [confirmReset, setConfirmReset] = useState(false); // inline confirm instead of window.confirm

    const refresh = () => { setBalanceInfo(getBalance()); setHistory(getHistory()); };

    useEffect(() => { refresh(); }, []);

    // ── Save profile to localStorage ─────────────────────────────────────────
    const handleSave = (e) => {
        e.preventDefault();
        saveProfile({ firstName, lastName, email, bio });
        setSaveToast(true);
        setTimeout(() => setSaveToast(false), 2500);
    };

    // ── Reset virtual balance (inline confirmation) ───────────────────────────
    const handleResetClick = () => setConfirmReset(true);
    const handleResetConfirm = () => {
        setResetting(true);
        setConfirmReset(false);
        resetBalance();
        setTimeout(() => { refresh(); setResetting(false); }, 400);
    };
    const handleResetCancel = () => setConfirmReset(false);

    const balanceUp = balanceInfo ? balanceInfo.balance >= balanceInfo.startingBalance : true;
    const initials  = `${firstName[0] || 'A'}${lastName[0] || 'M'}`.toUpperCase();

    return (
        <div className="animate-fade-up">
            {/* Success toast */}
            {saveToast && (
                <div style={{
                    position: 'fixed', top: '80px', right: '24px', zIndex: 9999,
                    background: 'var(--color-positive-dim)', border: '1px solid rgba(0,230,118,0.3)',
                    color: 'var(--color-positive)', borderRadius: '12px', padding: '12px 20px',
                    display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '14px',
                    boxShadow: 'var(--shadow-elevated)', animation: 'scaleIn 0.2s ease',
                }}>
                    <CheckCircle size={16}/> Profile saved successfully!
                </div>
            )}

            <h2 className="page-title mb-4 text-white">Account Profile</h2>

            <Row className="g-4">
                {/* ── LEFT COLUMN ─────────────────────────────────────────── */}
                <Col lg={4}>
                    {/* Avatar card */}
                    <div className="auth-card shadow-lg text-center p-4 border-subtle-custom mb-4">
                        <div className="mb-3">
                            <div className="profile-avatar mx-auto shadow-lg"
                                style={{ width: '80px', height: '80px', fontSize: '26px', boxShadow: '0 0 24px rgba(79,124,255,0.3)' }}>
                                {initials}
                            </div>
                        </div>
                        <h4 className="fw-bold mb-1 text-white">{firstName} {lastName}</h4>
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
                        <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '10px', textAlign: 'center' }}>
                            Authentication wired in Deliverable 3
                        </p>
                    </div>
                </Col>

                {/* ── RIGHT COLUMN ─────────────────────────────────────────── */}
                <Col lg={8}>
                    {/* Personal Info — saves to localStorage */}
                    <div className="auth-card shadow-lg p-4 border-subtle-custom mb-4">
                        <h5 className="fw-bold mb-4 text-white d-flex align-items-center gap-2">
                            Personal Information
                            <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', background: 'rgba(255,255,255,0.04)', padding: '2px 8px', borderRadius: '6px' }}>
                                Saved locally
                            </span>
                        </h5>
                        <Form onSubmit={handleSave}>
                            <Row className="g-4 mb-4">
                                <Col md={6}>
                                    <Form.Group controlId="firstName">
                                        <Form.Label className="form-label text-secondary-custom">First Name</Form.Label>
                                        <Form.Control
                                            value={firstName}
                                            onChange={e => setFirstName(e.target.value)}
                                            className="form-input"
                                            placeholder="First name"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="lastName">
                                        <Form.Label className="form-label text-secondary-custom">Last Name</Form.Label>
                                        <Form.Control
                                            value={lastName}
                                            onChange={e => setLastName(e.target.value)}
                                            className="form-input"
                                            placeholder="Last name"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="mb-4" controlId="email">
                                <Form.Label className="form-label text-secondary-custom">Email Address</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="form-input"
                                    placeholder="your@email.com"
                                />
                            </Form.Group>
                            <Form.Group className="mb-4" controlId="bio">
                                <Form.Label className="form-label text-secondary-custom">Journaling Style / Bio</Form.Label>
                                <Form.Control
                                    as="textarea" rows={3}
                                    value={bio}
                                    onChange={e => setBio(e.target.value)}
                                    className="form-input"
                                    placeholder="Describe your trading style…"
                                />
                            </Form.Group>
                            <div className="d-flex justify-content-end pt-3 border-top border-subtle-custom">
                                <button type="submit"
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '8px',
                                        padding: '11px 32px', borderRadius: '10px',
                                        background: 'var(--gradient-primary)',
                                        border: 'none', color: '#fff', fontWeight: 700, fontSize: '14px',
                                        cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                                        boxShadow: '0 4px 16px rgba(79,124,255,0.25)',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 6px 24px rgba(79,124,255,0.35)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 4px 16px rgba(79,124,255,0.25)'; }}
                                >
                                    <Save size={14}/> Update Settings
                                </button>
                            </div>
                        </Form>
                    </div>

                    {/* ── Paper Trading Account ────────────────────────────── */}
                    <div className="auth-card shadow-lg p-4 border-subtle-custom mb-4"
                        style={{ background: 'linear-gradient(145deg, #0A1218 0%, #080A10 100%)' }}>
                        <div className="d-flex justify-content-between align-items-start mb-4">
                            <div>
                                <h5 className="fw-bold mb-1 d-flex align-items-center gap-2 text-white">
                                    <DollarSign size={18} style={{ color: 'var(--color-positive)' }}/> Paper Trading Account
                                </h5>
                                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                                    Virtual credits — no real money. Auto-resets after 30 days.
                                </p>
                            </div>

                            {/* Inline reset confirmation */}
                            {confirmReset ? (
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    background: 'var(--color-negative-dim)', border: '1px solid rgba(255,68,68,0.25)',
                                    borderRadius: '10px', padding: '8px 12px', animation: 'scaleIn 0.18s ease',
                                }}>
                                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Reset to $10,000?</span>
                                    <button onClick={handleResetConfirm}
                                        style={{ padding: '4px 12px', borderRadius: '6px', border: 'none', background: 'var(--color-negative)', color: '#fff', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                                        Yes
                                    </button>
                                    <button onClick={handleResetCancel}
                                        style={{ padding: '4px 12px', borderRadius: '6px', border: '1px solid var(--border-input)', background: 'transparent', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <button id="reset-balance-btn" onClick={handleResetClick} disabled={resetting}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '6px',
                                        padding: '7px 14px', borderRadius: '8px',
                                        border: '1px solid var(--border-input)', background: 'transparent',
                                        color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600,
                                        cursor: 'pointer', transition: 'all 0.15s',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(255,68,68,0.4)'; e.currentTarget.style.color='var(--color-negative)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border-input)'; e.currentTarget.style.color='var(--text-secondary)'; }}
                                >
                                    <RefreshCw size={13} style={{ animation: resetting ? 'spin 1s linear infinite' : 'none' }}/>
                                    Reset to $10,000
                                </button>
                            )}
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
                            <h6 style={{ color: 'var(--text-secondary)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Activity size={12}/> Transaction History
                            </h6>
                            {history.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '13px' }}>
                                    📭 No transactions yet — log a trade to see your balance change.
                                </div>
                            ) : (
                                <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
                                    {history.map(entry => (
                                        <div key={entry.id}
                                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.1s' }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ width: '28px', height: '28px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: entry.type === 'profit' ? 'var(--color-positive-dim)' : 'var(--color-negative-dim)', flexShrink: 0 }}>
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
                        <Form.Check type="switch" id="email-notifications" label="Email alerts for weekly summaries"   defaultChecked className="mb-3 text-secondary-custom" />
                        <Form.Check type="switch" id="weekly-report"       label="System notifications for trade entry" defaultChecked className="text-secondary-custom" />
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default Profile;
