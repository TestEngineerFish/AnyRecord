import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storageService, type Account } from '../../services/storage';
import { autoLockService } from '../../services/autoLock';

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await storageService.getAllAccounts();
      setAccounts(data);
    } catch (err) {
      setError('加载账号数据失败');
      console.error('加载账号数据失败:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAccount = () => {
    navigate('/add');
  };

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    try {
      if (query.trim()) {
        const results = await storageService.searchAccounts(query);
        setAccounts(results);
      } else {
        await loadAccounts();
      }
    } catch (err) {
      console.error('搜索账号失败:', err);
    }
  };

  const handleDeleteAccount = async (id: string) => {
    if (!window.confirm('确定要删除这个账号吗？')) {
      return;
    }

    try {
      await storageService.deleteAccount(id);
      setAccounts(prev => prev.filter(account => account.id !== id));
    } catch (err) {
      console.error('删除账号失败:', err);
      alert('删除账号失败');
    }
  };

  const handleCopyPassword = async (password: string) => {
    try {
      await navigator.clipboard.writeText(password);
      alert('密码已复制到剪贴板');
    } catch (err) {
      console.error('复制密码失败:', err);
      alert('复制密码失败');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 顶部操作栏 */}
      <div className="flex justify-between items-center">
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="搜索账号..."
              value={searchQuery}
              onChange={handleSearch}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => autoLockService.lockNow()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
          >
            <svg className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            锁定
          </button>
          <button
            onClick={() => navigate('/settings')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
          >
            <svg className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            设置
          </button>
          <button
            onClick={handleAddAccount}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            添加账号
          </button>
        </div>
      </div>

      {/* 账号列表 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {accounts.map(account => (
          <div
            key={account.id}
            className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {/* TODO: 添加平台图标 */}
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      平台
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {account.platform}
                    </dd>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate mt-2">
                      用户名
                    </dt>
                    <dd className="text-sm text-gray-900 dark:text-white">
                      {account.username}
                    </dd>
                    {account.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {account.tags.map(tag => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3">
              <div className="flex justify-between">
                <button
                  onClick={() => navigate(`/edit/${account.id}`)}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  编辑
                </button>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleCopyPassword(account.password)}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    复制密码
                  </button>
                  <button
                    onClick={() => handleDeleteAccount(account.id)}
                    className="text-sm font-medium text-red-600 hover:text-red-500"
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 空状态 */}
      {accounts.length === 0 && (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">暂无账号</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            开始添加您的第一个账号吧！
          </p>
          <div className="mt-6">
            <button
              onClick={handleAddAccount}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              添加账号
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
