import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useOutletContext, useParams } from 'react-router-dom'

import { expenseService } from '../../services/expense.local.service'

export function ExpenseEdit() {
  const [expenseToEdit, setExpenseToEdit] = useState(expenseService.getEmptyExpense())
  const txtInputRef = useRef()

  const [setExpenses] = useOutletContext()
  const navigate = useNavigate()
  const { expenseId } = useParams()

  useEffect(() => {
    if (expenseId) loadExpense()
    txtInputRef.current.focus()
  }, [])

  async function loadExpense() {
    try {
      const expense = await expenseService.getById(expenseId)
      setExpenseToEdit(expense)
    } catch (err) {
      console.log('Had issues with loading expense to edit:', err)
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
      navigate('/')
    } catch (err) {
      console.log('Had issues with saving expense:', err)
    }
  }

  function validateForm() {
    return !expenseToEdit.txt || !expenseToEdit.amount
  }

  // todo - add category and date
  return (
    <section className="expense-edit">
      <Link to="/">
        <button className="btn-back"></button>
      </Link>

      <div className="main-content flex column align-center">
        <h1 className="edit-heading">{expenseId ? 'Edit' : 'Add'} Expense</h1>

        <form>
          <div className="input-container flex column">
            <label htmlFor="txt">Expense title</label>
            <input
              ref={txtInputRef}
              type="text"
              name="txt"
              id="txt"
              onChange={handleChange}
              value={expenseToEdit.txt}
              placeholder="title"
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

          <button className="btn-submit" onClick={onSaveExpense} disabled={validateForm()}>
            Save
          </button>
        </form>
      </div>
    </section>
  )
}
