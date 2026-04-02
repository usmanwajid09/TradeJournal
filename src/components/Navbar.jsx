import React, { useState, useEffect } from 'react';
import { Navbar as BsNavbar, Container, Nav, Dropdown } from 'react-bootstrap';
import { Bell, LogOut, Settings, ChevronDown, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getBalance, formatBalance } from '../services/virtualBalance';

const Navbar = () => {
    const [balanceInfo, setBalanceInfo] = useState(null);

    // Refresh balance on mount and after navigation (polling every 5s)
    useEffect(() => {
        const refresh = () => setBalanceInfo(getBalance());
        refresh();
        const t = setInterval(refresh, 5000);
        return () => clearInterval(t);
    }, []);

    const balanceUp = balanceInfo ? balanceInfo.balance >= balanceInfo.startingBalance : true;

    return (
        <BsNavbar
            expand="lg"
            className="py-2 sticky-top animate-fade-down"
            style={{ backgroundColor: 'var(--bg-sidebar)', borderBottom: '1px solid var(--border-subtle)' }}
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
                                    padding: '6px 14px',
                                    borderRadius: '10px',
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
                                        fontVariantNumeric: 'tabular-nums',
                                        lineHeight: 1.2,
                                    }}>
                                        {formatBalance(balanceInfo.balance)}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Notification Bell */}
                        <div className="notification-bell" id="notification-bell" title="Notifications">
                            <Bell size={16} />
                            <div className="notification-dot" />
                        </div>

                        {/* User Dropdown */}
                        <Dropdown align="end">
                            <Dropdown.Toggle
                                variant="transparent" id="dropdown-user"
                                className="d-flex align-items-center gap-2 border-0 text-white p-0"
                                style={{ background: 'transparent', boxShadow: 'none' }}
                            >
                                <div className="profile-avatar" style={{ width: '34px', height: '34px', fontSize: '12px', boxShadow: '0 0 10px rgba(79,124,255,0.25)' }}>
                                    AM
                                </div>
                                <div className="text-start d-none d-md-block">
                                    <div style={{ fontSize: '13px', fontWeight: 600, lineHeight: 1.2 }}>Ahmad Masood</div>
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
                                <Dropdown.Item as={Link} to="/login"
                                    style={{ borderRadius: '8px', padding: '8px 14px', fontSize: '13px', color: 'var(--color-negative)' }}
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
