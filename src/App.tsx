import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="text-xl font-bold text-pink-600">
                💒 Wedding Planner
              </Link>
              <div className="flex space-x-6">
                <Link
                  to="/"
                  className="text-gray-600 hover:text-pink-600 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/guests"
                  className="text-gray-600 hover:text-pink-600 transition-colors"
                >
                  Guests
                </Link>
                <Link
                  to="/budget"
                  className="text-gray-600 hover:text-pink-600 transition-colors"
                >
                  Budget
                </Link>
                <Link
                  to="/vendors"
                  className="text-gray-600 hover:text-pink-600 transition-colors"
                >
                  Vendors
                </Link>
                <Link
                  to="/tasks"
                  className="text-gray-600 hover:text-pink-600 transition-colors"
                >
                  Tasks
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route
            path="/guests"
            element={
              <div className="p-8 text-center text-gray-500">
                Guests page coming soon...
              </div>
            }
          />
          <Route
            path="/budget"
            element={
              <div className="p-8 text-center text-gray-500">
                Budget page coming soon...
              </div>
            }
          />
          <Route
            path="/vendors"
            element={
              <div className="p-8 text-center text-gray-500">
                Vendors page coming soon...
              </div>
            }
          />
          <Route
            path="/tasks"
            element={
              <div className="p-8 text-center text-gray-500">
                Tasks page coming soon...
              </div>
            }
          />
        </Routes>

        {/* Footer */}
        <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4">
          <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
            <p>
              Built with ❤️ for your special day |{' '}
              <a
                href="https://vite.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-500 hover:text-pink-600"
              >
                Vite
              </a>{' '}
              +{' '}
              <a
                href="https://react.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-500 hover:text-pink-600"
              >
                React
              </a>
            </p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  )
}

export default App
