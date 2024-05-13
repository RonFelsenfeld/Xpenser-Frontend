import { ChartReplacement } from './ChartReplacment'
import { LineChart } from './LineChart'
import { PieChart } from './PieChart'

export function Statistics({ expenses, onCloseStatistic }) {
  // ! Render pie chart only when there are expenses and some with category
  function isExistDataForPieChart() {
    const hasCategory = expenses.some(expense => expense.category)
    return !!expenses?.length && hasCategory
  }

  // ! Render line chart only when there are expenses and some with category
  function isExistDataForLineChart() {
    const hasDate = expenses.some(expense => expense.at)
    return !!expenses?.length && hasDate
  }

  return (
    <section className="statistics-section flex column">
      <button className="btn-close" onClick={onCloseStatistic}></button>

      {isExistDataForPieChart() && <PieChart title="Expenses Per Category" expenses={expenses} />}
      {isExistDataForLineChart() && <LineChart title="Expenses Per Month" expenses={expenses} />}

      {!isExistDataForPieChart() && !isExistDataForLineChart() && <ChartReplacement />}
    </section>
  )
}
