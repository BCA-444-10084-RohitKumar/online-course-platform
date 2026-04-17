import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import UserDashboard from './pages/UserDashboard.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'

// Protected route — redirects if no valid session or wrong role
function PrivateRoute({ children, role }) {
  const raw = localStorage.getItem('user')
  const user = raw ? JSON.parse(raw) : null

  if (!user || !user.token) return <Navigate to="/login" replace />
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} replace />
  }
  return children 
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/register"  element={<Register />} />

        <Route path="/dashboard" element={
          <PrivateRoute role="USER">
            <UserDashboard />
          </PrivateRoute>
        } />

        <Route path="/admin" element={
          <PrivateRoute role="ADMIN">
            <AdminDashboard />
          </PrivateRoute>
        } />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}
