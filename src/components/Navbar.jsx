import React, { useState } from 'react';
import { Navbar as BsNavbar, Container, Nav, Dropdown } from 'react-bootstrap';
import { Bell, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [showNotif, setShowNotif] = useState(false);

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

                        {/* Notification Bell */}
                        <div
                            className="notification-bell"
                            id="notification-bell"
                            onClick={() => setShowNotif(v => !v)}
                            title="Notifications"
                        >
                            <Bell size={16} />
                            <div className="notification-dot" />
                        </div>

                        {/* User Dropdown */}
                        <Dropdown align="end">
                            <Dropdown.Toggle
                                variant="transparent"
                                id="dropdown-user"
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

                            <Dropdown.Menu
                                style={{
                                    backgroundColor: 'var(--bg-card)',
                                    border: '1px solid var(--border-subtle)',
                                    borderRadius: '12px',
                                    padding: '8px',
                                    boxShadow: 'var(--shadow-elevated)',
                                    minWidth: '180px',
                                }}
                            >
                                <Dropdown.Item
                                    as={Link} to="/profile"
                                    style={{ borderRadius: '8px', padding: '8px 14px', fontSize: '13px', color: 'var(--text-primary)' }}
                                    className="d-flex align-items-center gap-2"
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    <Settings size={14} style={{ color: 'var(--text-secondary)' }} /> Profile Settings
                                </Dropdown.Item>
                                <Dropdown.Divider style={{ borderColor: 'var(--border-subtle)', margin: '4px 0' }} />
                                <Dropdown.Item
                                    as={Link} to="/login"
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
