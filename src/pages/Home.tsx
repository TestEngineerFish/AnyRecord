import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const { logout, isGuestMode } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50 animate-fade-in">
      <div className="container mx-auto px-4 py-8">
        {/* 欢迎头部 */}
        <div className="text-center mb-8 animate-slide-in">
          {isGuestMode && (
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-warning-100 text-warning-800 mb-4">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              访客模式
            </div>
          )}
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            欢迎来到 AnyRecord
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            {isGuestMode 
              ? '您正在使用访客模式，数据将不会被保存' 
              : '安全可靠的密码管理器，保护您的数字生活'
            }
          </p>
        </div>
        
        {/* 功能卡片 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="card-hover animate-slide-in" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900">密码管理</h3>
            </div>
            <p className="text-neutral-600 mb-4">
              安全存储和管理您的所有密码，使用军用级加密技术
            </p>
            <button className="btn-primary w-full">
              管理密码
            </button>
          </div>
          
          <div className="card-hover animate-slide-in" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900">安全检查</h3>
            </div>
            <p className="text-neutral-600 mb-4">
              定期检查密码强度，及时发现安全风险
            </p>
            <button className="btn-secondary w-full">
              开始检查
            </button>
          </div>
          
          <div className="card-hover animate-slide-in" style={{animationDelay: '0.3s'}}>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900">导入导出</h3>
            </div>
            <p className="text-neutral-600 mb-4">
              导入其他密码管理器数据，或备份您的数据
            </p>
            <button className="btn-secondary w-full">
              数据管理
            </button>
          </div>
        </div>
        
        {/* 操作栏 */}
        <div className="flex justify-center space-x-4 animate-fade-in" style={{animationDelay: '0.5s'}}>
          <button
            onClick={logout}
            className="btn-danger"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            退出登录
          </button>
        </div>
        
        {/* 底部统计 */}
        <div className="mt-16 text-center text-sm text-neutral-500 animate-pulse-soft">
          <p>数据安全存储在本地，使用客户端加密技术</p>
        </div>
      </div>
    </div>
  );
};

export default Home; 