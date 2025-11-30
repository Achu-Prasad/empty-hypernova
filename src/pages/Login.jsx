import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Loader2 } from 'lucide-react';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/admin');
        } catch (err) {
            setError('Failed to sign in. Please check your credentials.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-content">
                <div className="login-header">
                    <Link to="/" className="brand-logo">
                        Achu Prasad
                    </Link>
                    <h2 className="page-title">Admin Access</h2>
                </div>

                <form onSubmit={handleSubmit} className="login-card">
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-input"
                            placeholder="admin@example.com"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-input"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="login-btn"
                    >
                        {loading ? <Loader2 className="w-5 h-5 spinner" /> : 'Sign In'}
                    </button>
                </form>

                <div className="back-link-container">
                    <Link to="/" className="back-link">
                        <ArrowLeft size={16} /> Back to Portfolio
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
