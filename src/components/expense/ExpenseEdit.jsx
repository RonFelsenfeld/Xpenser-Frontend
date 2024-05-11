import { useEffect, useState } from 'react'
import { Link, useNavigate, useOutletContext, useParams } from 'react-router-dom'

import { expenseService } from '../../services/expense.local.service'
import { Loader } from '../general/Loader'

export function ExpenseEdit() {
  const [expenseToEdit, setExpenseToEdit] = useState(expenseService.getEmptyExpense())
  const [isLoading, setIsLoading] = useState(true)

  const [setExpenses] = useOutletContext()
  const navigate = useNavigate()
  const { expenseId } = useParams()

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
      navigate('/')
    } catch (err) {
      console.log('Had issues with saving expense:', err)
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
      <Link to="/">
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

            <div className="input-container flex column">
              <label htmlFor="at">
                Expense date <span className="optional">(Optional)</span>
              </label>
              <input
                type="date"
                name="at"
                id="at"
                onChange={handleChange}
                value={expenseToEdit.at}
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
                onChange={handleChange}
                value={expenseToEdit.notes}
                placeholder="Notes"
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
