import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../api/axios.js'
import '../styles/Auth.css'

export default function Login() {
  const navigate = useNavigate()

  const [role,     setRole]     = useState('USER')
  const [form,     setForm]     = useState({ email: '', password: '' })
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [showPass, setShowPass] = useState(false)

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const endpoint = role === 'ADMIN' ? '/admin/auth/login' : '/auth/login'
      const { data } = await API.post(endpoint, {
        email:    form.email,
        password: form.password,
      })

      // Backend role verification — double-check on frontend too
      if (role === 'ADMIN' && data.role !== 'ADMIN') {
        setError('This account does not have admin privileges.')
        return
      }
      if (role === 'USER' && data.role !== 'USER') {
        setError('Please use the Admin login option.')
        return
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('user',  JSON.stringify(data))

      navigate(data.role === 'ADMIN' ? '/admin' : '/dashboard')

    } catch (err) {
      const msg = err.response?.data
      setError(typeof msg === 'string' ? msg : 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />
      <div className="auth-orb auth-orb-3" />

      <div className="auth-card">
        {/* Brand */}
        <Link to="/" className="auth-brand">
          <span className="auth-brand-icon">🎓</span>
          <span className="auth-brand-name">Edu<em>Verse</em></span>
        </Link>

        <h1 className="auth-heading">Welcome Back</h1>
        <p className="auth-sub">Sign in to continue your learning journey</p>

        {/* Role selector */}
        <div className="role-selector">
          <button
            type="button"
            className={`role-option ${role === 'USER' ? 'active' : ''}`}
            onClick={() => { setRole('USER'); setError('') }}
          >
            <span className="role-option-icon">👤</span>
            <span className="role-option-label">Student</span>
            <span className="role-option-desc">Access your courses</span>
          </button>
          <button
            type="button"
            className={`role-option ${role === 'ADMIN' ? 'active' : ''}`}
            onClick={() => { setRole('ADMIN'); setError('') }}
          >
            <span className="role-option-icon">⚙️</span>
            <span className="role-option-label">Admin</span>
            <span className="role-option-desc">Manage platform</span>
          </button>
        </div>

        {role === 'ADMIN' && (
          <div className="admin-badge">
            🔐 Admin Login — Restricted Access
          </div>
        )}

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label className="form-label">Email Address</label>
            <div className="input-wrap">
              <span className="input-icon">📧</span>
              <input
                className="form-input"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={set('email')}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-field">
            <label className="form-label">Password</label>
            <div className="input-wrap">
              <span className="input-icon">🔒</span>
              <input
                className="form-input"
                type={showPass ? 'text' : 'password'}
                placeholder="Enter your password"
                value={form.password}
                onChange={set('password')}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="pass-toggle"
                onClick={() => setShowPass(p => !p)}
                tabIndex={-1}
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && (
            <div className="auth-error">
              <span>⚠️</span> {error}
            </div>
          )}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading
              ? <><span className="spinner" /> Signing In…</>
              : `Sign In as ${role === 'ADMIN' ? 'Admin' : 'Student'} →`
            }
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account?{' '}
          <Link to="/register">Create one for free</Link>
        </p>
      </div>
    </div>
  )
}
