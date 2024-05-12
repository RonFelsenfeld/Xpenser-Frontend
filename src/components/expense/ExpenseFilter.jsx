import { useRef, useState } from 'react'
import { DatePicker } from '../general/DatePicker'

import { expenseService } from '../../services/expense.service'
import { useClickOutside } from '../../customHooks/useClickOutside'

export function ExpenseFilter({ filterBy, setFilterBy }) {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const datePickerRef = useRef()

  useClickOutside(datePickerRef, () => setIsDatePickerOpen(false))

  function handleChange({ target }) {
    let { value, name: field } = target

    setFilterBy(prevFilterBy => ({
      ...prevFilterBy,
      [field]: value,
    }))
  }

  function handleDatePick(dateRange) {
    if (!dateRange)
      return setFilterBy(prevFilterBy => ({
        ...prevFilterBy,
        at: null,
      }))

    let { from, to } = dateRange
    if (!to) to = from

    const startDate = new Date(from).getTime()
    const endDate = new Date(to).getTime()

    setFilterBy(prevFilterBy => ({
      ...prevFilterBy,
      at: { from: startDate, to: endDate },
    }))
  }

  function onClearFilter() {
    const defaultFilter = expenseService.getDefaultFilterBy()
    setFilterBy({ ...defaultFilter })
  }

  function toggleIsDatePickerOpen() {
    setIsDatePickerOpen(prevIsOpen => !prevIsOpen)
  }

  function getFormattedDateFilter() {
    const { at } = filterBy
    if (!at) return 'Open picker'

    const { from, to } = at

    let dateStr = new Date(from).toLocaleDateString('en-gb')
    if (from !== to) dateStr += ` - ${new Date(to).toLocaleDateString('en-GB')}`

    return dateStr
  }

  function getFilteringByCriteriaClass(criteria) {
    if (filterBy[criteria]) return 'active'
    return ''
  }

  const categories = expenseService.getExpenseCategories()
  return (
    <section className="expense-filter">
      <fieldset className="filter-fieldset flex">
        <legend>Filter your expenses</legend>

        <div className="filter-container flex">
          <div className="input-container flex column">
            <label htmlFor="txt">By title</label>
            <input
              type="text"
              name="txt"
              id="txt"
              className={getFilteringByCriteriaClass('txt')}
              onChange={handleChange}
              value={filterBy.txt}
              placeholder="title"
              autoComplete="off"
            />
          </div>

          <div className="input-container flex column">
            <p htmlFor="at">By a specific date or range</p>

            <button
              className={`btn-open-picker ${getFilteringByCriteriaClass('at')}`}
              onClick={toggleIsDatePickerOpen}
            >
              {getFormattedDateFilter()}
            </button>

            {isDatePickerOpen && (
              <div
                ref={datePickerRef}
                className="date-picker-container animate__animated animate__flipInX"
              >
                <DatePicker selected={filterBy.at} setSelected={handleDatePick} isRange={true} />
              </div>
            )}
          </div>

          <div className="input-container flex column">
            <label htmlFor="category">By category</label>
            <select
              name="category"
              id="category"
              onChange={handleChange}
              className={getFilteringByCriteriaClass('category')}
              value={filterBy.category}
            >
              <option value="">All</option>

              {categories.map((category, idx) => (
                <option key={category + idx} value={category.toLowerCase()}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          title="Clear Filter"
          className="btn-clear-filter flex align-center justify-center"
          onClick={onClearFilter}
        ></button>
      </fieldset>
    </section>
  )
}
