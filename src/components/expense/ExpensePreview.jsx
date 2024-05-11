export function ExpensePreview({ expense, onRemoveExpense }) {
  return (
    <article className="expense-preview">
      <p className="expense-txt">
        {expense.txt} - <span className="expense-amount">{expense.amount}</span>
      </p>

      <div className="actions-container flex align-center">
        <button className="btn btn-edit flex align-center justify-center"></button>

        <button
          className="btn btn-delete flex align-center justify-center"
          onClick={() => onRemoveExpense(expense._id)}
        ></button>
      </div>
    </article>
  )
}
