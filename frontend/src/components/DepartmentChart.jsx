import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function DepartmentChart({
  data = [],
  metric = 'avg_performance_score',
  label = 'Avg Performance (%)',
  color = 'rgba(99,102,241,0.75)',
}) {
  if (!data || data.length === 0) {
    return (
      <div className="empty-state" style={{ padding: '2rem' }}>
        <div className="empty-icon">📊</div>
        <p>No data available yet.</p>
      </div>
    )
  }

  const chartData = {
    labels: data.map(d => d.department),
    datasets: [
      {
        label,
        data: data.map(d => d[metric]),
        backgroundColor: color,
        borderColor: color.replace('0.75', '1'),
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#f1f5f9',
        bodyColor: '#94a3b8',
        borderColor: '#334155',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#94a3b8',
          font: { size: 10 },
          maxRotation: 30,
        },
        grid: { color: 'rgba(51,65,85,0.4)' },
      },
      y: {
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(51,65,85,0.4)' },
      },
    },
  }

  return <Bar data={chartData} options={options} />
}
