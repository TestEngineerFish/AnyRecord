import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cryptoService } from '../../services/crypto';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // 验证主密码
      const isValid = await cryptoService.verifyPassword(formData.password);
      if (!isValid) {
        setError('密码错误');
        return;
      }

      // 登录成功
      login();
      navigate('/');
    } catch (error) {
      console.error('登录失败:', error);
      setError('登录失败，请重试');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-neutral-50 py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-md w-full space-y-8 animate-slide-in">
        {/* Logo 和标题 */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-primary-600 rounded-full flex items-center justify-center mb-6 animate-bounce-subtle">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-neutral-900 mb-2">
            欢迎回来
          </h2>
          <p className="text-neutral-600">
            请登录您的 AnyRecord 账户
          </p>
          {error && (
            <div className="mt-4 p-3 bg-danger-50 border border-danger-200 rounded-lg animate-shake">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-danger-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-danger-700">{error}</span>
              </div>
            </div>
          )}
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                邮箱地址
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="input w-full"
                placeholder="请输入您的邮箱地址"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
                主密码
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="input w-full"
                placeholder="请输入您的主密码"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="rememberMe"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-700">
                记住我
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">
                忘记密码？
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="btn-primary w-full"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              登录
            </button>
          </div>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gradient-to-br from-primary-50 to-neutral-50 text-neutral-500">或</span>
          </div>
        </div>

        <div>
          <button
            onClick={() => navigate('/guest')}
            className="btn-secondary w-full"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            以访客模式使用
          </button>
          <p className="text-xs text-neutral-500 text-center mt-2">
            访客模式下数据不会保存
          </p>
        </div>
        
        {/* 底部信息 */}
        <div className="text-center text-xs text-neutral-500">
          <p>使用 AnyRecord，您同意我们的服务条款和隐私政策</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
