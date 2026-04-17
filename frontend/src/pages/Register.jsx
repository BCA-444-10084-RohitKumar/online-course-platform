import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../api/axios.js'
import '../styles/Auth.css'

export default function Register() {
  const navigate = useNavigate()

  const [form,     setForm]     = useState({ name:'', email:'', password:'', phone:'', role:'USER' })
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [showPass, setShowPass] = useState(false)

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (form.phone.replace(/\D/g,'').length < 10) {
      setError('Please enter a valid 10-digit phone number.')
      return
    }

    setLoading(true)
    try {
      await API.post('/auth/signup', {
        name:     form.name.trim(),
        email:    form.email.trim(),
        password: form.password,
        phone:    form.phone.trim(),
        role:     form.role,
      })
      navigate('/login')
    } catch (err) {
      const msg = err.response?.data
      setError(typeof msg === 'string' ? msg : 'Registration failed. Please try again.')
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

        <h1 className="auth-heading">Create Account</h1>
        <p className="auth-sub">Join 10,000+ learners and start today — it's free</p>

        {/* Role selector */}
        <div className="role-selector">
          <button
            type="button"
            className={`role-option ${form.role === 'USER' ? 'active' : ''}`}
            onClick={() => setForm(f => ({ ...f, role: 'USER' }))}
          >
            <span className="role-option-icon">🎓</span>
            <span className="role-option-label">Student</span>
            <span className="role-option-desc">Buy & access courses</span>
          </button>
          <button
            type="button"
            className={`role-option ${form.role === 'ADMIN' ? 'active' : ''}`}
            onClick={() => setForm(f => ({ ...f, role: 'ADMIN' }))}
          >
            <span className="role-option-icon">⚙️</span>
            <span className="role-option-label">Admin</span>
            <span className="role-option-desc">Manage the platform</span>
          </button>
        </div>

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form-row">
            <div className="form-field">
              <label className="form-label">Full Name</label>
              <div className="input-wrap">
                <span className="input-icon">👤</span>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Enter your Name"
                  value={form.name}
                  onChange={set('name')}
                  required
                  autoComplete="name"
                />
              </div>
            </div>

            <div className="form-field">
              <label className="form-label">Phone</label>
              <div className="input-wrap">
                <span className="input-icon">📱</span>
                <input
                  className="form-input"
                  type="tel"
                  placeholder="9876543210"
                  value={form.phone}
                  onChange={set('phone')}
                  required
                  maxLength={10}
                  autoComplete="tel"
                />
              </div>
            </div>
          </div>

          <div className="form-field">
            <label className="form-label">Email Address</label>
            <div className="input-wrap">
              <span className="input-icon">📧</span>
              <input
                className="form-input"
                type="email"
                placeholder="Enter your gmail"
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
                placeholder="Min 6 characters"
                value={form.password}
                onChange={set('password')}
                required
                minLength={6}
                autoComplete="new-password"
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
              ? <><span className="spinner" /> Creating Account…</>
              : 'Create My Account →'
            }
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  )
}
