import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cryptoService } from '../../services/crypto';
import { useAuth } from '../../contexts/AuthContext';

const MasterPassword = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkMasterPassword();
  }, []);

  const checkMasterPassword = async () => {
    try {
      // 检查是否已设置主密码
      const hasMasterPassword = await cryptoService.verifyPassword('');
      setIsSettingUp(!hasMasterPassword);
    } catch (error) {
      console.error('检查主密码状态失败:', error);
      setError('检查主密码状态失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('密码长度至少为8个字符');
      return;
    }

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    try {
      await cryptoService.initialize(password);
      login();
      navigate('/');
    } catch (error) {
      console.error('设置主密码失败:', error);
      setError('设置主密码失败');
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const isValid = await cryptoService.verifyPassword(password);
      if (isValid) {
        login();
        navigate('/');
      } else {
        setError('密码错误');
      }
    } catch (error) {
      console.error('验证密码失败:', error);
      setError('验证密码失败');
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-neutral-50 py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-md w-full space-y-8 animate-slide-in">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center mb-6 animate-bounce-subtle">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-neutral-900 mb-2">
            {isSettingUp ? '设置主密码' : '输入主密码'}
          </h2>
          <p className="text-neutral-600 max-w-sm mx-auto">
            {isSettingUp
              ? '为您的密码库设置一个安全的主密码，请确保它足够强壮且不会忘记'
              : '请输入您的主密码来解锁您的密码库'}
          </p>
        </div>

        <form className="space-y-6" onSubmit={isSettingUp ? handleSetup : handleVerify}>
          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
                {isSettingUp ? '新主密码' : '主密码'}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="input w-full"
                placeholder={isSettingUp ? '请输入一个强密码（至少8位）' : '请输入您的主密码'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {isSettingUp && (
                <div className="mt-2">
                  <div className="text-xs text-neutral-500">
                    密码强度要求：
                  </div>
                  <div className="flex space-x-1 mt-1">
                    <div className={`h-1 w-full rounded ${password.length >= 8 ? 'bg-success-500' : 'bg-neutral-200'}`}></div>
                    <div className={`h-1 w-full rounded ${/[A-Z]/.test(password) ? 'bg-success-500' : 'bg-neutral-200'}`}></div>
                    <div className={`h-1 w-full rounded ${/[0-9]/.test(password) ? 'bg-success-500' : 'bg-neutral-200'}`}></div>
                    <div className={`h-1 w-full rounded ${/[^A-Za-z0-9]/.test(password) ? 'bg-success-500' : 'bg-neutral-200'}`}></div>
                  </div>
                  <div className="text-xs text-neutral-500 mt-1">
                    至少8位，包含大小写字母、数字和特殊字符
                  </div>
                </div>
              )}
            </div>
            {isSettingUp && (
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-neutral-700 mb-2">
                  确认主密码
                </label>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  required
                  className="input w-full"
                  placeholder="请再次输入相同的密码"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-danger-600 mt-1">密码不一致</p>
                )}
              </div>
            )}
          </div>

          {error && (
            <div className="p-4 bg-danger-50 border border-danger-200 rounded-lg animate-shake">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-danger-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-danger-700">{error}</p>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={isSettingUp && (password.length < 8 || password !== confirmPassword)}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isSettingUp ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                )}
              </svg>
              {isSettingUp ? '设置主密码' : '解锁密码库'}
            </button>
          </div>
          
          {isSettingUp && (
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-primary-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="text-sm font-medium text-primary-800 mb-1">重要提示</h4>
                  <p className="text-xs text-primary-700">
                    请牢记您的主密码，一旦丢失无法找回。建议将其写下并安全保存。
                  </p>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default MasterPassword; 