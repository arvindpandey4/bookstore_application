import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import loginImage from '../assets/images/image.png';

const AuthModal = ({ onClose }) => {
    const navigate = useNavigate();
    const [view, setView] = useState('login');
    const { login, register } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    // Login State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [loginAttempts, setLoginAttempts] = useState(false);

    // Signup State
    const [fullName, setFullName] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [mobile, setMobile] = useState('');
    const [signupError, setSignupError] = useState('');
    const [signupAttempts, setSignupAttempts] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginAttempts(true);
        if (!email || !password) {
            setLoginError('Please fill in all fields');
            return;
        }

        setLoginError('');
        try {
            await login({ email, password });
            onClose(); // Close modal on success
        } catch (error) {
            setLoginError(error.response?.data?.message || 'Login failed');
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setSignupAttempts(true);
        if (!fullName || !signupEmail || !signupPassword || !mobile) {
            setSignupError('Please fill in all fields');
            return;
        }

        setSignupError('');
        try {
            await register({
                name: fullName,
                email: signupEmail,
                password: signupPassword,
                mobile: mobile
            });
            onClose(); // Close modal on success
        } catch (error) {
            setSignupError(error.response?.data?.message || 'Signup failed');
        }
    };

    const getInputClass = (isError) => {
        // Updated to rectangular box standard style
        return `form-control rounded-1 ${isError ? 'border-danger' : ''}`;
    };

    return (
        <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 1050 }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="d-flex align-items-center justify-content-center">

                {/* Left Card: Image */}
                <div
                    className="d-flex flex-column align-items-center justify-content-center position-relative"
                    style={{
                        width: '400px',
                        height: '445px',
                        backgroundColor: '#F5F5F5',
                        borderRadius: '21px',
                        overflow: 'hidden',
                        zIndex: 1,
                        marginRight: '-30px' // Connect cards
                    }}
                >
                    {/* Removed rounded-circle, image is direct */}
                    <img src={loginImage} alt="Online Book Shopping" className="img-fluid mb-4" style={{ width: '200px', objectFit: 'contain' }} />
                    <p className="fw-bold text-uppercase text-dark mb-0 fs-6 text-center">online book shopping</p>
                </div>

                {/* Right Card: Form */}
                <div
                    className="bg-white p-5 px-sm-5 py-4"
                    style={{
                        width: '500px',
                        height: '490px',
                        borderRadius: '6px',
                        boxShadow: '0px 5px 15px #00000029',
                        border: '1px solid #E4E4E4',
                        display: 'flex',
                        flexDirection: 'column',
                        zIndex: 2,
                        position: 'relative'
                    }}
                >
                    {/* Tabs - Reduced Gap */}
                    <div className="d-flex mb-4 justify-content-center gap-5 px-4">
                        <button
                            className={`btn btn-link text-decoration-none fw-bold text-uppercase fs-4 p-0 position-relative ${view === 'login' ? 'text-dark' : 'text-muted'}`}
                            onClick={() => { setView('login'); setLoginError(''); setLoginAttempts(false); }}
                            style={{ opacity: view === 'login' ? 1 : 0.5 }}
                        >
                            LOGIN
                            {view === 'login' && <div className="position-absolute start-0 end-0 mx-auto" style={{ height: '4px', width: '25px', bottom: '-8px', backgroundColor: '#A03037', borderRadius: '2px' }}></div>}
                        </button>
                        <button
                            className={`btn btn-link text-decoration-none fw-bold text-uppercase fs-4 p-0 position-relative ${view === 'signup' ? 'text-dark' : 'text-muted'}`}
                            onClick={() => { setView('signup'); setSignupError(''); setSignupAttempts(false); }}
                            style={{ opacity: view === 'signup' ? 1 : 0.5 }}
                        >
                            SIGNUP
                            {view === 'signup' && <div className="position-absolute start-0 end-0 mx-auto" style={{ height: '4px', width: '25px', bottom: '-8px', backgroundColor: '#A03037', borderRadius: '2px' }}></div>}
                        </button>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', paddingRight: '5px' }}>
                        {view === 'login' ? (
                            <form onSubmit={handleLogin} className="d-flex flex-column h-100">
                                <div className="mb-3">
                                    <label className="form-label small text-muted mb-1 fw-bold" style={{ fontSize: '10px' }}>Email Id</label>
                                    <input
                                        type="email"
                                        className={getInputClass(loginAttempts && (!email))}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        style={{ boxShadow: 'none' }}
                                    />
                                    {loginAttempts && !email && <div className="text-danger small mt-1">Required</div>}
                                </div>
                                <div className="mb-2">
                                    <label className="form-label small text-muted mb-1 fw-bold" style={{ fontSize: '10px' }}>Password</label>
                                    <div className="position-relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            className={getInputClass(loginAttempts && (!password))}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            style={{ boxShadow: 'none', paddingRight: '30px' }}
                                        />
                                        <span
                                            className="position-absolute top-50 translate-middle-y end-0 me-2 text-muted"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            <i className={`bi bi-eye${showPassword ? '' : '-slash'}`}></i>
                                        </span>
                                    </div>
                                    {loginAttempts && !password && <div className="text-danger small mt-1">Required</div>}
                                </div>


                                <div className="text-end mb-4">
                                    <button type="button" className="btn btn-link text-muted p-0 text-decoration-none" style={{ fontSize: '10px' }} onClick={() => { onClose(); navigate('/forgot-password'); }}>Forgot Password?</button>
                                </div>

                                {loginError && <div className="alert alert-danger py-1 small">{loginError}</div>}

                                <button type="submit" className="btn w-100 fw-bold py-2 mb-3 text-white" style={{ backgroundColor: '#A03037', border: 'none', borderRadius: '2px' }}>Login</button>

                                <div className="d-flex align-items-center my-2">
                                    <hr className="flex-grow-1 my-0" />
                                    <span className="text-muted fw-bold small mx-3" style={{ fontSize: '12px' }}>OR</span>
                                    <hr className="flex-grow-1 my-0" />
                                </div>

                                <div className="d-flex gap-3 justify-content-between mt-2">
                                    <button type="button" className="btn flex-grow-1 fw-bold text-white py-2 small" style={{ backgroundColor: '#4267B2', border: 'none', borderRadius: '2px' }}>Facebook</button>
                                    <button type="button" className="btn btn-light border flex-grow-1 fw-bold text-muted py-2 small" style={{ borderRadius: '2px' }} onClick={() => window.open('http://localhost:5000/auth/google', '_self')}>Google</button>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handleSignup} className="d-flex flex-column h-100">
                                <div className="mb-2">
                                    <label className="form-label small text-muted mb-1 fw-bold" style={{ fontSize: '10px' }}>Full Name</label>
                                    <input
                                        type="text"
                                        className={getInputClass(signupAttempts && !fullName)}
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        style={{ boxShadow: 'none' }}
                                    />
                                    {signupAttempts && !fullName && <div className="text-danger small mt-1">Required</div>}
                                </div>
                                <div className="mb-2">
                                    <label className="form-label small text-muted mb-1 fw-bold" style={{ fontSize: '10px' }}>Email Id</label>
                                    <input
                                        type="email"
                                        className={getInputClass(signupAttempts && !signupEmail)}
                                        value={signupEmail}
                                        onChange={(e) => setSignupEmail(e.target.value)}
                                        style={{ boxShadow: 'none' }}
                                    />
                                    {signupAttempts && !signupEmail && <div className="text-danger small mt-1">Required</div>}
                                </div>
                                <div className="mb-2">
                                    <label className="form-label small text-muted mb-1 fw-bold" style={{ fontSize: '10px' }}>Password</label>
                                    <div className="position-relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            className={getInputClass(signupAttempts && !signupPassword)}
                                            value={signupPassword}
                                            onChange={(e) => setSignupPassword(e.target.value)}
                                            style={{ boxShadow: 'none', paddingRight: '30px' }}
                                        />
                                        <span
                                            className="position-absolute top-50 translate-middle-y end-0 me-2 text-muted"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            <i className={`bi bi-eye${showPassword ? '' : '-slash'}`}></i>
                                        </span>
                                    </div>
                                    {signupAttempts && !signupPassword && <div className="text-danger small mt-1">Required</div>}
                                </div>
                                <div className="mb-4">
                                    <label className="form-label small text-muted mb-1 fw-bold" style={{ fontSize: '10px' }}>Mobile Number</label>
                                    <input
                                        type="text"
                                        className={getInputClass(signupAttempts && !mobile)}
                                        value={mobile}
                                        onChange={(e) => setMobile(e.target.value)}
                                        style={{ boxShadow: 'none' }}
                                    />
                                    {signupAttempts && !mobile && <div className="text-danger small mt-1">Required</div>}
                                </div>

                                {signupError && <div className="alert alert-danger py-1 small">{signupError}</div>}

                                <button type="submit" className="btn w-100 fw-bold py-2 text-white mt-4" style={{ backgroundColor: '#A03037', border: 'none', borderRadius: '2px' }}>Signup</button>

                                <div className="d-flex align-items-center my-2">
                                    <hr className="flex-grow-1 my-0" />
                                    <span className="text-muted fw-bold small mx-3" style={{ fontSize: '12px' }}>OR</span>
                                    <hr className="flex-grow-1 my-0" />
                                </div>

                                <button type="button" className="btn btn-light border w-100 fw-bold text-muted py-2 small" style={{ borderRadius: '2px' }} onClick={() => window.open('http://localhost:5000/auth/google', '_self')}>Google Signup</button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
