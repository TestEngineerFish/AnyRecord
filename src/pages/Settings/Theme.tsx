import { useState } from 'react';

const Theme = () => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    // TODO: 实现主题切换逻辑
    console.log('切换主题:', newTheme);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          主题设置
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          自定义应用的外观
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            主题模式
          </label>
          <div className="mt-4 space-y-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="theme-light"
                name="theme"
                value="light"
                checked={theme === 'light'}
                onChange={() => handleThemeChange('light')}
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
                checked={theme === 'dark'}
                onChange={() => handleThemeChange('dark')}
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
                checked={theme === 'system'}
                onChange={() => handleThemeChange('system')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <label htmlFor="theme-system" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                跟随系统
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Theme;
