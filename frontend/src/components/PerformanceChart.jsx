import React from 'react'
import {
  Chart as ChartJS,
  ArcElement, Tooltip, Legend,
} from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

const COLORS = [
  'rgba(99,102,241,0.8)',
  'rgba(16,185,129,0.8)',
  'rgba(245,158,11,0.8)',
  'rgba(239,68,68,0.8)',
  'rgba(59,130,246,0.8)',
  'rgba(168,85,247,0.8)',
  'rgba(236,72,153,0.8)',
  'rgba(20,184,166,0.8)',
  'rgba(251,146,60,0.8)',
]

export default function PerformanceChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="empty-state" style={{ padding: '2rem' }}>
        <div className="empty-icon">🎯</div>
        <p>No data available yet.</p>
      </div>
    )
  }

  const chartData = {
    labels: data.map(d => d.department),
    datasets: [
      {
        label: 'Faculty Count',
        data: data.map(d => d.faculty_count),
        backgroundColor: COLORS.slice(0, data.length),
        borderColor: '#0f172a',
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  }

  const options = {
    responsive: true,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#94a3b8',
          padding: 12,
          font: { size: 11 },
          boxWidth: 12,
          boxHeight: 12,
        },
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#f1f5f9',
        bodyColor: '#94a3b8',
        borderColor: '#334155',
        borderWidth: 1,
        callbacks: {
          label: (ctx) => ` ${ctx.label}: ${ctx.parsed} faculty`,
        },
      },
    },
  }

  return <Doughnut data={chartData} options={options} />
}
