import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import ProtectedRoute from './components/ProtectedRoute'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import BookDetailPage from './pages/BookDetailPage'
import CartPage from './pages/CartPage'
import OrderPage from './pages/OrderPage'
import WishlistPage from './pages/WishlistPage'
import ProfilePage from './pages/ProfilePage'
import LoginPage from './pages/LoginPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import OrderSuccessPage from './pages/OrderSuccessPage'

function AppContent() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const hideHeaderPaths = ['/login', '/forgot-password'];
  const showHeader = !hideHeaderPaths.includes(location.pathname);
  const { loginWithToken } = useAuth();
  const navigate = React.useNavigate ? React.useNavigate() : null; // Hooks call order might be tricky inside AppContent which is child. 
  // Wait, AppContent is inside Router so navigate works? No, AppContent is inside App -> Router. Check line 67.
  // Actually AppContent is CALLED inside App which is inside BrowserRouter? No.
  // App.jsx structure:
  // function AppContent() { useLocation... }
  // function App() { return (AuthProvider)(CartProvider)(AppContent) }
  // Where is Router?
  // Usually Router is in main.jsx.
  // I will assume Router surrounds App.
  const query = new URLSearchParams(location.search);
  const token = query.get('token');

  React.useEffect(() => {
    if (token) {
      loginWithToken(token).then(() => {
        // Remove token from URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }).catch(err => {
        console.error(err);
      });
    }
  }, [token, loginWithToken]);

  return (
    <div className="d-flex flex-column min-vh-100">
      {showHeader && <Header />}

      <main className={`flex-grow-1 ${showHeader ? 'bg-white' : 'bg-light'}`}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
          } />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/book/:id" element={<BookDetailPage />} />

          {/* Protected Routes */}
          <Route path="/cart" element={
            <ProtectedRoute><CartPage /></ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute><OrderPage /></ProtectedRoute>
          } />
          <Route path="/wishlist" element={
            <ProtectedRoute><WishlistPage /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><ProfilePage /></ProtectedRoute>
          } />
          <Route path="/order-success" element={
            <ProtectedRoute><OrderSuccessPage /></ProtectedRoute>
          } />
        </Routes>
      </main>

      {/* Footer placeholder - Only show if Header is shown */}
      {showHeader && (
        <footer className="bg-dark text-white py-3 mt-auto">
          <div className="container text-start">
            <small className="text-white-50">Copyright © 2020, Bookstore Private Limited. All Rights Reserved</small>
          </div>
        </footer>
      )}
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  )
}

export default App
