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
}

async function query() {
  try {
    const expenses = await storageService.query(EXPENSE_KEY)
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
