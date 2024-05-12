import { io } from 'socket.io-client'
import { userService } from './user.service'

export const SOCKET_EMIT_SET_USER = 'set-user-expenses'

export const SOCKET_EMIT_ADD_EXPENSE = 'add-expense'
export const SOCKET_EVENT_EXPENSE_ADDED = 'expense-added'

export const SOCKET_EMIT_REMOVE_EXPENSE = 'remove-expense'
export const SOCKET_EVENT_EXPENSE_REMOVED = 'expense-removed'

export const SOCKET_EMIT_UPDATE_EXPENSE = 'update-expense'
export const SOCKET_EVENT_EXPENSE_UPDATED = 'expense-updated'

export const SOCKET_EMIT_EDITING_EXPENSE = 'editing-expense'
export const SOCKET_EVENT_EXPENSE_EDITED = 'expense-is-edited'

const SOCKET_EMIT_LOGIN = 'set-user-socket'
const SOCKET_EMIT_LOGOUT = 'unset-user-socket'

const baseUrl = process.env.NODE_ENV === 'production' ? '' : '//localhost:3030'
export const socketService = createSocketService()

socketService.setup()
socketService.on('connection', () => {
  console.log('connected!')
})

function createSocketService() {
  var socket = null

  const socketService = {
    setup() {
      socket = io(baseUrl)
      const user = userService.getLoggedInUser()
      if (user) this.login(user._id)
    },
    on(eventName, cb) {
      socket.on(eventName, cb)
    },
    off(eventName, cb = null) {
      if (!socket) return
      if (!cb) socket.removeAllListeners(eventName)
      else socket.off(eventName, cb)
    },
    emit(eventName, data) {
      socket.emit(eventName, data)
    },
    login(userId) {
      socket.emit(SOCKET_EMIT_LOGIN, userId)
    },
    logout() {
      socket.emit(SOCKET_EMIT_LOGOUT)
    },
    terminate() {
      socket = null
    },
  }
  return socketService
}
