import React, { useEffect, useState, useCallback } from 'react'
import api from '../api/axios'
import FacultyTable from '../components/FacultyTable'
import FacultyForm from '../components/FacultyForm'

export default function FacultyManagement() {
  const [faculty, setFaculty] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [message, setMessage] = useState('')

  const fetchFaculty = useCallback(async (q = '') => {
    setLoading(true)
    try {
      const res = await api.get('/faculty/', { params: q ? { search: q } : {} })
      // Handle both paginated and non-paginated responses
      const data = res.data?.results ?? res.data
      setFaculty(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFaculty()
  }, [fetchFaculty])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => fetchFaculty(search), 400)
    return () => clearTimeout(timer)
  }, [search, fetchFaculty])

  const handleAdd = () => {
    setEditTarget(null)
    setShowModal(true)
  }

  const handleEdit = (item) => {
    setEditTarget(item)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this faculty member?')) return
    try {
      await api.delete(`/faculty/${id}/`)
      setMessage('Faculty deleted successfully.')
      fetchFaculty(search)
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      console.error(err)
    }
  }

  const handleSave = async (formData) => {
    try {
      if (editTarget) {
        await api.put(`/faculty/${editTarget.id}/`, formData)
        setMessage('Faculty updated successfully.')
      } else {
        await api.post('/faculty/', formData)
        setMessage('Faculty added successfully.')
      }
      setShowModal(false)
      fetchFaculty(search)
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      throw err
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Faculty Management</h1>
          <p className="page-subtitle">Add, edit, and manage faculty records</p>
        </div>
        <button id="add-faculty-btn" className="btn btn-primary" onClick={handleAdd}>
          ＋ Add Faculty
        </button>
      </div>

      {message && <div className="alert alert-success">{message}</div>}

      <div className="card">
        <div className="toolbar">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              id="faculty-search"
              className="form-input"
              type="text"
              placeholder="Search by name, department, or subject…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            {faculty.length} record{faculty.length !== 1 ? 's' : ''}
          </span>
        </div>

        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : (
          <FacultyTable
            faculty={faculty}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      {showModal && (
        <FacultyForm
          initialData={editTarget}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}
