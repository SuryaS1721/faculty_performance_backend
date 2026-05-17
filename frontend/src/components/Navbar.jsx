import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">
        <div className="brand-icon">🎓</div>
        <span>FacultyIQ</span>
      </NavLink>

      <div className="navbar-links">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
        >
          📊 Dashboard
        </NavLink>
        <NavLink
          to="/faculty"
          className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
        >
          👥 Faculty
        </NavLink>
        <NavLink
          to="/reports"
          className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
        >
          📈 Reports
        </NavLink>
      </div>

      <div className="navbar-user">
        <div className="user-badge">
          <span>👤</span>
          <span>{user?.username || 'Admin'}</span>
        </div>
        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  )
}
