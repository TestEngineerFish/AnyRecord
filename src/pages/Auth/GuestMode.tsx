import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const GuestMode = () => {
  const navigate = useNavigate();
  const { loginAsGuest } = useAuth();

  const handleConfirm = () => {
    // 设置访客模式状态
    loginAsGuest();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-warning-50 to-neutral-50 py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-md w-full space-y-8 animate-slide-in">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-to-br from-warning-500 to-warning-600 rounded-full flex items-center justify-center mb-6 animate-bounce-subtle">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-neutral-900 mb-2">
            访客模式
          </h2>
          <p className="text-neutral-600">
            无需注册，立即体验 AnyRecord
          </p>
        </div>

        <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-warning-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-warning-800 mb-2">访客模式特点</h4>
              <ul className="text-sm text-warning-700 space-y-1">
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  无需注册即可使用所有功能
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  数据仅在当前会话中保存
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  关闭浏览器后数据将被清除
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleConfirm}
            className="btn-primary w-full"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            开始使用访客模式
          </button>
          <button
            onClick={() => navigate('/login')}
            className="btn-secondary w-full"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
            </svg>
            返回登录页面
          </button>
        </div>

        <div className="text-center text-xs text-neutral-500">
          <p>想要永久保存数据？<button onClick={() => navigate('/login')} className="text-primary-600 hover:text-primary-500 underline">创建账户</button></p>
        </div>
      </div>
    </div>
  );
};

export default GuestMode;
