import { useContext, useEffect, useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'

import { expenseService } from '../services/expense.service'
import { utilService } from '../services/util.service'

import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import {
  SOCKET_EMIT_REMOVE_EXPENSE,
  SOCKET_EMIT_SET_USER,
  SOCKET_EVENT_EXPENSE_ADDED,
  SOCKET_EVENT_EXPENSE_EDITED,
  SOCKET_EVENT_EXPENSE_REMOVED,
  SOCKET_EVENT_EXPENSE_UPDATED,
  socketService,
} from '../services/socket.service'
import { UserContext } from '../contexts/UserContext'

import { ExpenseList } from '../components/expense/ExpenseList'
import { ExpenseFilter } from '../components/expense/ExpenseFilter'
import { Loader } from '../components/general/Loader'
import { Statistics } from '../components/general/Statistics'

export function ExpenseIndex() {
  const [expenses, setExpenses] = useState(null)
  const [filterBy, setFilterBy] = useState(expenseService.getDefaultFilterBy())

  const { user } = useContext(UserContext)
  const navigate = useNavigate()

  useEffect(() => {
    // ! Blocking un-authorized entrance
    if (!user) navigate('/')
    socketService.emit(SOCKET_EMIT_SET_USER, user)

    socketService.on(SOCKET_EVENT_EXPENSE_ADDED, expense => {
      setExpenses(prevExpenses => [...prevExpenses, expense])
    })

    socketService.on(SOCKET_EVENT_EXPENSE_REMOVED, expenseId => {
      setExpenses(prevExpenses => prevExpenses.filter(e => e._id !== expenseId))
    })

    socketService.on(SOCKET_EVENT_EXPENSE_UPDATED, expense => {
      setExpenses(prevExpenses => prevExpenses.map(e => (e._id === expense._id ? expense : e)))
    })

    socketService.on(SOCKET_EVENT_EXPENSE_EDITED, () => {
      showSuccessMsg(`Someone is editing expense...`)
    })

    return () => {
      socketService.off(SOCKET_EVENT_EXPENSE_ADDED)
      socketService.off(SOCKET_EVENT_EXPENSE_REMOVED)
      socketService.off(SOCKET_EVENT_EXPENSE_UPDATED)
      socketService.off(SOCKET_EVENT_EXPENSE_EDITED)
    }
  }, [])

  useEffect(() => {
    loadExpenses(filterBy)
  }, [filterBy])

  async function loadExpenses(filterBy) {
    try {
      const expenses = await expenseService.query(filterBy)
      setExpenses(expenses)
    } catch (err) {
      console.log('Had issues with loading expenses:', err)
      showErrorMsg('Could not load expenses at the moment')
    }
  }

  async function onRemoveExpense(expenseId) {
    try {
      await expenseService.remove(expenseId)
      socketService.emit(SOCKET_EMIT_REMOVE_EXPENSE, expenseId)

      setExpenses(prevExpenses => prevExpenses.filter(e => e._id !== expenseId))
      showSuccessMsg('Expense removed!')
    } catch (err) {
      console.log('Had issues with removing expense:', err)
      showErrorMsg('Could not remove expense at the moment')
    }
  }

  function onSetFilterBy(filterBy) {
    setFilterBy(filterBy)
  }

  function getTotalExpenses() {
    const totalExpenses = expenseService.calcTotalExpenses(expenses)
    return utilService.getFormattedCurrency(totalExpenses)
  }

  if (!expenses) return <Loader />
  return (
    <section className="expense-index">
      <div className="expenses-container">
        <header className="expenses-header">
          <div className="total-container flex align-center justify-between">
            <Link to="/expense/edit">
              <button
                className="btn-add-expense flex align-center justify-center"
                title="Add New Expense"
              ></button>
            </Link>
            <p className="total-expenses flex align-center">
              Total expenses: <span>{getTotalExpenses()}</span>
            </p>
          </div>

          <ExpenseFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy} />
        </header>

        {expenses && expenses.length ? (
          <ExpenseList expenses={expenses} onRemoveExpense={onRemoveExpense} />
        ) : (
          <span className="no-expenses">No expenses to show</span>
        )}
      </div>

      <div className="statistics-container">
        <Statistics expenses={expenses} />
      </div>

      <Outlet context={[setExpenses]} />
    </section>
  )
}
