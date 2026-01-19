import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import userService from '../services/userService';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            await userService.forgotPassword(email);
            setMessage('Password reset link sent to your email.');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset link.');
        }
    };

    return (
        <div className="d-flex flex-column min-vh-100 bg-white">
            {/* Custom Header for Forgot Password */}
            <div className="w-100 py-3 px-5" style={{ backgroundColor: '#A03037' }}>
                <div className="d-flex align-items-center text-white" style={{ marginLeft: '175px' }}>
                    <i className="bi bi-book-half fs-4 me-2"></i>
                    <h5 className="mb-0 fw-normal">Bookstore</h5>
                </div>
            </div>

            <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center">
                <h4 className="fw-bold mb-4 text-dark" style={{ fontSize: '24px' }}>Forgot Your Password?</h4>

                {/* The Main Card 'Square' */}
                <div
                    className="bg-white overflow-hidden"
                    style={{
                        width: '400px',
                        border: '1px solid #E0E0E0',
                        borderRadius: '6px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}
                >
                    {/* Top Section: Form */}
                    <div className="p-4 px-5 pb-5">
                        <div className="mb-4 text-muted small" style={{ fontSize: '13px', lineHeight: '1.6', color: '#666' }}>
                            Enter your email address and we'll send you a link to reset your password.
                        </div>

                        {message && <div className="alert alert-success small py-2">{message}</div>}
                        {error && <div className="alert alert-danger small py-2">{error}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="form-label small fw-bold text-dark" style={{ fontSize: '12px', marginBottom: '8px' }}>Email Id</label>
                                <input
                                    type="email"
                                    className="form-control rounded-1"
                                    style={{ height: '40px', borderColor: '#CED4DA' }}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <button className="btn w-100 fw-bold py-2 text-white" style={{ backgroundColor: '#A03037', border: 'none', borderRadius: '3px', height: '40px', fontSize: '14px' }}>Reset Password</button>
                        </form>
                    </div>

                    {/* Bottom Section: Create Account Link */}
                    <div
                        className="py-4 d-flex justify-content-center align-items-center"
                        style={{
                            backgroundColor: '#F9F9F9',
                            borderTop: '1px solid #E0E0E0',
                            height: '80px'
                        }}
                    >
                        <Link to="/login" className="text-decoration-none fw-bold text-uppercase text-dark" style={{ fontSize: '14px' }}>CREATE ACCOUNT</Link>
                    </div>
                </div>
            </div>

            {/* Standard Footer */}
            <footer className="bg-dark text-white py-3 mt-auto">
                <div className="container text-start" style={{ marginLeft: '14%' }}>
                    <small className="text-white-50">Copyright © 2020, Bookstore Private Limited. All Rights Reserved</small>
                </div>
            </footer>
        </div>
    );
};

export default ForgotPasswordPage;
