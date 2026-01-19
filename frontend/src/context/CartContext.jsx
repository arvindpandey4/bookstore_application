import React, { createContext, useContext, useState, useEffect } from 'react';
import bookService from '../services/bookService';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartCount, setCartCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchCartCount = async () => {
        try {
            const data = await bookService.getCart();
            if (data.success) {
                const count = data.data.items?.reduce((total, item) => total + item.quantity, 0) || 0;
                setCartCount(count);
            }
        } catch (error) {
            console.error('Error fetching cart count:', error);
            setCartCount(0);
        }
    };

    const refreshCart = () => {
        fetchCartCount();
    };

    useEffect(() => {
        // Fetch cart count on mount
        const token = localStorage.getItem('token');
        if (token) {
            fetchCartCount();
        }

        // Listen for cart updates
        window.addEventListener('cartUpdated', fetchCartCount);

        return () => {
            window.removeEventListener('cartUpdated', fetchCartCount);
        };
    }, []);

    return (
        <CartContext.Provider value={{ cartCount, refreshCart, loading }}>
            {children}
        </CartContext.Provider>
    );
};
