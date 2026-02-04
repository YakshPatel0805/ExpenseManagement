import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showProfileForm, setShowProfileForm] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [profileData, setProfileData] = useState({
        name: '',
        email: ''
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [settings, setSettings] = useState({
        currency: 'USD',
        notifications: true,
        darkMode: true,
        autoSync: true
    });

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                email: user.email || ''
            });
        }
    }, [user]);

    const handleLogout = async () => {
        if (window.confirm('Are you sure you want to logout?')) {
            await logout();
            navigate('/login');
        }
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(profileData),
            });

            const data = await response.json();
            if (data.success) {
                alert('Profile updated successfully!');
                setShowProfileForm(false);
            } else {
                alert(data.message || 'Error updating profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error updating profile');
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 8) {
            alert('Password must be at least 8 characters long');
            return;
        }

        try {
            const response = await fetch('/api/change-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                }),
            });

            const data = await response.json();
            if (data.success) {
                alert('Password changed successfully!');
                setShowPasswordForm(false);
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            } else {
                alert(data.message || 'Error changing password');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            alert('Error changing password');
        }
    };

    const handleSettingChange = (setting, value) => {
        setSettings(prev => ({
            ...prev,
            [setting]: value
        }));
        // In a real app, you'd save this to the backend
        localStorage.setItem('userSettings', JSON.stringify({
            ...settings,
            [setting]: value
        }));
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

                {/* Profile Form */}
                {showProfileForm && (
                    <div className="chart-container" style={{ marginBottom: '2rem' }}>
                        <div className="chart-header">
                            <h3 className="chart-title">Edit Profile</h3>
                            <button 
                                onClick={() => setShowProfileForm(false)}
                                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
                            >
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handleProfileSubmit} style={{ display: 'grid', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={profileData.name}
                                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.8rem',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={profileData.email}
                                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.8rem',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px'
                                    }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowProfileForm(false)}
                                    style={{
                                        padding: '0.8rem 1.5rem',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        background: 'white',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="tips-button" style={{ margin: 0 }}>
                                    Update Profile
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Password Form */}
                {showPasswordForm && (
                    <div className="chart-container" style={{ marginBottom: '2rem' }}>
                        <div className="chart-header">
                            <h3 className="chart-title">Change Password</h3>
                            <button 
                                onClick={() => setShowPasswordForm(false)}
                                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
                            >
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handlePasswordSubmit} style={{ display: 'grid', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.8rem',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                    required
                                    minLength="8"
                                    style={{
                                        width: '100%',
                                        padding: '0.8rem',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                    required
                                    minLength="8"
                                    style={{
                                        width: '100%',
                                        padding: '0.8rem',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px'
                                    }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordForm(false)}
                                    style={{
                                        padding: '0.8rem 1.5rem',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        background: 'white',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="tips-button" style={{ margin: 0 }}>
                                    Change Password
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="expense-list">
                    <div className="section-header">
                        <h3 className="section-title">Profile Settings</h3>
                    </div>
                    <div className="category-list">
                        <div className="expense-item">
                            <div className="category-icon" style={{ background: '#3498db' }}>👤</div>
                            <div className="category-details">
                                <div className="category-name">Profile Information</div>
                                <div className="category-description">
                                    {user?.name} • {user?.email}
                                </div>
                            </div>
                            <button 
                                className="tips-button" 
                                style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                                onClick={() => setShowProfileForm(true)}
                            >
                                Edit
                            </button>
                        </div>
                        <div className="expense-item">
                            <div className="category-icon" style={{ background: '#2ecc71' }}>🔒</div>
                            <div className="category-details">
                                <div className="category-name">Change Password</div>
                                <div className="category-description">Update your account password</div>
                            </div>
                            <button 
                                className="tips-button" 
                                style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                                onClick={() => setShowPasswordForm(true)}
                            >
                                Change
                            </button>
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
                                value={settings.currency}
                                onChange={(e) => handleSettingChange('currency', e.target.value)}
                                className="tips-button"
                                style={{
                                    padding: '0.5rem',
                                    fontSize: '0.9rem',
                                    background: '#34495e',
                                    color: '#ecf0f1',
                                    border: '1px solid #4a5f7a'
                                }}
                            >
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="GBP">GBP (£)</option>
                                <option value="CAD">CAD (C$)</option>
                                <option value="AUD">AUD (A$)</option>
                            </select>
                        </div>
                        <div className="expense-item">
                            <div className="category-icon" style={{ background: '#f39c12' }}>🔔</div>
                            <div className="category-details">
                                <div className="category-name">Notifications</div>
                                <div className="category-description">Enable push notifications</div>
                            </div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <input 
                                    type="checkbox" 
                                    checked={settings.notifications}
                                    onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                                /> 
                                Enabled
                            </label>
                        </div>
                        <div className="expense-item">
                            <div className="category-icon" style={{ background: '#34495e' }}>🌙</div>
                            <div className="category-details">
                                <div className="category-name">Dark Mode</div>
                                <div className="category-description">Use dark theme</div>
                            </div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <input 
                                    type="checkbox" 
                                    checked={settings.darkMode}
                                    onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
                                /> 
                                Enabled
                            </label>
                        </div>
                        <div className="expense-item">
                            <div className="category-icon" style={{ background: '#16a085' }}>🔄</div>
                            <div className="category-details">
                                <div className="category-name">Auto Sync</div>
                                <div className="category-description">Automatically sync data</div>
                            </div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <input 
                                    type="checkbox" 
                                    checked={settings.autoSync}
                                    onChange={(e) => handleSettingChange('autoSync', e.target.checked)}
                                /> 
                                Enabled
                            </label>
                        </div>
                    </div>
                </div>

                <div className="expense-list" style={{ marginTop: '2rem' }}>
                    <div className="section-header">
                        <h3 className="section-title">Data & Privacy</h3>
                    </div>
                    <div className="category-list">
                        <div className="expense-item">
                            <div className="category-icon" style={{ background: '#3498db' }}>📊</div>
                            <div className="category-details">
                                <div className="category-name">Export Data</div>
                                <div className="category-description">Download your financial data</div>
                            </div>
                            <button 
                                className="tips-button" 
                                style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                                onClick={() => alert('Export feature coming soon!')}
                            >
                                Export
                            </button>
                        </div>
                        <div className="expense-item">
                            <div className="category-icon" style={{ background: '#e67e22' }}>🗑️</div>
                            <div className="category-details">
                                <div className="category-name">Delete Account</div>
                                <div className="category-description">Permanently delete your account</div>
                            </div>
                            <button 
                                className="tips-button" 
                                style={{ 
                                    padding: '0.5rem 1rem', 
                                    fontSize: '0.9rem', 
                                    background: '#e74c3c' 
                                }}
                                onClick={() => {
                                    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                                        alert('Account deletion feature coming soon!');
                                    }
                                }}
                            >
                                Delete
                            </button>
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