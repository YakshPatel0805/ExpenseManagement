import DashboardLayout from '../components/DashboardLayout';

const Summary = () => {
    return (
        <DashboardLayout>
            <div id="summary-page" className="page-content">
                <div className="dashboard-header">
                    <div>
                        <h1 className="dashboard-title">Summary</h1>
                        <p className="dashboard-date">Financial reports and insights</p>
                    </div>
                    <select className="tips-button" style={{ height: 'fit-content', background: 'white', color: '#2c3e50' }}>
                        <option>This Month</option>
                        <option>Last Month</option>
                        <option>Last 3 Months</option>
                        <option>This Year</option>
                    </select>
                </div>

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
                                <div style={{ fontSize: '1.5rem', color: '#2ecc71' }}>$4,200</div>
                            </div>
                            <div>
                                <div style={{ color: '#e74c3c', fontWeight: 'bold' }}>Expenses</div>
                                <div style={{ fontSize: '1.5rem', color: '#e74c3c' }}>$2,847</div>
                            </div>
                        </div>
                        <div style={{ color: '#2ecc71', fontWeight: 'bold' }}>Net: +$1,353</div>
                    </div>

                    <div className="chart-container">
                        <h4 style={{ color: '#2c3e50', marginBottom: '1rem' }}>Budget Performance</h4>
                        <div style={{ marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span>Food & Dining</span>
                                <span>85%</span>
                            </div>
                            <div style={{ background: '#ecf0f1', height: '8px', borderRadius: '4px' }}>
                                <div style={{ background: '#e74c3c', height: '100%', width: '85%', borderRadius: '4px' }}></div>
                            </div>
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span>Transportation</span>
                                <span>62%</span>
                            </div>
                            <div style={{ background: '#ecf0f1', height: '8px', borderRadius: '4px' }}>
                                <div style={{ background: '#f39c12', height: '100%', width: '62%', borderRadius: '4px' }}></div>
                            </div>
                        </div>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span>Shopping</span>
                                <span>45%</span>
                            </div>
                            <div style={{ background: '#ecf0f1', height: '8px', borderRadius: '4px' }}>
                                <div style={{ background: '#2ecc71', height: '100%', width: '45%', borderRadius: '4px' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Monthly Breakdown */}
                <div className="chart-container">
                    <div className="chart-header">
                        <h3 className="chart-title">Monthly Breakdown</h3>
                        <span className="chart-period">March 2020</span>
                    </div>
                    <div className="chart-placeholder">📊</div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Summary;