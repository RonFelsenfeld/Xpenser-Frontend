import { storageService } from './async-storage.service'
import { utilService } from './util.service'

const EXPENSE_KEY = 'expensesDB'
_createExpenses()

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
}

async function query(filterBy = {}) {
  try {
    let expenses = await storageService.query(EXPENSE_KEY)

    // ! Checking for filter criteria
    const filterByValues = Object.values(filterBy)
    if (filterByValues.some(val => val)) {
      expenses = _filterExpenses(expenses, filterBy)
    }

    return expenses
  } catch (err) {
    console.log('Query -> Had issues querying expenses', err)
    throw new Error(err)
  }
}

async function getById(expenseId) {
  const expense = await storageService.get(EXPENSE_KEY, expenseId)
  return expense
}

function remove(expenseId) {
  return storageService.remove(EXPENSE_KEY, expenseId)
}

function save(expense) {
  if (expense._id) {
    return storageService.put(EXPENSE_KEY, expense)
  } else {
    return storageService.post(EXPENSE_KEY, expense)
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
  return { at: '', category: '' }
}

function _filterExpenses(expenses, { at, category }) {
  let expensesToReturn = expenses.slice()

  if (at) {
    expensesToReturn = expensesToReturn.filter(
      e => new Date(e.at).getTime() === new Date(at).getTime()
    )
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

////////////////////////////////////////////////////

// ! DEMO DATA

function _createExpense(txt, amount) {
  const newExpense = getEmptyExpense()

  newExpense._id = utilService.makeId()
  newExpense.txt = txt
  newExpense.amount = amount

  return newExpense
}

function _createExpenses() {
  let expenses = utilService.loadFromStorage(EXPENSE_KEY)

  if (!expenses || !expenses.length) {
    expenses = []

    expenses.push(_createExpense('Rent', 3000))
    expenses.push(_createExpense('T-shirt - Zara', 120))
    expenses.push(_createExpense('Running shoes', 450))
    expenses.push(_createExpense('Fuel', 313))
    expenses.push(_createExpense('Bus to Tel Aviv', 12))

    utilService.saveToStorage(EXPENSE_KEY, expenses)
  }

  return expenses
}
