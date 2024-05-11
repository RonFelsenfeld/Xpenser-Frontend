import { useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'

import { expenseService } from '../services/expense.local.service'

import { ExpenseList } from '../components/expense/ExpenseList'
import { ExpenseFilter } from '../components/expense/ExpenseFilter'
import { PieChart } from '../components/general/PieChart'

export function ExpenseIndex() {
  const [expenses, setExpenses] = useState([])
  const [filterBy, setFilterBy] = useState(expenseService.getDefaultFilterBy())

  useEffect(() => {
    loadExpenses(filterBy)
  }, [filterBy])

  async function loadExpenses(filterBy) {
    try {
      const expenses = await expenseService.query(filterBy)
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

  // todo - loader
  if (!expenses.length) return <div className="loading-msg">Loading...</div>
  return (
    <section className="expense-index">
      <div>
        <Link to="/expense/edit">
          <button className="btn-add-expense flex align-center justify-center"></button>
        </Link>

        <ExpenseFilter filterBy={filterBy} setFilterBy={setFilterBy} />

        {expenses.length ? (
          <ExpenseList expenses={expenses} onRemoveExpense={onRemoveExpense} />
        ) : (
          <div>Add your first expense</div>
        )}
      </div>

      <div className="chart-container">
        <PieChart expenses={expenses} />
      </div>

      <Outlet context={[setExpenses]} />
    </section>
  )
}
