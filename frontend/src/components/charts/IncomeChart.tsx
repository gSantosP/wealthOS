import {
  Chart as ChartJS,
  CategoryScale, LinearScale,
  PointElement, LineElement,
  Filler, Tooltip, Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import type { MonthlySnapshot } from '../../types'

ChartJS.register(
  CategoryScale, LinearScale,
  PointElement, LineElement,
  Filler, Tooltip, Legend
)

interface IncomeChartProps {
  data: MonthlySnapshot[]
}

export function IncomeChart({ data }: IncomeChartProps) {
  const labels   = data.map(d => d.month)
  const income   = data.map(d => d.income)
  const expenses = data.map(d => d.expenses)

  return (
    <div className="col-span-2 rounded-2xl border p-6"
         style={{ background: 'rgba(255,255,255,0.035)', borderColor: 'rgba(255,255,255,0.07)' }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-zinc-100">Income vs Expenses</h3>
          <p className="text-xs text-zinc-500 mt-0.5">Last {data.length} months</p>
        </div>
        <div className="flex gap-4">
          {[
            { label: 'Income',   color: '#10b981' },
            { label: 'Expenses', color: '#f43f5e' },
          ].map(({ label, color }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 rounded" style={{ background: color }} />
              <span className="text-xs text-zinc-400">{label}</span>
            </div>
          ))}
        </div>
      </div>
      <Line
        data={{
          labels,
          datasets: [
            {
              label:           'Income',
              data:            income,
              borderColor:     '#10b981',
              backgroundColor: 'rgba(16,185,129,0.12)',
              borderWidth:     2,
              fill:            true,
              tension:         0.4,
              pointRadius:     3,
              pointBackgroundColor: '#10b981',
              pointBorderColor:    '#07080d',
              pointBorderWidth:    2,
            },
            {
              label:           'Expenses',
              data:            expenses,
              borderColor:     '#f43f5e',
              backgroundColor: 'rgba(244,63,94,0.1)',
              borderWidth:     2,
              fill:            true,
              tension:         0.4,
              pointRadius:     3,
              pointBackgroundColor: '#f43f5e',
              pointBorderColor:    '#07080d',
              pointBorderWidth:    2,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#10131e',
              borderColor:     'rgba(255,255,255,0.1)',
              borderWidth:     1,
              padding:         10,
              callbacks: {
                label: ctx => `  ${ctx.dataset.label}: $${(ctx.parsed.y ?? 0).toLocaleString()}`,
              },
            },
          },
          scales: {
            x: {
              grid:  { color: 'rgba(255,255,255,0.04)' },
              ticks: { color: '#5a6278', font: { size: 11 } },
            },
            y: {
              grid:  { color: 'rgba(255,255,255,0.04)' },
              ticks: {
                color: '#5a6278',
                font:  { size: 11 },
                callback: v => `$${(Number(v) / 1000).toFixed(0)}k`,
              },
            },
          },
          animation: { duration: 1000, easing: 'easeInOutQuart' },
        }}
        style={{ maxHeight: 220 }}
      />
    </div>
  )
}
