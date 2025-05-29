import { useState, useCallback } from 'react';

interface PasswordGeneratorProps {
  onGenerate: (password: string) => void;
}

const PasswordGenerator = ({ onGenerate }: PasswordGeneratorProps) => {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true
  });

  const generatePassword = useCallback(() => {
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let chars = '';
    if (options.uppercase) chars += uppercaseChars;
    if (options.lowercase) chars += lowercaseChars;
    if (options.numbers) chars += numberChars;
    if (options.symbols) chars += symbolChars;

    if (chars === '') {
      chars = lowercaseChars + numberChars; // 默认至少包含小写字母和数字
    }

    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }

    onGenerate(password);
  }, [length, options, onGenerate]);

  const handleOptionChange = (option: keyof typeof options) => {
    setOptions(prev => {
      const newOptions = { ...prev, [option]: !prev[option] };
      // 确保至少选择了一种字符类型
      if (Object.values(newOptions).every(v => !v)) {
        newOptions[option] = true;
      }
      return newOptions;
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            密码长度: {length}
          </label>
          <input
            type="range"
            min="8"
            max="32"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="uppercase"
              checked={options.uppercase}
              onChange={() => handleOptionChange('uppercase')}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="uppercase" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              大写字母 (A-Z)
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="lowercase"
              checked={options.lowercase}
              onChange={() => handleOptionChange('lowercase')}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="lowercase" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              小写字母 (a-z)
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="numbers"
              checked={options.numbers}
              onChange={() => handleOptionChange('numbers')}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="numbers" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              数字 (0-9)
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="symbols"
              checked={options.symbols}
              onChange={() => handleOptionChange('symbols')}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="symbols" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              特殊字符 (!@#$%^&*)
            </label>
          </div>
        </div>

        <button
          type="button"
          onClick={generatePassword}
          className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          生成密码
        </button>
      </div>
    </div>
  );
};

export default PasswordGenerator; 