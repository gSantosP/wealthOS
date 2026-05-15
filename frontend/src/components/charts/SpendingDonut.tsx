import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import type { SpendingByCategory } from '../../types'

ChartJS.register(ArcElement, Tooltip)

interface SpendingDonutProps {
  data:  SpendingByCategory[]
  total: number
}

export function SpendingDonut({ data, total }: SpendingDonutProps) {
  return (
    <div className="rounded-2xl border p-6"
         style={{ background: 'rgba(255,255,255,0.035)', borderColor: 'rgba(255,255,255,0.07)' }}>
      <h3 className="text-sm font-semibold text-zinc-100 mb-1">Spending</h3>
      <p className="text-xs text-zinc-500 mb-4">By category · this month</p>

      <div className="relative flex items-center justify-center" style={{ height: 180 }}>
        <Doughnut
          data={{
            labels:   data.map(d => d.category),
            datasets: [{
              data:            data.map(d => d.amount),
              backgroundColor: data.map(d => d.color),
              borderColor:     '#07080d',
              borderWidth:     3,
              hoverOffset:     6,
            }],
          }}
          options={{
            responsive:         true,
            maintainAspectRatio: false,
            cutout:             '72%',
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: '#10131e',
                borderColor:     'rgba(255,255,255,0.1)',
                borderWidth:     1,
                padding:         10,
                callbacks: {
                  label: ctx => `  $${ctx.parsed.toLocaleString()} (${Math.round(ctx.parsed / total * 100)}%)`,
                },
              },
            },
            animation: { animateRotate: true, duration: 1000 },
          }}
        />
        <div className="absolute text-center pointer-events-none">
          <p className="font-mono text-lg font-semibold text-zinc-100">
            ${total.toLocaleString()}
          </p>
          <p className="text-xs text-zinc-500">total spent</p>
        </div>
      </div>

      <div className="mt-4 space-y-2.5">
        {data.map(d => (
          <div key={d.category} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
              <span className="text-xs text-zinc-400">{d.category}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-medium text-zinc-200">
                ${d.amount.toLocaleString()}
              </span>
              <span className="text-xs text-zinc-600">
                {Math.round(d.amount / total * 100)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
