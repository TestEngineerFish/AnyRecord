import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AuthRoutes from './routes/AuthRoutes';
import AppRoutes from './routes/AppRoutes';
import MainLayout from './components/Layout/MainLayout';
import Login from './pages/Auth/Login';
import MasterPassword from './pages/Auth/MasterPassword';
import { cryptoService } from './services/crypto';
import { useAuth, AuthProvider } from './contexts/AuthContext';

function AppContent() {
  const { isAuthenticated, isGuestMode } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [hasMasterPassword, setHasMasterPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 如果已经是游客模式，跳过主密码检查
    if (isGuestMode) {
      setIsLoading(false);
      return;
    }
    checkMasterPassword();
  }, [isGuestMode]);

  const checkMasterPassword = async () => {
    try {
      // 检查是否已设置主密码
      const hasPassword = await cryptoService.verifyPassword('');
      setHasMasterPassword(hasPassword);
      if (!hasPassword) {
        // 如果没有设置主密码，导航到主密码设置页面
        navigate('/master-password');
        return;
      }
    } catch (error) {
      console.error('检查主密码状态失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-50 to-neutral-50">
        <div className="text-center animate-fade-in">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* 主密码设置路由 - 只在非游客模式下显示 */}
      {!isGuestMode && !hasMasterPassword && (
        <Route path="/master-password" element={<MasterPassword />} />
      )}

      {/* 认证路由 */}
      {!isAuthenticated && (
        <Route path="/*" element={<AuthRoutes />} />
      )}

      {/* 主应用路由 */}
      {isAuthenticated && (
        <Route element={<MainLayout />}>
          <Route path="/*" element={<AppRoutes />} />
        </Route>
      )}

      {/* 默认重定向 */}
      <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
    </Routes>
  );
}

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;
