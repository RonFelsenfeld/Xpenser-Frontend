import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import { ExpenseIndex } from './pages/ExpenseIndex'

export function App() {
  return (
    <Router>
      <section className="app">
        <main>
          <Routes>
            <Route path="/" element={<ExpenseIndex />} />
          </Routes>
        </main>
      </section>
    </Router>
  )
}
