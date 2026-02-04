import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';

const Summary = () => {
    const [summaryData, setSummaryData] = useState({
        expenseSummary: [],
        totalSpent: 0,
        transactionStats: {
            totalExpenses: 0,
            totalIncome: 0,
            netAmount: 0,
            transactionCount: 0
        }
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');

    useEffect(() => {
        fetchSummaryData();
    }, [selectedPeriod]);

    const fetchSummaryData = async () => {
        try {
            setLoading(true);
            setError('');
            
            // Get date range based on selected period
            const { startDate, endDate } = getDateRange(selectedPeriod);
            
            console.log('Fetching summary data for period:', selectedPeriod, 'from', startDate, 'to', endDate);
            
            // Fetch expense summary
            const expenseUrl = `/api/expenses/summary?startDate=${startDate}&endDate=${endDate}`;
            console.log('Fetching expenses from:', expenseUrl);
            
            const expenseResponse = await fetch(expenseUrl, {
                credentials: 'include'
            });
            
            console.log('Expense response status:', expenseResponse.status);
            const expenseData = await expenseResponse.json();
            console.log('Expense data:', expenseData);
            
            // Fetch transaction stats
            const statsUrl = `/api/transactions/stats?startDate=${startDate}&endDate=${endDate}`;
            console.log('Fetching stats from:', statsUrl);
            
            const statsResponse = await fetch(statsUrl, {
                credentials: 'include'
            });
            
            console.log('Stats response status:', statsResponse.status);
            const statsData = await statsResponse.json();
            console.log('Stats data:', statsData);
            
            // Update state with fetched data
            const newSummaryData = {
                expenseSummary: expenseData.success ? expenseData.summary : [],
                totalSpent: expenseData.success ? expenseData.totalSpent : 0,
                transactionStats: statsData.success ? statsData.stats : {
                    totalExpenses: 0,
                    totalIncome: 0,
                    netAmount: 0,
                    transactionCount: 0
                }
            };
            
            console.log('Setting summary data:', newSummaryData);
            setSummaryData(newSummaryData);
            
            if (!expenseData.success) {
                setError(expenseData.message || 'Failed to fetch expense data');
            }
            
        } catch (error) {
            console.error('Error fetching summary data:', error);
            setError('Network error occurred while fetching data');
        } finally {
            setLoading(false);
        }
    };

    const getDateRange = (period) => {
        const now = new Date();
        let startDate, endDate;

        switch (period) {
            case 'thisMonth':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                break;
            case 'lastMonth':
                startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                endDate = new Date(now.getFullYear(), now.getMonth(), 0);
                break;
            case 'last3Months':
                startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                break;
            case 'thisYear':
                startDate = new Date(now.getFullYear(), 0, 1);
                endDate = new Date(now.getFullYear(), 11, 31);
                break;
            default:
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        }

        return {
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0]
        };
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

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const getPeriodLabel = (period) => {
        const labels = {
            thisMonth: 'This Month',
            lastMonth: 'Last Month',
            last3Months: 'Last 3 Months',
            thisYear: 'This Year'
        };
        return labels[period] || 'This Month';
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="dashboard-header">
                    <div>
                        <h1 className="dashboard-title">Summary</h1>
                        <p className="dashboard-date">Loading financial reports...</p>
                    </div>
                </div>
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <div style={{ fontSize: '2rem' }}>📊</div>
                    <p>Loading summary data...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div id="summary-page" className="page-content">
                <div className="dashboard-header">
                    <div>
                        <h1 className="dashboard-title">Summary</h1>
                        <p className="dashboard-date">Financial reports and insights</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <button 
                            className="tips-button" 
                            onClick={fetchSummaryData}
                            style={{ height: 'fit-content' }}
                        >
                            🔄 Refresh
                        </button>
                        <select 
                            className="tips-button" 
                            style={{ height: 'fit-content', background: 'white', color: '#2c3e50' }}
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.target.value)}
                        >
                            <option value="thisMonth">This Month</option>
                            <option value="lastMonth">Last Month</option>
                            <option value="last3Months">Last 3 Months</option>
                            <option value="thisYear">This Year</option>
                        </select>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="chart-container" style={{ marginBottom: '2rem', background: '#fee' }}>
                        <div style={{ color: '#e74c3c', textAlign: 'center', padding: '1rem' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚠️</div>
                            <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Error Loading Data</div>
                            <div>{error}</div>
                            <button 
                                className="tips-button" 
                                onClick={fetchSummaryData}
                                style={{ marginTop: '1rem' }}
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                )}

                {/* Debug Info (remove in production) */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="chart-container" style={{ marginBottom: '2rem', background: '#f8f9fa' }}>
                        <h4>Debug Info</h4>
                        <div style={{ fontSize: '0.8rem', fontFamily: 'monospace' }}>
                            <div>Loading: {loading.toString()}</div>
                            <div>Error: {error || 'None'}</div>
                            <div>Period: {selectedPeriod}</div>
                            <div>Total Spent: {summaryData.totalSpent}</div>
                            <div>Expense Categories: {summaryData.expenseSummary.length}</div>
                            <div>Transaction Count: {summaryData.transactionStats.transactionCount}</div>
                            <div>Raw Data: {JSON.stringify(summaryData, null, 2)}</div>
                        </div>
                    </div>
                )}

                {/* Summary Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '2rem'
                }}>
                    <div className="chart-container">
                        <h4 style={{ color: '#2c3e50', marginBottom: '1rem' }}>Income vs Expenses</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div>
                                <div style={{ color: '#2ecc71', fontWeight: 'bold' }}>Income</div>
                                <div style={{ fontSize: '1.5rem', color: '#2ecc71' }}>
                                    {formatCurrency(summaryData.transactionStats.totalIncome)}
                                </div>
                            </div>
                            <div>
                                <div style={{ color: '#e74c3c', fontWeight: 'bold' }}>Expenses</div>
                                <div style={{ fontSize: '1.5rem', color: '#e74c3c' }}>
                                    {formatCurrency(summaryData.transactionStats.totalExpenses)}
                                </div>
                            </div>
                        </div>
                        <div style={{ 
                            color: summaryData.transactionStats.netAmount >= 0 ? '#2ecc71' : '#e74c3c', 
                            fontWeight: 'bold' 
                        }}>
                            Net: {summaryData.transactionStats.netAmount >= 0 ? '+' : ''}
                            {formatCurrency(summaryData.transactionStats.netAmount)}
                        </div>
                    </div>

                    <div className="chart-container">
                        <h4 style={{ color: '#2c3e50', marginBottom: '1rem' }}>Transaction Overview</h4>
                        <div style={{ marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span>Total Transactions</span>
                                <span style={{ fontWeight: 'bold' }}>{summaryData.transactionStats.transactionCount}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span>Total Spent</span>
                                <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>
                                    {formatCurrency(summaryData.totalSpent)}
                                </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Period</span>
                                <span style={{ fontWeight: 'bold' }}>{getPeriodLabel(selectedPeriod)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Category Breakdown */}
                {summaryData.expenseSummary.length > 0 && (
                    <div className="chart-container" style={{ marginBottom: '2rem' }}>
                        <div className="chart-header">
                            <h3 className="chart-title">Expense Breakdown by Category</h3>
                            <span className="chart-period">{getPeriodLabel(selectedPeriod)}</span>
                        </div>
                        <div className="category-list">
                            {summaryData.expenseSummary.map((category, index) => {
                                const percentage = summaryData.totalSpent > 0 
                                    ? ((category.total / summaryData.totalSpent) * 100).toFixed(1)
                                    : 0;
                                
                                return (
                                    <div key={category._id} className="category-item">
                                        <div className="category-icon">
                                            {getCategoryIcon(category._id)}
                                        </div>
                                        <div className="category-details">
                                            <div className="category-name">
                                                {category._id.charAt(0).toUpperCase() + category._id.slice(1)}
                                            </div>
                                            <div className="category-description">
                                                {category.count} transaction{category.count !== 1 ? 's' : ''} • {percentage}%
                                            </div>
                                        </div>
                                        <div className="category-amount">
                                            {formatCurrency(category.total)}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {summaryData.expenseSummary.length === 0 && (
                    <div className="chart-container">
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
                            <h3 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>No Data Available</h3>
                            <p style={{ color: '#7f8c8d' }}>
                                No expenses found for {getPeriodLabel(selectedPeriod).toLowerCase()}. 
                                Start tracking your expenses to see detailed reports here.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Summary;