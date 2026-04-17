import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import CourseCard from '../components/CourseCard.jsx'
import PaymentModal from '../components/PaymentModal.jsx'
import API from '../api/axios.js'
import '../styles/Home.css'

const CATEGORIES = ['All', 'Web Development', 'Data Science', 'Cloud Computing', 'Programming', 'Design', 'DevOps']

export default function Home() {
  const [courses,    setCourses]    = useState([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState('')
  const [selected,   setSelected]   = useState(null)   // course for payment
  const [search,     setSearch]     = useState('')
  const [activecat,  setActivecat]  = useState('All')

  const raw  = localStorage.getItem('user')
  const user = raw ? JSON.parse(raw) : null

  useEffect(() => {
    API.get('/courses')
      .then(r => setCourses(r.data))
      .catch(() => setError('Failed to load courses. Please refresh.'))
      .finally(() => setLoading(false))
  }, [])

  // Client-side filter
  const filtered = useMemo(() => {
    return courses.filter(c => {
      const matchSearch = !search ||
        c.title?.toLowerCase().includes(search.toLowerCase()) ||
        c.description?.toLowerCase().includes(search.toLowerCase()) ||
        c.instructor?.toLowerCase().includes(search.toLowerCase())
      const matchCat = activecat === 'All' || c.category === activecat
      return matchSearch && matchCat
    })
  }, [courses, search, activecat])

  const handleBuy = (course) => {
    if (!user) {
      setSelected(course) // modal will show login prompt
    } else {
      setSelected(course)
    }
  }

  return (
    <>
      <Navbar />

      {/* ══════ HERO ══════ */}
      <section className="hero">
        {/* Left */}
        <div className="hero-left">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            🚀 India's #1 Online Learning Platform
          </div>

          <h1 className="hero-title">
            Learn Skills That
            <span className="hero-title-accent">Shape Careers</span>
          </h1>

          <p className="hero-desc">
            World-class courses built by industry experts. From web development
            to data science — gain the skills employers actually want.
          </p>

          <div className="hero-actions">
            <Link to="/register" className="hero-cta-primary">
              Start Learning Free →
            </Link>
            <a href="#courses" className="hero-cta-secondary">
              ▶ Browse Courses
            </a>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-num">10K+</span>
              <span className="hero-stat-label">Active Learners</span>
            </div>
            <div className="hero-stat-div" />
            <div className="hero-stat">
              <span className="hero-stat-num">50+</span>
              <span className="hero-stat-label">Expert Courses</span>
            </div>
            <div className="hero-stat-div" />
            <div className="hero-stat">
              <span className="hero-stat-num">4.9★</span>
              <span className="hero-stat-label">Avg Rating</span>
            </div>
            <div className="hero-stat-div" />
            <div className="hero-stat">
              <span className="hero-stat-num">₹0</span>
              <span className="hero-stat-label">To Sign Up</span>
            </div>
          </div>
        </div>

        {/* Right — decorative */}
        <div className="hero-right">
          <div className="hero-orb orb-purple" />
          <div className="hero-orb orb-gold" />
          <div className="hero-orb orb-blue" />

          {/* Central mockup */}
          <div className="hero-mockup">
            <div className="mockup-header">🎓 My Learning Hub</div>
            <div className="mockup-body">
              {[
                { icon:'⚛️',  label:'In Progress', value:'React & Spring Boot' },
                { icon:'🐍',  label:'Completed',   value:'Python for DS'       },
                { icon:'☁️',  label:'Starting',    value:'AWS Practitioner'    },
              ].map(r => (
                <div key={r.value} className="mockup-row">
                  <span className="mockup-row-icon">{r.icon}</span>
                  <div className="mockup-row-text">
                    <span>{r.label}</span>
                    <strong>{r.value}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Floating cards */}
          <div className="hero-float-card fc-1">
            <span className="fc-icon">🏆</span>
            <div>
              <div className="fc-label">Certification</div>
              <div className="fc-value">Industry Recognised</div>
            </div>
          </div>

          <div className="hero-float-card fc-2">
            <span className="fc-icon">💡</span>
            <div>
              <div className="fc-label">Live Projects</div>
              <div className="fc-value">Build Real Apps</div>
            </div>
          </div>

          <div className="hero-float-card fc-3">
            <span className="fc-icon">📈</span>
            <div>
              <div className="fc-label">Avg Salary Hike</div>
              <div className="fc-value">+45% After Course</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <div className="trust-strip">
        <span className="trust-label">Trusted by learners at</span>
        {['Google', 'Amazon', 'Infosys', 'TCS', 'Wipro', 'Microsoft'].map(c => (
          <span key={c} className="trust-item">{c}</span>
        ))}
      </div>

      {/* ══════ COURSES ══════ */}
      <section className="courses-section" id="courses">

        <div className="section-head">
          <div className="section-head-left">
            <div className="section-eyebrow">📚 Our Courses</div>
            <h2>
              Explore <span className="text-gold">Expert-Led</span> Courses
            </h2>
            <p>
              {loading ? 'Loading courses…' : `${courses.length} courses available`}
            </p>
          </div>
          <Link to="/register" className="view-all-btn">
            View All Courses →
          </Link>
        </div>

        {/* Search + filter */}
        <div className="courses-search-bar">
          <div className="search-input-wrap">
            <span className="search-icon">🔍</span>
            <input
              className="search-input"
              type="text"
              placeholder="Search courses, instructors…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="category-pills">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`cat-pill ${activecat === cat ? 'active' : ''}`}
                onClick={() => setActivecat(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="skel-grid">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="skeleton skel-card" style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        ) : error ? (
          <div className="courses-empty">
            <div className="courses-empty-icon">⚠️</div>
            <p>{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="courses-empty">
            <div className="courses-empty-icon">🔎</div>
            <p>No courses match your search. Try a different keyword or category.</p>
          </div>
        ) : (
          <div className="courses-grid">
            {filtered.map((course, i) => (
              <CourseCard
                key={course.id}
                course={course}
                onBuy={() => handleBuy(course)}
                delay={i * 0.07}
              />
            ))}
          </div>
        )}
      </section>

      {/* Payment modal */}
      {selected && (
        <PaymentModal
          course={selected}
          onClose={() => setSelected(null)}
          onSuccess={() => setSelected(null)}
        />
      )}
    </>
  )
}
