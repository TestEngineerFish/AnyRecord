import SwiftUI

struct AccountDetailView: View {
    @Environment(\.dismiss) private var dismiss
    let account: Account
    let viewModel: AccountViewModel
    
    @State private var isEditing = false
    @State private var editedPlatformName: String
    @State private var editedUsername: String
    @State private var editedPassword: String
    @State private var editedNotes: String
    @State private var editedLoginURL: String
    @State private var editedTags: String
    
    init(account: Account, viewModel: AccountViewModel) {
        self.account = account
        self.viewModel = viewModel
        
        _editedPlatformName = State(initialValue: account.platformName)
        _editedUsername = State(initialValue: account.username)
        _editedPassword = State(initialValue: account.password)
        _editedNotes = State(initialValue: account.notes ?? "")
        _editedLoginURL = State(initialValue: account.loginURL ?? "")
        _editedTags = State(initialValue: account.tags.joined(separator: ", "))
    }
    
    var body: some View {
        NavigationStack {
            Form {
                Section("基本信息") {
                    if isEditing {
                        TextField("平台名称", text: $editedPlatformName)
                        TextField("用户名", text: $editedUsername)
                        SecureField("密码", text: $editedPassword)
                    } else {
                        LabeledContent("平台名称", value: account.platformName)
                        LabeledContent("用户名", value: account.username)
                        HStack {
                            Text("密码")
                            Spacer()
                            Button(action: {
                                viewModel.copyToClipboard(account.password)
                            }) {
                                Image(systemName: "doc.on.doc")
                            }
                        }
                    }
                }
                
                Section("附加信息") {
                    if isEditing {
                        TextField("备注", text: $editedNotes)
                        TextField("登录网址", text: $editedLoginURL)
                        TextField("标签（用逗号分隔）", text: $editedTags)
                    } else {
                        if let notes = account.notes {
                            LabeledContent("备注", value: notes)
                        }
                        if let url = account.loginURL {
                            LabeledContent("登录网址", value: url)
                        }
                        if !account.tags.isEmpty {
                            Text("标签")
                            ForEach(account.tags, id: \.self) { tag in
                                Text(tag)
                                    .foregroundStyle(.secondary)
                            }
                        }
                    }
                }
                
                if !isEditing {
                    Section {
                        Button(role: .destructive) {
                            viewModel.deleteAccount(account)
                            dismiss()
                        } label: {
                            Label("删除账号", systemImage: "trash")
                        }
                    }
                }
            }
            .navigationTitle(isEditing ? "编辑账号" : "账号详情")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    if isEditing {
                        Button("取消") {
                            isEditing = false
                        }
                    } else {
                        Button("关闭") {
                            dismiss()
                        }
                    }
                }
                
                ToolbarItem(placement: .confirmationAction) {
                    if isEditing {
                        Button("保存") {
                            saveChanges()
                        }
                    } else {
                        Button("编辑") {
                            isEditing = true
                        }
                    }
                }
            }
        }
    }
    
    private func saveChanges() {
        account.platformName = editedPlatformName
        account.username = editedUsername
        account.password = editedPassword
        account.notes = editedNotes.isEmpty ? nil : editedNotes
        account.loginURL = editedLoginURL.isEmpty ? nil : editedLoginURL
        account.tags = editedTags.split(separator: ",").map { String($0.trimmingCharacters(in: .whitespaces)) }
        
        viewModel.updateAccount(account)
        isEditing = false
    }
} 