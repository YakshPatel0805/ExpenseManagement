import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';

const Wallets = () => {
    const [wallets, setWallets] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showTransferForm, setShowTransferForm] = useState(false);
    const [transferData, setTransferData] = useState({
        fromWalletId: '',
        toWalletId: '',
        amount: '',
        description: ''
    });

    useEffect(() => {
        fetchWallets();
        fetchTransactions();
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

    const fetchTransactions = async () => {
        try {
            const response = await fetch('/api/transactions/recent?limit=10', {
                credentials: 'include'
            });
            const data = await response.json();
            
            if (data.success) {
                setTransactions(data.transactions);
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
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

    const handleTransfer = async (e) => {
        e.preventDefault();

        if (!transferData.fromWalletId) {
            alert('Please select a source account');
            return;
        }

        if (!transferData.toWalletId) {
            alert('Please select a destination account');
            return;
        }

        if (transferData.fromWalletId === transferData.toWalletId) {
            alert('Source and destination accounts must be different');
            return;
        }

        if (!transferData.amount || parseFloat(transferData.amount) <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        try {
            const response = await fetch('/api/wallets/transfer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    ...transferData,
                    amount: parseFloat(transferData.amount)
                }),
            });

            const data = await response.json();

            if (data.success) {
                await fetchWallets();
                await fetchTransactions();
                resetTransferForm();
                alert('Transfer completed successfully!');
            } else {
                alert(data.message || 'Error completing transfer');
            }
        } catch (error) {
            console.error('Error transferring money:', error);
            alert('Network error occurred');
        }
    };

    const resetTransferForm = () => {
        setTransferData({
            fromWalletId: '',
            toWalletId: '',
            amount: '',
            description: ''
        });
        setShowTransferForm(false);
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

    const getTransactionIcon = (type) => {
        const icons = {
            expense: '💸',
            income: '💰',
            transfer: '💳'
        };
        return icons[type] || '📊';
    };

    const getTransactionColor = (type) => {
        const colors = {
            expense: '#e74c3c',
            income: '#2ecc71',
            transfer: '#3498db'
        };
        return colors[type] || '#7f8c8d';
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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
                <div style={{display: 'flex', gap: '1rem'}}>
                    <button 
                        className="tips-button" 
                        style={{height: 'fit-content'}}
                        onClick={() => setShowTransferForm(true)}
                    >
                        💸 Transfer Money
                    </button>
                </div>
            </div>

            {/* Transfer Form */}
            {showTransferForm && (
                <div className="chart-container" style={{ marginBottom: '2rem' }}>
                    <div className="chart-header">
                        <h3 className="chart-title">Transfer Money</h3>
                        <button 
                            onClick={resetTransferForm}
                            style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
                        >
                            ✕
                        </button>
                    </div>
                    <form onSubmit={handleTransfer} style={{ display: 'grid', gap: '1rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                    📤 From Account *
                                </label>
                                <select
                                    value={transferData.fromWalletId}
                                    onChange={(e) => setTransferData({...transferData, fromWalletId: e.target.value})}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.8rem',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        backgroundColor: 'white'
                                    }}
                                >
                                    <option value="">Select source account</option>
                                    {wallets.map(wallet => (
                                        <option key={wallet._id} value={wallet._id}>
                                            {wallet.name} ({formatCurrency(wallet.balance)})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                    📥 To Account *
                                </label>
                                <select
                                    value={transferData.toWalletId}
                                    onChange={(e) => setTransferData({...transferData, toWalletId: e.target.value})}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.8rem',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        backgroundColor: 'white'
                                    }}
                                >
                                    <option value="">Select destination account</option>
                                    {wallets.map(wallet => (
                                        <option key={wallet._id} value={wallet._id}>
                                            {wallet.name} ({formatCurrency(wallet.balance)})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                    💰 Amount *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    value={transferData.amount}
                                    onChange={(e) => setTransferData({...transferData, amount: e.target.value})}
                                    placeholder="0.00"
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
                                    📝 Description
                                </label>
                                <input
                                    type="text"
                                    value={transferData.description}
                                    onChange={(e) => setTransferData({...transferData, description: e.target.value})}
                                    placeholder="e.g., Monthly savings"
                                    style={{
                                        width: '100%',
                                        padding: '0.8rem',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px'
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            <button
                                type="button"
                                onClick={resetTransferForm}
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
                            <button
                                type="submit"
                                className="tips-button"
                                style={{ margin: 0 }}
                            >
                                Transfer Money
                            </button>
                        </div>
                    </form>
                </div>
            )}

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
                        
                        {transactions.length === 0 ? (
                            <div className="chart-container">
                                <div style={{ textAlign: 'center', padding: '2rem' }}>
                                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📊</div>
                                    <p style={{ color: '#7f8c8d' }}>No transactions yet</p>
                                </div>
                            </div>
                        ) : (
                            <div className="category-list">
                                {transactions.map((transaction) => {
                                    const fromWallet = transaction.fromWalletId;
                                    const toWallet = transaction.toWalletId;
                                    
                                    let displayText = '';
                                    let displayAmount = '';
                                    let amountColor = '#7f8c8d';
                                    
                                    if (transaction.type === 'transfer') {
                                        displayText = `Transfer from ${fromWallet?.name || 'Unknown'} to ${toWallet?.name || 'Unknown'}`;
                                        displayAmount = `-${formatCurrency(transaction.amount)}`;
                                        amountColor = '#3498db';
                                    } else if (transaction.type === 'expense') {
                                        displayText = transaction.description || 'Expense';
                                        displayAmount = `-${formatCurrency(transaction.amount)}`;
                                        amountColor = '#e74c3c';
                                    } else if (transaction.type === 'income') {
                                        displayText = transaction.description || 'Income';
                                        displayAmount = `+${formatCurrency(transaction.amount)}`;
                                        amountColor = '#2ecc71';
                                    }
                                    
                                    return (
                                        <div key={transaction._id} className="expense-item">
                                            <div className="category-icon" style={{ background: getTransactionColor(transaction.type) }}>
                                                {getTransactionIcon(transaction.type)}
                                            </div>
                                            <div className="category-details">
                                                <div className="category-name">{displayText}</div>
                                                <div className="category-description">
                                                    {formatDate(transaction.date)}
                                                </div>
                                            </div>
                                            <div className="category-amount" style={{color: amountColor}}>
                                                {displayAmount}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </>
            )}
        </DashboardLayout>
    );
};

export default Wallets;