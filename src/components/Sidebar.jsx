import React from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, PlusSquare, User, BookOpen } from 'lucide-react';
import logo from '../assets/logo.png';

const menuItems = [
    { name: 'Dashboard',   icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Live Trades', icon: TrendingUp,       path: '/trades' },
    { name: 'Log Trade',   icon: PlusSquare,       path: '/add-trade' },
    { name: 'Journal',     icon: BookOpen,         path: '/journal' },
    { name: 'Profile',     icon: User,             path: '/profile' },
];

const Sidebar = () => (
    <div className="sidebar vh-100 position-sticky top-0" style={{ width: '260px', animation: 'fadeInLeft 0.45s cubic-bezier(.4,0,.2,1) both' }}>
        {/* Logo */}
        <div className="sidebar-logo px-2 d-flex align-items-center justify-content-center">
            <img src={logo} alt="TradeJournal" style={{ height: '42px', width: 'auto', marginTop: '4px', filter: 'drop-shadow(0 0 10px rgba(79,124,255,0.3))' }} />
        </div>

        {/* Nav Section Label */}
        <div className="px-3 mb-2" style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Main Menu
        </div>

        {/* Nav Items */}
        <Nav className="flex-column px-2 gap-1">
            {menuItems.map(item => (
                <Nav.Link
                    key={item.path}
                    as={NavLink}
                    to={item.path}
                    id={`nav-${item.name.toLowerCase().replace(' ', '-')}`}
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <item.icon size={17} />
                    <span>{item.name}</span>
                </Nav.Link>
            ))}
        </Nav>

        {/* Pro Upsell */}
        <div className="sb-upsell mt-auto mx-2 mb-3 animate-fade-up delay-6">
            <div className="upsell-crown">👑</div>
            <div className="upsell-title">Go Pro Trader</div>
            <div className="upsell-sub">Unlock advanced AI analytics, backtesting &amp; smart insights.</div>
            <button className="upsell-btn">Upgrade to Pro</button>
        </div>

        {/* Profile */}
        <div className="sidebar-profile px-2">
            <div className="profile-info">
                <div className="profile-avatar" style={{ boxShadow: '0 0 12px rgba(79,124,255,0.3)' }}>AM</div>
                <div className="profile-details">
                    <div className="profile-email">Ahmad Masood</div>
                    <div className="profile-role">Pro Trader</div>
                </div>
            </div>
        </div>
    </div>
);

export default Sidebar;
