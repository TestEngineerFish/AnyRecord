import SwiftUI

struct AddAccountView: View {
    @Environment(\.dismiss) private var dismiss
    let viewModel: AccountViewModel
    
    @State private var platformName = ""
    @State private var username = ""
    @State private var password = ""
    @State private var notes = ""
    @State private var loginURL = ""
    @State private var tags = ""
    
    var body: some View {
        NavigationStack {
            Form {
                Section("基本信息") {
                    TextField("平台名称", text: $platformName)
                    TextField("用户名/邮箱/手机号", text: $username)
                    SecureField("密码", text: $password)
                }
                
                Section("附加信息") {
                    TextField("备注", text: $notes)
                    TextField("登录网址", text: $loginURL)
                    TextField("标签（用逗号分隔）", text: $tags)
                }
            }
            .navigationTitle("添加账号")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("取消") {
                        dismiss()
                    }
                }
                
                ToolbarItem(placement: .confirmationAction) {
                    Button("保存") {
                        saveAccount()
                    }
                    .disabled(platformName.isEmpty || username.isEmpty || password.isEmpty)
                }
            }
        }
    }
    
    private func saveAccount() {
        let account = Account(
            platformName: platformName,
            username: username,
            password: password,
            notes: notes.isEmpty ? nil : notes,
            tags: tags.split(separator: ",").map { String($0.trimmingCharacters(in: .whitespaces)) },
            loginURL: loginURL.isEmpty ? nil : loginURL
        )
        
        viewModel.addAccount(account)
        dismiss()
    }
} 