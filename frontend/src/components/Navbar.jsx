import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import '../styles/Navbar.css'

export default function Navbar() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const [open, setOpen] = useState(false)

  const raw  = localStorage.getItem('user')
  const user = raw ? JSON.parse(raw) : null

  const logout = () => {
    localStorage.clear()
    navigate('/')
    setOpen(false)
  }

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link'

  return (
    <nav className="navbar">
      <div className="nav-inner">
        {/* Brand */}
        <Link to="/" className="nav-brand" onClick={() => setOpen(false)}>
          <span className="nav-brand-icon">🎓</span>
          <span className="nav-brand-name">Edu<em>Verse</em></span>
        </Link>

        {/* Center links */}
        <div className={`nav-links ${open ? 'open' : ''}`}>
          <Link to="/" className={isActive('/')} onClick={() => setOpen(false)}>
            Courses
          </Link>
          {user && (
            <Link
              to={user.role === 'ADMIN' ? '/admin' : '/dashboard'}
              className={isActive(user.role === 'ADMIN' ? '/admin' : '/dashboard')}
              onClick={() => setOpen(false)}
            >
              {user.role === 'ADMIN' ? '⚙️ Admin Panel' : '📚 My Learning'}
            </Link>
          )}
        </div>

        {/* Right side */}
        <div className={`nav-right ${open ? 'open' : ''}`}>
          {user ? (
            <>
              <div className="nav-user-chip">
                <div className="nav-avatar">
                  {user.name?.[0]?.toUpperCase() ?? 'U'}
                </div>
                <span className="nav-username">{user.name}</span>
              </div>
              {user.role === 'ADMIN' && (
                <Link to="/admin" className="nav-dash-link" onClick={() => setOpen(false)}>
                  ⚙️ Dashboard
                </Link>
              )}
              <button className="nav-btn-ghost" onClick={logout}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-btn-ghost" onClick={() => setOpen(false)}>
                Sign In
              </Link>
              <Link to="/register" className="nav-btn-primary" onClick={() => setOpen(false)}>
                Get Started →
              </Link>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button
          className="hamburger"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span style={open ? { transform: 'rotate(45deg) translate(5px, 5px)' } : {}} />
          <span style={open ? { opacity: 0 } : {}} />
          <span style={open ? { transform: 'rotate(-45deg) translate(5px, -5px)' } : {}} />
        </button>
      </div>
    </nav>
  )
}
