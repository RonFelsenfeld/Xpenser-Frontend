import { useEffect, useState } from 'react'
import { expenseService } from '../services/expense.local.service'

import { ExpenseList } from '../components/expense/ExpenseList'

export function ExpenseIndex() {
  const [expenses, setExpenses] = useState([])

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
      console.log('Had issues with removing expense:', err)
    }
  }

  async function onAddExpense() {
    const txt = prompt('Expense txt')
    const amount = +prompt('Expense amount')

    const newExpense = expenseService.getEmptyExpense()
    newExpense.txt = txt
    newExpense.amount = amount
    newExpense.at = Date.now()

    try {
      const savedExpense = await expenseService.save(newExpense)
      setExpenses(prevExpenses => [...prevExpenses, savedExpense])
    } catch (err) {
      console.log('Had issues with saving expense:', err)
    }
  }

  if (!expenses.length) return <div>Loading...</div>
  return (
    <section className="expense-index">
      <h1 className="index-heading">Expense Index</h1>
      <button className="btn-add-expense" onClick={onAddExpense}>
        Add expense
      </button>

      {expenses.length ? (
        <ExpenseList expenses={expenses} onRemoveExpense={onRemoveExpense} />
      ) : (
        <div>Add your first expense</div>
      )}
    </section>
  )
}
