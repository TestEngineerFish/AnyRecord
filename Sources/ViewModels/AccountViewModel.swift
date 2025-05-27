import Foundation
import SwiftData
import LocalAuthentication

@Observable
class AccountViewModel {
    private let modelContext: ModelContext
    private let securityService = SecurityService.shared
    
    var accounts: [Account] = []
    var searchText: String = ""
    var selectedTags: Set<String> = []
    
    init(modelContext: ModelContext) {
        self.modelContext = modelContext
        loadAccounts()
    }
    
    func loadAccounts() {
        let descriptor = FetchDescriptor<Account>(
            sortBy: [SortDescriptor(\.platformName)]
        )
        
        do {
            accounts = try modelContext.fetch(descriptor)
        } catch {
            print("Error loading accounts: \(error)")
        }
    }
    
    func addAccount(_ account: Account) {
        modelContext.insert(account)
        save()
    }
    
    func deleteAccount(_ account: Account) {
        modelContext.delete(account)
        save()
    }
    
    func updateAccount(_ account: Account) {
        account.updatedAt = Date()
        save()
    }
    
    private func save() {
        do {
            try modelContext.save()
            loadAccounts()
        } catch {
            print("Error saving context: \(error)")
        }
    }
    
    func copyToClipboard(_ text: String) {
        UIPasteboard.general.string = text
        // 60秒后清除剪贴板
        DispatchQueue.main.asyncAfter(deadline: .now() + 60) {
            if UIPasteboard.general.string == text {
                UIPasteboard.general.string = ""
            }
        }
    }
    
    func authenticateWithBiometrics() async throws -> Bool {
        let context = LAContext()
        var error: NSError?
        
        guard context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) else {
            throw error ?? SecurityError.authenticationFailed
        }
        
        return try await context.evaluatePolicy(
            .deviceOwnerAuthenticationWithBiometrics,
            localizedReason: "请验证身份以访问密码"
        )
    }
    
    var filteredAccounts: [Account] {
        accounts.filter { account in
            let matchesSearch = searchText.isEmpty ||
                account.platformName.localizedCaseInsensitiveContains(searchText) ||
                account.username.localizedCaseInsensitiveContains(searchText)
            
            let matchesTags = selectedTags.isEmpty ||
                !Set(account.tags).isDisjoint(with: selectedTags)
            
            return matchesSearch && matchesTags
        }
    }
}

enum SecurityError: Error {
    case authenticationFailed
} 