import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { expenseService } from '../../services/expense.service'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export function LineChart({ title, expenses }) {
  const expensesPerMonthMap = expenseService.getExpensesPerMonthMap(expenses)

  // ! Making sure that the arrays are orderly sync
  const monthMapEntries = Object.entries(expensesPerMonthMap)
  const monthInMap = monthMapEntries.map(([key, value]) => key)
  const totalExpensesPerMonth = monthMapEntries.map(([key, value]) => value)

  const data = {
    labels: monthInMap,
    datasets: [
      {
        data: totalExpensesPerMonth,
        borderColor: 'rgb(56, 112, 232)',
        backgroundColor: 'rgb(56, 112, 232)',
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  }

  return (
    <div className="line-chart">
      <h3 className="chart-title">{title}</h3>
      <Line data={data} options={options} />
    </div>
  )
}
