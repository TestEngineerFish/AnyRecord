import SwiftUI
import SwiftData

struct ContentView: View {
    @Environment(\.modelContext) private var modelContext
    @State private var viewModel: AccountViewModel
    @State private var showingAddAccount = false
    @State private var isAuthenticated = false
    
    init(modelContext: ModelContext) {
        _viewModel = State(initialValue: AccountViewModel(modelContext: modelContext))
    }
    
    var body: some View {
        NavigationStack {
            Group {
                if isAuthenticated {
                    accountList
                } else {
                    authenticationView
                }
            }
            .navigationTitle("密码管理")
            .toolbar {
                ToolbarItem(placement: .primaryAction) {
                    Button(action: { showingAddAccount = true }) {
                        Label("添加账号", systemImage: "plus")
                    }
                }
            }
            .sheet(isPresented: $showingAddAccount) {
                AddAccountView(viewModel: viewModel)
            }
        }
    }
    
    private var accountList: some View {
        List {
            ForEach(viewModel.filteredAccounts) { account in
                AccountRow(account: account, viewModel: viewModel)
            }
            .onDelete { indexSet in
                for index in indexSet {
                    viewModel.deleteAccount(viewModel.filteredAccounts[index])
                }
            }
        }
        .searchable(text: $viewModel.searchText, prompt: "搜索平台或用户名")
    }
    
    private var authenticationView: some View {
        VStack {
            Image(systemName: "lock.shield")
                .font(.system(size: 60))
                .foregroundStyle(.blue)
            
            Text("请验证身份")
                .font(.title)
                .padding()
            
            Button("使用 Face ID / Touch ID") {
                Task {
                    do {
                        isAuthenticated = try await viewModel.authenticateWithBiometrics()
                    } catch {
                        print("Authentication failed: \(error)")
                    }
                }
            }
            .buttonStyle(.borderedProminent)
        }
    }
}

struct AccountRow: View {
    let account: Account
    let viewModel: AccountViewModel
    @State private var showingDetails = false
    
    var body: some View {
        VStack(alignment: .leading) {
            HStack {
                Text(account.platformName)
                    .font(.headline)
                Spacer()
                if let url = account.loginURL {
                    Button(action: {
                        if let url = URL(string: url) {
                            UIApplication.shared.open(url)
                        }
                    }) {
                        Image(systemName: "arrow.up.right.square")
                    }
                }
            }
            
            Text(account.username)
                .font(.subheadline)
                .foregroundStyle(.secondary)
            
            if !account.tags.isEmpty {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack {
                        ForEach(account.tags, id: \.self) { tag in
                            Text(tag)
                                .font(.caption)
                                .padding(.horizontal, 8)
                                .padding(.vertical, 4)
                                .background(.blue.opacity(0.1))
                                .clipShape(Capsule())
                        }
                    }
                }
            }
        }
        .contentShape(Rectangle())
        .onTapGesture {
            showingDetails = true
        }
        .sheet(isPresented: $showingDetails) {
            AccountDetailView(account: account, viewModel: viewModel)
        }
    }
} 