import React, { useEffect, useState } from 'react'
import api from '../api/axios'
import DepartmentChart from '../components/DepartmentChart'
import PerformanceChart from '../components/PerformanceChart'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [deptData, setDeptData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, deptRes] = await Promise.all([
          api.get('/faculty/stats/'),
          api.get('/faculty/department_analysis/'),
        ])
        setStats(statsRes.data)
        setDeptData(deptRes.data)
      } catch (err) {
        console.error('Dashboard fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="spinner-wrap">
        <div className="spinner" />
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview of faculty performance metrics</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon purple">👥</div>
          <div className="stat-info">
            <div className="stat-value" style={{ color: '#a5b4fc' }}>{stats?.total_faculty ?? 0}</div>
            <div className="stat-label">Total Faculty</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">⭐</div>
          <div className="stat-info">
            <div className="stat-value" style={{ color: '#6ee7b7' }}>{stats?.avg_feedback_score ?? 0}</div>
            <div className="stat-label">Avg Feedback Score</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">📊</div>
          <div className="stat-info">
            <div className="stat-value" style={{ color: '#93c5fd' }}>{stats?.avg_performance_score ?? 0}%</div>
            <div className="stat-label">Avg Performance</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon amber">✅</div>
          <div className="stat-info">
            <div className="stat-value" style={{ color: '#fcd34d' }}>{stats?.avg_attendance_percentage ?? 0}%</div>
            <div className="stat-label">Avg Attendance</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">🏛️</div>
          <div className="stat-info">
            <div className="stat-value" style={{ color: '#a5b4fc' }}>{stats?.departments_count ?? 0}</div>
            <div className="stat-label">Departments</div>
          </div>
        </div>
      </div>

      {/* Top Performer */}
      {stats?.top_performer && (
        <div className="top-performer-card">
          <span className="trophy">🏆</span>
          <div className="info">
            <strong>Top Performer: {stats.top_performer.name}</strong>
            <p>{stats.top_performer.department} — Score: {stats.top_performer.performance_score}%</p>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-title">📊 Avg Performance by Department</div>
          <DepartmentChart data={deptData} />
        </div>
        <div className="chart-card">
          <div className="chart-title">🎯 Score Distribution</div>
          <PerformanceChart data={deptData} />
        </div>
      </div>
    </div>
  )
}
