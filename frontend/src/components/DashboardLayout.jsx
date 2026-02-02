import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = ({ children }) => {
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const { user, logout } = useAuth();
    const location = useLocation();

    const toggleMobileNav = () => {
        setMobileNavOpen(!mobileNavOpen);
    };

    const closeMobileNav = () => {
        setMobileNavOpen(false);
    };

    const handleLogout = async () => {
        if (window.confirm('Are you sure you want to logout?')) {
            await logout();
        }
    };

    const navItems = [
        { path: '/dashboard', icon: '📊', label: 'Dashboard' },
        { path: '/expenses', icon: '💰', label: 'Expenses' },
        { path: '/wallets', icon: '👛', label: 'Wallets' },
        { path: '/summary', icon: '📋', label: 'Summary' },
        { path: '/accounts', icon: '🏦', label: 'Accounts' },
        { path: '/settings', icon: '⚙️', label: 'Settings' },
    ];

    return (
        <div className="dashboard-container">
            {/* Mobile Navigation Toggle */}
            <button 
                className="mobile-nav-toggle" 
                onClick={toggleMobileNav}
            >
                ☰
            </button>
            
            {/* Mobile Navigation Overlay */}
            <div 
                className={`mobile-nav-overlay ${mobileNavOpen ? 'active' : ''}`}
                onClick={closeMobileNav}
            ></div>
            
            {/* Sidebar */}
            <div className={`sidebar ${mobileNavOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="user-avatar">👤</div>
                    <div className="user-name">{user?.name || 'User'}</div>
                    <div className="user-email">{user?.email || 'user@email.com'}</div>
                </div>
                
                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                            onClick={closeMobileNav}
                        >
                            <i>{item.icon}</i> {item.label}
                        </Link>
                    ))}
                    <button 
                        className="nav-item logout-btn" 
                        onClick={handleLogout}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'inherit',
                            width: '100%',
                            textAlign: 'left',
                            padding: '1rem 1.5rem',
                            cursor: 'pointer'
                        }}
                    >
                        <i>🚪</i> Logout
                    </button>
                </nav>
            </div>

            {/* Main Content */}
            <div className="main-content">
                {children}
            </div>
        </div>
    );
};

export default DashboardLayout;