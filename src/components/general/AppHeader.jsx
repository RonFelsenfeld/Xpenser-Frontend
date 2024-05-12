import { useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { UserContext } from '../../contexts/UserContext'

import { showErrorMsg, showSuccessMsg } from '../../services/event-bus.service'
import { userService } from '../../services/user.service.local'

export function AppHeader() {
  const { user, setUser } = useContext(UserContext)
  const navigate = useNavigate()
  const location = useLocation()

  async function handleLogout() {
    try {
      await userService.logout()
      showSuccessMsg('Logout successfully')
      setUser(null)
      navigate('/')
    } catch (err) {
      showErrorMsg('Could not logout')
      console.log('Had issues logging out:', err)
    }
  }

  const { pathname } = location
  return (
    <header className="app-header flex align-center justify-between">
      <h1 className="logo">Xpenser</h1>

      {user && (
        <div className="user-container flex align-center">
          <span className="user-greet">Hello, {user.username}</span>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}

      {/* // ! Checking if in signup page -> If so, hide button in app header
       */}
      {!user && pathname !== '/' && <button className="btn-logout">Login</button>}
    </header>
  )
}
