import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

import { expenseService } from '../../services/expense.service'
import { utilService } from '../../services/util.service'

ChartJS.register(ArcElement, Tooltip, Legend)

export function PieChart({ title, expenses }) {
  const expensesPerCategoryMap = expenseService.getCategoriesMap(expenses)

  // ! Making sure that the arrays are orderly sync
  const categoryMapEntries = Object.entries(expensesPerCategoryMap)
  const categoriesInMap = categoryMapEntries.map(([key, value]) => utilService.capitalize(key))
  const totalExpensesPerCategory = categoryMapEntries.map(([key, value]) => value)

  const categoriesColor = expenseService.getCategoriesColors(categoriesInMap)

  const data = {
    labels: categoriesInMap,
    datasets: [
      {
        label: 'Total expenses',
        data: totalExpensesPerCategory,
        backgroundColor: categoriesColor,
        borderColor: categoriesColor,
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          padding: 35,
          color: 'rgb(50, 51, 56)',
          font: {
            size: 14,
          },
        },
      },
    },
  }

  return (
    <div className="pie-chart">
      <h3 className="chart-title">{title}</h3>
      <Pie data={data} options={options} />
    </div>
  )
}
