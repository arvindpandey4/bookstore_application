import React, { createContext, useState, useContext, useEffect } from 'react';
import userService from '../services/userService';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on mount
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        const data = await userService.login(credentials);
        if (data.success) {
            setUser(data.data);
            return data;
        }
        throw new Error(data.message || 'Login failed');
    };

    const register = async (userData) => {
        const data = await userService.register(userData);
        if (data.success) {
            // Auto-login after registration
            setUser(data.data);
            return data;
        }
        throw new Error(data.message || 'Registration failed');
    };

    const logout = () => {
        userService.logout();
        setUser(null);
    };

    const value = {
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
