import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import ExpenseChart from '../components/ExpenseChart';

const Summary = () => {
    const [summaryData, setSummaryData] = useState({
        expenseSummary: [],
        totalSpent: 0,
        totalIncome: 0,
        transactionStats: {
            totalExpenses: 0,
            totalIncome: 0,
            netAmount: 0,
            transactionCount: 0
        }
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedPeriod, setSelectedPeriod] = useState(() => {
        return sessionStorage.getItem('summaryPeriod') || 'thisMonth';
    });
    const [customDateRange, setCustomDateRange] = useState(() => {
        const saved = sessionStorage.getItem('summaryCustomDateRange');
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0]
        };
    });

    useEffect(() => {
        fetchSummaryData();
    }, [selectedPeriod, customDateRange]);

    useEffect(() => {
        sessionStorage.setItem('summaryPeriod', selectedPeriod);
    }, [selectedPeriod]);

    useEffect(() => {
        sessionStorage.setItem('summaryCustomDateRange', JSON.stringify(customDateRange));
    }, [customDateRange]);

    const fetchSummaryData = async () => {
        try {
            setLoading(true);
            setError('');
            
            // Get date range based on selected period or custom dates
            let startDate, endDate;
            if (selectedPeriod === 'custom') {
                startDate = customDateRange.startDate;
                endDate = customDateRange.endDate;
            } else {
                const range = getDateRange(selectedPeriod);
                startDate = range.startDate;
                endDate = range.endDate;
            }
            
            console.log('Fetching summary data for period:', selectedPeriod, 'from', startDate, 'to', endDate);
            
            // Fetch expense summary
            const expenseUrl = `/api/expenses/summary?startDate=${startDate}&endDate=${endDate}`;
            const expenseResponse = await fetch(expenseUrl, {
                credentials: 'include'
            });
            const expenseData = await expenseResponse.json();
            console.log('Expense data:', expenseData);
            
            // Fetch income summary
            const incomeUrl = `/api/income/summary?startDate=${startDate}&endDate=${endDate}`;
            const incomeResponse = await fetch(incomeUrl, {
                credentials: 'include'
            });
            const incomeData = await incomeResponse.json();
            console.log('Income data:', incomeData);
            
            // Fetch transaction stats
            const statsUrl = `/api/transactions/stats?startDate=${startDate}&endDate=${endDate}`;
            const statsResponse = await fetch(statsUrl, {
                credentials: 'include'
            });
            const statsData = await statsResponse.json();
            console.log('Stats data:', statsData);
            
            // Update state with fetched data
            const newSummaryData = {
                expenseSummary: expenseData.success ? expenseData.summary : [],
                totalSpent: expenseData.success ? expenseData.totalSpent : 0,
                totalIncome: incomeData.success ? incomeData.totalIncome : 0,
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
            case 'last3Months':
                startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                break;
            case 'thisYear':
                startDate = new Date(now.getFullYear(), 0, 1);
                endDate = new Date(now.getFullYear(), 11, 31);
                break;
            case 'lastYear':
                startDate = new Date(now.getFullYear(), 11, 31);
                endDate = new Date(now);
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
        if (period === 'custom') {
            return `${customDateRange.startDate} to ${customDateRange.endDate}`;
        }
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
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <select
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.target.value)}
                            style={{
                                padding: '0.8rem 1.5rem',
                                border: '1px solid #4a5f7a',
                                borderRadius: '4px',
                                backgroundColor: '#34495e',
                                color: '#ecf0f1',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: '600'
                            }}
                        >
                            <option value="thisMonth">This Month</option>
                            <option value="lastMonth">Last Month</option>
                            <option value="last3Months">Last 3 Months</option>
                            <option value="thisYear">This Year</option>
                            <option value="custom">Custom Range</option>
                        </select>
                        <button 
                            className="tips-button" 
                            onClick={fetchSummaryData}
                            style={{ height: 'fit-content' }}
                        >
                            🔄 Refresh
                        </button>
                    </div>
                </div>

                {/* Custom Date Range */}
                {selectedPeriod === 'custom' && (
                    <div className="chart-container" style={{ marginBottom: '2rem' }}>
                        <div className="chart-header">
                            <h3 className="chart-title">Select Date Range</h3>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#2c3e50' }}>
                                    📅 Start Date
                                </label>
                                <input
                                    type="date"
                                    value={customDateRange.startDate}
                                    max={new Date().toISOString().split('T')[0]}
                                    onChange={(e) => setCustomDateRange({...customDateRange, startDate: e.target.value})}
                                    style={{
                                        width: '100%',
                                        padding: '0.8rem',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        fontSize: '1rem',
                                        color: '#2c3e50',
                                        backgroundColor: 'white'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#2c3e50' }}>
                                    📅 End Date
                                </label>
                                <input
                                    type="date"
                                    value={customDateRange.endDate}
                                    max={new Date().toISOString().split('T')[0]}
                                    onChange={(e) => setCustomDateRange({...customDateRange, endDate: e.target.value})}
                                    style={{
                                        width: '100%',
                                        padding: '0.8rem',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        fontSize: '1rem',
                                        color: '#2c3e50',
                                        backgroundColor: 'white'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}

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
                        <h4 style={{ color: '#2c3e50', marginBottom: '1rem' }}>Income</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div>
                                <div style={{ color: '#2ecc71', fontWeight: 'bold', marginBottom: '0.5rem' }}>Total Income</div>
                                <div style={{ fontSize: '1.5rem', color: '#2ecc71', fontWeight: 'bold' }}>
                                    {formatCurrency(summaryData.totalIncome)}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="chart-container">
                        <h4 style={{ color: '#2c3e50', marginBottom: '1rem' }}>Expenses</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div>
                                <div style={{ color: '#e74c3c', fontWeight: 'bold', marginBottom: '0.5rem' }}>Total Expenses</div>
                                <div style={{ fontSize: '1.5rem', color: '#e74c3c', fontWeight: 'bold' }}>
                                    {formatCurrency(summaryData.totalSpent)}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="chart-container">
                        <h4 style={{ color: '#2c3e50', marginBottom: '1rem' }}>Net Amount</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div>
                                <div style={{ 
                                    color: summaryData.totalIncome - summaryData.totalSpent >= 0 ? '#2ecc71' : '#e74c3c', 
                                    fontWeight: 'bold',
                                    marginBottom: '0.5rem'
                                }}>
                                    Net Balance
                                </div>
                                <div style={{ 
                                    fontSize: '1.5rem', 
                                    color: summaryData.totalIncome - summaryData.totalSpent >= 0 ? '#2ecc71' : '#e74c3c', 
                                    fontWeight: 'bold' 
                                }}>
                                    {summaryData.totalIncome - summaryData.totalSpent >= 0 ? '+' : ''}
                                    {formatCurrency(summaryData.totalIncome - summaryData.totalSpent)}
                                </div>
                            </div>
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
                        <ExpenseChart data={summaryData.expenseSummary} type="bar" />
                        
                        <div className="category-list" style={{ marginTop: '2rem' }}>
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