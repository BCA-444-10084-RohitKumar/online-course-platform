import { useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../api/axios.js'
import '../styles/PaymentModal.css'

export default function PaymentModal({ course, onClose, onSuccess }) {
  const raw  = localStorage.getItem('user')
  const user = raw ? JSON.parse(raw) : null

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    name:  user?.name  || '',
    email: user?.email || '',
    phone: '',
  })

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handlePay = async () => {
    if (!form.name || !form.email || !form.phone) {
      alert('Please fill in all fields.')
      return
    }
    if (form.phone.replace(/\D/g, '').length < 10) {
      alert('Please enter a valid 10-digit phone number.')
      return
    }

    setLoading(true)
    try {
      // 1. Create order on backend
      const { data: orderJson } = await API.post('/payment/create-order', {
        name:       form.name,
        email:      form.email,
        phone:      form.phone,
        courseName: course.title,
        amount:     course.price,
        courseId:   course.id,
        userId:     user?.id ?? null,
      })

      // FIX: orderJson is already a string (backend returns rzpOrder.toString())
      // parse it safely
      const order = typeof orderJson === 'string' ? JSON.parse(orderJson) : orderJson

      // FIX: VITE_RAZORPAY_KEY now loads correctly after renaming .evn → .env
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY
      if (!razorpayKey) {
        alert('Razorpay key is missing. Check your .env file.')
        setLoading(false)
        return
      }

      // 2. Open Razorpay checkout
      const options = {
        key:         razorpayKey,
        amount:      order.amount,
        currency:    'INR',
        name:        'EduVerse',
        description: course.title,
        image:       'https://i.ibb.co/XsZKjYk/eduverse-logo.png',
        order_id:    order.id,

        handler: async (response) => {
          try {
            await API.post('/payment/update-order', null, {
              params: {
                paymentId: response.razorpay_payment_id,
                orderId:   response.razorpay_order_id,
                status:    'PAID',
              },
            })
            setSuccess(true)
            if (onSuccess) onSuccess()
          } catch {
            alert('Payment recorded but enrollment failed. Contact support.')
          }
        },

        prefill: {
          name:    form.name,
          email:   form.email,
          contact: form.phone,
        },

        notes: { courseId: course.id },

        theme: { color: '#f59e0b' },

        modal: {
          ondismiss: () => setLoading(false),
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', (res) => {
        API.post('/payment/update-order', null, {
          params: {
            paymentId: res.error.metadata?.payment_id || '',
            orderId:   order.id,
            status:    'FAILED',
          },
        }).catch(() => {})
        alert('Payment failed: ' + res.error.description)
        setLoading(false)
      })
      rzp.open()

    } catch (err) {
      // FIX: Show the actual server error message instead of a generic one.
      // This makes it much easier to debug what went wrong.
      const serverMsg = err.response?.data?.message || err.response?.data || err.message
      console.error('Order creation failed:', serverMsg, err)
      alert('Could not create order: ' + (serverMsg || 'Please try again.'))
      setLoading(false)
    }
  }

  // Close on backdrop click
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="modal-overlay" onClick={handleBackdrop}>
      <div className="pay-modal" role="dialog" aria-modal="true">

        {/* ── Close ── */}
        <button className="pay-close" onClick={onClose} aria-label="Close">✕</button>

        {/* ── Success State ── */}
        {success ? (
          <div className="pay-success">
            <div className="pay-success-icon">🎉</div>
            <h3>Payment Successful!</h3>
            <p style={{ marginBottom: '1.5rem' }}>
              You now have full access to <strong>{course.title}</strong>.<br />
              A confirmation email has been sent to {form.email}.
            </p>
            <Link to="/dashboard" className="btn-primary" style={{ textDecoration:'none' }}>
              Go to My Courses →
            </Link>
          </div>
        ) : !user ? (
          /* ── Not logged in ── */
          <>
            <div className="pay-modal-header">
              <h2 className="pay-modal-title">Ready to Enroll?</h2>
              <p className="pay-modal-sub">Please sign in to purchase this course.</p>
            </div>
            <div className="pay-login-prompt">
              <p>You need an account to purchase courses and track your progress.</p>
              <Link to="/login" onClick={onClose}>Sign In to Continue →</Link>
            </div>
          </>
        ) : (
          /* ── Payment form ── */
          <>
            <div className="pay-modal-header">
              <h2 className="pay-modal-title">Complete Purchase</h2>
              <p className="pay-modal-sub">You're one step away from full access!</p>
            </div>

            {/* Course strip */}
            <div className="pay-course-strip">
              <img
                className="pay-course-img"
                src={course.imageUrl || `https://picsum.photos/seed/c${course.id}/120/120`}
                alt={course.title}
              />
              <div className="pay-course-info">
                <div className="pay-course-name">{course.title}</div>
                <div className="pay-course-meta">by {course.instructor || 'Expert Instructor'}</div>
              </div>
              <div className="pay-course-price">
                ₹{course.price?.toLocaleString('en-IN')}
              </div>
            </div>

            {/* Form */}
            <div className="pay-form">
              <div className="pay-form-row">
                <div className="pay-field">
                  <label>Full Name</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={set('name')}
                  />
                </div>
                <div className="pay-field">
                  <label>Phone</label>
                  <input
                    className="form-input"
                    type="tel"
                    placeholder="9876543210"
                    value={form.phone}
                    onChange={set('phone')}
                    maxLength={10}
                  />
                </div>
              </div>
              <div className="pay-field">
                <label>Email Address</label>
                <input
                  className="form-input"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={set('email')}
                />
              </div>

              {/* What you get */}
              <div style={{
                background: 'var(--bg-card-hover)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-sm)',
                padding: '0.9rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
              }}>
                {['Lifetime access to all course content',
                  'HD video lectures & downloadable resources',
                  'Certificate of completion',
                  'Access on mobile & desktop',
                ].map((item) => (
                  <div key={item} style={{ fontSize: '0.83rem', color: 'var(--text-2)', display: 'flex', gap: '8px' }}>
                    <span style={{ color: 'var(--emerald)' }}>✓</span> {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Pay button */}
            <div className="pay-submit-wrap">
              <button className="pay-btn" onClick={handlePay} disabled={loading}>
                {loading
                  ? <><span className="spinner" /> Processing…</>
                  : <>🔒 Pay ₹{course.price?.toLocaleString('en-IN')} Securely</>
                }
              </button>
            </div>

            <p className="pay-lock">
              🔐 Secured by Razorpay &nbsp;·&nbsp; SSL Encrypted &nbsp;·&nbsp; Safe Checkout
            </p>
          </>
        )}
      </div>
    </div>
  )
}
