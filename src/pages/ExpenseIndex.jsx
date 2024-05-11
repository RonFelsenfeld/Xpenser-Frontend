import { useEffect, useState } from 'react'
import { expenseService } from '../services/expense.local.service'

import { ExpenseList } from '../components/expense/ExpenseList'

export function ExpenseIndex() {
  const [expenses, setExpenses] = useState([])
  console.log(expenses)

  useEffect(() => {
    loadExpenses()
  }, [])

  async function loadExpenses() {
    try {
      const expenses = await expenseService.query()
      setExpenses(expenses)
    } catch (err) {
      console.log('Had issues with loading expenses:', err)
    }
  }

  if (!expenses.length) return <div>Loading...</div>
  return (
    <section className="expense-index">
      <h1>Expense Index</h1>

      {expenses.length ? <ExpenseList expenses={expenses} /> : <div>Add your first expense</div>}
    </section>
  )
}
