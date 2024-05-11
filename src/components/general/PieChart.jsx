import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

import { expenseService } from '../../services/expense.local.service'
import { utilService } from '../../services/util.service'

ChartJS.register(ArcElement, Tooltip, Legend)

export function PieChart({ expenses }) {
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
        label: 'Total Expenses',
        data: totalExpensesPerCategory,
        backgroundColor: categoriesColor,
        borderColor: categoriesColor,
        borderWidth: 2,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          padding: 20,
        },
      },
    },
  }

  return <Pie data={data} options={options} />
}
