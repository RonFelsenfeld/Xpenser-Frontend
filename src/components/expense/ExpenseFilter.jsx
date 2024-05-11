import { expenseService } from '../../services/expense.local.service'

export function ExpenseFilter({ filterBy, setFilterBy }) {
  function handleChange({ target }) {
    let { value, name: field } = target

    setFilterBy(prevFilterBy => ({
      ...prevFilterBy,
      [field]: value,
    }))
  }

  const categories = expenseService.getExpenseCategories()
  return (
    <section className="expense-filter">
      <fieldset className="filter-fieldset flex">
        <legend>Filter your expenses</legend>

        <div className="filter-container flex">
          <div className="input-container flex column">
            <label htmlFor="at">By a specific date</label>
            <input type="date" name="at" id="at" value={filterBy.at} onChange={handleChange} />
          </div>

          <div className="input-container flex column">
            <label htmlFor="category">By category</label>
            <select name="category" id="category" onChange={handleChange}>
              <option value="">All</option>

              {categories.map((category, idx) => (
                <option key={category + idx} value={category.toLowerCase()}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </fieldset>
    </section>
  )
}
