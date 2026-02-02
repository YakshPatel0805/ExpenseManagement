import DashboardLayout from '../components/DashboardLayout';

const Accounts = () => {
    return (
        <DashboardLayout>
            <div id="accounts-page" className="page-content">
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">Accounts</h1>
                    <p className="dashboard-date">Manage your financial accounts</p>
                </div>
                <button className="tips-button" style={{height: 'fit-content'}}>+ Link Account</button>
            </div>

            <div className="expense-list">
                <div className="section-header">
                    <h3 className="section-title">Connected Accounts</h3>
                </div>
                <div className="category-list">
                    <div className="expense-item">
                        <div className="category-icon" style={{background: '#3498db'}}>🏦</div>
                        <div className="category-details">
                            <div className="category-name">Chase Checking</div>
                            <div className="category-description">****1234 • Last sync: 2 min ago</div>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'end'}}>
                            <div className="category-amount">$3,240.50</div>
                            <div style={{color: '#2ecc71', fontSize: '0.8rem'}}>Connected</div>
                        </div>
                    </div>
                    <div className="expense-item">
                        <div className="category-icon" style={{background: '#2ecc71'}}>💰</div>
                        <div className="category-details">
                            <div className="category-name">Chase Savings</div>
                            <div className="category-description">****5678 • Last sync: 5 min ago</div>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'end'}}>
                            <div className="category-amount">$8,450.75</div>
                            <div style={{color: '#2ecc71', fontSize: '0.8rem'}}>Connected</div>
                        </div>
                    </div>
                    <div className="expense-item">
                        <div className="category-icon" style={{background: '#9b59b6'}}>💳</div>
                        <div className="category-details">
                            <div className="category-name">Visa Credit Card</div>
                            <div className="category-description">****4532 • Last sync: 1 hour ago</div>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'end'}}>
                            <div className="category-amount">-$1,240.25</div>
                            <div style={{color: '#2ecc71', fontSize: '0.8rem'}}>Connected</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="expense-list" style={{marginTop: '2rem'}}>
                <div className="section-header">
                    <h3 className="section-title">Account Settings</h3>
                </div>
                <div className="category-list">
                    <div className="expense-item">
                        <div className="category-icon" style={{background: '#f39c12'}}>🔄</div>
                        <div className="category-details">
                            <div className="category-name">Auto Sync</div>
                            <div className="category-description">Automatically sync transactions</div>
                        </div>
                        <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                            <input type="checkbox" defaultChecked /> Enabled
                        </label>
                    </div>
                    <div className="expense-item">
                        <div className="category-icon" style={{background: '#e74c3c'}}>🔔</div>
                        <div className="category-details">
                            <div className="category-name">Low Balance Alert</div>
                            <div className="category-description">Get notified when balance is low</div>
                        </div>
                        <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                            <input type="checkbox" defaultChecked /> Enabled
                        </label>
                    </div>
                </div>
            </div>
        </div>
        </DashboardLayout>
    );
};

export default Accounts;