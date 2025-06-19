import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import MasterPassword from '../pages/Auth/MasterPassword';
import DashboardRoutes from './DashboardRoutes';
import { cryptoService } from '../services/crypto';

const AppRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // 检查是否已设置主密码
      const hasMasterPassword = await cryptoService.verifyPassword('');
      setIsAuthenticated(hasMasterPassword);
    } catch (error) {
      console.error('检查认证状态失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/master-password"
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <MasterPassword />
        }
      />
      <Route
        path="/*"
        element={
          isAuthenticated ? (
            <DashboardRoutes />
          ) : (
            <Navigate to="/master-password" replace />
          )
        }
      />
    </Routes>
  );
};

export default AppRoutes; 