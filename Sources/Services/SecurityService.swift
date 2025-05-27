import Foundation
import CryptoKit
import Security

class SecurityService {
    static let shared = SecurityService()
    private let keychainService = "com.anyrecord.app"
    
    private init() {}
    
    // 使用 Keychain 存储敏感数据
    func saveToKeychain(key: String, data: Data) throws {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: keychainService,
            kSecAttrAccount as String: key,
            kSecValueData as String: data
        ]
        
        SecItemDelete(query as CFDictionary)
        
        let status = SecItemAdd(query as CFDictionary, nil)
        guard status == errSecSuccess else {
            throw SecurityError.saveFailed
        }
    }
    
    // 从 Keychain 读取数据
    func loadFromKeychain(key: String) throws -> Data {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: keychainService,
            kSecAttrAccount as String: key,
            kSecReturnData as String: true
        ]
        
        var result: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &result)
        
        guard status == errSecSuccess,
              let data = result as? Data else {
            throw SecurityError.loadFailed
        }
        
        return data
    }
    
    // 加密数据
    func encrypt(_ data: Data, using key: SymmetricKey) throws -> Data {
        let sealedBox = try AES.GCM.seal(data, using: key)
        return sealedBox.combined ?? Data()
    }
    
    // 解密数据
    func decrypt(_ data: Data, using key: SymmetricKey) throws -> Data {
        let sealedBox = try AES.GCM.SealedBox(combined: data)
        return try AES.GCM.open(sealedBox, using: key)
    }
}

enum SecurityError: Error {
    case saveFailed
    case loadFailed
    case encryptionFailed
    case decryptionFailed
} 