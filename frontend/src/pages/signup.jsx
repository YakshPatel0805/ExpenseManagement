import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        terms: false
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState('');
    const [passwordMatch, setPasswordMatch] = useState('');
    const { signup } = useAuth();
    const navigate = useNavigate();

    const checkPasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        if (strength >= 4) {
            setPasswordStrength('Strong');
        } else if (strength >= 2) {
            setPasswordStrength('Medium');
        } else {
            setPasswordStrength('Weak');
        }
    };

    const checkPasswordMatch = (password, confirmPassword) => {
        if (!confirmPassword) {
            setPasswordMatch('');
            return;
        }

        if (password === confirmPassword) {
            setPasswordMatch('✓ Passwords match');
        } else {
            setPasswordMatch('✗ Passwords do not match');
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newFormData = {
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        };
        setFormData(newFormData);

        if (name === 'password') {
            checkPasswordStrength(value);
            checkPasswordMatch(value, newFormData.confirmPassword);
        }
        if (name === 'confirmPassword') {
            checkPasswordMatch(newFormData.password, value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (!formData.terms) {
            setError('Please accept the terms and conditions');
            setLoading(false);
            return;
        }

        const result = await signup(formData.name, formData.email, formData.password);
        
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
                <div className="signup-card">
                <h2>Create Account</h2>
                <p className="subtitle">Join us today and get started</p>
                
                {error && (
                    <div style={{
                        background: '#e74c3c',
                        color: 'white',
                        padding: '10px',
                        borderRadius: '5px',
                        marginBottom: '20px',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input 
                            type="text" 
                            name="name" 
                            placeholder="Full Name" 
                            value={formData.name}
                            onChange={handleChange}
                            required 
                        />
                    </div>
                    
                    <div className="input-group">
                        <input 
                            type="email" 
                            name="email" 
                            placeholder="Email Address" 
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
                        {passwordStrength && (
                            <div className={`password-strength ${passwordStrength.toLowerCase()}`}>
                                Password strength: {passwordStrength}
                            </div>
                        )}
                    </div>
                    
                    <div className="input-group">
                        <input 
                            type="password" 
                            name="confirmPassword" 
                            placeholder="Confirm Password" 
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required 
                        />
                        {passwordMatch && (
                            <div className={`password-match ${passwordMatch.includes('✓') ? 'match' : 'no-match'}`}>
                                {passwordMatch}
                            </div>
                        )}
                    </div>
                    
                    <div className="options">
                        <label className="checkbox">
                            <input 
                                type="checkbox" 
                                name="terms" 
                                checked={formData.terms}
                                onChange={handleChange}
                                required 
                            />
                            <span className="checkmark"></span>
                            I agree to the <Link to="#" className="terms-link">Terms & Conditions</Link>
                        </label>
                    </div>
                    <button type="submit" className="signup-btn" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>
                
                <div className="login-link">
                    Already have an account? <Link to="/login">Sign in</Link>
                </div>
            </div>
            </div>
        </div>
    );
};

export default Signup;