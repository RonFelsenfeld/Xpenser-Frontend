import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

const STORAGE_KEY = 'userDB'
const STORAGE_KEY_LOGGEDIN = 'loggedinUser'
_createDemoUsers()

export const userService = {
  login,
  signup,
  logout,
  getById,
  getLoggedInUser,
  getEmptyCredentials,
}

async function login({ username, password }) {
  try {
    const users = await storageService.query(STORAGE_KEY)
    const user = users.find(user => user.username === username)
    if (user && user.password === password) return _setLoggedInUser(user)
  } catch (err) {
    console.log('Login in service --> Has issues login')
    return Promise.reject('Invalid login')
  }
}

async function signup({ username, password }) {
  const user = { username, password }

  try {
    const savedUser = await storageService.post(STORAGE_KEY, user)
    return _setLoggedInUser(savedUser)
  } catch (err) {
    console.log('Signup in service --> Has issues signup')
    return Promise.reject('Could not signup')
  }
}

function logout() {
  sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN)
  return Promise.resolve()
}

function getById(userId) {
  return storageService.get(STORAGE_KEY, userId)
}

function getLoggedInUser() {
  return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN))
}

function _setLoggedInUser(user) {
  console.log(user)
  const userToSave = { _id: user._id, username: user.username }
  sessionStorage.setItem(STORAGE_KEY_LOGGEDIN, JSON.stringify(userToSave))
  return userToSave
}

function getEmptyCredentials() {
  return {
    username: '',
    password: '',
  }
}

////////////////////////////////////////////////////

// ! DEMO USER

function _createDemoUsers() {
  let users = utilService.loadFromStorage(STORAGE_KEY)

  if (!users || !users.length) {
    users = []

    const user1 = {
      _id: 'u123',
      username: 'guest',
      password: '12345',
    }

    users = [user1]
    utilService.saveToStorage(STORAGE_KEY, users)
  }
}
