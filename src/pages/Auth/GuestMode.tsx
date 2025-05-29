import { useNavigate } from 'react-router-dom';

const GuestMode = () => {
  const navigate = useNavigate();

  const handleConfirm = () => {
    // TODO: 设置访客模式状态
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            访客模式
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            请注意：访客模式下的数据将不会保存
          </p>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700 dark:text-yellow-200">
                在访客模式下：
                <ul className="list-disc list-inside mt-2">
                  <li>所有数据仅保存在当前浏览器会话中</li>
                  <li>关闭浏览器后数据将被清除</li>
                  <li>无法进行数据同步</li>
                </ul>
              </p>
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => navigate('/login')}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            返回登录
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            确认使用访客模式
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuestMode;
