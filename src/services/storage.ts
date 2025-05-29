import { openDB, type IDBPDatabase, type DBSchema } from 'idb';
import { cryptoService } from './crypto';

interface Account {
  id: string;
  platform: string;
  username: string;
  password: string;
  url?: string;
  tags: string[];
  notes?: string;
  createdAt: number;
  updatedAt: number;
  encryptedData?: string;
  iv?: string;
}

interface AnyRecordDB extends DBSchema {
  accounts: {
    key: string;
    value: Account;
    indexes: {
      'by-platform': string;
      'by-tags': string;
    };
  };
}

class StorageService {
  private db: Promise<IDBPDatabase<AnyRecordDB>>;

  constructor() {
    this.db = openDB<AnyRecordDB>('anyrecord', 1, {
      upgrade(db) {
        const store = db.createObjectStore('accounts', { keyPath: 'id' });
        store.createIndex('by-platform', 'platform');
        store.createIndex('by-tags', 'tags', { multiEntry: true });
      },
    });
  }

  // 添加账号
  async addAccount(account: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>): Promise<Account> {
    const db = await this.db;
    const id = crypto.randomUUID();
    const now = Date.now();

    // 加密敏感数据
    const { encryptedData, iv } = await cryptoService.encrypt(account.password);

    const newAccount: Account = {
      ...account,
      id,
      createdAt: now,
      updatedAt: now,
      encryptedData,
      iv,
      password: '********', // 存储加密后的占位符
    };

    await db.add('accounts', newAccount);
    return newAccount;
  }

  // 更新账号
  async updateAccount(id: string, account: Partial<Omit<Account, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Account> {
    const db = await this.db;
    const tx = db.transaction('accounts', 'readwrite');
    const store = tx.objectStore('accounts');
    
    const existingAccount = await store.get(id);
    if (!existingAccount) {
      throw new Error('账号不存在');
    }

    // 如果密码被更新，需要重新加密
    let encryptedData = existingAccount.encryptedData;
    let iv = existingAccount.iv;
    if (account.password && account.password !== '********') {
      const encrypted = await cryptoService.encrypt(account.password);
      encryptedData = encrypted.encryptedData;
      iv = encrypted.iv;
      account.password = '********';
    }

    const updatedAccount: Account = {
      ...existingAccount,
      ...account,
      updatedAt: Date.now(),
      encryptedData,
      iv,
    };

    await store.put(updatedAccount);
    await tx.done;
    return updatedAccount;
  }

  // 删除账号
  async deleteAccount(id: string): Promise<void> {
    const db = await this.db;
    await db.delete('accounts', id);
  }

  // 获取所有账号
  async getAllAccounts(): Promise<Account[]> {
    const db = await this.db;
    return db.getAll('accounts');
  }

  // 获取单个账号
  async getAccount(id: string): Promise<Account | undefined> {
    const db = await this.db;
    return db.get('accounts', id);
  }

  // 搜索账号
  async searchAccounts(query: string): Promise<Account[]> {
    const db = await this.db;
    const accounts = await db.getAll('accounts');
    
    const searchTerm = query.toLowerCase();
    return accounts.filter(account => 
      account.platform.toLowerCase().includes(searchTerm) ||
      account.username.toLowerCase().includes(searchTerm) ||
      account.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  // 导出数据
  async exportData(): Promise<string> {
    const accounts = await this.getAllAccounts();
    return JSON.stringify(accounts, null, 2);
  }

  // 导入数据
  async importData(data: string): Promise<void> {
    const accounts: Account[] = JSON.parse(data);
    const db = await this.db;
    const tx = db.transaction('accounts', 'readwrite');
    const store = tx.objectStore('accounts');

    // 清空现有数据
    await store.clear();

    // 导入新数据
    for (const account of accounts) {
      await store.add(account);
    }

    await tx.done;
  }

  // 获取账号密码
  async getAccountPassword(id: string): Promise<string> {
    const account = await this.getAccount(id);
    if (!account || !account.encryptedData || !account.iv) {
      throw new Error('账号不存在或密码未加密');
    }

    return cryptoService.decrypt(account.encryptedData, account.iv);
  }
}

export const storageService = new StorageService();
export type { Account }; 