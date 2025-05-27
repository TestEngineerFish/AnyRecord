import SwiftUI
import SwiftData

@main
struct AnyRecordApp: App {
    let container: ModelContainer
    
    init() {
        do {
            container = try ModelContainer(
                for: Account.self,
                configurations: ModelConfiguration(isStoredInMemoryOnly: false)
            )
        } catch {
            fatalError("Failed to initialize ModelContainer: \(error)")
        }
    }
    
    var body: some Scene {
        WindowGroup {
            ContentView(modelContext: container.mainContext)
        }
        .modelContainer(container)
    }
} 