import { httpService } from './http.service'
import { utilService } from './util.service'

const BASE_URL = 'expense'

export const expenseService = {
  query,
  getById,
  remove,
  save,
  getEmptyExpense,
  getExpenseCategories,
  getDefaultFilterBy,
  getCategoriesMap,
  getCategoriesColors,
  getExpensesPerMonthMap,
}

async function query(filterBy = {}) {
  let expenses = await httpService.get(BASE_URL)

  // ! Checking for filter criteria
  const filterByValues = Object.values(filterBy)
  if (filterByValues.some(val => val)) {
    expenses = _filterExpenses(expenses, filterBy)
  }

  return expenses
}

function getById(expenseId) {
  return httpService.get(`${BASE_URL}/${expenseId}`)
}

function remove(expenseId) {
  return httpService.delete(`${BASE_URL}/${expenseId}`)
}

function save(expense) {
  if (expense._id) {
    return httpService.put(`${BASE_URL}/${expense._id}`, expense)
  } else {
    return httpService.post(BASE_URL, expense)
  }
}

////////////////////////////////////////////////////

function getEmptyExpense() {
  return {
    txt: '',
    amount: 0,
    category: '',
    at: '',
    notes: '',
  }
}

function getExpenseCategories() {
  return ['Food', 'Utilities', 'Entertainment', 'Transport', 'Savings', 'Other']
}

function getDefaultFilterBy() {
  return { txt: '', at: null, category: '' }
}

function _filterExpenses(expenses, { txt, at, category }) {
  let expensesToReturn = expenses.slice()

  if (txt) {
    const regExp = new RegExp(txt, 'i')
    expensesToReturn = expensesToReturn.filter(e => regExp.test(e.txt))
  }

  if (at) {
    const { from, to } = at
    expensesToReturn = expensesToReturn.filter(e => e.at >= from && e.at <= to)
  }

  if (category) {
    expensesToReturn = expensesToReturn.filter(e => e.category === category)
  }

  return expensesToReturn
}

function getCategoriesMap(expenses) {
  const expensesPerCategoryMap = expenses.reduce((map, { amount, category }) => {
    if (!category) return map
    if (!map[category]) map[category] = 0
    map[category] += amount
    return map
  }, {})

  return expensesPerCategoryMap
}

function getCategoriesColors(categories) {
  const rootStyles = getComputedStyle(document.documentElement)

  const colors = categories.map(category => {
    const lowercasedCategory = category.toLowerCase()
    return rootStyles.getPropertyValue(`--category-${lowercasedCategory}-clr`)
  })

  return colors
}

function getExpensesPerMonthMap(expenses) {
  const lastFourMonthsMap = utilService.getLastFourMonths()

  expenses.forEach(({ amount, at }) => {
    if (!at) return

    const month = new Date(at).toLocaleDateString('en-GB', { month: 'long' })
    if (lastFourMonthsMap[month] === undefined) return

    lastFourMonthsMap[month] += amount
  })

  return lastFourMonthsMap
}
