import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import AuthModal from './AuthModal';
import educationIcon from '../assets/education.svg';
import supermarketIcon from '../assets/supermarket.svg';

const Header = () => {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [showAuthModal, setShowAuthModal] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top py-2">
                <div className="container">
                    {/* Logo */}
                    <Link className="navbar-brand d-flex align-items-center me-5" to="/">
                        <img src={educationIcon} alt="Bookstore" className="me-2" style={{ width: '30px' }} />
                        <span className="fw-normal">Bookstore</span>
                    </Link>

                    {/* Search Bar */}
                    <div className="flex-grow-1 mx-lg-5">
                        <form onSubmit={handleSearch}>
                            <div className="input-group bg-white rounded overflow-hidden">
                                <span className="input-group-text bg-white border-0 text-muted ps-3">
                                    <i className="bi bi-search"></i>
                                </span>
                                <input
                                    className="form-control border-0 shadow-none"
                                    type="search"
                                    placeholder="Search books by title or author..."
                                    aria-label="Search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </form>
                    </div>

                    {/* User Actions */}
                    <div className="d-flex align-items-center ms-5">
                        {/* Profile Dropdown */}
                        <div className="dropdown">
                            <button
                                className="btn btn-link d-flex flex-column align-items-center text-white text-decoration-none mx-3 p-0 dropdown-toggle"
                                type="button"
                                id="profileDropdown"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="mb-0"><i className="bi bi-person fs-5"></i></div>
                                <small style={{ fontSize: '10px' }}>{user ? user.name.split(' ')[0] : 'Profile'}</small>
                            </button>

                            <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-0 p-3" aria-labelledby="profileDropdown" style={{ minWidth: '250px' }}>
                                {user ? (
                                    <>
                                        <li><h6 className="dropdown-header px-0 text-dark fw-bold mb-2">Hello {user.name},</h6></li>
                                        <li>
                                            <Link className="dropdown-item px-0 d-flex align-items-center text-muted" to="/profile">
                                                <i className="bi bi-person me-2"></i> Profile
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item px-0 d-flex align-items-center text-muted" to="/orders">
                                                <i className="bi bi-bag me-2"></i> My Orders
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item px-0 d-flex align-items-center text-muted" to="/wishlist">
                                                <i className="bi bi-heart me-2"></i> My Wishlist
                                            </Link>
                                        </li>
                                        <li><div className="dropdown-divider my-2"></div></li>
                                        <li>
                                            <button
                                                className="btn btn-outline-danger w-100 rounded-0 py-1"
                                                onClick={handleLogout}
                                            >
                                                Logout
                                            </button>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        <li><h6 className="dropdown-header px-0 text-dark fw-bold">Welcome</h6></li>
                                        <li><p className="small text-muted mb-2">To access account and manage orders</p></li>
                                        <li>
                                            <button
                                                className="btn btn-outline-danger w-100 rounded-0 mb-3"
                                                style={{ color: '#A03037', borderColor: '#A03037' }}
                                                onClick={() => setShowAuthModal(true)}
                                            >
                                                LOGIN/SIGNUP
                                            </button>
                                        </li>
                                        <li><div className="dropdown-divider"></div></li>
                                        <li>
                                            <Link className="dropdown-item px-0 d-flex align-items-center text-muted" to="/orders">
                                                <i className="bi bi-bag me-2"></i> My Orders
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item px-0 d-flex align-items-center text-muted" to="/wishlist">
                                                <i className="bi bi-heart me-2"></i> Wishlist
                                            </Link>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>

                        {/* Cart */}
                        <Link to="/cart" className="d-flex flex-column align-items-center text-white text-decoration-none ms-5 me-3 position-relative">
                            <div className="mb-0"><img src={supermarketIcon} alt="Cart" style={{ width: '25px', filter: 'brightness(0) invert(1)' }} /></div>
                            <small style={{ fontSize: '10px' }}>Cart</small>
                            {cartCount > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-white text-primary" style={{ fontSize: '8px', padding: '2px 5px' }}>
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Auth Modal Overlay */}
            {showAuthModal && (
                <AuthModal onClose={() => setShowAuthModal(false)} />
            )}
        </>
    );
};

export default Header;
