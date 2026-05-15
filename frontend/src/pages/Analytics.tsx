import { useState } from 'react'
import { useWealthStore } from '../hooks/useWealthStore'
import { IncomeChart }   from '../components/charts/IncomeChart'
import { SpendingDonut } from '../components/charts/SpendingDonut'

const PERIODS = ['1W', '1M', '6M', '1Y'] as const

export function Analytics() {
  const { dashboard, activePeriod, setActivePeriod } = useWealthStore()
  const [activeView, setActiveView] = useState<'overview' | 'spending'>('overview')

  if (!dashboard) return null

  const history      = dashboard.history
  const avgIncome    = Math.round(history.reduce((s, h) => s + h.income, 0) / history.length)
  const avgExpenses  = Math.round(history.reduce((s, h) => s + h.expenses, 0) / history.length)
  const totalSaved   = history.reduce((s, h) => s + (h.income - h.expenses), 0)
  const bestMonth    = history.reduce((best, h) =>
    (h.income - h.expenses) > (best.income - best.expenses) ? h : best, history[0])
  const totalSpent   = dashboard.byCategory.reduce((s, c) => s + c.amount, 0)

  return (
    <div className="flex flex-col h-full">
      {/* Topbar */}
      <header className="h-[55px] flex-shrink-0 flex items-center gap-3 px-6 border-b"
              style={{ background: 'rgba(7,8,13,0.85)', backdropFilter: 'blur(10px)',
                       borderColor: 'rgba(255,255,255,0.07)' }}>
        <span className="text-[15px] font-semibold text-zinc-100 tracking-tight mr-auto">
          Analytics
        </span>

        {/* View toggle */}
        <div className="flex gap-0.5 rounded-xl p-1 border mr-2"
             style={{ background: '#0f1218', borderColor: 'rgba(255,255,255,0.08)' }}>
          {(['overview', 'spending'] as const).map(v => (
            <button
              key={v}
              onClick={() => setActiveView(v)}
              className={`px-3 py-1 rounded-lg text-[12px] font-medium transition-all capitalize ${
                activeView === v ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
              style={activeView === v
                ? { background: '#6366f1', boxShadow: '0 2px 8px rgba(99,102,241,0.4)' }
                : {}}
            >
              {v}
            </button>
          ))}
        </div>

        {/* Period selector */}
        <div className="flex gap-0.5 rounded-xl p-1 border"
             style={{ background: '#0f1218', borderColor: 'rgba(255,255,255,0.08)' }}>
          {PERIODS.map(p => (
            <button
              key={p}
              onClick={() => setActivePeriod(p)}
              className={`px-3 py-1 rounded-lg text-[12px] font-medium transition-all ${
                activePeriod === p ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
              style={activePeriod === p
                ? { background: '#6366f1', boxShadow: '0 2px 8px rgba(99,102,241,0.4)' }
                : {}}
            >
              {p}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Metric cards */}
        <div className="grid grid-cols-4 gap-3">
          {[
            {
              label: 'Avg Monthly Income',
              value: `$${avgIncome.toLocaleString()}`,
              sub:   'Last 6 months',
              color: '#10b981',
              iconColor: '#10b981',
              bgColor: 'rgba(16,185,129,0.1)',
              icon: <path d="M23 6l-9.5 9.5-5-5L1 18" strokeWidth="2" stroke="#10b981" fill="none"/>,
            },
            {
              label: 'Avg Monthly Expenses',
              value: `$${avgExpenses.toLocaleString()}`,
              sub:   'Last 6 months',
              color: '#f43f5e',
              iconColor: '#f43f5e',
              bgColor: 'rgba(244,63,94,0.1)',
              icon: <path d="M23 18l-9.5-9.5-5 5L1 6" strokeWidth="2" stroke="#f43f5e" fill="none"/>,
            },
            {
              label: 'Total Saved (6M)',
              value: `$${totalSaved.toLocaleString()}`,
              sub:   `${Math.round(totalSaved / (avgIncome * 6) * 100)}% of income`,
              color: '#6366f1',
              bgColor: 'rgba(99,102,241,0.1)',
              icon: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeWidth="2" stroke="#6366f1" fill="none"/></>,
            },
            {
              label: 'Best Month',
              value: bestMonth.month,
              sub:   `+$${(bestMonth.income - bestMonth.expenses).toLocaleString()} saved`,
              color: '#f59e0b',
              bgColor: 'rgba(245,158,11,0.1)',
              icon: <><circle cx="12" cy="12" r="10" strokeWidth="2" stroke="#f59e0b" fill="none"/><polyline points="12 6 12 12 16 14" strokeWidth="2" stroke="#f59e0b" fill="none"/></>,
            },
          ].map(({ label, value, sub, color, bgColor, icon }) => (
            <div key={label} className="rounded-2xl border p-4 hover:border-white/10 transition-colors"
                 style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.07)' }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3 flex-shrink-0"
                   style={{ background: bgColor }}>
                <svg width="14" height="14" viewBox="0 0 24 24">{icon}</svg>
              </div>
              <p className="text-[11px] text-zinc-500 mb-1">{label}</p>
              <p className="font-mono text-[18px] font-semibold" style={{ color }}>{value}</p>
              <p className="text-[11px] text-zinc-600 mt-1">{sub}</p>
            </div>
          ))}
        </div>

        {activeView === 'overview' ? (
          <>
            {/* Income chart — full width */}
            <div className="rounded-2xl border p-6"
                 style={{ background: 'rgba(255,255,255,0.035)', borderColor: 'rgba(255,255,255,0.07)' }}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-100">Income vs Expenses</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">Last {history.length} months — detailed view</p>
                </div>
                <div className="flex gap-4">
                  {[{ label: 'Income', color: '#10b981' }, { label: 'Expenses', color: '#f43f5e' }].map(({ label, color }) => (
                    <div key={label} className="flex items-center gap-1.5">
                      <div className="w-3 h-0.5 rounded" style={{ background: color }} />
                      <span className="text-xs text-zinc-400">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <IncomeChart data={history} />
            </div>

            {/* Monthly savings breakdown */}
            <div className="rounded-2xl border p-6"
                 style={{ background: 'rgba(255,255,255,0.035)', borderColor: 'rgba(255,255,255,0.07)' }}>
              <h3 className="text-sm font-semibold text-zinc-100 mb-1">Monthly Savings</h3>
              <p className="text-xs text-zinc-500 mb-5">Net cash flow per month</p>
              <div className="space-y-3">
                {history.map(h => {
                  const net     = h.income - h.expenses
                  const maxNet  = Math.max(...history.map(x => x.income - x.expenses))
                  const pct     = Math.round((net / maxNet) * 100)
                  return (
                    <div key={h.month} className="flex items-center gap-4">
                      <span className="font-mono text-[12px] text-zinc-500 w-8 flex-shrink-0">{h.month}</span>
                      <div className="flex-1 h-2 rounded-full overflow-hidden"
                           style={{ background: 'rgba(255,255,255,0.07)' }}>
                        <div className="h-full rounded-full transition-all duration-700"
                             style={{ width: pct + '%',
                                      background: net > avgIncome * 0.3 ? '#10b981' : net > 0 ? '#6366f1' : '#f43f5e' }} />
                      </div>
                      <span className={`font-mono text-[12px] w-20 text-right flex-shrink-0 ${
                        net >= 0 ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {net >= 0 ? '+' : ''}${net.toLocaleString()}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        ) : (
          /* Spending view */
          <div className="grid grid-cols-2 gap-4">
            <SpendingDonut data={dashboard.byCategory} total={totalSpent} />

            <div className="rounded-2xl border p-6"
                 style={{ background: 'rgba(255,255,255,0.035)', borderColor: 'rgba(255,255,255,0.07)' }}>
              <h3 className="text-sm font-semibold text-zinc-100 mb-1">Category Breakdown</h3>
              <p className="text-xs text-zinc-500 mb-5">May 2026 — sorted by spend</p>
              <div className="space-y-3">
                {[...dashboard.byCategory].sort((a, b) => b.amount - a.amount).map(c => {
                  const pct = Math.round((c.amount / totalSpent) * 100)
                  return (
                    <div key={c.category}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                          <span className="text-[12.5px] text-zinc-300">{c.category}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] text-zinc-600">{pct}%</span>
                          <span className="font-mono text-[12.5px] font-medium text-zinc-200">
                            ${c.amount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="h-1 rounded-full overflow-hidden"
                           style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <div className="h-full rounded-full"
                             style={{ width: pct + '%', background: c.color, opacity: 0.8 }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
