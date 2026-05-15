import { useEffect, useRef, useState } from 'react'
import { useWealthStore } from '../hooks/useWealthStore'
import type { SavingsGoal } from '../types'

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#06b6d4', '#a78bfa', '#f43f5e']

const EMOJIS = ['✈', '🏠', '🚗', '📈', '💻', '🎓', '💍', '🌴', '🏋', '🎸']

function GoalCard({
  goal, color, onDelete, onUpdate,
}: {
  goal: SavingsGoal
  color: string
  onDelete: () => void
  onUpdate: (update: Partial<Pick<SavingsGoal, 'current'>>) => void
}) {
  const fillRef = useRef<HTMLDivElement>(null)
  const pct = Math.min(Math.round((goal.current / goal.target) * 100), 100)
  const remaining = goal.target - goal.current
  const monthsLeft = remaining > 0 ? Math.ceil(remaining / 2340) : 0

  useEffect(() => {
    const t = setTimeout(() => {
      if (fillRef.current) fillRef.current.style.width = pct + '%'
    }, 200)
    return () => clearTimeout(t)
  }, [pct])

  const [editing, setEditing]   = useState(false)
  const [deposit, setDeposit]   = useState('')

  function handleDeposit(e: React.FormEvent) {
    e.preventDefault()
    const amt = parseFloat(deposit)
    if (isNaN(amt) || amt <= 0) return
    onUpdate({ current: Math.min(goal.current + amt, goal.target) })
    setDeposit('')
    setEditing(false)
  }

  return (
    <div className="rounded-2xl border p-6 flex flex-col gap-4 hover:border-white/10 transition-colors"
         style={{ background: 'rgba(255,255,255,0.035)', borderColor: 'rgba(255,255,255,0.07)',
                  animation: 'fadeUp 0.4s ease both' }}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
               style={{ background: `${color}18` }}>
            {goal.emoji}
          </div>
          <div>
            <p className="text-[13.5px] font-semibold text-zinc-100">{goal.name}</p>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              {pct === 100 ? 'Goal reached!' : `~${monthsLeft} month${monthsLeft !== 1 ? 's' : ''} to go`}
            </p>
          </div>
        </div>
        <button
          onClick={onDelete}
          className="text-zinc-700 hover:text-red-400 transition-colors text-sm"
        >
          ✕
        </button>
      </div>

      {/* Amounts */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[11px] text-zinc-500 mb-0.5">Saved</p>
          <p className="font-mono text-lg font-semibold text-zinc-100">
            ${goal.current.toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-zinc-500 mb-0.5">Target</p>
          <p className="font-mono text-[13px] text-zinc-400">
            ${goal.target.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="font-mono text-[13px] font-semibold" style={{ color }}>
            {pct}%
          </span>
          {pct < 100 && (
            <span className="text-[11px] text-zinc-500">
              ${remaining.toLocaleString()} remaining
            </span>
          )}
        </div>
        <div className="h-1.5 rounded-full overflow-hidden"
             style={{ background: 'rgba(255,255,255,0.07)' }}>
          <div
            ref={fillRef}
            className="h-full rounded-full transition-all duration-[1100ms] cubic-bezier"
            style={{ width: '0%', background: color }}
          />
        </div>
      </div>

      {/* Deposit */}
      {pct < 100 && (
        editing ? (
          <form onSubmit={handleDeposit} className="flex gap-2">
            <input
              autoFocus
              type="number" min="1" step="0.01"
              value={deposit} onChange={e => setDeposit(e.target.value)}
              placeholder="Amount"
              className="flex-1 px-3 py-2 rounded-xl text-sm text-zinc-100 outline-none"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
            />
            <button type="submit"
                    className="px-3 py-2 rounded-xl text-[12px] font-medium text-white"
                    style={{ background: color }}>
              Add
            </button>
            <button type="button" onClick={() => setEditing(false)}
                    className="px-3 py-2 rounded-xl text-[12px] text-zinc-500 hover:text-zinc-300">
              Cancel
            </button>
          </form>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="text-[12px] font-medium transition-colors hover:opacity-80"
            style={{ color }}
          >
            + Add deposit
          </button>
        )
      )}

      {pct === 100 && (
        <div className="flex items-center gap-2 text-[12px] font-medium text-emerald-400">
          <span>Goal complete</span>
        </div>
      )}
    </div>
  )
}

function AddGoalModal({ onClose, onAdd }: { onClose: () => void; onAdd: (g: Omit<SavingsGoal, 'id'>) => void }) {
  const [name,    setName]    = useState('')
  const [target,  setTarget]  = useState('')
  const [current, setCurrent] = useState('')
  const [emoji,   setEmoji]   = useState('✈')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const t = parseFloat(target)
    const c = parseFloat(current) || 0
    if (!name.trim() || isNaN(t) || t <= 0) return
    onAdd({ name: name.trim(), emoji, target: t, current: Math.min(c, t) })
    onClose()
  }

  const inputCls = `w-full px-3 py-2.5 rounded-xl text-sm text-zinc-100 outline-none
    focus:border-indigo-500 transition-colors`
  const inputStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
         style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
         onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="w-[380px] rounded-2xl border p-7"
           style={{ background: '#0f1218', borderColor: 'rgba(99,102,241,0.3)',
                    animation: 'fadeUp 0.18s ease' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[15px] font-semibold text-zinc-100">New Goal</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 text-xl transition-colors">×</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-500 mb-1.5">
              Goal Name
            </label>
            <input value={name} onChange={e => setName(e.target.value)}
                   placeholder="e.g. Emergency Fund"
                   className={inputCls} style={inputStyle} />
          </div>
          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-500 mb-2">
              Icon
            </label>
            <div className="flex flex-wrap gap-2">
              {EMOJIS.map(em => (
                <button key={em} type="button" onClick={() => setEmoji(em)}
                        className={`w-9 h-9 rounded-xl text-lg transition-all ${
                          emoji === em ? 'ring-2 ring-indigo-500' : 'hover:bg-white/5'
                        }`}
                        style={{ background: emoji === em ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.05)' }}>
                  {em}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-500 mb-1.5">
                Target ($)
              </label>
              <input type="number" min="1" value={target} onChange={e => setTarget(e.target.value)}
                     placeholder="10000" className={inputCls} style={inputStyle} />
            </div>
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-500 mb-1.5">
                Saved So Far ($)
              </label>
              <input type="number" min="0" value={current} onChange={e => setCurrent(e.target.value)}
                     placeholder="0" className={inputCls} style={inputStyle} />
            </div>
          </div>
          <button type="submit"
                  className="w-full py-3 rounded-xl text-sm font-semibold text-white mt-2 transition-all hover:-translate-y-px"
                  style={{ background: '#6366f1', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }}>
            Create Goal
          </button>
        </form>
      </div>
    </div>
  )
}

export function Goals() {
  const { dashboard, addGoal, removeGoal, updateGoal } = useWealthStore()
  const [showAdd, setShowAdd] = useState(false)

  const goals = dashboard?.goals ?? []
  const totalSaved  = goals.reduce((s, g) => s + g.current, 0)
  const totalTarget = goals.reduce((s, g) => s + g.target, 0)
  const complete    = goals.filter(g => g.current >= g.target).length

  return (
    <div className="flex flex-col h-full">
      {/* Topbar */}
      <header className="h-[55px] flex-shrink-0 flex items-center gap-3 px-6 border-b"
              style={{ background: 'rgba(7,8,13,0.85)', backdropFilter: 'blur(10px)',
                       borderColor: 'rgba(255,255,255,0.07)' }}>
        <span className="text-[15px] font-semibold text-zinc-100 tracking-tight mr-auto">
          Savings Goals
        </span>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[12.5px] font-medium
                     border transition-all hover:bg-indigo-500/10"
          style={{ borderColor: 'rgba(99,102,241,0.3)', color: '#818cf8',
                   background: 'rgba(99,102,241,0.08)' }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Goal
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total Saved',  value: `$${totalSaved.toLocaleString()}`,  color: '#10b981' },
            { label: 'Total Target', value: `$${totalTarget.toLocaleString()}`, color: '#eef0f8' },
            { label: 'Goals Complete', value: `${complete} / ${goals.length}`,  color: '#6366f1' },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-2xl border p-4"
                 style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.07)' }}>
              <p className="text-[11px] text-zinc-500 mb-1">{label}</p>
              <p className="font-mono text-xl font-semibold" style={{ color }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Goals grid */}
        {goals.length === 0 ? (
          <div className="rounded-2xl border p-16 text-center"
               style={{ borderColor: 'rgba(255,255,255,0.07)', borderStyle: 'dashed' }}>
            <p className="text-zinc-500 text-sm mb-3">No goals yet</p>
            <button onClick={() => setShowAdd(true)}
                    className="text-indigo-400 text-sm hover:text-indigo-300 transition-colors">
              + Create your first goal
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {goals.map((g, i) => (
              <GoalCard
                key={g.id}
                goal={g}
                color={COLORS[i % COLORS.length]}
                onDelete={() => removeGoal(g.id)}
                onUpdate={u => updateGoal(g.id, u)}
              />
            ))}
          </div>
        )}
      </div>

      {showAdd && (
        <AddGoalModal
          onClose={() => setShowAdd(false)}
          onAdd={addGoal}
        />
      )}
    </div>
  )
}
