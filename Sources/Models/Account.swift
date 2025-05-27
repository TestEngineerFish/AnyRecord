import Foundation
import SwiftData

@Model
final class Account {
    var platformName: String
    var username: String
    var password: String
    var notes: String?
    var tags: [String]
    var loginURL: String?
    var createdAt: Date
    var updatedAt: Date
    
    init(
        platformName: String,
        username: String,
        password: String,
        notes: String? = nil,
        tags: [String] = [],
        loginURL: String? = nil
    ) {
        self.platformName = platformName
        self.username = username
        self.password = password
        self.notes = notes
        self.tags = tags
        self.loginURL = loginURL
        self.createdAt = Date()
        self.updatedAt = Date()
    }
} 