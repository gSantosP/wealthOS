import { useEffect, useRef, useState } from 'react'
import { useWealthStore } from '../hooks/useWealthStore'
import type { Budget } from '../types'

function barColor(pct: number): string {
  if (pct >= 100) return '#f43f5e'
  if (pct >= 85)  return '#f59e0b'
  return '#6366f1'
}

function BudgetRow({ budget, onEdit }: { budget: Budget; onEdit: (id: string, limit: number) => void }) {
  const fillRef = useRef<HTMLDivElement>(null)
  const pct     = (budget.spent / budget.limit) * 100
  const over    = budget.spent > budget.limit
  const color   = barColor(pct)

  const [editing,  setEditing]  = useState(false)
  const [newLimit, setNewLimit] = useState(budget.limit.toString())

  useEffect(() => {
    const t = setTimeout(() => {
      if (fillRef.current) fillRef.current.style.width = Math.min(pct, 100) + '%'
    }, 200)
    return () => clearTimeout(t)
  }, [pct])

  function handleSave() {
    const val = parseFloat(newLimit)
    if (!isNaN(val) && val > 0) onEdit(budget.id, val)
    setEditing(false)
  }

  return (
    <div className="rounded-2xl border p-5 hover:border-white/10 transition-colors"
         style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.07)' }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[13.5px] font-medium text-zinc-200">
          {budget.emoji} {budget.category}
        </span>
        <div className="flex items-center gap-3">
          <span className={`font-mono text-[12.5px] font-medium ${over ? 'text-red-400' : 'text-zinc-400'}`}>
            ${budget.spent.toLocaleString()} /
          </span>
          {editing ? (
            <div className="flex items-center gap-2">
              <input
                autoFocus
                type="number" min="1"
                value={newLimit}
                onChange={e => setNewLimit(e.target.value)}
                onBlur={handleSave}
                onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setEditing(false) }}
                className="w-20 px-2 py-1 rounded-lg text-[12px] text-zinc-100 outline-none font-mono"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(99,102,241,0.4)' }}
              />
            </div>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="font-mono text-[12.5px] text-zinc-400 hover:text-indigo-400 transition-colors"
            >
              ${budget.limit.toLocaleString()}
            </button>
          )}
        </div>
      </div>

      <div className="h-2 rounded-full overflow-hidden mb-2"
           style={{ background: 'rgba(255,255,255,0.07)' }}>
        <div
          ref={fillRef}
          className="h-full rounded-full transition-all duration-[1000ms]"
          style={{ width: '0%', background: color }}
        />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-[11.5px]" style={{ color: over ? '#f43f5e' : '#5a6278' }}>
          {over
            ? `Over budget by $${(budget.spent - budget.limit).toFixed(0)}`
            : `$${(budget.limit - budget.spent).toFixed(0)} remaining · ${pct.toFixed(0)}% used`}
        </p>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
          <span className="text-[11px]" style={{ color }}>
            {pct >= 100 ? 'Over budget' : pct >= 85 ? 'Almost full' : 'On track'}
          </span>
        </div>
      </div>
    </div>
  )
}

export function Budgets() {
  const { dashboard, updateBudget } = useWealthStore()
  const budgets = dashboard?.budgets ?? []

  const totalBudgeted = budgets.reduce((s, b) => s + b.limit, 0)
  const totalSpent    = budgets.reduce((s, b) => s + b.spent, 0)
  const onTrack       = budgets.filter(b => b.spent <= b.limit).length
  const overBudget    = budgets.filter(b => b.spent > b.limit).length

  return (
    <div className="flex flex-col h-full">
      {/* Topbar */}
      <header className="h-[55px] flex-shrink-0 flex items-center gap-3 px-6 border-b"
              style={{ background: 'rgba(7,8,13,0.85)', backdropFilter: 'blur(10px)',
                       borderColor: 'rgba(255,255,255,0.07)' }}>
        <span className="text-[15px] font-semibold text-zinc-100 tracking-tight mr-auto">
          Budget Tracker
        </span>
        <span className="text-[12px] text-zinc-500">May 2026</span>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Summary cards */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Total Budgeted', value: `$${totalBudgeted.toLocaleString()}`, color: '#eef0f8' },
            { label: 'Total Spent',    value: `$${totalSpent.toLocaleString()}`,    color: totalSpent > totalBudgeted ? '#f43f5e' : '#10b981' },
            { label: 'On Track',       value: `${onTrack} categories`,              color: '#10b981' },
            { label: 'Over Budget',    value: `${overBudget} categories`,           color: overBudget > 0 ? '#f43f5e' : '#10b981' },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-2xl border p-4"
                 style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.07)' }}>
              <p className="text-[11px] text-zinc-500 mb-1">{label}</p>
              <p className="font-mono text-[17px] font-semibold" style={{ color }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Tip */}
        <div className="rounded-xl border px-4 py-3 flex items-center gap-3"
             style={{ background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.2)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p className="text-[12px] text-indigo-300">
            Click on any budget limit to edit it inline.
          </p>
        </div>

        {/* Budget list */}
        <div className="space-y-3">
          {budgets.map(b => (
            <BudgetRow
              key={b.id}
              budget={b}
              onEdit={(id, limit) => updateBudget(id, { limit })}
            />
          ))}
        </div>

        {/* Overall progress */}
        <div className="rounded-2xl border p-5"
             style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.07)' }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[13px] font-semibold text-zinc-100">Overall Budget Health</p>
            <span className="font-mono text-[13px] text-zinc-400">
              ${totalSpent.toLocaleString()} / ${totalBudgeted.toLocaleString()}
            </span>
          </div>
          <OverallBar spent={totalSpent} budget={totalBudgeted} />
          <p className="text-[11.5px] text-zinc-500 mt-2">
            {totalSpent <= totalBudgeted
              ? `$${(totalBudgeted - totalSpent).toLocaleString()} remaining across all categories`
              : `$${(totalSpent - totalBudgeted).toLocaleString()} over total budget`}
          </p>
        </div>
      </div>
    </div>
  )
}

function OverallBar({ spent, budget }: { spent: number; budget: number }) {
  const fillRef = useRef<HTMLDivElement>(null)
  const pct = Math.min((spent / budget) * 100, 100)

  useEffect(() => {
    const t = setTimeout(() => {
      if (fillRef.current) fillRef.current.style.width = pct + '%'
    }, 300)
    return () => clearTimeout(t)
  }, [pct])

  return (
    <div className="h-3 rounded-full overflow-hidden"
         style={{ background: 'rgba(255,255,255,0.07)' }}>
      <div
        ref={fillRef}
        className="h-full rounded-full transition-all duration-1000"
        style={{ width: '0%', background: barColor(pct) }}
      />
    </div>
  )
}
