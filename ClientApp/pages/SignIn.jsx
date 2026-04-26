import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import borblogo from '../assets/borblogo.png'
import styles from './SignIn.module.css'
import { login, register } from '../api.js'

export default function SignIn() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('login')
  const [showPass, setShowPass] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      let user
      if (tab === 'login') {
        user = await login(username, password)
      } else {
        if (password !== confirmPassword) {
          setError('Passwords do not match')
          return
        }
        user = await register(username, password)
      }
      localStorage.setItem('currentUser', JSON.stringify(user))
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className={styles.page}>
      <button className={styles.back} onClick={() => navigate('/')}>← back</button>

      <div className={styles.logoWrap}>
        <img src={borblogo} alt="Borb logo" style={{ height: 184 }} />
      </div>

      <h1 className={styles.title}>Welcome to Borb</h1>
      <p className={styles.sub}>Your message exchange community</p>

      <div className={styles.card}>
        {/* tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === 'login' ? styles.activeTab : ''}`}
            onClick={() => setTab('login')}
          >
            Login
          </button>
          <button
            className={`${styles.tab} ${tab === 'register' ? styles.activeTab : ''}`}
            onClick={() => setTab('register')}
          >
            Register
          </button>
        </div>

        {/* form */}
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>
              Username <span className={styles.req}>*</span>
            </label>
            <input
              className={styles.input}
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              Password <span className={styles.req}>*</span>
            </label>
            <div className={styles.passWrap}>
              <input
                className={styles.input}
                type={showPass ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button className={styles.eyeBtn} onClick={() => setShowPass(p => !p)} type="button">
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {tab === 'register' && (
            <div className={styles.field}>
              <label className={styles.label}>
                Confirm Password <span className={styles.req}>*</span>
              </label>
              <div className={styles.passWrap}>
                <input
                  className={styles.input}
                  type={showPass ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {error && <p className={styles.error}>{error}</p>}

          <button className={styles.submitBtn} type="submit">
            {tab === 'login' ? 'Log In' : 'Create Account'}
          </button>

          {tab === 'login' && (
            <p className={styles.demo}>
              Demo accounts: alice, bob, charlie (password: password123)
            </p>
          )}
        </form>
      </div>
    </div>
  )
}