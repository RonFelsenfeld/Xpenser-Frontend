import { useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { socketService } from '../../services/socket.service'
import { showErrorMsg, showSuccessMsg } from '../../services/event-bus.service'
import { userService } from '../../services/user.service'
import { UserContext } from '../../contexts/UserContext'
import { utilService } from '../../services/util.service'

export function AppHeader() {
  const { user, setUser } = useContext(UserContext)
  const navigate = useNavigate()
  const location = useLocation()

  async function handleLogout() {
    try {
      await userService.logout()
      socketService.logout()

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
      <div className="title-container flex align-center">
        <img src="/assets/img/loader-coin.png" alt="Green coin" className="login-img" />
        <h1 className="main-heading">Xpenser</h1>
      </div>

      {user && (
        <div className="user-container flex align-center">
          <span className="user-greet">
            {utilService.greetBasedOnHour()}, {user.username}
          </span>
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
