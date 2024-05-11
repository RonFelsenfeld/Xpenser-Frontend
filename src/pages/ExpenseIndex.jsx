import { useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'

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

  // async function onAddExpense() {
  //   const txt = prompt('Expense txt')
  //   const amount = +prompt('Expense amount')

  //   const newExpense = expenseService.getEmptyExpense()
  //   newExpense.txt = txt
  //   newExpense.amount = amount
  //   newExpense.at = Date.now()

  //   try {
  //     const savedExpense = await expenseService.save(newExpense)
  //     setExpenses(prevExpenses => [...prevExpenses, savedExpense])
  //   } catch (err) {
  //     console.log('Had issues with saving expense:', err)
  //   }
  // }

  // todo - loader
  if (!expenses.length) return <div className="loading-msg">Loading...</div>
  return (
    <section className="expense-index">
      <Link to="/expense/edit">
        <button className="btn-add-expense">Add expense</button>
      </Link>

      {expenses.length ? (
        <ExpenseList expenses={expenses} onRemoveExpense={onRemoveExpense} />
      ) : (
        <div>Add your first expense</div>
      )}

      <Outlet context={[setExpenses]} />
    </section>
  )
}
