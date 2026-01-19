import React from 'react';
import { useAuth } from '../context/AuthContext';
import PleaseLoginPage from '../pages/PleaseLoginPage';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <PleaseLoginPage />;
    }

    return children;
};

export default ProtectedRoute;
