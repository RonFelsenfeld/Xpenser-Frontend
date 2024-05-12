import { useEffect, useState } from 'react'
import { Link, useNavigate, useOutletContext, useParams } from 'react-router-dom'

import { expenseService } from '../../services/expense.service'
import { showErrorMsg, showSuccessMsg } from '../../services/event-bus.service'
import {
  SOCKET_EMIT_ADD_EXPENSE,
  SOCKET_EMIT_EDITING_EXPENSE,
  SOCKET_EMIT_UPDATE_EXPENSE,
  socketService,
} from '../../services/socket.service'

import { Loader } from '../general/Loader'
import { DatePicker } from '../general/DatePicker'

export function ExpenseEdit() {
  const [expenseToEdit, setExpenseToEdit] = useState(expenseService.getEmptyExpense())
  const [isLoading, setIsLoading] = useState(true)

  const [setExpenses] = useOutletContext()
  const navigate = useNavigate()
  const { expenseId } = useParams()

  useEffect(() => {
    socketService.emit(SOCKET_EMIT_EDITING_EXPENSE, expenseId)
  }, [])

  useEffect(() => {
    if (expenseId) loadExpense()
    else {
      setExpenseToEdit(expenseService.getEmptyExpense())
      setIsLoading(false)
    }
  }, [expenseId])

  async function loadExpense() {
    setIsLoading(true)
    try {
      const expense = await expenseService.getById(expenseId)
      setExpenseToEdit(expense)
    } catch (err) {
      console.log('Had issues with loading expense to edit:', err)
    } finally {
      setIsLoading(false)
    }
  }

  function handleChange({ target }) {
    let { value, name: field, type } = target

    if (type === 'number') value = +value || 0

    setExpenseToEdit(prevExpenseToEdit => ({
      ...prevExpenseToEdit,
      [field]: value,
    }))
  }

  function handleDatePick(newDate) {
    // ! On first render --> new Date is null (when expense has no date it's undefined)
    if (newDate === null) return

    const updatedDate = newDate ? new Date(newDate).getTime() : ''

    setExpenseToEdit(prevExpenseToEdit => ({
      ...prevExpenseToEdit,
      at: updatedDate,
    }))
  }

  function onSelectCategory(category) {
    category = category.toLowerCase()
    if (category !== expenseToEdit.category) {
      setExpenseToEdit(prevExpenseToEdit => ({ ...prevExpenseToEdit, category }))
    } else {
      setExpenseToEdit(prevExpenseToEdit => ({ ...prevExpenseToEdit, category: '' }))
    }
  }

  async function onSaveExpense(ev) {
    ev.preventDefault()

    try {
      const savedExpense = await expenseService.save(expenseToEdit)
      setExpenses(prevExpenses => {
        // If editing existing expense -->
        if (expenseId) return prevExpenses.map(e => (e._id === savedExpense._id ? savedExpense : e))

        // If adding new expense
        return [...prevExpenses, savedExpense]
      })

      const socketType = expenseId ? SOCKET_EMIT_UPDATE_EXPENSE : SOCKET_EMIT_ADD_EXPENSE

      socketService.emit(socketType, savedExpense)
      showSuccessMsg('Expense saved!')
      navigate('/expense')
    } catch (err) {
      console.log('Had issues with saving expense:', err)
      showErrorMsg('Could not save expense at the moment')
    }
  }

  function isFormValid() {
    return expenseToEdit.txt && expenseToEdit.amount && expenseToEdit.amount > 0
  }

  function getActiveCategoryClass(category) {
    if (expenseToEdit.category === category.toLowerCase()) return 'active'
    return ''
  }

  const categories = expenseService.getExpenseCategories()

  return (
    <section className="expense-edit">
      <Link to="/expense">
        <button className="btn-back"></button>
      </Link>

      {isLoading && <Loader />}

      {!isLoading && (
        <div className="main-content flex column align-center">
          <h1 className="edit-heading">{expenseId ? 'Edit' : 'Add'} Expense</h1>

          <form>
            <div className="input-container flex column">
              <label htmlFor="txt">Expense title</label>
              <input
                type="text"
                name="txt"
                id="txt"
                onChange={handleChange}
                value={expenseToEdit.txt}
                placeholder="title"
                autoComplete="off"
                maxLength={50}
                autoFocus
              />
            </div>

            <div className="input-container flex column">
              <label htmlFor="amount">Expense amount</label>
              <input
                type="number"
                name="amount"
                id="amount"
                min={0.01}
                onChange={handleChange}
                value={expenseToEdit.amount || ''}
                placeholder="amount"
              />
            </div>

            <p className="date-title">
              Select date <span className="optional">(Optional)</span>
            </p>

            <div className="date-picker-container flex justify-center">
              <DatePicker
                selected={new Date(expenseToEdit.at) || ''}
                setSelected={handleDatePick}
              />
            </div>

            <div className="input-container flex column">
              <label htmlFor="notes">
                Expense notes <span className="optional">(Optional)</span>
              </label>

              <input
                type="txt"
                name="notes"
                id="notes"
                maxLength={30}
                onChange={handleChange}
                value={expenseToEdit.notes}
                placeholder="Notes"
                autoComplete="off"
              />
            </div>

            <p className="category-title">
              Select category <span className="optional">(Optional)</span>
            </p>
            <div className="categories-container flex">
              {categories.map((category, idx) => (
                <button
                  key={categories + idx}
                  title="Select category"
                  type="button"
                  className={`btn-category ${category.toLowerCase()} ${getActiveCategoryClass(
                    category
                  )}`}
                  onClick={() => onSelectCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <button className="btn-submit" onClick={onSaveExpense} disabled={!isFormValid()}>
              Save
            </button>
          </form>
        </div>
      )}
    </section>
  )
}
