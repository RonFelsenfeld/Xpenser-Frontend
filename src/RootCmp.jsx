import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import { ExpenseIndex } from './pages/ExpenseIndex'

import { AppHeader } from './components/general/AppHeader'
import { ExpenseEdit } from './components/expense/ExpenseEdit'
import { UserMsg } from './components/general/UserMsg'
import { LoginSignup } from './components/general/LoginSignup'

export function App() {
  return (
    <Router>
      <section className="app">
        <AppHeader />
        <main>
          <Routes>
            <Route path="/" element={<LoginSignup />} />
            <Route path="/expense" element={<ExpenseIndex />}>
              <Route path="/expense/edit/:expenseId?" element={<ExpenseEdit />} />
            </Route>
          </Routes>
        </main>
      </section>

      <UserMsg />
    </Router>
  )
}
