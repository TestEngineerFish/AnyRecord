import { cryptoService } from './crypto';

interface AutoLockSettings {
  enabled: boolean;
  timeout: number; // 单位：分钟
}

const DEFAULT_SETTINGS: AutoLockSettings = {
  enabled: true,
  timeout: 30,
};

class AutoLockService {
  private timer: number | null = null;
  private lastActivity: number = Date.now();
  private settings: AutoLockSettings = DEFAULT_SETTINGS;

  constructor() {
    // 从 localStorage 加载设置
    const savedSettings = localStorage.getItem('autoLockSettings');
    if (savedSettings) {
      this.settings = JSON.parse(savedSettings);
    }

    // 添加用户活动监听器
    this.addActivityListeners();
  }

  // 更新设置
  updateSettings(settings: Partial<AutoLockSettings>): void {
    this.settings = { ...this.settings, ...settings };
    localStorage.setItem('autoLockSettings', JSON.stringify(this.settings));
    this.resetTimer();
  }

  // 获取当前设置
  getSettings(): AutoLockSettings {
    return { ...this.settings };
  }

  // 添加用户活动监听器
  private addActivityListeners(): void {
    const events = ['mousedown', 'keydown', 'touchstart', 'mousemove'];
    events.forEach(event => {
      window.addEventListener(event, () => this.updateLastActivity());
    });
  }

  // 更新最后活动时间
  private updateLastActivity(): void {
    this.lastActivity = Date.now();
    this.resetTimer();
  }

  // 重置计时器
  private resetTimer(): void {
    if (this.timer) {
      window.clearTimeout(this.timer);
    }

    if (this.settings.enabled && this.settings.timeout > 0) {
      this.timer = window.setTimeout(() => {
        this.checkAndLock();
      }, this.settings.timeout * 60 * 1000);
    }
  }

  // 检查并锁定
  private checkAndLock(): void {
    const inactiveTime = (Date.now() - this.lastActivity) / 1000 / 60; // 转换为分钟
    if (inactiveTime >= this.settings.timeout) {
      this.lock();
    } else {
      // 如果未达到锁定时间，重新设置计时器
      this.resetTimer();
    }
  }

  // 锁定应用
  private lock(): void {
    cryptoService.clearMasterKey();
    window.location.href = '/master-password';
  }

  // 手动锁定
  lockNow(): void {
    this.lock();
  }

  // 检查是否已锁定
  isLocked(): boolean {
    return !cryptoService.hasMasterKey();
  }
}

export const autoLockService = new AutoLockService(); 