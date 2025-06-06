import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const { logout } = useAuth();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">首页</h1>
      <nav className="mb-4">
        <Link to="/test-rds" className="text-blue-500 hover:underline mr-4">
          RDS测试
        </Link>
        <button
          onClick={logout}
          className="text-red-500 hover:underline"
        >
          退出登录
        </button>
      </nav>
    </div>
  );
};

export default Home; 