import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import API from '../api/axios.js'
import '../styles/UserDashboard.css'

export default function UserDashboard() {
  const raw  = localStorage.getItem('user')
  const user = raw ? JSON.parse(raw) : {}

  const [courses,  setCourses]  = useState([])
  const [active,   setActive]   = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')

  useEffect(() => {
    API.get('/access/courses', { params: { email: user.email } })
      .then(r => {
        setCourses(r.data)
        if (r.data.length > 0) setActive(r.data[0])
      })
      .catch(() => setError('Could not load your courses. Please try again.'))
      .finally(() => setLoading(false))
  }, [])

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return '☀️ Good morning'
    if (h < 17) return '🌤 Good afternoon'
    return '🌙 Good evening'
  }

  return (
    <div className="ud-page">
      <Navbar />

      <div className="ud-container">
        {/* Header */}
        <div className="ud-header">
          <div className="ud-header-left">
            <div className="section-eyebrow">📚 My Learning</div>
            <h1>{greeting()}, {user.name?.split(' ')[0] || 'Learner'}!</h1>
            <p>Pick up where you left off and keep the momentum going.</p>
          </div>

          <div className="ud-stat-row">
            <div className="ud-stat-card">
              <span className="ud-stat-num">{courses.length}</span>
              <span className="ud-stat-label">Courses</span>
            </div>
            <div className="ud-stat-card">
              <span className="ud-stat-num">
                {courses.reduce((a, c) => a + (c.duration || 0), 0)}h
              </span>
              <span className="ud-stat-label">Content</span>
            </div>
            <div className="ud-stat-card">
              <span className="ud-stat-num">∞</span>
              <span className="ud-stat-label">Lifetime</span>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="ud-loading">
            <div className="spinner-lg" />
            <p>Loading your courses…</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="ud-empty">
            <div className="ud-empty-icon">⚠️</div>
            <h2>Something went wrong</h2>
            <p>{error}</p>
            <button className="ud-empty-cta" onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && courses.length === 0 && (
          <div className="ud-empty">
            <div className="ud-empty-icon">📚</div>
            <h2>No Courses Yet</h2>
            <p>
              You haven't purchased any courses yet. Browse our catalog
              and find the perfect course to start your journey!
            </p>
            <Link to="/" className="ud-empty-cta">
              Browse Courses →
            </Link>
          </div>
        )}

        {/* Main layout */}
        {!loading && !error && courses.length > 0 && (
          <div className="ud-layout">

            {/* Sidebar */}
            <aside className="ud-sidebar">
              <div className="ud-sidebar-head">
                <span className="ud-sidebar-title">My Courses</span>
                <span className="ud-sidebar-count">{courses.length}</span>
              </div>
              <div className="ud-sidebar-list">
                {courses.map((c) => (
                  <button
                    key={c.id}
                    className={`sidebar-item ${active?.id === c.id ? 'active' : ''}`}
                    onClick={() => setActive(c)}
                  >
                    <img
                      className="sidebar-thumb"
                      src={c.imageUrl || `https://picsum.photos/seed/c${c.id}/80/80`}
                      alt={c.title}
                      onError={e => { e.target.src = `https://picsum.photos/seed/c${c.id}/80/80` }}
                    />
                    <div className="sidebar-info">
                      <div className="sidebar-name">{c.title}</div>
                      <div className="sidebar-cat">{c.category || 'Course'}</div>
                    </div>
                    {active?.id === c.id && <span className="sidebar-active-dot" />}
                  </button>
                ))}
              </div>
            </aside>

            {/* Main viewer */}
            <main className="ud-main">
              {active && (
                <>
                  {/* Video player */}
                  <div className="video-wrap">
                    {active.videoUrl ? (
                      <iframe
                        src={active.videoUrl}
                        title={active.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div className="video-placeholder">
                        <span className="video-placeholder-icon">🎬</span>
                        <p>Video content coming soon</p>
                      </div>
                    )}
                  </div>

                  {/* Course details */}
                  <div className="course-detail">
                    <div className="course-detail-top">
                      <h2 className="course-detail-title">{active.title}</h2>
                      <span className="enrolled-badge">✅ Enrolled</span>
                    </div>

                    <div className="course-detail-tags">
                      <span className="detail-tag">👨‍🏫 {active.instructor || 'Expert Instructor'}</span>
                      <span className="detail-tag">📂 {active.category || 'Course'}</span>
                      <span className="detail-tag">⏱ {active.duration || 0} hours</span>
                      <span className="detail-tag">📹 HD Video</span>
                      <span className="detail-tag">📜 Certificate Included</span>
                    </div>

                    <p className="course-detail-desc">
                      {active.description || 'Full course description coming soon.'}
                    </p>
                  </div>
                </>
              )}
            </main>
          </div>
        )}
      </div>
    </div>
  )
}
