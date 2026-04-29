import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, PlusSquare, User, BookOpen } from 'lucide-react';
import logo from '../assets/logo.png';

const menuItems = [
    { name: 'Dashboard',   Icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Live Trades', Icon: TrendingUp,       path: '/trades' },
    { name: 'Log Trade',   Icon: PlusSquare,       path: '/add-trade' },
    { name: 'Journal',     Icon: BookOpen,         path: '/journal' },
    { name: 'Profile',     Icon: User,             path: '/profile' },
];

const Sidebar = () => (
    <div style={{
        width: '260px',
        height: '100%',
        background: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 12px',
        flexShrink: 0,
        animation: 'fadeInLeft 0.45s cubic-bezier(.4,0,.2,1) both',
        position: 'relative',
    }}>
        {/* Gradient accent line on right edge */}
        <div style={{
            position: 'absolute', top: 0, right: 0,
            width: '1px', height: '100%',
            background: 'linear-gradient(to bottom, transparent, rgba(79,124,255,0.25) 40%, rgba(79,124,255,0.25) 60%, transparent)',
        }}/>

        {/* Logo */}
        <div style={{ paddingBottom: '20px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={logo} alt="TradeJournal" style={{ height: '42px', width: 'auto', filter: 'drop-shadow(0 0 10px rgba(79,124,255,0.3))' }} />
        </div>

        {/* Menu label */}
        <div style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.1em', paddingLeft: '10px', marginBottom: '8px' }}>
            Main Menu
        </div>

        {/* Nav Items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {menuItems.map(({ name, Icon, path }) => (
                <NavLink
                    key={path}
                    to={path}
                    id={`nav-${name.toLowerCase().replace(' ', '-')}`}
                    style={({ isActive }) => ({
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        fontSize: '13px',
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? 'var(--accent-blue)' : 'var(--text-secondary)',
                        background: isActive ? 'var(--accent-blue-dim)' : 'transparent',
                        border: isActive ? '1px solid rgba(79,124,255,0.15)' : '1px solid transparent',
                        textDecoration: 'none',
                        transition: 'all 0.15s ease',
                        position: 'relative',
                    })}
                    onMouseEnter={e => {
                        if (!e.currentTarget.classList.contains('active')) {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                            e.currentTarget.style.color = 'var(--text-primary)';
                        }
                    }}
                    onMouseLeave={e => {
                        if (!e.currentTarget.style.color.includes('var(--accent-blue)')) {
                            e.currentTarget.style.background = 'transparent';
                        }
                    }}
                >
                    {({ isActive }) => (
                        <>
                            {/* Left indicator */}
                            {isActive && (
                                <div style={{
                                    position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                                    width: '3px', height: '60%',
                                    background: 'var(--gradient-primary)',
                                    borderRadius: '0 2px 2px 0',
                                }}/>
                            )}
                            <Icon size={17} style={{
                                color: isActive ? 'var(--accent-blue)' : 'currentColor',
                                filter: isActive ? 'drop-shadow(0 0 4px rgba(79,124,255,0.4))' : 'none',
                                flexShrink: 0,
                                stroke: 'currentColor',
                                fill: 'none',
                                strokeWidth: 1.8,
                            }}/>
                            <span>{name}</span>
                        </>
                    )}
                </NavLink>
            ))}
        </nav>

        {/* Pro Upsell */}
        <div style={{
            marginTop: 'auto',
            marginBottom: '12px',
            borderRadius: '12px',
            padding: '16px',
            background: 'linear-gradient(135deg, rgba(79,124,255,0.08) 0%, rgba(167,139,250,0.06) 100%)',
            border: '1px solid rgba(79, 124, 255, 0.2)',
            position: 'relative',
            overflow: 'hidden',
        }}>
            <div style={{ position: 'absolute', top: -30, right: -30, width: 80, height: 80, borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,124,255,0.12) 0%, transparent 60%)' }}/>
            <div style={{ fontSize: '20px', marginBottom: '8px' }}>👑</div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>Go Pro Trader</div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: 1.5 }}>
                Unlock advanced AI analytics, backtesting &amp; smart insights.
            </div>
            <button style={{
                width: '100%', padding: '8px',
                background: 'var(--gradient-primary)',
                border: 'none', borderRadius: '8px',
                fontSize: '12px', fontWeight: 700, color: '#fff',
                cursor: 'pointer', transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
                Upgrade to Pro
            </button>
        </div>

        {/* Profile */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', borderRadius: '10px', cursor: 'pointer', transition: 'background 0.15s' }}
                onClick={() => window.location.href='/profile'}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
                <div style={{
                    width: '34px', height: '34px', borderRadius: '50%',
                    background: 'var(--gradient-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: 700, color: '#fff',
                    boxShadow: '0 0 12px rgba(79,124,255,0.3)',
                    flexShrink: 0,
                }}>
                    {localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).name.split(' ').map(n => n[0]).join('').toUpperCase() : 'GU'}
                </div>
                <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).name : 'Guest User'}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Pro Trader</div>
                </div>
            </div>
        </div>
    </div>
);

export default Sidebar;
