import { Link } from 'react-router-dom'

export function ExpensePreview({ expense, onRemoveExpense }) {
  function getCapitalizedCategory(category) {
    return category.charAt(0).toUpperCase() + category.slice(1)
  }

  function formatAmountToCurrency(amount) {
    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ILS',
    }).format(amount)

    return formattedAmount
  }

  const { txt, amount, category, at } = expense
  return (
    <article className="expense-preview flex align-center justify-between">
      <p className="bold-detail expense-txt">{txt}</p>
      <p className="bold-detail expense-amount">{formatAmountToCurrency(amount)}</p>

      {category ? (
        <p
          className="expense-category"
          style={{ backgroundColor: `var(--category-${category}-clr)` }}
        >
          {getCapitalizedCategory(category)}
        </p>
      ) : (
        <Link to={`/expense/edit/${expense._id}`} className="btn-no no-category">
          <button>- Add category</button>
        </Link>
      )}

      {at ? (
        <p className="expense-at">{at}</p>
      ) : (
        <Link to={`/expense/edit/${expense._id}`} className="btn-no no-date">
          <button>- Add date</button>
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
