import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';

const Dashboard = () => {
    const [walletSummary, setWalletSummary] = useState({
        totalBalance: 0,
        totalWallets: 0,
        walletsByType: []
    });
    const [expenseStats, setExpenseStats] = useState({
        totalSpent: 0,
        expenseCount: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWalletSummary();
        fetchExpenseStats();
    }, []);

    const fetchWalletSummary = async () => {
        try {
            const response = await fetch('/api/wallets/summary', {
                credentials: 'include'
            });
            const data = await response.json();
            
            if (data.success) {
                setWalletSummary(data.summary);
            }
        } catch (error) {
            console.error('Error fetching wallet summary:', error);
        }
    };

    const fetchExpenseStats = async () => {
        try {
            // Get current month expenses
            const now = new Date();
            const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
            const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
            
            const response = await fetch(`/api/expenses/summary?startDate=${startDate}&endDate=${endDate}`, {
                credentials: 'include'
            });
            const data = await response.json();
            
            if (data.success) {
                setExpenseStats({
                    totalSpent: data.totalSpent,
                    expenseCount: data.summary.reduce((sum, cat) => sum + cat.count, 0)
                });
            }
        } catch (error) {
            console.error('Error fetching expense stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };
    return (
        <DashboardLayout>
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">Dashboard</h1>
                    <p className="dashboard-date">Welcome back, here's your financial summary</p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="stats-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem'}}>
                <div className="chart-container" style={{textAlign: 'center'}}>
                    <div style={{fontSize: '2.5rem', color: '#e74c3c', marginBottom: '0.5rem'}}>💸</div>
                    <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#2c3e50'}}>
                        {loading ? '...' : formatCurrency(expenseStats.totalSpent)}
                    </div>
                    <div style={{color: '#7f8c8d'}}>Total Spent</div>
                    <div style={{color: '#e74c3c', fontSize: '0.9rem', marginTop: '0.5rem'}}>This Month</div>
                </div>
                
                <div className="chart-container" style={{textAlign: 'center'}}>
                    <div style={{fontSize: '2.5rem', color: '#2ecc71', marginBottom: '0.5rem'}}>💰</div>
                    <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#2c3e50'}}>
                        {loading ? '...' : formatCurrency(walletSummary.totalBalance)}
                    </div>
                    <div style={{color: '#7f8c8d'}}>Total Balance</div>
                    <div style={{color: '#2ecc71', fontSize: '0.9rem', marginTop: '0.5rem'}}>
                        {walletSummary.totalWallets} Account{walletSummary.totalWallets !== 1 ? 's' : ''}
                    </div>
                </div>
                
                <div className="chart-container" style={{textAlign: 'center'}}>
                    <div style={{fontSize: '2.5rem', color: '#3498db', marginBottom: '0.5rem'}}>📊</div>
                    <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#2c3e50'}}>
                        {loading ? '...' : expenseStats.expenseCount}
                    </div>
                    <div style={{color: '#7f8c8d'}}>Transactions</div>
                    <div style={{color: '#3498db', fontSize: '0.9rem', marginTop: '0.5rem'}}>This Month</div>
                </div>
                
                <div className="chart-container" style={{textAlign: 'center'}}>
                    <div style={{fontSize: '2.5rem', color: '#f39c12', marginBottom: '0.5rem'}}>🎯</div>
                    <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#2c3e50'}}>73%</div>
                    <div style={{color: '#7f8c8d'}}>Budget Used</div>
                    <div style={{color: '#f39c12', fontSize: '0.9rem', marginTop: '0.5rem'}}>$2,200 left</div>
                </div>
            </div>

            <div className="dashboard-grid">
                {/* Spending Chart */}
                <div className="chart-container">
                    <div className="chart-header">
                        <h3 className="chart-title">Monthly Spending</h3>
                        <span className="chart-period">Last 6 months</span>
                    </div>
                    <div className="chart-placeholder">📈</div>
                </div>

                {/* Quick Actions */}
                <div className="expense-summary">
                    <div className="summary-header">
                        <h3 className="summary-title">Quick Actions</h3>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                        <Link to="/expenses" style={{textDecoration: 'none'}}>
                            <button className="tips-button" style={{width: '100%'}}>Add New Expense</button>
                        </Link>
                        <button className="tips-button">Transfer Money</button>
                        <Link to="/summary" style={{textDecoration: 'none'}}>
                            <button className="tips-button" style={{width: '100%'}}>View Reports</button>
                        </Link>
                        <Link to="/accounts" style={{textDecoration: 'none'}}>
                            <button className="tips-button" style={{width: '100%'}}>Manage Accounts</button>
                        </Link>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;