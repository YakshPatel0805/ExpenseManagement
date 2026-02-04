import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';

const Accounts = () => {
    const [wallets, setWallets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingWallet, setEditingWallet] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        type: 'checking',
        balance: '0',
        currency: 'USD',
        color: '#3498db',
        bankName: '',
        accountNumber: '',
        creditLimit: ''
    });

    useEffect(() => {
        fetchWallets();
    }, []);

    const fetchWallets = async () => {
        try {
            const response = await fetch('/api/wallets', {
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                setWallets(data.wallets);
            } else {
                console.error('Failed to fetch wallets:', data.message);
            }
        } catch (error) {
            console.error('Error fetching wallets:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic client-side validation
        if (!formData.name.trim()) {
            alert('Account name is required');
            return;
        }
        
        try {
            const url = editingWallet ? `/api/wallets/${editingWallet._id}` : '/api/wallets';
            const method = editingWallet ? 'PUT' : 'POST';
            
            const submitData = {
                name: formData.name.trim(),
                type: formData.type,
                balance: formData.balance ? parseFloat(formData.balance) : 0,
                currency: formData.currency || 'USD',
                color: formData.color || '#3498db',
                bankName: formData.bankName.trim() || undefined,
                accountNumber: formData.accountNumber.trim() || undefined,
                creditLimit: formData.creditLimit ? parseFloat(formData.creditLimit) : undefined
            };

            console.log('Submitting data:', submitData);

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(submitData),
            });

            const data = await response.json();
            console.log('Response:', data);
            
            if (data.success) {
                await fetchWallets();
                resetForm();
                alert(editingWallet ? 'Account updated successfully!' : 'Account created successfully!');
            } else {
                console.error('Server error:', data);
                if (data.errors && data.errors.length > 0) {
                    const errorMessages = data.errors.map(err => err.msg).join('\n');
                    alert(`Validation errors:\n${errorMessages}`);
                } else {
                    alert(data.message || 'Error saving account');
                }
            }
        } catch (error) {
            console.error('Error saving wallet:', error);
            alert('Network error occurred while saving account');
        }
    };

    const handleEdit = (wallet) => {
        setEditingWallet(wallet);
        setFormData({
            name: wallet.name,
            type: wallet.type,
            balance: wallet.balance.toString(),
            currency: wallet.currency,
            color: wallet.color,
            bankName: wallet.bankName || '',
            accountNumber: wallet.accountNumber || '',
            creditLimit: wallet.creditLimit ? wallet.creditLimit.toString() : ''
        });
        setShowAddForm(true);
    };

    const handleDelete = async (walletId) => {
        if (window.confirm('Are you sure you want to delete this account?')) {
            try {
                const response = await fetch(`/api/wallets/${walletId}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });
                const data = await response.json();
                if (data.success) {
                    await fetchWallets();
                    alert('Account deleted successfully!');
                } else {
                    alert(data.message || 'Error deleting account');
                }
            } catch (error) {
                console.error('Error deleting wallet:', error);
                alert('Error deleting account');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            type: 'checking',
            balance: '0',
            currency: 'USD',
            color: '#3498db',
            bankName: '',
            accountNumber: '',
            creditLimit: ''
        });
        setEditingWallet(null);
        setShowAddForm(false);
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

    if (loading) {
        return (
            <DashboardLayout>
                <div className="dashboard-header">
                    <div>
                        <h1 className="dashboard-title">Accounts</h1>
                        <p className="dashboard-date">Loading your accounts...</p>
                    </div>
                </div>
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <div style={{ fontSize: '2rem' }}>🏦</div>
                    <p>Loading accounts...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div id="accounts-page" className="page-content">
                <div className="dashboard-header">
                    <div>
                        <h1 className="dashboard-title">Accounts</h1>
                        <p className="dashboard-date">Manage your financial accounts</p>
                    </div>
                    <button 
                        className="tips-button" 
                        style={{height: 'fit-content'}}
                        onClick={() => setShowAddForm(true)}
                    >
                        + Add Account
                    </button>
                </div>

                {/* Add/Edit Form */}
                {showAddForm && (
                    <div className="chart-container" style={{ marginBottom: '2rem' }}>
                        <div className="chart-header">
                            <h3 className="chart-title">
                                {editingWallet ? 'Edit Account' : 'Add New Account'}
                            </h3>
                            <button 
                                onClick={resetForm}
                                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
                            >
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                        Account Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
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
                                        Account Type *
                                    </label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '0.8rem',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px'
                                        }}
                                    >
                                        <option value="savings">Savings Account</option>
                                        <option value="credit_card">Credit Card</option>
                                        <option value="debit_card">Debit Card</option>
                                        <option value="cash">Cash</option>
                                        <option value="investment">Investment Account</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                        Current Balance
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.balance}
                                        onChange={(e) => setFormData({...formData, balance: e.target.value})}
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
                                        Bank Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.bankName}
                                        onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                                        style={{
                                            width: '100%',
                                            padding: '0.8rem',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px'
                                        }}
                                    />
                                </div>
                            </div>

                            {formData.type === 'credit_card' && (
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                        Credit Limit
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.creditLimit}
                                        onChange={(e) => setFormData({...formData, creditLimit: e.target.value})}
                                        style={{
                                            width: '100%',
                                            padding: '0.8rem',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px'
                                        }}
                                    />
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                <button
                                    type="button"
                                    onClick={resetForm}
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
                                    {editingWallet ? 'Update Account' : 'Add Account'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Accounts List */}
                <div className="expense-list">
                    <div className="section-header">
                        <h3 className="section-title">Your Accounts ({wallets.length})</h3>
                    </div>
                    
                    {wallets.length === 0 ? (
                        <div className="chart-container">
                            <div style={{ textAlign: 'center', padding: '2rem' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏦</div>
                                <h3 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>No Accounts Yet</h3>
                                <p style={{ color: '#7f8c8d', marginBottom: '1rem' }}>
                                    Add your first account to start tracking your finances.
                                </p>
                                <button 
                                    className="tips-button"
                                    onClick={() => setShowAddForm(true)}
                                >
                                    Add Your First Account
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="category-list">
                            {wallets.map((wallet) => (
                                <div key={wallet._id} className="expense-item">
                                    <div 
                                        className="category-icon" 
                                        style={{ background: wallet.color }}
                                    >
                                        {getTypeIcon(wallet.type)}
                                    </div>
                                    <div className="category-details">
                                        <div className="category-name">{wallet.name}</div>
                                        <div className="category-description">
                                            {getTypeLabel(wallet.type)}
                                            {wallet.bankName && ` • ${wallet.bankName}`}
                                            {wallet.type === 'credit_card' && wallet.creditLimit && 
                                                ` • Limit: ${formatCurrency(wallet.creditLimit)}`
                                            }
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div className="category-amount">
                                            {formatCurrency(wallet.balance)}
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => handleEdit(wallet)}
                                                style={{
                                                    background: '#3498db',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '0.5rem',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    fontSize: '0.8rem'
                                                }}
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => handleDelete(wallet._id)}
                                                style={{
                                                    background: '#e74c3c',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '0.5rem',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    fontSize: '0.8rem'
                                                }}
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Accounts;