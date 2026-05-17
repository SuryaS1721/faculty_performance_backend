import React, { useState } from 'react'

const DEPARTMENTS = [
  'Computer Science', 'Electronics', 'Mechanical',
  'Civil', 'Mathematics', 'Physics', 'Chemistry', 'Management', 'Other',
]

const EMPTY_FORM = {
  name: '',
  department: 'Computer Science',
  subject: '',
  feedback_score: '',
  performance_score: '',
  attendance_percentage: '',
}

export default function FacultyForm({ initialData, onSave, onClose }) {
  const [form, setForm] = useState(initialData
    ? {
        name: initialData.name,
        department: initialData.department,
        subject: initialData.subject,
        feedback_score: initialData.feedback_score,
        performance_score: initialData.performance_score,
        attendance_percentage: initialData.attendance_percentage,
      }
    : EMPTY_FORM
  )
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const validate = () => {
    if (!form.name.trim()) return 'Name is required.'
    if (!form.subject.trim()) return 'Subject is required.'
    const fb = parseFloat(form.feedback_score)
    if (isNaN(fb) || fb < 0 || fb > 10) return 'Feedback score must be 0–10.'
    const ps = parseFloat(form.performance_score)
    if (isNaN(ps) || ps < 0 || ps > 100) return 'Performance score must be 0–100.'
    const att = parseFloat(form.attendance_percentage)
    if (isNaN(att) || att < 0 || att > 100) return 'Attendance must be 0–100.'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }
    setError('')
    setSaving(true)
    try {
      await onSave({
        ...form,
        feedback_score: parseFloat(form.feedback_score),
        performance_score: parseFloat(form.performance_score),
        attendance_percentage: parseFloat(form.attendance_percentage),
      })
    } catch (apiErr) {
      const data = apiErr.response?.data
      const msg = data
        ? Object.values(data).flat().join(' ')
        : 'Failed to save. Please try again.'
      setError(msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{initialData ? '✏️ Edit Faculty' : '➕ Add Faculty'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} id="faculty-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="f-name">Full Name *</label>
              <input id="f-name" className="form-input" name="name" value={form.name}
                onChange={handleChange} placeholder="e.g. Dr. Jane Doe" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="f-dept">Department *</label>
              <select id="f-dept" className="form-select" name="department"
                value={form.department} onChange={handleChange}>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="f-subject">Subject *</label>
            <input id="f-subject" className="form-input" name="subject" value={form.subject}
              onChange={handleChange} placeholder="e.g. Data Structures" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="f-feedback">Feedback Score (0–10) *</label>
              <input id="f-feedback" className="form-input" type="number" name="feedback_score"
                value={form.feedback_score} onChange={handleChange}
                min="0" max="10" step="0.1" placeholder="e.g. 8.5" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="f-performance">Performance Score (0–100) *</label>
              <input id="f-performance" className="form-input" type="number" name="performance_score"
                value={form.performance_score} onChange={handleChange}
                min="0" max="100" step="0.1" placeholder="e.g. 85.0" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="f-attendance">Attendance % (0–100) *</label>
            <input id="f-attendance" className="form-input" type="number" name="attendance_percentage"
              value={form.attendance_percentage} onChange={handleChange}
              min="0" max="100" step="0.1" placeholder="e.g. 95.0" />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" id="save-faculty-btn" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : (initialData ? '💾 Update' : '➕ Add Faculty')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
