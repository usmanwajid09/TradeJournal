import React from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  TrendingUp,
  PlusSquare, 
  User,
  BookOpen
} from 'lucide-react';
import logo from '../assets/logo.png';

const Sidebar = () => {
    const location = useLocation();

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'Live Trades', icon: TrendingUp, path: '/trades' },
        { name: 'Log Trade', icon: PlusSquare, path: '/add-trade' },
        { name: 'Journal', icon: BookOpen, path: '/journal' },
        { name: 'Profile', icon: User, path: '/profile' },
    ];

    return (
        <div className="sidebar vh-100 position-sticky top-0 shadow-sm" style={{ width: '260px', background: 'var(--bg-sidebar)' }}>
            <div className="sidebar-logo px-3 mb-4 d-flex align-items-center justify-content-center">
                <img src={logo} alt="TradeJournal" style={{ height: '45px', width: 'auto', marginTop: '20px' }} />
            </div>
            
            <div className="sidebar-nav">
                <div className="nav-section-label px-3 mb-2" style={{ fontSize: '10px', fontWeight: '600', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Main Menu</div>
                <Nav className="flex-column px-2 gap-1">
                    {menuItems.map((item) => (
                        <Nav.Link 
                            key={item.path}
                            as={NavLink} 
                            to={item.path} 
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        >
                            <item.icon size={18} />
                            <span>{item.name}</span>
                        </Nav.Link>
                    ))}
                </Nav>
            </div>

            <div className="sb-upsell mt-auto mx-3 mb-4 p-3 rounded-4" style={{ background: 'rgba(63, 108, 251, 0.1)', border: '1px solid rgba(63, 108, 251, 0.2)' }}>
                <div className="upsell-crown mb-2" style={{ fontSize: '20px' }}>👑</div>
                <div className="upsell-title fw-bold text-white mb-1" style={{ fontSize: '13px' }}>Go Pro Trader</div>
                <div className="upsell-sub text-secondary mb-3" style={{ fontSize: '11px', lineHeight: '1.4' }}>Unlock advanced analytics and AI insights.</div>
                <button className="btn btn-primary w-100 py-1 fw-bold" style={{ fontSize: '11px' }}>Upgrade</button>
            </div>

            <div className="sidebar-profile p-3 border-top border-subtle">
                <div className="profile-info d-flex align-items-center gap-3">
                    <div className="profile-avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '32px', height: '32px', fontSize: '12px' }}>JD</div>
                    <div className="profile-details">
                        <div className="profile-email text-white fw-bold" style={{ fontSize: '12px' }}>John Doe</div>
                        <div className="profile-role text-secondary" style={{ fontSize: '10px' }}>Pro Trader</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
