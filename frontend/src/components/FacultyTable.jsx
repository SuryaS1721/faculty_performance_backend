import React from 'react'

const GRADE_CLASS = {
  'A+': 'badge-a-plus',
  'A': 'badge-a',
  'B': 'badge-b',
  'C': 'badge-c',
  'D': 'badge-d',
}

function ScoreBar({ value, max, color }) {
  const pct = Math.round((value / max) * 100)
  return (
    <div className="score-bar-wrap">
      <div className="score-bar">
        <div className="score-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="score-val">{value}</span>
    </div>
  )
}

export default function FacultyTable({ faculty, onEdit, onDelete }) {
  if (!faculty || faculty.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">👥</div>
        <p>No faculty records found. Click <strong>"＋ Add Faculty"</strong> to get started.</p>
      </div>
    )
  }

  return (
    <div className="table-wrapper">
      <table id="faculty-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Department</th>
            <th>Subject</th>
            <th>Feedback (0–10)</th>
            <th>Performance (%)</th>
            <th>Attendance (%)</th>
            <th>Grade</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {faculty.map((f, idx) => (
            <tr key={f.id}>
              <td style={{ color: 'var(--text-muted)' }}>{idx + 1}</td>
              <td><strong>{f.name}</strong></td>
              <td>
                <span style={{
                  background: 'rgba(99,102,241,0.1)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '1rem',
                  fontSize: '0.8rem',
                }}>
                  {f.department}
                </span>
              </td>
              <td>{f.subject}</td>
              <td>
                <ScoreBar value={f.feedback_score} max={10} color="#10b981" />
              </td>
              <td>
                <ScoreBar value={f.performance_score} max={100} color="#6366f1" />
              </td>
              <td>
                <ScoreBar value={f.attendance_percentage} max={100} color="#f59e0b" />
              </td>
              <td>
                <span className={`badge ${GRADE_CLASS[f.performance_grade] || 'badge-d'}`}>
                  {f.performance_grade}
                </span>
              </td>
              <td>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => onEdit(f)}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => onDelete(f.id)}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
