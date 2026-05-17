import React, { useEffect, useState } from 'react'
import api from '../api/axios'
import DepartmentChart from '../components/DepartmentChart'
import PerformanceChart from '../components/PerformanceChart'

export default function Reports() {
  const [deptData, setDeptData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/faculty/department_analysis/')
      .then(res => setDeptData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="spinner-wrap"><div className="spinner" /></div>
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Performance Reports</h1>
          <p className="page-subtitle">Department-wise analysis and performance distribution</p>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-title">📊 Avg Performance Score by Department</div>
          <DepartmentChart data={deptData} metric="avg_performance_score" label="Avg Performance (%)" />
        </div>
        <div className="chart-card">
          <div className="chart-title">⭐ Avg Feedback Score by Department</div>
          <DepartmentChart data={deptData} metric="avg_feedback_score" label="Avg Feedback (0–10)" color="rgba(16,185,129,0.7)" />
        </div>
        <div className="chart-card">
          <div className="chart-title">✅ Avg Attendance by Department</div>
          <DepartmentChart data={deptData} metric="avg_attendance_percentage" label="Avg Attendance (%)" color="rgba(245,158,11,0.7)" />
        </div>
        <div className="chart-card">
          <div className="chart-title">🎯 Faculty Count by Department</div>
          <PerformanceChart data={deptData} />
        </div>
      </div>

      {/* Department Analysis Table */}
      <div className="card dept-table-card">
        <div className="card-title">📋 Department-wise Summary</div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Department</th>
                <th>Faculty Count</th>
                <th>Avg Feedback</th>
                <th>Avg Performance</th>
                <th>Avg Attendance</th>
                <th>Best Score</th>
                <th>Lowest Score</th>
              </tr>
            </thead>
            <tbody>
              {deptData.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="empty-state">
                      <div className="empty-icon">📭</div>
                      <p>No department data available yet.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                deptData.map((dept) => (
                  <tr key={dept.department}>
                    <td><strong>{dept.department}</strong></td>
                    <td>{dept.faculty_count}</td>
                    <td>
                      <ScoreBar value={dept.avg_feedback_score} max={10} color="#10b981" />
                    </td>
                    <td>
                      <ScoreBar value={dept.avg_performance_score} max={100} color="#6366f1" />
                    </td>
                    <td>
                      <ScoreBar value={dept.avg_attendance_percentage} max={100} color="#f59e0b" />
                    </td>
                    <td style={{ color: '#6ee7b7', fontWeight: 600 }}>{dept.max_performance_score}%</td>
                    <td style={{ color: '#fca5a5', fontWeight: 600 }}>{dept.min_performance_score}%</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function ScoreBar({ value, max, color }) {
  const pct = Math.round((value / max) * 100)
  return (
    <div className="score-bar-wrap">
      <div className="score-bar">
        <div
          className="score-bar-fill"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="score-val">{value}</span>
    </div>
  )
}
