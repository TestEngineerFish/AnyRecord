import { useState, useEffect } from 'react';
import { passwordStrengthService, PasswordStrength, type PasswordStrengthResult } from '../services/passwordStrength';

interface PasswordStrengthIndicatorProps {
  password: string;
  onStrengthChange?: (strength: PasswordStrengthResult) => void;
}

const strengthColors = {
  [PasswordStrength.VeryWeak]: 'bg-red-500',
  [PasswordStrength.Weak]: 'bg-orange-500',
  [PasswordStrength.Medium]: 'bg-yellow-500',
  [PasswordStrength.Strong]: 'bg-green-500',
  [PasswordStrength.VeryStrong]: 'bg-emerald-500',
};

const strengthText = {
  [PasswordStrength.VeryWeak]: '非常弱',
  [PasswordStrength.Weak]: '弱',
  [PasswordStrength.Medium]: '中等',
  [PasswordStrength.Strong]: '强',
  [PasswordStrength.VeryStrong]: '非常强',
};

const PasswordStrengthIndicator = ({ password, onStrengthChange }: PasswordStrengthIndicatorProps) => {
  const [strength, setStrength] = useState<PasswordStrengthResult | null>(null);

  useEffect(() => {
    if (password) {
      const result = passwordStrengthService.checkStrength(password);
      setStrength(result);
      onStrengthChange?.(result);
    } else {
      setStrength(null);
    }
  }, [password, onStrengthChange]);

  if (!password) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${strength ? strengthColors[strength.strength] : ''}`}
            style={{ width: `${strength?.score || 0}%` }}
          />
        </div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {strength ? strengthText[strength.strength] : ''}
        </span>
      </div>

      {strength && strength.feedback.length > 0 && (
        <div className="space-y-1">
          {strength.feedback.map((message, index) => (
            <p key={index} className="text-sm text-red-600 dark:text-red-400">
              {message}
            </p>
          ))}
        </div>
      )}

      {strength && strength.suggestions.length > 0 && (
        <div className="mt-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">建议：</h4>
          <ul className="list-disc list-inside space-y-1">
            {strength.suggestions.map((suggestion, index) => (
              <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator; 