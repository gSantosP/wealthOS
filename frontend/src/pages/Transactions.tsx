import { useState, useMemo } from 'react'
import { useWealthStore } from '../hooks/useWealthStore'
import { AddTransactionModal } from '../components/ui/AddTransactionModal'
import type { Category } from '../types'

const CATEGORIES: (Category | 'All')[] = [
  'All', 'Food', 'Housing', 'Transport', 'Entertainment', 'Health', 'Shopping', 'Income', 'Other',
]

const CATEGORY_COLOR: Record<string, string> = {
  Housing: '#6366f1', Food: '#10b981', Transport: '#f59e0b',
  Entertainment: '#06b6d4', Health: '#a78bfa', Shopping: '#f43f5e',
  Income: '#34d399', Other: '#64748b',
}

export function Transactions() {
  const { dashboard, removeTransaction } = useWealthStore()
  const [search,      setSearch]      = useState('')
  const [typeFilter,  setTypeFilter]  = useState<'all' | 'credit' | 'debit'>('all')
  const [catFilter,   setCatFilter]   = useState<Category | 'All'>('All')
  const [modalOpen,   setModalOpen]   = useState(false)

  const transactions = dashboard?.transactions ?? []

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      const matchSearch = t.name.toLowerCase().includes(search.toLowerCase())
      const matchType   = typeFilter === 'all' || t.type === typeFilter
      const matchCat    = catFilter === 'All' || t.category === catFilter
      return matchSearch && matchType && matchCat
    })
  }, [transactions, search, typeFilter, catFilter])

  const totalIncome   = transactions.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0)
  const totalExpenses = transactions.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0)
  const net           = totalIncome - totalExpenses

  return (
    <div className="flex flex-col h-full">
      {/* Topbar */}
      <header className="h-[55px] flex-shrink-0 flex items-center gap-3 px-6 border-b"
              style={{ background: 'rgba(7,8,13,0.85)', backdropFilter: 'blur(10px)',
                       borderColor: 'rgba(255,255,255,0.07)' }}>
        <span className="text-[15px] font-semibold text-zinc-100 tracking-tight mr-auto">
          Transactions
        </span>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[12.5px] font-medium
                     border transition-all hover:bg-indigo-500/10"
          style={{ borderColor: 'rgba(99,102,241,0.3)', color: '#818cf8',
                   background: 'rgba(99,102,241,0.08)' }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Transaction
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total Income',   value: totalIncome,   color: '#10b981', sign: '+' },
            { label: 'Total Expenses', value: totalExpenses, color: '#f43f5e', sign: '-' },
            { label: 'Net Cash Flow',  value: net,           color: net >= 0 ? '#10b981' : '#f43f5e', sign: net >= 0 ? '+' : '' },
          ].map(({ label, value, color, sign }) => (
            <div key={label} className="rounded-2xl border p-4"
                 style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.07)' }}>
              <p className="text-[11px] text-zinc-500 mb-1">{label}</p>
              <p className="font-mono text-xl font-semibold" style={{ color }}>
                {sign}${Math.abs(value).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="rounded-2xl border p-4 flex flex-wrap items-center gap-3"
             style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.07)' }}>
          {/* Search */}
          <div className="relative flex-1 min-w-[180px]">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                 width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search transactions..."
              className="w-full pl-8 pr-3 py-2 rounded-xl text-sm text-zinc-200 outline-none
                         transition-colors focus:border-indigo-500"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            />
          </div>

          {/* Type filter */}
          <div className="flex gap-1 rounded-xl p-1 border"
               style={{ background: '#0f1218', borderColor: 'rgba(255,255,255,0.08)' }}>
            {(['all', 'credit', 'debit'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1 rounded-lg text-[12px] font-medium transition-all capitalize ${
                  typeFilter === t ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
                style={typeFilter === t
                  ? { background: '#6366f1', boxShadow: '0 2px 6px rgba(99,102,241,0.35)' }
                  : {}}
              >
                {t === 'all' ? 'All' : t === 'credit' ? 'Income' : 'Expenses'}
              </button>
            ))}
          </div>

          {/* Category filter */}
          <select
            value={catFilter}
            onChange={e => setCatFilter(e.target.value as Category | 'All')}
            className="px-3 py-2 rounded-xl text-[12px] text-zinc-300 outline-none"
            style={{ background: '#0f1218', border: '1px solid rgba(255,255,255,0.08)',
                     appearance: 'none', minWidth: 120 }}
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Transaction list */}
        <div className="rounded-2xl border overflow-hidden"
             style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.07)' }}>
          <div className="px-5 py-3 border-b flex items-center justify-between"
               style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
            <p className="text-[13px] font-semibold text-zinc-100">
              {filtered.length} transaction{filtered.length !== 1 ? 's' : ''}
            </p>
            <p className="text-[11px] text-zinc-500">May 2026</p>
          </div>

          <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            {filtered.length === 0 ? (
              <div className="py-12 text-center text-zinc-600 text-sm">
                No transactions match your filters
              </div>
            ) : filtered.map(tx => (
              <div key={tx.id}
                   className="flex items-center gap-3 px-5 py-3 group hover:bg-white/[0.025]
                              transition-colors cursor-default">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                     style={{ background: tx.type === 'credit'
                       ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)' }}>
                  {tx.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-zinc-100 truncate">{tx.name}</p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">{tx.date}</p>
                </div>
                <span className="text-[10.5px] px-2 py-0.5 rounded-full border"
                      style={{ borderColor: 'rgba(255,255,255,0.1)',
                               color: CATEGORY_COLOR[tx.category] ?? '#64748b' }}>
                  {tx.category}
                </span>
                <button
                  onClick={() => removeTransaction(tx.id)}
                  className="text-zinc-700 hover:text-red-400 transition-colors opacity-0
                             group-hover:opacity-100 text-sm px-1"
                >
                  ✕
                </button>
                <span className={`font-mono text-[13px] font-semibold min-w-[80px] text-right ${
                  tx.type === 'credit' ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {tx.type === 'credit' ? '+' : '-'}${tx.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AddTransactionModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
