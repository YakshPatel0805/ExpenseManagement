import DashboardLayout from '../components/DashboardLayout';

const Expense = () => {
    return (
        <DashboardLayout>
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">Expenses</h1>
                    <p className="dashboard-date">01 - 25 March, 2020</p>
                </div>
                <button className="tips-button" style={{height: 'fit-content'}}>+ Add Expense</button>
            </div>

            <div className="dashboard-grid">
                {/* Chart Section */}
                <div className="chart-container">
                    <div className="chart-header">
                        <h3 className="chart-title">Expenses</h3>
                        <span className="chart-period">01 - 25 March, 2020</span>
                    </div>
                    <div className="chart-placeholder">📊</div>
                </div>

                {/* Expense Summary */}
                <div className="expense-summary">
                    <div className="summary-header">
                        <h3 className="summary-title">Where your money go?</h3>
                    </div>
                    <div className="category-list">
                        <div className="category-item">
                            <div className="category-icon food">🍕</div>
                            <div className="category-details">
                                <div className="category-name">Food and Drinks</div>
                            </div>
                            <div className="category-amount">872.400</div>
                        </div>
                        <div className="category-item">
                            <div className="category-icon grocery">🛒</div>
                            <div className="category-details">
                                <div className="category-name">Shopping</div>
                            </div>
                            <div className="category-amount">1.378.200</div>
                        </div>
                        <div className="category-item">
                            <div className="category-icon housing">🏠</div>
                            <div className="category-details">
                                <div className="category-name">Housing</div>
                            </div>
                            <div className="category-amount">928.500</div>
                        </div>
                        <div className="category-item">
                            <div className="category-icon transport">🚗</div>
                            <div className="category-details">
                                <div className="category-name">Transportation</div>
                            </div>
                            <div className="category-amount">420.700</div>
                        </div>
                        <div className="category-item">
                            <div className="category-icon entertainment">🎮</div>
                            <div className="category-details">
                                <div className="category-name">Vehicle</div>
                            </div>
                            <div className="category-amount">520.000</div>
                        </div>
                    </div>

                    <div className="tips-card">
                        <div className="tips-icon">💡</div>
                        <div className="tips-title">Save more money</div>
                        <div className="tips-description">
                            Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue.
                        </div>
                        <button className="tips-button">VIEW TIPS</button>
                    </div>
                </div>
            </div>

            {/* Recent Expenses */}
            <div className="expense-list">
                <div className="section-header">
                    <h3 className="section-title">Today</h3>
                </div>
                <div className="category-list">
                    <div className="expense-item">
                        <div className="category-icon grocery">🛒</div>
                        <div className="category-details">
                            <div className="category-name">Grocery</div>
                            <div className="category-description">5:12 pm • Belanja di pasar</div>
                        </div>
                        <div className="category-amount">-326.800</div>
                    </div>
                    <div className="expense-item">
                        <div className="category-icon transport">🚌</div>
                        <div className="category-details">
                            <div className="category-name">Transportation</div>
                            <div className="category-description">5:12 pm • Naik bus umum</div>
                        </div>
                        <div className="category-amount">-15.000</div>
                    </div>
                    <div className="expense-item">
                        <div className="category-icon housing">🏠</div>
                        <div className="category-details">
                            <div className="category-name">Housing</div>
                            <div className="category-description">5:12 pm • Bayar Listrik</div>
                        </div>
                        <div className="category-amount">-185.750</div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Expense;