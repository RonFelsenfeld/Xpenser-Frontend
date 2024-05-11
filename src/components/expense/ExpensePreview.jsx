import { Link } from 'react-router-dom'
import { utilService } from '../../services/util.service'

export function ExpensePreview({ expense, onRemoveExpense }) {
  function formatAmountToCurrency(amount) {
    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ILS',
    }).format(amount)

    return formattedAmount
  }

  function formatExpenseDate(date) {
    const expenseDate = new Date(date)
    const formattedDate = expenseDate.toLocaleDateString('en-GB')
    const formattedDay = expenseDate.toLocaleDateString('en-GB', { weekday: 'long' })

    return `${formattedDate}, ${formattedDay}`
  }

  const { txt, amount, category, at, notes } = expense
  return (
    <article className="expense-preview flex align-center justify-between">
      <p className="bold-detail expense-txt">{txt}</p>
      <p className="bold-detail expense-amount">{formatAmountToCurrency(amount)}</p>

      {category ? (
        <p
          className="expense-category flex align-center justify-center"
          style={{ backgroundColor: `var(--category-${category}-clr)` }}
        >
          {utilService.capitalize(category)}
        </p>
      ) : (
        <Link to={`/expense/edit/${expense._id}`} className="btn-no no-category">
          <button>+ Add category</button>
        </Link>
      )}

      {at ? (
        <p className="expense-at">{formatExpenseDate(at)}</p>
      ) : (
        <Link to={`/expense/edit/${expense._id}`} className="btn-no no-date">
          <button>+ Add date</button>
        </Link>
      )}

      {notes ? (
        <p className="expense-notes">{notes}</p>
      ) : (
        <Link to={`/expense/edit/${expense._id}`} className="btn-no no-notes">
          <button>+ Add notes</button>
        </Link>
      )}

      <div className="actions-container flex align-center">
        <Link to={`/expense/edit/${expense._id}`}>
          <button
            title="Edit Expense"
            className="btn btn-edit flex align-center justify-center"
          ></button>
        </Link>

        <button
          title="Remove Expense"
          className="btn btn-delete flex align-center justify-center"
          onClick={() => onRemoveExpense(expense._id)}
        ></button>
      </div>
    </article>
  )
}
