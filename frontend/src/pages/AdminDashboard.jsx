import { useState, useEffect, useCallback } from 'react'
import Navbar from '../components/Navbar.jsx'
import API from '../api/axios.js'
import '../styles/AdminDashboard.css'

const TABS = [
  { key: 'overview',  label: 'Overview',     icon: '📊' },
  { key: 'courses',   label: 'Courses',       icon: '📚' },
  { key: 'students',  label: 'Students',      icon: '👥' },
  { key: 'payments',  label: 'Payments',      icon: '💳' },
]

const BLANK_COURSE = {
  title: '', description: '', price: '', videoUrl: '',
  imageUrl: '', instructor: '', category: '', duration: '',
}

export default function AdminDashboard() {
  const raw  = localStorage.getItem('user')
  const user = raw ? JSON.parse(raw) : {}

  const [tab,      setTab]      = useState('overview')
  const [stats,    setStats]    = useState({})
  const [courses,  setCourses]  = useState([])
  const [students, setStudents] = useState([])
  const [payments, setPayments] = useState([])
  const [loading,  setLoading]  = useState(true)

  // Modal state
  const [modal,    setModal]    = useState(null)  // null | 'add' | 'edit'
  const [form,     setForm]     = useState(BLANK_COURSE)
  const [saving,   setSaving]   = useState(false)
  const [deleting, setDeleting] = useState(null)

  // Search
  const [courseSearch,  setCourseSearch]  = useState('')
  const [studentSearch, setStudentSearch] = useState('')

  /* ── Data fetching ── */
  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [statsRes, coursesRes, studentsRes, paymentsRes] = await Promise.all([
        API.get('/admin/dashboard'),
        API.get('/admin/courses'),
        API.get('/admin/students'),
        API.get('/admin/transactions'),
      ])
      setStats(stats   => ({ ...stats,    ...statsRes.data }))
      setStats(statsRes.data)
      setCourses(coursesRes.data)
      setStudents(studentsRes.data)
      setPayments(paymentsRes.data)
    } catch (err) {
      console.error('Dashboard fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  /* ── Course CRUD ── */
  const openAdd  = () => { setForm(BLANK_COURSE); setModal('add') }
  const openEdit = (c) => {
    setForm({
      ...c,
      price:    c.price?.toString()    || '',
      duration: c.duration?.toString() || '',
    })
    setModal('edit')
  }
  const closeModal = () => { setModal(null); setForm(BLANK_COURSE) }

  const saveCourse = async () => {
    if (!form.title || !form.price) { alert('Title and Price are required.'); return }
    setSaving(true)
    try {
      const payload = {
        ...form,
        price:    parseFloat(form.price)    || 0,
        duration: parseInt(form.duration)   || 0,
      }
      if (modal === 'add') {
        const { data } = await API.post('/admin/course', payload)
        setCourses(c => [data, ...c])
      } else {
        const { data } = await API.put(`/admin/course/${form.id}`, payload)
        setCourses(c => c.map(x => x.id === data.id ? data : x))
      }
      closeModal()
      fetchAll() // refresh stats
    } catch (err) {
      alert('Error saving course: ' + (err.response?.data || err.message))
    } finally {
      setSaving(false)
    }
  }

  const deleteCourse = async (id) => {
    if (!window.confirm('Permanently delete this course?')) return
    setDeleting(id)
    try {
      await API.delete(`/admin/course/${id}`)
      setCourses(c => c.filter(x => x.id !== id))
      fetchAll()
    } catch {
      alert('Delete failed.')
    } finally {
      setDeleting(null)
    }
  }

  /* ── Helpers ── */
  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const filteredCourses  = courses.filter(c =>
    !courseSearch || c.title?.toLowerCase().includes(courseSearch.toLowerCase()) ||
    c.instructor?.toLowerCase().includes(courseSearch.toLowerCase())
  )

  const filteredStudents = students.filter(s =>
    !studentSearch ||
    s.name?.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.email?.toLowerCase().includes(studentSearch.toLowerCase())
  )

  const fmtDate = (dt) => dt ? new Date(dt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'2-digit' }) : '—'
  const fmtAmt  = (a)  => a != null ? `₹${Number(a).toLocaleString('en-IN')}` : '—'

  /* ── Render ── */
  return (
    <div className="ad-page">
      <Navbar />

      <div className="ad-container">

        {/* ── Page header ── */}
        <div className="ad-header">
          <div className="ad-header-left">
            <div className="section-eyebrow">⚙️ Admin Panel</div>
            <h1>Platform <span>Dashboard</span></h1>
            <p>Manage courses, students and payments in one place.</p>
          </div>
          <div className="ad-header-right">
            <div className="admin-chip">
              <div className="admin-chip-avatar">
                {user.name?.[0]?.toUpperCase() ?? 'A'}
              </div>
              {user.name || 'Admin'}
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="ad-tabs">
          {TABS.map(t => (
            <button
              key={t.key}
              className={`ad-tab ${tab === t.key ? 'active' : ''}`}
              onClick={() => setTab(t.key)}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* ═══════════════════ OVERVIEW ═══════════════════ */}
        {tab === 'overview' && (
          <>
            {/* Stats */}
            <div className="ad-stats-grid">
              {[
                { icon:'📚', label:'Total Courses',    val: stats.totalCourses,      accent:'linear-gradient(135deg,#7c3aed,#2563eb)', trend:'+2 this month' },
                { icon:'👥', label:'Total Students',   val: stats.totalStudents,     accent:'linear-gradient(135deg,#10b981,#0891b2)', trend:'+18 this week' },
                { icon:'💳', label:'Total Payments',   val: stats.totalTransactions, accent:'linear-gradient(135deg,#f59e0b,#ef4444)', trend:'All time' },
                { icon:'💰', label:'Revenue (₹)',      val: stats.totalRevenue != null ? Number(stats.totalRevenue).toLocaleString('en-IN') : '—', accent:'linear-gradient(135deg,#f43f5e,#ec4899)', trend:'Total earned' },
              ].map((s, i) => (
                <div key={s.label} className="stat-card fade-up"
                  style={{ '--card-accent': s.accent, animationDelay: `${i*0.07}s` }}>
                  <div className="stat-card-top">
                    <div className="stat-card-icon">{s.icon}</div>
                    <span className="stat-card-trend">{s.trend}</span>
                  </div>
                  <div className="stat-card-num">{loading ? '…' : (s.val ?? '0')}</div>
                  <div className="stat-card-label">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Recent rows */}
            <div className="ad-recent-row">
              {/* Recent payments */}
              <div className="ad-widget">
                <div className="ad-widget-header">
                  <span className="ad-widget-title">💳 Recent Payments</span>
                  <button className="ad-widget-link" onClick={() => setTab('payments')}>View all</button>
                </div>
                <div className="recent-tx-list">
                  {payments.slice(0, 5).map(p => (
                    <div key={p.id} className="recent-tx-item">
                      <div className="tx-avatar">{p.name?.[0]?.toUpperCase() ?? '?'}</div>
                      <div className="tx-info">
                        <div className="tx-name">{p.name || '—'}</div>
                        <div className="tx-course">{p.courseName}</div>
                      </div>
                      <div className="tx-amount">{fmtAmt(p.amount)}</div>
                    </div>
                  ))}
                  {payments.length === 0 && !loading && (
                    <p style={{ padding:'1rem', color:'var(--text-3)', fontSize:'0.85rem', textAlign:'center' }}>
                      No payments yet
                    </p>
                  )}
                </div>
              </div>

              {/* Recent students */}
              <div className="ad-widget">
                <div className="ad-widget-header">
                  <span className="ad-widget-title">👥 Recent Students</span>
                  <button className="ad-widget-link" onClick={() => setTab('students')}>View all</button>
                </div>
                <div className="recent-tx-list">
                  {students.slice(0, 5).map(s => (
                    <div key={s.id} className="recent-tx-item">
                      <div className="tx-avatar"
                        style={{ background: s.role === 'ADMIN' ? 'var(--grad-gold)' : 'var(--grad-purple)' }}>
                        {s.name?.[0]?.toUpperCase() ?? '?'}
                      </div>
                      <div className="tx-info">
                        <div className="tx-name">{s.name}</div>
                        <div className="tx-course">{s.email}</div>
                      </div>
                      <span className={`role-pill role-${s.role?.toLowerCase()}`}>{s.role}</span>
                    </div>
                  ))}
                  {students.length === 0 && !loading && (
                    <p style={{ padding:'1rem', color:'var(--text-3)', fontSize:'0.85rem', textAlign:'center' }}>
                      No students yet
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════ COURSES ═══════════════════ */}
        {tab === 'courses' && (
          <div className="fade-up">
            <div className="tab-section-head">
              <h2 className="tab-section-title">📚 All Courses ({courses.length})</h2>
              <div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap' }}>
                <input
                  className="form-input"
                  style={{ width:220 }}
                  type="text"
                  placeholder="🔍 Search courses…"
                  value={courseSearch}
                  onChange={e => setCourseSearch(e.target.value)}
                />
                <button className="btn-add-course" onClick={openAdd}>
                  ＋ Add Course
                </button>
              </div>
            </div>

            <div className="ad-table-wrap">
              <table className="ad-table">
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Category</th>
                    <th>Instructor</th>
                    <th>Duration</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.map(c => (
                    <tr key={c.id}>
                      <td>
                        <div className="cell-course">
                          <img
                            className="cell-thumb"
                            src={c.imageUrl || `https://picsum.photos/seed/c${c.id}/80/80`}
                            alt={c.title}
                            onError={e => { e.target.src=`https://picsum.photos/seed/c${c.id}/80/80` }}
                          />
                          <div>
                            <strong>{c.title}</strong>
                            <small>{c.description?.slice(0, 50)}…</small>
                          </div>
                        </div>
                      </td>
                      <td><span className="badge badge-purple">{c.category || '—'}</span></td>
                      <td>{c.instructor || '—'}</td>
                      <td>{c.duration ? `${c.duration}h` : '—'}</td>
                      <td className="cell-price">{fmtAmt(c.price)}</td>
                      <td>
                        <div className="tbl-actions">
                          <button className="btn-tbl btn-edit" onClick={() => openEdit(c)}>✏️ Edit</button>
                          <button
                            className="btn-tbl btn-del"
                            onClick={() => deleteCourse(c.id)}
                            disabled={deleting === c.id}
                          >
                            {deleting === c.id ? '…' : '🗑 Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredCourses.length === 0 && (
                    <tr><td colSpan={6} style={{ textAlign:'center', padding:'3rem', color:'var(--text-3)' }}>
                      {loading ? 'Loading…' : 'No courses found'}
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══════════════════ STUDENTS ═══════════════════ */}
        {tab === 'students' && (
          <div className="fade-up">
            <div className="tab-section-head">
              <h2 className="tab-section-title">👥 All Students ({students.length})</h2>
              <input
                className="form-input"
                style={{ width:240 }}
                type="text"
                placeholder="🔍 Search students…"
                value={studentSearch}
                onChange={e => setStudentSearch(e.target.value)}
              />
            </div>

            <div className="ad-table-wrap">
              <table className="ad-table">
                <thead>
                  <tr><th>Student</th><th>Email</th><th>Phone</th><th>Role</th></tr>
                </thead>
                <tbody>
                  {filteredStudents.map(s => (
                    <tr key={s.id}>
                      <td>
                        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                          <div className="tx-avatar" style={{ background: s.role==='ADMIN' ? 'var(--grad-gold)' : 'var(--grad-purple)' }}>
                            {s.name?.[0]?.toUpperCase() ?? '?'}
                          </div>
                          <strong>{s.name}</strong>
                        </div>
                      </td>
                      <td>{s.email}</td>
                      <td>{s.phone || '—'}</td>
                      <td><span className={`role-pill role-${s.role?.toLowerCase()}`}>{s.role}</span></td>
                    </tr>
                  ))}
                  {filteredStudents.length === 0 && (
                    <tr><td colSpan={4} style={{ textAlign:'center', padding:'3rem', color:'var(--text-3)' }}>
                      {loading ? 'Loading…' : 'No students found'}
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══════════════════ PAYMENTS ═══════════════════ */}
        {tab === 'payments' && (
          <div className="fade-up">
            <div className="tab-section-head">
              <h2 className="tab-section-title">💳 Payment History ({payments.length})</h2>
              <div style={{ display:'flex', gap:'0.5rem' }}>
                {['All','PAID','PENDING','FAILED'].map(s => (
                  <span key={s} className={`status-pill status-${s.toLowerCase()} badge`}
                    style={{ cursor:'pointer' }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="ad-table-wrap">
              <table className="ad-table">
                <thead>
                  <tr>
                    <th>Student</th><th>Course</th>
                    <th>Amount</th><th>Status</th>
                    <th>Order ID</th><th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map(p => (
                    <tr key={p.id}>
                      <td>
                        <strong>{p.name || '—'}</strong>
                        <small>{p.email}</small>
                      </td>
                      <td>{p.courseName || '—'}</td>
                      <td className="cell-price">{fmtAmt(p.amount)}</td>
                      <td>
                        <span className={`status-pill status-${p.status?.toLowerCase() || 'pending'}`}>
                          {p.status === 'PAID' ? '✅' : p.status === 'FAILED' ? '❌' : '⏳'} {p.status || 'PENDING'}
                        </span>
                      </td>
                      <td><small style={{ fontFamily:'monospace', color:'var(--text-3)' }}>{p.orderId?.slice(0,20) || '—'}</small></td>
                      <td><small>{fmtDate(p.createdAt)}</small></td>
                    </tr>
                  ))}
                  {payments.length === 0 && (
                    <tr><td colSpan={6} style={{ textAlign:'center', padding:'3rem', color:'var(--text-3)' }}>
                      {loading ? 'Loading…' : 'No payments yet'}
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ═══════════════════ COURSE MODAL ═══════════════════ */}
      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="ad-modal">
            <button className="ad-modal-close" onClick={closeModal}>✕</button>
            <h2 className="ad-modal-title">
              {modal === 'add' ? '➕ Add New Course' : '✏️ Edit Course'}
            </h2>

            <div className="ad-modal-grid">
              {[
                { key:'title',      label:'Course Title *',     ph:'e.g. React & Spring Boot Masterclass', full:true },
                { key:'instructor', label:'Instructor Name',    ph:'e.g. Rahul Verma' },
                { key:'category',   label:'Category',           ph:'e.g. Web Development' },
                { key:'price',      label:'Price (₹) *',        ph:'e.g. 4999',  type:'number' },
                { key:'duration',   label:'Duration (hours)',   ph:'e.g. 40',    type:'number' },
                { key:'imageUrl',   label:'Thumbnail Image URL',ph:'https://…',  full:true },
                { key:'videoUrl',   label:'Video Embed URL',    ph:'https://youtube.com/embed/…', full:true },
              ].map(f => (
                <div key={f.key} className={`ad-modal-field ${f.full ? 'full' : ''}`}>
                  <label>{f.label}</label>
                  <input
                    type={f.type || 'text'}
                    placeholder={f.ph}
                    value={form[f.key] || ''}
                    onChange={set(f.key)}
                    min={f.type === 'number' ? 0 : undefined}
                  />
                </div>
              ))}
              <div className="ad-modal-field full">
                <label>Description</label>
                <textarea
                  rows={3}
                  placeholder="Write a compelling course description…"
                  value={form.description || ''}
                  onChange={set('description')}
                />
              </div>
            </div>

            <button
              className="btn-primary"
              style={{ width:'100%', justifyContent:'center', padding:'14px' }}
              onClick={saveCourse}
              disabled={saving}
            >
              {saving
                ? <><span className="spinner" /> Saving…</>
                : modal === 'add' ? '✅ Add Course' : '💾 Save Changes'
              }
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
