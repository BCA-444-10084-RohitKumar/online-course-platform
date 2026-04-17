import '../styles/CourseCard.css'

const RATINGS = { 1: 4.9, 2: 4.8, 3: 4.7, 4: 4.9, 5: 4.6, 6: 4.8 }
const STUDENTS = { 1: '2.4k', 2: '1.8k', 3: '3.1k', 4: '4.2k', 5: '980', 6: '1.5k' }

function Stars({ rating }) {
  const full  = Math.floor(rating)
  const empty = 5 - full
  return (
    <div className="card-stars">
      {[...Array(full)].map((_, i) => <span key={i} className="star">★</span>)}
      {[...Array(empty)].map((_, i) => <span key={i} className="star-empty">★</span>)}
      <span className="stars-count">{rating} ({STUDENTS[1] || '1k'}+)</span>
    </div>
  )
}

export default function CourseCard({ course, onBuy, enrolled = false, delay = 0 }) {
  const rating = RATINGS[course.id] ?? 4.7
  const fallbackImg = `https://picsum.photos/seed/course${course.id}/600/340`

  return (
    <div className="course-card fade-up" style={{ animationDelay: `${delay}s` }}>
      {/* Thumbnail */}
      <div className="card-thumb">
        <img
          src={course.imageUrl || fallbackImg}
          alt={course.title}
          onError={e => { e.target.src = fallbackImg }}
        />
        <span className="card-category">{course.category || 'Course'}</span>
        <span className="card-bookmark">🔖</span>
      </div>

      {/* Body */}
      <div className="card-body">
        <h3 className="card-title">{course.title}</h3>
        <p className="card-desc">{course.description}</p>

        <div className="card-meta">
          <span className="card-meta-item">
            <span className="card-meta-icon">👨‍🏫</span>
            {course.instructor || 'Expert Instructor'}
          </span>
          <span className="card-meta-item">
            <span className="card-meta-icon">⏱</span>
            {course.duration || 20}h
          </span>
          <span className="card-meta-item">
            <span className="card-meta-icon">📹</span>
            HD Video
          </span>
        </div>

        <Stars rating={rating} />

        {/* Footer */}
        <div className="card-footer">
          <div className="card-price-wrap">
            <span className="card-price-label">Price</span>
            <div className="card-price">
              <span className="price-sym">₹</span>
              <span className="price-val">{course.price?.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {enrolled ? (
            <div className="btn-enrolled">
              ✅ Enrolled
            </div>
          ) : (
            <button className="btn-buy" onClick={onBuy}>
              Buy Now
              <span className="btn-buy-arrow">→</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
