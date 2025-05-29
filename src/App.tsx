import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import AuthRoutes from './routes/AuthRoutes';
import AppRoutes from './routes/AppRoutes';
import MainLayout from './components/Layout/MainLayout';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
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
    </Router>
  );
}

export default App;
