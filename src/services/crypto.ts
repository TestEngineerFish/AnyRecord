import { openDB, type IDBPDatabase } from 'idb';

// 加密配置
const ENCRYPTION_CONFIG = {
  name: 'AES-GCM',
  length: 256,
  iterations: 100000,
};

// 加密密钥存储
const KEY_STORE = 'encryption-keys';

// 生成加密密钥
async function generateKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: ENCRYPTION_CONFIG.iterations,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: ENCRYPTION_CONFIG.name, length: ENCRYPTION_CONFIG.length },
    false,
    ['encrypt', 'decrypt']
  );
}

// 生成随机盐值
function generateSalt(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(16));
}

// 加密数据
async function encryptData(data: string, key: CryptoKey): Promise<{ encryptedData: string; iv: string }> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encodedData = new TextEncoder().encode(data);

  const encryptedData = await crypto.subtle.encrypt(
    {
      name: ENCRYPTION_CONFIG.name,
      iv,
    },
    key,
    encodedData
  );

  return {
    encryptedData: btoa(String.fromCharCode(...new Uint8Array(encryptedData))),
    iv: btoa(String.fromCharCode(...iv)),
  };
}

// 解密数据
async function decryptData(encryptedData: string, iv: string, key: CryptoKey): Promise<string> {
  const encryptedArray = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
  const ivArray = Uint8Array.from(atob(iv), c => c.charCodeAt(0));

  const decryptedData = await crypto.subtle.decrypt(
    {
      name: ENCRYPTION_CONFIG.name,
      iv: ivArray,
    },
    key,
    encryptedArray
  );

  return new TextDecoder().decode(decryptedData);
}

// 加密服务类
class CryptoService {
  private db: Promise<IDBPDatabase>;
  private masterKey: CryptoKey | null = null;

  constructor() {
    this.db = openDB(KEY_STORE, 1, {
      upgrade(db) {
        db.createObjectStore('keys');
      },
    });
  }

  // 初始化加密服务
  async initialize(password: string): Promise<void> {
    const salt = generateSalt();
    const key = await generateKey(password, salt);

    const db = await this.db;
    const tx = db.transaction('keys', 'readwrite');
    await tx.store.put(salt, 'salt');
    await tx.done;
    this.masterKey = key;
  }

  // 验证主密码
  async verifyPassword(password: string): Promise<boolean> {
    try {
      const db = await this.db;
      const tx = db.transaction('keys', 'readonly');
      const salt = await tx.store.get('salt');
      if (!salt) return false;

      const key = await generateKey(password, salt);
      this.masterKey = key;
      return true;
    } catch (error) {
      console.error('验证密码失败:', error);
      return false;
    }
  }

  // 加密数据
  async encrypt(data: string): Promise<{ encryptedData: string; iv: string }> {
    if (!this.masterKey) {
      throw new Error('加密服务未初始化');
    }
    return encryptData(data, this.masterKey);
  }

  // 解密数据
  async decrypt(encryptedData: string, iv: string): Promise<string> {
    if (!this.masterKey) {
      throw new Error('加密服务未初始化');
    }
    return decryptData(encryptedData, iv, this.masterKey);
  }

  // 清除主密钥
  clearMasterKey(): void {
    this.masterKey = null;
  }

  // 检查是否有主密钥
  hasMasterKey(): boolean {
    return this.masterKey !== null;
  }
}

export const cryptoService = new CryptoService(); 