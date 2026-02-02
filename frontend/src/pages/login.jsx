import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        remember: false
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await login(formData.email, formData.password);
        
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error);
        }
        
        setLoading(false);
    };

    return (
        <div className="auth-page-wrapper">
            <div className="container">
                <div className="login-card">
                <h2>Welcome Back</h2>
                <p className="subtitle">Please sign in to your account</p>
                
                {error && (
                    <div style={{
                        background: '#e74c3c',
                        color: 'white',
                        padding: '10px',
                        borderRadius: '5px',
                        marginBottom: '20px'
                    }}>
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input 
                            type="email" 
                            name="email" 
                            placeholder="Email" 
                            value={formData.email}
                            onChange={handleChange}
                            required 
                        />
                    </div>
                    
                    <div className="input-group">
                        <input 
                            type="password" 
                            name="password" 
                            placeholder="Password" 
                            value={formData.password}
                            onChange={handleChange}
                            required 
                        />
                    </div>
                    
                    <div className="options">
                        <label className="checkbox">
                            <input 
                                type="checkbox" 
                                name="remember" 
                                checked={formData.remember}
                                onChange={handleChange}
                            />
                            <span className="checkmark"></span>
                            Remember me
                        </label>
                        <Link to="#" className="forgot-password">Forgot password?</Link>
                    </div>
                    
                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>
                
                <div className="signup-link">
                    Don't have an account? <Link to="/signup">Sign up</Link>
                </div>
            </div>
            </div>
        </div>
    );
};

export default Login;