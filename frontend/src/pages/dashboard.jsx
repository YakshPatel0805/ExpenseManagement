import DashboardLayout from '../components/DashboardLayout';

const Dashboard = () => {
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
                    <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#2c3e50'}}>$2,847</div>
                    <div style={{color: '#7f8c8d'}}>Total Spent</div>
                    <div style={{color: '#e74c3c', fontSize: '0.9rem', marginTop: '0.5rem'}}>This Month</div>
                </div>
                
                <div className="chart-container" style={{textAlign: 'center'}}>
                    <div style={{fontSize: '2.5rem', color: '#2ecc71', marginBottom: '0.5rem'}}>💰</div>
                    <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#2c3e50'}}>$5,240</div>
                    <div style={{color: '#7f8c8d'}}>Total Balance</div>
                    <div style={{color: '#2ecc71', fontSize: '0.9rem', marginTop: '0.5rem'}}>All Accounts</div>
                </div>
                
                <div className="chart-container" style={{textAlign: 'center'}}>
                    <div style={{fontSize: '2.5rem', color: '#3498db', marginBottom: '0.5rem'}}>📊</div>
                    <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#2c3e50'}}>127</div>
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
                        <button className="tips-button">Add New Expense</button>
                        <button className="tips-button">Transfer Money</button>
                        <button className="tips-button">View Reports</button>
                        <button className="tips-button">Manage Accounts</button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;