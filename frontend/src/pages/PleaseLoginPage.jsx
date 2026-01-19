import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import nothingImage from '../assets/Page-1.svg';

const PleaseLoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Determine content based on route
    let message = "Login to view items in your wishlist.";
    if (location.pathname.includes('orders')) {
        message = "Login to view your recent orders.";
    } else if (location.pathname.includes('cart')) {
        message = "Login to view items in your cart.";
    } else if (location.pathname.includes('profile')) {
        message = "Login to view your profile.";
    }

    return (
        <div className="d-flex flex-column align-items-center justify-content-center py-5 mt-5">
            <h5 className="fw-bold text-uppercase mb-2 text-dark">PLEASE LOG IN</h5>
            <p className="text-muted small mb-5">{message}</p>

            <div className="mb-5">
                <img src={nothingImage} alt="Please Login" style={{ width: '80px', opacity: 0.8 }} />
            </div>

            <button
                className="btn fw-bold px-5 py-2 small"
                style={{
                    color: '#A03037',
                    border: '1px solid #A03037',
                    backgroundColor: 'white',
                    borderRadius: '2px',
                    letterSpacing: '0.5px'
                }}
                onClick={() => navigate('/login')}
            >
                LOGIN/SIGNUP
            </button>
        </div>
    );
};

export default PleaseLoginPage;
