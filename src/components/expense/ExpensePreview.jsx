export function ExpensePreview({ expense }) {
  return (
    <article className="expense-preview">
      <p>
        {expense.txt} - <span>{expense.amount}</span>
      </p>
    </article>
  )
}
