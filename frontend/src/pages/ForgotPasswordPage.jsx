import React from 'react';
import { Link } from 'react-router-dom';

const ForgotPasswordPage = () => {
    return (
        <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-white">
            <h4 className="fw-bold mb-4">Forgot Your Password?</h4>

            <div className="card border p-4 shadow-sm" style={{ width: '400px' }}>
                <div className="text-center mb-4 text-muted small px-3">
                    Enter your email address and we'll send you a link to reset your password.
                </div>

                <form>
                    <div className="mb-4">
                        <label className="form-label small fw-bold">Email Id</label>
                        <input type="email" className="form-control" />
                    </div>
                    <button className="btn btn-primary w-100 fw-bold mb-3" style={{ backgroundColor: '#A03037', border: 'none' }}>Reset Password</button>
                </form>
            </div>

            <div className="mt-0 bg-light py-4 w-100 d-flex justify-content-center" style={{ maxWidth: '400px' }}>
                <Link to="/login" className="btn btn-white w-75 fw-bold text-uppercase" style={{ backgroundColor: '#fff' }}>Create Account</Link>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
