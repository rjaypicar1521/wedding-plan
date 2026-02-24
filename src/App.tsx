import { WeddingProvider } from './stores/WeddingContext'
import { Dashboard } from './components/Dashboard'
import { GuestList } from './components/GuestList'
import './App.css'

function App() {
  return (
    <WeddingProvider>
      <div className="app">
        <header className="app-header">
          <h1>💒 Wedding Planner</h1>
        </header>
        <main className="app-main">
          <Dashboard />
          <GuestList />
        </main>
        <footer className="app-footer">
          <p>
            Built with ❤️ for your special day
          </p>
        </footer>
      </div>
    </WeddingProvider>
  )
}

export default App
