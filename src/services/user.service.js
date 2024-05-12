import { httpService } from './http.service.js'

const BASE_URL = 'auth/'
const STORAGE_KEY_LOGGEDIN = 'loggedInUser'

export const userService = {
  login,
  logout,
  signup,
  getById,
  getLoggedInUser,
  getEmptyCredentials,
}

async function login({ username, password }) {
  try {
    const user = await httpService.post(BASE_URL + 'login', { username, password })
    if (user) return _setLoggedInUser(user)
    return Promise.reject('Invalid login')
  } catch (err) {
    console.log('Login in service --> Has issues login')
    throw new Error(err)
  }
}

async function signup({ username, password }) {
  const user = { username, password }

  try {
    const savedUser = await httpService.post(BASE_URL + 'signup', user)
    if (savedUser) return _setLoggedInUser(savedUser)
    else return Promise.reject('Invalid signup')
  } catch (err) {
    console.log('Signup in service --> Has issues signup')
  }
}

async function logout() {
  try {
    httpService.post(BASE_URL + 'logout')
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN)
  } catch (err) {
    console.log('Logout in service --> Has issues logout')
  }
}

function getById(userId) {
  return httpService.get('user/' + userId)
}

function getLoggedInUser() {
  return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN))
}

function _setLoggedInUser(user) {
  const userToSave = {
    _id: user._id,
    username: user.username,
  }

  sessionStorage.setItem(STORAGE_KEY_LOGGEDIN, JSON.stringify(userToSave))
  return userToSave
}

function getEmptyCredentials() {
  return {
    username: '',
    password: '',
  }
}
