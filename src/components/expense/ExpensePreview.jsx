export function ExpensePreview({ expense, onRemoveExpense }) {
  return (
    <article className="expense-preview flex align-center  justify-between">
      <p className="expense-txt">
        {expense.txt} - <span className="expense-amount">{expense.amount}</span>
      </p>

      <div className="actions-container flex align-center">
        <button
          title="Edit Expense"
          className="btn btn-edit flex align-center justify-center"
        ></button>

        <button
          title="Remove Expense"
          className="btn btn-delete flex align-center justify-center"
          onClick={() => onRemoveExpense(expense._id)}
        ></button>
      </div>
    </article>
  )
}
