import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Index = () => {
    useEffect(() => {
        // Smooth scrolling for anchor links
        const anchors = document.querySelectorAll('a[href^="#"]');
        anchors.forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Header background on scroll
        const handleScroll = () => {
            const header = document.querySelector('.header');
            if (header) {
                if (window.scrollY > 100) {
                    header.style.background = 'rgba(44, 62, 80, 0.98)';
                } else {
                    header.style.background = 'rgba(44, 62, 80, 0.95)';
                }
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            {/* Header */}
            <header className="header">
                <div className="nav-container">
                    <Link to="/" className="logo">💰 ExpenseTracker</Link>
                    <div className="nav-buttons">
                        <Link to="/login" className="btn btn-secondary">Login</Link>
                        <Link to="/signup" className="btn btn-primary">Get Started</Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-container">
                    <div className="hero-content">
                        <h1>Take Control of Your Finances</h1>
                        <p>Track expenses, manage budgets, and achieve your financial goals with our powerful and intuitive expense management platform.</p>
                        
                        <div className="hero-buttons">
                            <Link to="/signup" className="btn btn-primary btn-large">
                                ✨ Start Free Trial
                            </Link>
                            <Link to="/login" className="btn btn-secondary btn-large">
                                🚀 Login
                            </Link>
                        </div>
                        
                        <div className="hero-stats">
                            <div className="stat">
                                <span className="stat-number">10K+</span>
                                <span className="stat-label">Active Users</span>
                            </div>
                            <div className="stat">
                                <span className="stat-number">$2M+</span>
                                <span className="stat-label">Money Tracked</span>
                            </div>
                            <div className="stat">
                                <span className="stat-number">99.9%</span>
                                <span className="stat-label">Uptime</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="hero-visual">
                        <div className="dashboard-preview">
                            <div className="preview-content">
                                <div className="preview-card">
                                    <div className="preview-title">💸 Total Spent</div>
                                    <div className="preview-amount">$2,847</div>
                                </div>
                                <div className="preview-card">
                                    <div className="preview-title">💰 Total Balance</div>
                                    <div className="preview-amount">$5,240</div>
                                </div>
                                <div className="preview-card">
                                    <div className="preview-title">📊 Transactions</div>
                                    <div className="preview-amount">127</div>
                                </div>
                                <div className="preview-card">
                                    <div className="preview-title">🎯 Budget Used</div>
                                    <div className="preview-amount">73%</div>
                                </div>
                            </div>
                        </div>
                    </div> 
                </div>
            </section>

            {/* Features Section */}
            <section className="features">
                <div className="features-container">
                    <h2 className="section-title">Powerful Features</h2>
                    <p className="section-subtitle">Everything you need to manage your finances effectively</p>
                    
                    <div className="features-grid">
                        <div className="feature-card">
                            <span className="feature-icon">💸</span>
                            <h3 className="feature-title">Expense Tracking</h3>
                            <p className="feature-description">Monitor your daily spending with detailed categories, tags, and real-time insights to understand where your money goes.</p>
                        </div>
                        
                        <div className="feature-card">
                            <span className="feature-icon">👛</span>
                            <h3 className="feature-title">Multi-Wallet Support</h3>
                            <p className="feature-description">Connect multiple bank accounts, credit cards, and digital wallets in one centralized dashboard for complete financial visibility.</p>
                        </div>
                        
                        <div className="feature-card">
                            <span className="feature-icon">📈</span>
                            <h3 className="feature-title">Financial Reports</h3>
                            <p className="feature-description">Generate comprehensive reports with charts, graphs, and analytics to make informed financial decisions and track progress.</p>
                        </div>
                        
                        <div className="feature-card">
                            <span className="feature-icon">🎯</span>
                            <h3 className="feature-title">Budget Management</h3>
                            <p className="feature-description">Set custom budgets for different categories, receive alerts when approaching limits, and stay on track with your goals.</p>
                        </div>
                        
                        <div className="feature-card">
                            <span className="feature-icon">🔒</span>
                            <h3 className="feature-title">Bank-Level Security</h3>
                            <p className="feature-description">Your financial data is protected with enterprise-grade encryption, secure authentication, and privacy controls.</p>
                        </div>
                        
                        <div className="feature-card">
                            <span className="feature-icon">📱</span>
                            <h3 className="feature-title">Mobile Responsive</h3>
                            <p className="feature-description">Access your financial dashboard anywhere, anytime with our fully responsive design that works on all devices.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="cta">
                <div className="cta-container">
                    <h2>Ready to Take Control?</h2>
                    <p>Join thousands of users who are already managing their finances smarter with ExpenseTracker.</p>
                    <div className="hero-buttons">
                        <Link to="/signup" className="btn btn-primary btn-large">
                            ✨ Create Free Account
                        </Link>
                        <Link to="/login" className="btn btn-secondary btn-large">
                            🚀 Login to Dashboard
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-container">
                    <div className="footer-text">
                        © 2024 ExpenseTracker. All rights reserved.
                    </div>
                    <div className="footer-links">
                        <Link to="#">Privacy Policy</Link>
                        <Link to="#">Terms of Service</Link>
                        <Link to="#">Support</Link>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Index;