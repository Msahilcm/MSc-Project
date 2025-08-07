import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage';
import ProductPage from './components/ProductPage';
import ProductDetailPage from './components/ProductDetailPage';
import LoginFormPage from './components/LoginFormPage';
import ForgotPassword from './components/ForgotPassword';
import RegisterFormPage from './components/RegisterFormPage';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import AdminProductManagement from './components/AdminProductManagement';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import UserProfilePage from './components/UserProfilePage';
import FavoritesPage from './components/FavoritesPage';
import CartPage from './components/CartPage';
import { CartProvider } from './contexts/CartContext';
import './App.css';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/product/:productId" element={<ProductDetailPage />} />
          <Route path="/login" element={<LoginFormPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<RegisterFormPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
          <Route path="/admin/products" element={<ProtectedAdminRoute><AdminProductManagement /></ProtectedAdminRoute>} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
