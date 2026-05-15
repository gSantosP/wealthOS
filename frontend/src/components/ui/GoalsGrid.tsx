import { useEffect, useRef } from 'react'
import type { SavingsGoal } from '../../types'

interface GoalsGridProps {
  goals: SavingsGoal[]
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#06b6d4']

export function GoalsGrid({ goals }: GoalsGridProps) {
  const fillsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    const t = setTimeout(() => {
      fillsRef.current.forEach((el, i) => {
        if (!el || !goals[i]) return
        const pct = Math.min((goals[i].current / goals[i].target) * 100, 100)
        el.style.width = pct + '%'
      })
    }, 300)
    return () => clearTimeout(t)
  }, [goals])

  return (
    <div className="rounded-2xl border p-6"
         style={{ background: 'rgba(255,255,255,0.035)', borderColor: 'rgba(255,255,255,0.07)' }}>
      <h3 className="text-sm font-semibold text-zinc-100 mb-0.5">Savings Goals</h3>
      <p className="text-xs text-zinc-500 mb-4">{goals.length} active goals</p>

      <div className="grid grid-cols-2 gap-2">
        {goals.map((g, i) => {
          const pct = Math.min(Math.round((g.current / g.target) * 100), 100)
          const color = COLORS[i % COLORS.length]
          return (
            <div key={g.id}
                 className="rounded-xl border p-3 hover:border-white/10 transition-colors"
                 style={{ background: 'rgba(0,0,0,0.18)', borderColor: 'rgba(255,255,255,0.07)' }}>
              <p className="text-lg mb-1">{g.emoji}</p>
              <p className="text-[11px] text-zinc-400 mb-0.5">{g.name}</p>
              <p className="font-mono text-base font-semibold" style={{ color }}>{pct}%</p>
              <div className="h-0.5 rounded-full mt-2 overflow-hidden"
                   style={{ background: 'rgba(255,255,255,0.07)' }}>
                <div
                  ref={el => { if (el) fillsRef.current[i] = el }}
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: '0%', background: color }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
