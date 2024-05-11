import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import { ExpenseIndex } from './pages/ExpenseIndex'

import { AppHeader } from './components/general/AppHeader'

export function App() {
  return (
    <Router>
      <section className="app">
        <AppHeader />
        <main>
          <Routes>
            <Route path="/" element={<ExpenseIndex />} />
          </Routes>
        </main>
      </section>
    </Router>
  )
}
