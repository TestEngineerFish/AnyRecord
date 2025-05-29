import { useState, useEffect } from 'react';
import { storageService } from '../../services/storage';
import { autoLockService } from '../../services/autoLock';

interface Settings {
  theme: 'light' | 'dark' | 'system';
  autoLock: {
    enabled: boolean;
    timeout: number;
  };
  passwordGenerator: {
    length: number;
    useUppercase: boolean;
    useLowercase: boolean;
    useNumbers: boolean;
    useSymbols: boolean;
  };
}

const DEFAULT_SETTINGS: Settings = {
  theme: 'system',
  autoLock: {
    enabled: true,
    timeout: 30,
  },
  passwordGenerator: {
    length: 16,
    useUppercase: true,
    useLowercase: true,
    useNumbers: true,
    useSymbols: true,
  },
};

const Settings = () => {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    // 从 localStorage 加载设置
    const savedSettings = localStorage.getItem('settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSettingChange = (key: keyof Settings, value: Settings[keyof Settings]) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('settings', JSON.stringify(newSettings));

    // 如果更新了自动锁定设置，同步到自动锁定服务
    if (key === 'autoLock') {
      autoLockService.updateSettings(value as Settings['autoLock']);
    }
  };

  const handlePasswordGeneratorChange = (key: keyof Settings['passwordGenerator'], value: Settings['passwordGenerator'][keyof Settings['passwordGenerator']]) => {
    const newSettings = {
      ...settings,
      passwordGenerator: {
        ...settings.passwordGenerator,
        [key]: value,
      },
    };
    setSettings(newSettings);
    localStorage.setItem('settings', JSON.stringify(newSettings));
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      setError(null);
      setSuccess(null);

      const data = await storageService.exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `anyrecord-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setSuccess('数据导出成功');
    } catch (err) {
      console.error('导出数据失败:', err);
      setError('导出数据失败，请重试');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      setError(null);
      setSuccess(null);

      const text = await file.text();
      await storageService.importData(text);

      setSuccess('数据导入成功');
    } catch (err) {
      console.error('导入数据失败:', err);
      setError('导入数据失败，请确保文件格式正确');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          设置
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          管理应用配置和数据
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

      {success && (
        <div className="mb-4 p-4 rounded-md bg-green-50 dark:bg-green-900">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700 dark:text-green-200">{success}</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* 主题设置 */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">主题</h3>
          <div className="mt-4 space-y-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="theme-light"
                name="theme"
                value="light"
                checked={settings.theme === 'light'}
                onChange={(e) => handleSettingChange('theme', e.target.value as 'light')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <label htmlFor="theme-light" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                浅色
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="theme-dark"
                name="theme"
                value="dark"
                checked={settings.theme === 'dark'}
                onChange={(e) => handleSettingChange('theme', e.target.value as 'dark')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <label htmlFor="theme-dark" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                深色
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="theme-system"
                name="theme"
                value="system"
                checked={settings.theme === 'system'}
                onChange={(e) => handleSettingChange('theme', e.target.value as 'system')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <label htmlFor="theme-system" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                跟随系统
              </label>
            </div>
          </div>
        </div>

        {/* 自动锁定设置 */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">自动锁定</h3>
          <div className="mt-4 space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="autoLockEnabled"
                name="autoLockEnabled"
                checked={settings.autoLock.enabled}
                onChange={(e) => handleSettingChange('autoLock', { ...settings.autoLock, enabled: e.target.checked })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="autoLockEnabled" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                启用自动锁定
              </label>
            </div>
            {settings.autoLock.enabled && (
              <div>
                <label htmlFor="autoLockTimeout" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  自动锁定时间（分钟）
                </label>
                <select
                  id="autoLockTimeout"
                  name="autoLockTimeout"
                  value={settings.autoLock.timeout}
                  onChange={(e) => handleSettingChange('autoLock', { ...settings.autoLock, timeout: Number(e.target.value) })}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-800 dark:border-gray-600"
                >
                  <option value={5}>5 分钟</option>
                  <option value={15}>15 分钟</option>
                  <option value={30}>30 分钟</option>
                  <option value={60}>1 小时</option>
                  <option value={120}>2 小时</option>
                  <option value={0}>从不</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* 密码生成器设置 */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">密码生成器</h3>
          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="passwordLength" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                密码长度
              </label>
              <input
                type="range"
                id="passwordLength"
                name="passwordLength"
                min="8"
                max="32"
                step="1"
                value={settings.passwordGenerator.length}
                onChange={(e) => handlePasswordGeneratorChange('length', Number(e.target.value))}
                className="mt-1 block w-full"
              />
              <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {settings.passwordGenerator.length} 个字符
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="useUppercase"
                  name="useUppercase"
                  checked={settings.passwordGenerator.useUppercase}
                  onChange={(e) => handlePasswordGeneratorChange('useUppercase', e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="useUppercase" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  使用大写字母
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="useLowercase"
                  name="useLowercase"
                  checked={settings.passwordGenerator.useLowercase}
                  onChange={(e) => handlePasswordGeneratorChange('useLowercase', e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="useLowercase" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  使用小写字母
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="useNumbers"
                  name="useNumbers"
                  checked={settings.passwordGenerator.useNumbers}
                  onChange={(e) => handlePasswordGeneratorChange('useNumbers', e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="useNumbers" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  使用数字
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="useSymbols"
                  name="useSymbols"
                  checked={settings.passwordGenerator.useSymbols}
                  onChange={(e) => handlePasswordGeneratorChange('useSymbols', e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="useSymbols" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  使用特殊字符
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* 数据导入导出 */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">数据管理</h3>
          <div className="mt-4 space-y-4">
            <div>
              <button
                type="button"
                onClick={handleExport}
                disabled={isExporting}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExporting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    导出中...
                  </>
                ) : (
                  '导出数据'
                )}
              </button>
            </div>
            <div>
              <label className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer">
                {isImporting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    导入中...
                  </>
                ) : (
                  '导入数据'
                )}
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  disabled={isImporting}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 