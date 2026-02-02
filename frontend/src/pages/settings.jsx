import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        if (window.confirm('Are you sure you want to logout?')) {
            await logout();
            navigate('/login');
        }
    };
    return (
        <DashboardLayout>
            <div id="settings-page" className="page-content">
                <div className="dashboard-header">
                    <div>
                        <h1 className="dashboard-title">Settings</h1>
                        <p className="dashboard-date">Manage your preferences</p>
                    </div>
                </div>

                <div className="expense-list">
                    <div className="section-header">
                        <h3 className="section-title">Profile Settings</h3>
                    </div>
                    <div className="category-list">
                        <div className="expense-item">
                            <div className="category-icon" style={{ background: '#3498db' }}>👤</div>
                            <div className="category-details">
                                <div className="category-name">Profile Information</div>
                                <div className="category-description">Update your personal details</div>
                            </div>
                            <button className="tips-button" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Edit</button>
                        </div>
                        <div className="expense-item">
                            <div className="category-icon" style={{ background: '#2ecc71' }}>🔒</div>
                            <div className="category-details">
                                <div className="category-name">Change Password</div>
                                <div className="category-description">Update your account password</div>
                            </div>
                            <button className="tips-button" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Change</button>
                        </div>
                    </div>
                </div>

                <div className="expense-list" style={{ marginTop: '2rem' }}>
                    <div className="section-header">
                        <h3 className="section-title">App Preferences</h3>
                    </div>
                    <div className="category-list">
                        <div className="expense-item">
                            <div className="category-icon" style={{ background: '#9b59b6' }}>💱</div>
                            <div className="category-details">
                                <div className="category-name">Currency</div>
                                <div className="category-description">Default currency for transactions</div>
                            </div>
                            <select
                                className="tips-button"
                                style={{
                                    padding: '0.5rem',
                                    fontSize: '0.9rem',
                                    background: '#34495e',
                                    color: '#ecf0f1',
                                    border: '1px solid #4a5f7a'
                                }}
                            >
                                <option>USD ($)</option>
                                <option>EUR (€)</option>
                                <option>GBP (£)</option>
                            </select>
                        </div>
                        <div className="expense-item">
                            <div className="category-icon" style={{ background: '#f39c12' }}>🔔</div>
                            <div className="category-details">
                                <div className="category-name">Notifications</div>
                                <div className="category-description">Enable push notifications</div>
                            </div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <input type="checkbox" defaultChecked /> Enabled
                            </label>
                        </div>
                    </div>
                </div>

                <div className="expense-list" style={{ marginTop: '2rem' }}>
                    <div className="section-header">
                        <h3 className="section-title">Account Actions</h3>
                    </div>
                    <div className="category-list">
                        <div className="expense-item">
                            <div className="category-icon" style={{ background: '#e74c3c' }}>🚪</div>
                            <div className="category-details">
                                <div className="category-name">Logout</div>
                                <div className="category-description">Sign out of your account</div>
                            </div>
                            <button
                                className="tips-button"
                                style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', background: '#e74c3c' }}
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Settings;