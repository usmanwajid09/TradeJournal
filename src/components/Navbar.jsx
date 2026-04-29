import React, { useState, useEffect, useRef } from 'react';
import { Navbar as BsNavbar, Container, Nav, Dropdown } from 'react-bootstrap';
import { Bell, LogOut, Settings, ChevronDown, TrendingUp, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getBalance, formatBalance } from '../services/virtualBalance';

// ── Mock notifications (D3 will push these from the server) ──────────────────
const MOCK_NOTIFICATIONS = [
    { id: 1, type: 'success', icon: '✅', title: 'Trade logged successfully',    body: 'BTCUSDT Long — virtual balance updated.',     time: '2m ago',  read: false },
    { id: 2, type: 'warning', icon: '⚠️', title: 'Balance below starting point', body: 'Your virtual credits have dropped below $10k.', time: '14m ago', read: false },
    { id: 3, type: 'info',    icon: '📈', title: 'BTC up +3.4% today',           body: 'Bitcoin is trending strongly above $67,000.',  time: '1h ago',  read: true  },
    { id: 4, type: 'info',    icon: '📋', title: 'Weekly journal reminder',       body: 'Review your trades from this week.',           time: '3h ago',  read: true  },
];

import { logout, getCurrentUser } from '../services/auth';

const Navbar = () => {
    const [balanceInfo, setBalanceInfo]   = useState(null);
    const [showNotif, setShowNotif]       = useState(false);
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
    const notifRef = useRef(null);
    const navigate = useNavigate();

    const user = getCurrentUser() || { name: 'Guest', email: '' };
    const initials = (user.name || 'Guest').split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

    const unreadCount = notifications.filter(n => !n.read).length;

    // Refresh balance every 5s
    useEffect(() => {
        const refresh = () => setBalanceInfo(getBalance());
        refresh();
        const t = setInterval(refresh, 5000);
        return () => clearInterval(t);
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setShowNotif(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const markAllRead = () => setNotifications(ns => ns.map(n => ({ ...n, read: true })));
    const dismiss = (id) => setNotifications(ns => ns.filter(n => n.id !== id));

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
    };

    const balanceUp = balanceInfo ? balanceInfo.balance >= balanceInfo.startingBalance : true;

    return (
        <BsNavbar
            expand="lg"
            className="py-2 sticky-top animate-fade-down"
            style={{ backgroundColor: 'var(--bg-sidebar)', borderBottom: '1px solid var(--border-subtle)', position: 'relative', zIndex: 1050 }}
        >
            <Container fluid>
                <BsNavbar.Brand as={Link} to="/dashboard" className="gradient-text fw-bold" style={{ fontSize: '17px', letterSpacing: '-0.5px' }}>
                    TradeJournal
                </BsNavbar.Brand>

                <BsNavbar.Toggle aria-controls="navbar-main" className="border-0" style={{ background: 'rgba(255,255,255,0.06)' }} />

                <BsNavbar.Collapse id="navbar-main" className="justify-content-end">
                    <Nav className="align-items-center gap-3">

                        {/* Virtual Balance Badge */}
                        {balanceInfo && (
                            <div
                                id="virtual-balance-badge"
                                title={`Paper Trading Account · Expires in ${balanceInfo.daysLeft} days`}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '7px',
                                    padding: '6px 14px', borderRadius: '10px',
                                    background: balanceUp ? 'var(--color-positive-dim)' : 'var(--color-negative-dim)',
                                    border: `1px solid ${balanceUp ? 'rgba(0,230,118,0.2)' : 'rgba(255,68,68,0.2)'}`,
                                    cursor: 'default',
                                }}
                            >
                                <TrendingUp size={13} style={{ color: balanceUp ? 'var(--color-positive)' : 'var(--color-negative)' }}/>
                                <div>
                                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)', lineHeight: 1 }}>VIRTUAL</div>
                                    <div style={{
                                        fontSize: '13px', fontWeight: 800,
                                        color: balanceUp ? 'var(--color-positive)' : 'var(--color-negative)',
                                        fontVariantNumeric: 'tabular-nums', lineHeight: 1.2,
                                    }}>
                                        {formatBalance(balanceInfo.balance)}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── Notification Bell with Dropdown ─────────────── */}
                        <div ref={notifRef} style={{ position: 'relative' }}>
                            <button
                                id="notification-bell"
                                onClick={() => { setShowNotif(v => !v); if (!showNotif) markAllRead(); }}
                                style={{
                                    position: 'relative', background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--border-subtle)', borderRadius: '10px',
                                    width: '38px', height: '38px', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', color: 'var(--text-secondary)',
                                    transition: 'all 0.15s',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.1)'; e.currentTarget.style.color='var(--text-primary)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.05)'; e.currentTarget.style.color='var(--text-secondary)'; }}
                            >
                                <Bell size={16}/>
                                {unreadCount > 0 && (
                                    <div style={{
                                        position: 'absolute', top: '6px', right: '7px',
                                        width: '8px', height: '8px', borderRadius: '50%',
                                        background: 'var(--color-negative)',
                                        boxShadow: '0 0 6px var(--color-negative)',
                                        animation: 'pulse 2s infinite',
                                    }}/>
                                )}
                            </button>

                            {/* Notification Dropdown */}
                            {showNotif && (
                                <div style={{
                                    position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                                    width: '340px', background: 'var(--bg-card)',
                                    border: '1px solid var(--border-subtle)', borderRadius: '16px',
                                    boxShadow: 'var(--shadow-elevated)', zIndex: 2000,
                                    animation: 'scaleIn 0.18s cubic-bezier(.4,0,.2,1)',
                                    overflow: 'hidden',
                                }}>
                                    {/* Header */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
                                        <div>
                                            <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '14px' }}>Notifications</span>
                                            {unreadCount > 0 && (
                                                <span style={{ marginLeft: '8px', fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '10px', background: 'var(--accent-blue-dim)', color: 'var(--accent-blue)' }}>
                                                    {unreadCount} new
                                                </span>
                                            )}
                                        </div>
                                        <button onClick={markAllRead}
                                            style={{ background: 'none', border: 'none', fontSize: '11px', color: 'var(--accent-blue)', cursor: 'pointer', fontWeight: 600 }}>
                                            Mark all read
                                        </button>
                                    </div>

                                    {/* Notification items */}
                                    <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                                        {notifications.length === 0 ? (
                                            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                                                🎉 All caught up!
                                            </div>
                                        ) : notifications.map(n => (
                                            <div key={n.id}
                                                style={{
                                                    display: 'flex', alignItems: 'flex-start', gap: '12px',
                                                    padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)',
                                                    background: n.read ? 'transparent' : 'rgba(79,124,255,0.04)',
                                                    transition: 'background 0.15s',
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                                                onMouseLeave={e => e.currentTarget.style.background = n.read ? 'transparent' : 'rgba(79,124,255,0.04)'}
                                            >
                                                <span style={{ fontSize: '18px', flexShrink: 0, marginTop: '1px' }}>{n.icon}</span>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                                                        <span style={{ fontSize: '13px', fontWeight: n.read ? 500 : 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                                                            {n.title}
                                                        </span>
                                                        <span style={{ fontSize: '10px', color: 'var(--text-muted)', flexShrink: 0, marginLeft: '8px' }}>{n.time}</span>
                                                    </div>
                                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{n.body}</div>
                                                </div>
                                                <button onClick={() => dismiss(n.id)}
                                                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px', display: 'flex', flexShrink: 0 }}
                                                    onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                                                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                                                >
                                                    <X size={13}/>
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Footer */}
                                    <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                            🔔 Real-time alerts coming in Deliverable 3
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* User Dropdown */}
                        <Dropdown align="end">
                            <Dropdown.Toggle
                                variant="transparent" id="dropdown-user"
                                className="d-flex align-items-center gap-2 border-0 text-white p-0"
                                style={{ background: 'transparent', boxShadow: 'none' }}
                            >
                                <div className="profile-avatar" style={{ width: '34px', height: '34px', fontSize: '12px', boxShadow: '0 0 10px rgba(79,124,255,0.25)' }}>
                                    {initials}
                                </div>
                                <div className="text-start d-none d-md-block">
                                    <div style={{ fontSize: '13px', fontWeight: 600, lineHeight: 1.2 }}>{user.name}</div>
                                    <div style={{ fontSize: '10px', color: 'var(--accent-blue)' }}>Pro Trader</div>
                                </div>
                                <ChevronDown size={14} style={{ color: 'var(--text-secondary)' }} />
                            </Dropdown.Toggle>

                            <Dropdown.Menu style={{
                                backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
                                borderRadius: '12px', padding: '8px',
                                boxShadow: 'var(--shadow-elevated)', minWidth: '180px',
                            }}>
                                <Dropdown.Item as={Link} to="/profile"
                                    style={{ borderRadius: '8px', padding: '8px 14px', fontSize: '13px', color: 'var(--text-primary)' }}
                                    className="d-flex align-items-center gap-2"
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    <Settings size={14} style={{ color: 'var(--text-secondary)' }} /> Profile Settings
                                </Dropdown.Item>
                                <Dropdown.Divider style={{ borderColor: 'var(--border-subtle)', margin: '4px 0' }} />
                                <Dropdown.Item
                                    onClick={handleLogout}
                                    style={{ borderRadius: '8px', padding: '8px 14px', fontSize: '13px', color: 'var(--color-negative)', cursor: 'pointer' }}
                                    className="d-flex align-items-center gap-2"
                                    onMouseEnter={e => e.currentTarget.style.background = 'var(--color-negative-dim)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    <LogOut size={14} /> Logout
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Nav>
                </BsNavbar.Collapse>
            </Container>
        </BsNavbar>
    );
};

export default Navbar;
