import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PasswordGenerator from '../../components/PasswordGenerator';
import { storageService } from '../../services/storage';

interface AccountFormData {
  platform: string;
  username: string;
  password: string;
  url?: string;
  tags: string[];
  notes?: string;
}

const EditAccount = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [step, setStep] = useState(1);
  const [showPasswordGenerator, setShowPasswordGenerator] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<AccountFormData>({
    platform: '',
    username: '',
    password: '',
    url: '',
    tags: [],
    notes: ''
  });

  useEffect(() => {
    const loadAccount = async () => {
      if (!id) {
        setError('账号ID不存在');
        setIsLoading(false);
        return;
      }

      try {
        const account = await storageService.getAccount(id);
        if (!account) {
          setError('账号不存在');
          setIsLoading(false);
          return;
        }

        setFormData({
          platform: account.platform,
          username: account.username,
          password: account.password,
          url: account.url || '',
          tags: account.tags || [],
          notes: account.notes || ''
        });
      } catch (err) {
        console.error('加载账号失败:', err);
        setError('加载账号失败，请重试');
      } finally {
        setIsLoading(false);
      }
    };

    loadAccount();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) {
      setError('账号ID不存在');
      return;
    }

    if (step === 1) {
      setStep(2);
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await storageService.updateAccount(id, formData);
      navigate('/');
    } catch (err) {
      console.error('更新账号失败:', err);
      setError('更新账号失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordGenerate = (password: string) => {
    setFormData(prev => ({
      ...prev,
      password
    }));
    setShowPasswordGenerator(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          编辑账号
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {step === 1 ? '第一步：修改基本信息' : '第二步：修改标签和备注'}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-md bg-red-50 dark:bg-red-900">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 ? (
          <>
            <div>
              <label htmlFor="platform" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                平台名称
              </label>
              <input
                type="text"
                name="platform"
                id="platform"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600"
                value={formData.platform}
                onChange={handleChange}
                placeholder="例如：GitHub、Google"
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                用户名/邮箱
              </label>
              <input
                type="text"
                name="username"
                id="username"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600"
                value={formData.username}
                onChange={handleChange}
                placeholder="输入用户名或邮箱地址"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                密码
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="password"
                  name="password"
                  id="password"
                  required
                  className="flex-1 block w-full border border-gray-300 rounded-l-md py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="输入密码"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordGenerator(true)}
                  className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                >
                  生成
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                登录网址（可选）
              </label>
              <input
                type="url"
                name="url"
                id="url"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600"
                value={formData.url}
                onChange={handleChange}
                placeholder="https://"
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                标签（可选）
              </label>
              <input
                type="text"
                name="tags"
                id="tags"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600"
                value={formData.tags.join(', ')}
                onChange={(e) => {
                  const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
                  setFormData(prev => ({ ...prev, tags }));
                }}
                placeholder="用逗号分隔多个标签，如：工作, 个人"
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                备注（可选）
              </label>
              <textarea
                name="notes"
                id="notes"
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600"
                value={formData.notes}
                onChange={handleChange}
                placeholder="添加备注信息"
              />
            </div>
          </>
        )}

        <div className="flex justify-between">
          {step === 2 && (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
            >
              上一步
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="ml-auto inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                保存中...
              </>
            ) : (
              step === 1 ? '下一步' : '保存'
            )}
          </button>
        </div>
      </form>

      {/* 密码生成器弹窗 */}
      {showPasswordGenerator && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <PasswordGenerator onGenerate={handlePasswordGenerate} />
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setShowPasswordGenerator(false)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditAccount;
