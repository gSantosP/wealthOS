import { useEffect, useRef } from 'react'
import type { Budget } from '../../types'

interface BudgetTrackerProps {
  budgets: Budget[]
}

export function BudgetTracker({ budgets }: BudgetTrackerProps) {
  const fillsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    const timer = setTimeout(() => {
      fillsRef.current.forEach((el, i) => {
        if (!el || !budgets[i]) return
        const pct = Math.min((budgets[i].spent / budgets[i].limit) * 100, 100)
        el.style.width = pct + '%'
      })
    }, 300)
    return () => clearTimeout(timer)
  }, [budgets])

  function barColor(pct: number) {
    if (pct >= 100) return '#f43f5e'
    if (pct >= 85)  return '#f59e0b'
    return '#6366f1'
  }

  return (
    <div className="rounded-2xl border p-6"
         style={{ background: 'rgba(255,255,255,0.035)', borderColor: 'rgba(255,255,255,0.07)' }}>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-zinc-100">Budget Tracker</h3>
        <button className="text-xs text-indigo-400 hover:opacity-70 transition-opacity">
          Edit →
        </button>
      </div>

      <div className="space-y-4">
        {budgets.map((b, i) => {
          const pct  = (b.spent / b.limit) * 100
          const over = b.spent > b.limit
          const color = barColor(pct)

          return (
            <div key={b.id}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-sm text-zinc-200">
                  {b.emoji} {b.category}
                </span>
                <span className={`font-mono text-xs font-medium ${
                  over ? 'text-red-400' : 'text-zinc-400'
                }`}>
                  ${b.spent.toLocaleString()} / ${b.limit.toLocaleString()}
                </span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden"
                   style={{ background: 'rgba(255,255,255,0.07)' }}>
                <div
                  ref={el => { if (el) fillsRef.current[i] = el }}
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: '0%', background: color }}
                />
              </div>
              <p className="text-xs mt-1.5"
                 style={{ color: over ? '#f43f5e' : '#5a6278' }}>
                {over
                  ? `Over budget by $${(b.spent - b.limit).toFixed(0)}`
                  : `$${(b.limit - b.spent).toFixed(0)} remaining · ${pct.toFixed(0)}% used`}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
