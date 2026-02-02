import DashboardLayout from '../components/DashboardLayout';

const Wallets = () => {
    return (
        <DashboardLayout>
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">Wallets</h1>
                    <p className="dashboard-date">Manage your accounts and cards</p>
                </div>
                <button className="tips-button" style={{height: 'fit-content'}}>+ Add Wallet</button>
            </div>

            {/* Wallet Cards */}
            <div className="wallet-cards-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem'}}>
                {/* Credit Card */}
                <div className="chart-container" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', position: 'relative', overflow: 'hidden'}}>
                    <div style={{position: 'absolute', top: '1rem', right: '1rem', fontSize: '1.5rem'}}>💳</div>
                    <div style={{marginBottom: '2rem'}}>
                        <div style={{fontSize: '0.9rem', opacity: '0.8'}}>Credit Card</div>
                        <div style={{fontSize: '1.8rem', fontWeight: 'bold', margin: '0.5rem 0'}}>$3,240.50</div>
                        <div style={{fontSize: '0.8rem', opacity: '0.8'}}>**** **** **** 4532</div>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'end'}}>
                        <div>
                            <div style={{fontSize: '0.8rem', opacity: '0.8'}}>SAMANTHA JONES</div>
                            <div style={{fontSize: '0.8rem', opacity: '0.8'}}>12/25</div>
                        </div>
                        <div style={{fontSize: '1.2rem'}}>VISA</div>
                    </div>
                </div>

                {/* Savings Account */}
                <div className="chart-container" style={{background: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)', color: 'white', position: 'relative', overflow: 'hidden'}}>
                    <div style={{position: 'absolute', top: '1rem', right: '1rem', fontSize: '1.5rem'}}>🏦</div>
                    <div style={{marginBottom: '2rem'}}>
                        <div style={{fontSize: '0.9rem', opacity: '0.8'}}>Savings Account</div>
                        <div style={{fontSize: '1.8rem', fontWeight: 'bold', margin: '0.5rem 0'}}>$8,450.75</div>
                        <div style={{fontSize: '0.8rem', opacity: '0.8'}}>Account: ****1234</div>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'end'}}>
                        <div>
                            <div style={{fontSize: '0.8rem', opacity: '0.8'}}>CHASE BANK</div>
                            <div style={{fontSize: '0.8rem', opacity: '0.8'}}>+2.1% APY</div>
                        </div>
                        <div style={{fontSize: '1.2rem'}}>💰</div>
                    </div>
                </div>

                {/* Cash Wallet */}
                <div className="chart-container" style={{background: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)', color: 'white', position: 'relative', overflow: 'hidden'}}>
                    <div style={{position: 'absolute', top: '1rem', right: '1rem', fontSize: '1.5rem'}}>💵</div>
                    <div style={{marginBottom: '2rem'}}>
                        <div style={{fontSize: '0.9rem', opacity: '0.8'}}>Cash Wallet</div>
                        <div style={{fontSize: '1.8rem', fontWeight: 'bold', margin: '0.5rem 0'}}>$245.00</div>
                        <div style={{fontSize: '0.8rem', opacity: '0.8'}}>Physical Cash</div>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'end'}}>
                        <div>
                            <div style={{fontSize: '0.8rem', opacity: '0.8'}}>CASH ON HAND</div>
                            <div style={{fontSize: '0.8rem', opacity: '0.8'}}>Updated Today</div>
                        </div>
                        <div style={{fontSize: '1.2rem'}}>💸</div>
                    </div>
                </div>
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
        </DashboardLayout>
    );
};

export default Wallets;