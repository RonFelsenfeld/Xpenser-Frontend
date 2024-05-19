import { useContext, useEffect, useRef, useState } from 'react'
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
  const [isStatisticsOpen, setIsStatisticOpen] = useState(window.innerWidth > 1000)

  const debounceResize = useRef(utilService.debounce(handleResize, 100))
  const statisticsRef = useRef()

  const { user } = useContext(UserContext)
  const navigate = useNavigate()

  useEffect(() => {
    // ! Blocking un-authorized entrance
    if (!user) navigate('/')

    window.addEventListener('resize', debounceResize.current)

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
      window.removeEventListener('resize', debounceResize.current)
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

  function handleResize() {
    setIsStatisticOpen(window.innerWidth > 1000)
  }

  function onCloseStatistic() {
    utilService.animateCSS(statisticsRef.current, 'slideOutRight')

    setTimeout(() => {
      setIsStatisticOpen(false)
    }, 600)
  }

  function getOpenClass() {
    if (isStatisticsOpen) return 'open animate__animated animate__slideInRight animate__faster'

    return ''
  }

  if (!expenses) return <Loader />
  return (
    <section className={`expense-index ${isStatisticsOpen ? 'statistics-open' : ''}`}>
      <div className="animate__animated animate__fadeIn animate__faster backdrop"></div>

      <div className="expenses-container">
        <header className="expenses-header">
          <div className="total-container flex align-center justify-between">
            <div className="btn-container flex">
              <Link to="/expense/edit">
                <button
                  className="btn-add-expense flex align-center justify-center"
                  title="Add New Expense"
                ></button>
              </Link>

              <button
                className="btn-statistics flex align-center justify-center"
                title="Show Statistics"
                onClick={() => setIsStatisticOpen(true)}
              >
                Show Statistics
              </button>
            </div>

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

      {isStatisticsOpen && (
        <div ref={statisticsRef} className={`statistics-container  ${getOpenClass()}`}>
          <Statistics expenses={expenses} onCloseStatistic={onCloseStatistic} />
        </div>
      )}

      <Outlet context={[setExpenses]} />
    </section>
  )
}
