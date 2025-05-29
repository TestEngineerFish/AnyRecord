import { useState } from 'react';

const Sync = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      // TODO: 实现同步逻辑
      await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟同步过程
      setLastSyncTime(new Date().toLocaleString());
    } catch (error) {
      console.error('同步失败:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          同步设置
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          管理数据同步和备份
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isSyncing ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                同步中...
              </>
            ) : (
              '立即同步'
            )}
          </button>
        </div>

        {lastSyncTime && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            上次同步时间：{lastSyncTime}
          </div>
        )}

        <div className="bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700 dark:text-yellow-200">
                注意：同步功能目前处于开发中，暂不可用。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sync;
