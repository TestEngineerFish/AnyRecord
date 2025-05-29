// 密码强度等级
export enum PasswordStrength {
  VeryWeak = 'very-weak',
  Weak = 'weak',
  Medium = 'medium',
  Strong = 'strong',
  VeryStrong = 'very-strong',
}

// 密码强度检查结果
export interface PasswordStrengthResult {
  strength: PasswordStrength;
  score: number; // 0-100
  feedback: string[];
  suggestions: string[];
}

// 常见密码列表（实际应用中应该使用更大的列表）
const COMMON_PASSWORDS = new Set([
  'password',
  '123456',
  '12345678',
  'qwerty',
  'abc123',
  'monkey',
  'letmein',
  'dragon',
  '111111',
  'baseball',
  'iloveyou',
  'trustno1',
  'sunshine',
  'master',
  'welcome',
  'shadow',
  'ashley',
  'football',
  'jesus',
  'michael',
  'ninja',
  'mustang',
  'password1',
]);

class PasswordStrengthService {
  // 检查密码强度
  checkStrength(password: string): PasswordStrengthResult {
    const feedback: string[] = [];
    const suggestions: string[] = [];
    let score = 0;

    // 检查密码长度
    if (password.length < 8) {
      feedback.push('密码长度至少需要8个字符');
      suggestions.push('增加密码长度');
    } else {
      score += Math.min(password.length * 4, 20); // 最多20分
    }

    // 检查是否包含大写字母
    if (!/[A-Z]/.test(password)) {
      feedback.push('密码应包含大写字母');
      suggestions.push('添加大写字母');
    } else {
      score += 15;
    }

    // 检查是否包含小写字母
    if (!/[a-z]/.test(password)) {
      feedback.push('密码应包含小写字母');
      suggestions.push('添加小写字母');
    } else {
      score += 15;
    }

    // 检查是否包含数字
    if (!/\d/.test(password)) {
      feedback.push('密码应包含数字');
      suggestions.push('添加数字');
    } else {
      score += 15;
    }

    // 检查是否包含特殊字符
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      feedback.push('密码应包含特殊字符');
      suggestions.push('添加特殊字符');
    } else {
      score += 15;
    }

    // 检查字符多样性
    const uniqueChars = new Set(password.split('')).size;
    if (uniqueChars < password.length * 0.6) {
      feedback.push('密码字符重复过多');
      suggestions.push('使用更多不同的字符');
    } else {
      score += 10;
    }

    // 检查是否是常见密码
    if (COMMON_PASSWORDS.has(password.toLowerCase())) {
      feedback.push('这是一个常见密码，容易被猜测');
      suggestions.push('避免使用常见密码');
      score = Math.max(0, score - 30);
    }

    // 检查是否包含连续字符
    if (/(.)\1{2,}/.test(password)) {
      feedback.push('密码包含重复的连续字符');
      suggestions.push('避免使用重复的连续字符');
      score = Math.max(0, score - 10);
    }

    // 检查是否包含键盘模式
    if (/(qwer|asdf|zxcv|1234|5678|qaz|wsx|edc)/i.test(password)) {
      feedback.push('密码包含常见的键盘模式');
      suggestions.push('避免使用键盘模式');
      score = Math.max(0, score - 10);
    }

    // 确定密码强度等级
    let strength: PasswordStrength;
    if (score >= 90) {
      strength = PasswordStrength.VeryStrong;
    } else if (score >= 75) {
      strength = PasswordStrength.Strong;
    } else if (score >= 50) {
      strength = PasswordStrength.Medium;
    } else if (score >= 25) {
      strength = PasswordStrength.Weak;
    } else {
      strength = PasswordStrength.VeryWeak;
    }

    return {
      strength,
      score,
      feedback,
      suggestions,
    };
  }

  // 检查密码是否泄露（模拟）
  async checkLeaked(password: string): Promise<boolean> {
    // 这里应该调用实际的密码泄露检查 API
    // 目前仅作为示例，返回 false
    return false;
  }

  // 生成密码建议
  generateSuggestions(strength: PasswordStrength): string[] {
    const suggestions: string[] = [];

    switch (strength) {
      case PasswordStrength.VeryWeak:
        suggestions.push(
          '使用至少12个字符的密码',
          '混合使用大小写字母、数字和特殊字符',
          '避免使用个人信息或常见单词',
          '考虑使用密码生成器'
        );
        break;
      case PasswordStrength.Weak:
        suggestions.push(
          '增加密码长度',
          '添加更多特殊字符',
          '避免使用连续的数字或字母',
          '使用不相关的单词组合'
        );
        break;
      case PasswordStrength.Medium:
        suggestions.push(
          '使用更长的密码',
          '增加字符多样性',
          '避免使用常见的密码模式',
          '考虑使用密码短语'
        );
        break;
      case PasswordStrength.Strong:
        suggestions.push(
          '定期更换密码',
          '为不同账户使用不同的密码',
          '考虑使用密码管理器',
          '启用双因素认证'
        );
        break;
      case PasswordStrength.VeryStrong:
        suggestions.push(
          '保持密码安全',
          '定期检查密码泄露情况',
          '使用密码管理器存储密码',
          '启用双因素认证'
        );
        break;
    }

    return suggestions;
  }
}

export const passwordStrengthService = new PasswordStrengthService(); 