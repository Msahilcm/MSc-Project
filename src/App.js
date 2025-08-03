import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage';
import LoginPage from './components/LoginPage';
import LoginFormPage from './components/LoginFormPage';
import RegisterFormPage from './components/RegisterFormPage';
import UserProfilePage from './components/UserProfilePage';
import ProductPage from './components/ProductPage';
import ProductDetailPage from './components/ProductDetailPage';
import AdminDashboard from './components/AdminDashboard';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login/form" element={<LoginFormPage />} />
        <Route path="/register" element={<RegisterFormPage />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/product/:productId" element={<ProductDetailPage />} />
        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
