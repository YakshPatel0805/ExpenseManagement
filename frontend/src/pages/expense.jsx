import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';

const Expense = () => {
    const [expenses, setExpenses] = useState([]);
    const [wallets, setWallets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        category: 'food',
        walletId: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
    });
    const [summary, setSummary] = useState([]);

    useEffect(() => {
        fetchExpenses();
        fetchWallets();
        fetchSummary();
    }, []);

    const fetchExpenses = async () => {
        try {
            const response = await fetch('/api/expenses?limit=10', {
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                setExpenses(data.expenses);
            }
        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    };

    const fetchWallets = async () => {
        try {
            const response = await fetch('/api/wallets', {
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                setWallets(data.wallets);
                if (data.wallets.length > 0 && !formData.walletId) {
                    setFormData(prev => ({ ...prev, walletId: data.wallets[0]._id }));
                }
            }
        } catch (error) {
            console.error('Error fetching wallets:', error);
        }
    };

    const fetchSummary = async () => {
        try {
            const response = await fetch('/api/expenses/summary', {
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                setSummary(data.summary);
            }
        } catch (error) {
            console.error('Error fetching summary:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.title.trim() || !formData.amount || !formData.walletId) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            const response = await fetch('/api/expenses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    ...formData,
                    amount: parseFloat(formData.amount)
                }),
            });

            const data = await response.json();
            
            if (data.success) {
                await fetchExpenses();
                await fetchSummary();
                resetForm();
                alert('Expense added successfully!');
            } else {
                alert(data.message || 'Error adding expense');
            }
        } catch (error) {
            console.error('Error adding expense:', error);
            alert('Network error occurred');
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            amount: '',
            category: 'food',
            walletId: wallets.length > 0 ? wallets[0]._id : '',
            description: '',
            date: new Date().toISOString().split('T')[0]
        });
        setShowAddForm(false);
    };

    const getCategoryIcon = (category) => {
        const icons = {
            food: '🍕',
            shopping: '🛒',
            housing: '🏠',
            transportation: '🚗',
            entertainment: '🎮',
            healthcare: '🏥',
            utilities: '⚡',
            other: '📦'
        };
        return icons[category] || '📦';
    };

    const getCategoryLabel = (category) => {
        const labels = {
            food: 'Food & Drinks',
            shopping: 'Shopping',
            housing: 'Housing',
            transportation: 'Transportation',
            entertainment: 'Entertainment',
            healthcare: 'Healthcare',
            utilities: 'Utilities',
            other: 'Other'
        };
        return labels[category] || 'Other';
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };
    return (
        <DashboardLayout>
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">Expenses</h1>
                    <p className="dashboard-date">Track your spending</p>
                </div>
                <button 
                    className="tips-button" 
                    style={{height: 'fit-content'}}
                    onClick={() => setShowAddForm(true)}
                >
                    + Add Expense
                </button>
            </div>

            {/* Add Expense Form */}
            {showAddForm && (
                <div className="chart-container" style={{ marginBottom: '2rem' }}>
                    <div className="chart-header">
                        <h3 className="chart-title">Add New Expense</h3>
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
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    placeholder="e.g., Lunch at restaurant"
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
                                    Amount *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
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
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                    Category *
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.8rem',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px'
                                    }}
                                >
                                    <option value="food">🍕 Food & Drinks</option>
                                    <option value="shopping">🛒 Shopping</option>
                                    <option value="housing">🏠 Housing</option>
                                    <option value="transportation">🚗 Transportation</option>
                                    <option value="entertainment">🎮 Entertainment</option>
                                    <option value="healthcare">🏥 Healthcare</option>
                                    <option value="utilities">⚡ Utilities</option>
                                    <option value="other">📦 Other</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                    Account *
                                </label>
                                <select
                                    value={formData.walletId}
                                    onChange={(e) => setFormData({...formData, walletId: e.target.value})}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.8rem',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px'
                                    }}
                                >
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
                                    Date
                                </label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({...formData, date: e.target.value})}
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
                                    Description
                                </label>
                                <input
                                    type="text"
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    placeholder="Optional notes"
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
                                Add Expense
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="dashboard-grid">
                {/* Expense Summary */}
                <div className="expense-summary">
                    <div className="summary-header">
                        <h3 className="summary-title">Where your money goes?</h3>
                    </div>
                    <div className="category-list">
                        {summary.map((item) => (
                            <div key={item._id} className="category-item">
                                <div className="category-icon">{getCategoryIcon(item._id)}</div>
                                <div className="category-details">
                                    <div className="category-name">{getCategoryLabel(item._id)}</div>
                                    <div className="category-description">{item.count} transaction{item.count !== 1 ? 's' : ''}</div>
                                </div>
                                <div className="category-amount">{formatCurrency(item.total)}</div>
                            </div>
                        ))}
                    </div>

                    {summary.length === 0 && !loading && (
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📊</div>
                            <p style={{ color: '#7f8c8d' }}>No expenses yet. Add your first expense to see the breakdown.</p>
                        </div>
                    )}
                </div>

                {/* Chart Section */}
                <div className="chart-container">
                    <div className="chart-header">
                        <h3 className="chart-title">Expenses</h3>
                        <span className="chart-period">This Month</span>
                    </div>
                    <div className="chart-placeholder">📊</div>
                </div>
            </div>

            {/* Recent Expenses */}
            <div className="expense-list">
                <div className="section-header">
                    <h3 className="section-title">Recent Expenses</h3>
                </div>
                
                {expenses.length === 0 ? (
                    <div className="chart-container">
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💸</div>
                            <h3 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>No Expenses Yet</h3>
                            <p style={{ color: '#7f8c8d', marginBottom: '1rem' }}>
                                Start tracking your expenses to see them here.
                            </p>
                            <button 
                                className="tips-button"
                                onClick={() => setShowAddForm(true)}
                            >
                                Add Your First Expense
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="category-list">
                        {expenses.map((expense) => (
                            <div key={expense._id} className="expense-item">
                                <div className="category-icon">{getCategoryIcon(expense.category)}</div>
                                <div className="category-details">
                                    <div className="category-name">{expense.title}</div>
                                    <div className="category-description">
                                        {formatDate(expense.date)} • {expense.walletId?.name}
                                        {expense.description && ` • ${expense.description}`}
                                    </div>
                                </div>
                                <div className="category-amount" style={{color: '#e74c3c'}}>
                                    -{formatCurrency(expense.amount)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Expense;