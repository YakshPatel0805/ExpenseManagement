import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';

const Wallets = () => {
    const [wallets, setWallets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchWallets();
    }, []);

    const fetchWallets = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/wallets', {
                credentials: 'include'
            });
            const data = await response.json();
            
            if (data.success) {
                setWallets(data.wallets);
                setError('');
            } else {
                setError(data.message || 'Failed to fetch wallets');
            }
        } catch (error) {
            console.error('Error fetching wallets:', error);
            setError('Network error occurred');
        } finally {
            setLoading(false);
        }
    };

    const getTypeIcon = (type) => {
        const icons = {
            credit_card: '💳',
            debit_card: '💳',
            savings: '🏦',
            checking: '🏦',
            cash: '💵',
            investment: '📈',
            other: '👛'
        };
        return icons[type] || '👛';
    };

    const getTypeLabel = (type) => {
        const labels = {
            credit_card: 'Credit Card',
            debit_card: 'Debit Card',
            savings: 'Savings Account',
            checking: 'Checking Account',
            cash: 'Cash',
            investment: 'Investment Account',
            other: 'Other'
        };
        return labels[type] || 'Other';
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const getCardGradient = (type) => {
        const gradients = {
            credit_card: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            debit_card: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            savings: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)',
            checking: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
            cash: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)',
            investment: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)',
            other: 'linear-gradient(135deg, #34495e 0%, #2c3e50 100%)'
        };
        return gradients[type] || gradients.other;
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="dashboard-header">
                    <div>
                        <h1 className="dashboard-title">Wallets</h1>
                        <p className="dashboard-date">Loading your accounts...</p>
                    </div>
                </div>
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <div style={{ fontSize: '2rem' }}>💳</div>
                    <p>Loading wallets...</p>
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <div className="dashboard-header">
                    <div>
                        <h1 className="dashboard-title">Wallets</h1>
                        <p className="dashboard-date">Error loading accounts</p>
                    </div>
                </div>
                <div className="chart-container">
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
                        <h3 style={{ color: '#e74c3c', marginBottom: '0.5rem' }}>Error Loading Wallets</h3>
                        <p style={{ color: '#7f8c8d', marginBottom: '1rem' }}>{error}</p>
                        <button className="tips-button" onClick={fetchWallets}>
                            Try Again
                        </button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }
    return (
        <DashboardLayout>
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">Wallets</h1>
                    <p className="dashboard-date">Manage your Wallet</p>
                </div>
                {/* <div style={{display: 'flex', gap: '1rem'}}>
                    <Link to="/wallets" style={{textDecoration: 'none'}}> 
                        <button className="tips-button" style={{height: 'fit-content'}}>+ Add Wallet</button>
                    </Link>
                </div> */}
            </div>

            {wallets.length === 0 ? (
                <div className="chart-container">
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💳</div>
                        <h3 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>No Wallets Yet</h3>
                        <p style={{ color: '#7f8c8d', marginBottom: '1rem' }}>
                            Add your first account to start tracking your finances.
                        </p>
                        <Link to="/accounts" style={{textDecoration: 'none'}}>
                            <button className="tips-button">
                                Add Your First Account
                            </button>
                        </Link>
                    </div>
                </div>
            ) : (
                <>
                    {/* Wallet Cards */}
                    <div className="wallet-cards-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem'}}>
                        {wallets.map((wallet) => (
                            <div 
                                key={wallet._id} 
                                className="chart-container" 
                                style={{
                                    background: wallet.color ? wallet.color : getCardGradient(wallet.type), 
                                    color: 'white', 
                                    position: 'relative', 
                                    overflow: 'hidden'
                                }}
                            >
                                <div style={{position: 'absolute', top: '1rem', right: '1rem', fontSize: '1.5rem'}}>
                                    {getTypeIcon(wallet.type)}
                                </div>
                                <div style={{marginBottom: '2rem'}}>
                                    <div style={{fontSize: '0.9rem', opacity: '0.8'}}>{getTypeLabel(wallet.type)}</div>
                                    <div style={{fontSize: '1.8rem', fontWeight: 'bold', margin: '0.5rem 0'}}>
                                        {formatCurrency(wallet.balance)}
                                    </div>
                                    <div style={{fontSize: '0.8rem', opacity: '0.8'}}>
                                        {wallet.accountNumber ? `**** ${wallet.accountNumber.slice(-4)}` : wallet.name}
                                    </div>
                                </div>
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'end'}}>
                                    <div>
                                        <div style={{fontSize: '0.8rem', opacity: '0.8', textTransform: 'uppercase'}}>
                                            {wallet.name}
                                        </div>
                                        {wallet.bankName && (
                                            <div style={{fontSize: '0.8rem', opacity: '0.8'}}>
                                                {wallet.bankName}
                                            </div>
                                        )}
                                        {wallet.type === 'credit_card' && wallet.creditLimit && (
                                            <div style={{fontSize: '0.8rem', opacity: '0.8'}}>
                                                Limit: {formatCurrency(wallet.creditLimit)}
                                            </div>
                                        )}
                                    </div>
                                    <div style={{fontSize: '1.2rem'}}>
                                        {wallet.currency || 'USD'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Recent Transactions */}
                    <div className="expense-list">
                        <div className="section-header">
                            <h3 className="section-title">Recent Transactions</h3>
                        </div>
                        <div className="category-list">
                            <div className="expense-item">
                                <div className="category-icon" style={{background: '#2ecc71'}}>↗️</div>
                                <div className="category-details">
                                    <div className="category-name">Transfer to Savings</div>
                                    <div className="category-description">From Credit Card • 2:30 PM</div>
                                </div>
                                <div className="category-amount" style={{color: '#2ecc71'}}>+$500.00</div>
                            </div>
                            <div className="expense-item">
                                <div className="category-icon" style={{background: '#e74c3c'}}>↙️</div>
                                <div className="category-details">
                                    <div className="category-name">ATM Withdrawal</div>
                                    <div className="category-description">Chase ATM • 1:15 PM</div>
                                </div>
                                <div className="category-amount" style={{color: '#e74c3c'}}>-$100.00</div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </DashboardLayout>
    );
};

export default Wallets;