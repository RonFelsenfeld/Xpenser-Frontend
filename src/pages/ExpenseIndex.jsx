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

  async function onRemoveExpense(expenseId) {
    try {
      await expenseService.remove(expenseId)
      setExpenses(prevExpenses => prevExpenses.filter(e => e._id !== expenseId))
      // todo - show user msg
    } catch (err) {
      console.log('Had issues with removing expenses:', err)
    }
  }

  if (!expenses.length) return <div>Loading...</div>
  return (
    <section className="expense-index">
      <h1 className="index-heading">Expense Index</h1>

      {expenses.length ? (
        <ExpenseList expenses={expenses} onRemoveExpense={onRemoveExpense} />
      ) : (
        <div>Add your first expense</div>
      )}
    </section>
  )
}
