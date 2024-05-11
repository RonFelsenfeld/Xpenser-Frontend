import { storageService } from './async-storage.service'

const EXPENSE_KEY = 'expensesDB'

export const expenseService = {
  query,
  getById,
  remove,
  save,
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
