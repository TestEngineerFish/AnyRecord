import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AuthRoutes from './routes/AuthRoutes';
import AppRoutes from './routes/AppRoutes';
import MainLayout from './components/Layout/MainLayout';
import Login from './pages/Auth/Login';
import MasterPassword from './pages/Auth/MasterPassword';
import { cryptoService } from './services/crypto';

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMasterPassword, setHasMasterPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkMasterPassword();
  }, []);

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
    return <div>加载中...</div>;
  }

  return (
    <Routes>
      {/* 主密码设置路由 */}
      {!hasMasterPassword && (
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

      {/* 登录路由 */}
      <Route path="/login" element={
        <Login setIsAuthenticated={setIsAuthenticated} />
      } />

      {/* 默认重定向 */}
      <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
