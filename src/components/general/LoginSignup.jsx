import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { socketService } from '../../services/socket.service'
import { userService } from '../../services/user.service'
import { showErrorMsg, showSuccessMsg } from '../../services/event-bus.service'
import { UserContext } from '../../contexts/UserContext'

export function LoginSignup() {
  const [isSignup, setIsSignup] = useState(false)
  const [isShowPassword, setIsShowPassword] = useState(false)
  const [credentials, setCredentials] = useState(userService.getEmptyCredentials())

  const { setUser } = useContext(UserContext)
  const navigate = useNavigate()

  function handleChange({ target }) {
    const { name: field, value } = target
    setCredentials(prevCreds => ({ ...prevCreds, [field]: value }))
  }

  function handleSubmit(ev) {
    ev.preventDefault()
    submitCredentials(credentials)
  }

  function submitCredentials(credentials) {
    isSignup ? handleSignup(credentials) : handleLogin(credentials)
  }

  async function handleLogin(credentials) {
    try {
      const user = await userService.login(credentials)
      socketService.login(user._id)

      showSuccessMsg(`Welcome back, ${user.username}`)
      navigate('/expense')
      setUser(user)
    } catch (err) {
      console.log('Login -> Has issues login', err)
      showErrorMsg('Could not login, try again later.')
    }
  }

  async function handleSignup(credentials) {
    try {
      const user = await userService.signup(credentials)
      socketService.login(user._id)

      showSuccessMsg(`Welcome, ${user.username}`)
      navigate('/expense')
      setUser(user)
    } catch (err) {
      console.log('Signup -> Has issues signup', err)
      showErrorMsg('Could not sign-in, try again later.')
    }
  }

  const guestCredentials = { username: 'Guest', password: '12345' }
  return (
    <section className="login-page flex column align-center justify-center">
      <header className="login-header flex column align-center ">
        <div className="title-container flex align-center">
          <img src="/assets/img/loader-coin.png" alt="Green coin" className="login-img" />
          <h1 className="main-heading">Welcome to Xpenser</h1>
        </div>

        <h3 className="secondary-heading">
          The ultimate expense tracker for those who want to control their money.
        </h3>
        <h4 className="secondary-heading">You can login, signup or continue as a guest.</h4>
      </header>

      <form onSubmit={handleSubmit} className="flex column">
        <div className="input-container flex column">
          <label htmlFor="username">Enter username</label>
          <input
            type="text"
            placeholder="username"
            name="username"
            id="username"
            value={credentials.username}
            onChange={handleChange}
            required
            autoComplete="off"
            maxLength={20}
          />
        </div>

        <div className="input-container flex column">
          <label htmlFor="password">Enter password</label>
          <input
            type={isShowPassword ? 'text' : 'password'}
            placeholder="password"
            name="password"
            id="password"
            value={credentials.password}
            onChange={handleChange}
            required
            autoComplete="off"
            maxLength={30}
          />

          <button
            type="button"
            className={`btn-toggle-password ${isShowPassword ? 'active' : ''}`}
            onClick={() => setIsShowPassword(prevIsShow => !prevIsShow)}
          ></button>
        </div>

        <button className="btn-submit">{isSignup ? 'Sign up' : 'Login'}</button>
      </form>

      <p className="already-user flex">
        {`${isSignup ? 'Already have an account?' : "Don't have an account yet?"}`}
        <span onClick={() => setIsSignup(!isSignup)} className="btn-toggle">{`${
          isSignup ? 'Log in ' : 'Sign up'
        }`}</span>
      </p>

      <button
        type="button"
        className="btn-guest"
        onClick={() => {
          handleLogin(guestCredentials)
        }}
      >
        Continue as guest
      </button>
    </section>
  )
}
