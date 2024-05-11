import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import { ExpenseIndex } from './pages/ExpenseIndex'

import { AppHeader } from './components/general/AppHeader'
import { ExpenseEdit } from './components/expense/ExpenseEdit'

export function App() {
  return (
    <Router>
      <section className="app">
        <AppHeader />
        <main>
          <Routes>
            <Route path="/" element={<ExpenseIndex />}>
              <Route path="expense/edit/:expenseId?" element={<ExpenseEdit />} />
            </Route>
          </Routes>
        </main>
      </section>
    </Router>
  )
}
