import { useState } from 'react'
import type { Category } from '../../types'
import { useWealthStore } from '../../hooks/useWealthStore'

interface AddTransactionModalProps {
  open:    boolean
  onClose: () => void
}

const EXPENSE_CATEGORIES: Category[] = [
  'Food', 'Housing', 'Transport', 'Entertainment', 'Health', 'Shopping', 'Other',
]

const INCOME_CATEGORIES: Category[] = [
  'Income', 'Other',
]

const EMOJI_MAP: Record<string, string> = {
  Food: '🍽', Housing: '🏠', Transport: '🚗',
  Entertainment: '🎮', Health: '💊', Shopping: '🛍',
  Income: '💼', Other: '📌',
}

export function AddTransactionModal({ open, onClose }: AddTransactionModalProps) {
  const addTransaction = useWealthStore(s => s.addTransaction)

  const [name,     setName]     = useState('')
  const [amount,   setAmount]   = useState('')
  const [type,     setType]     = useState<'credit' | 'debit'>('debit')
  const [category, setCategory] = useState<Category>('Food')
  const [error,    setError]    = useState('')

  if (!open) return null

  function handleTypeChange(newType: 'credit' | 'debit') {
    setType(newType)
    // Auto-switch category default when toggling type
    setCategory(newType === 'credit' ? 'Income' : 'Food')
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const amt = parseFloat(amount)

    if (!name.trim()) { setError('Please enter a description.'); return }
    if (isNaN(amt) || amt <= 0) { setError('Please enter a valid amount greater than 0.'); return }

    setError('')
    addTransaction({
      name:     name.trim(),
      emoji:    EMOJI_MAP[category] ?? '📌',
      amount:   amt,
      type,
      category,
      date:     new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    })
    setName(''); setAmount(''); setType('debit'); setCategory('Food')
    onClose()
  }

  const inputCls = `w-full px-3 py-2.5 rounded-xl text-sm text-zinc-100 outline-none
    transition-colors focus:border-indigo-500 font-sans`
  const inputStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }

  const categories = type === 'credit' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
         style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
         onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="w-[380px] rounded-2xl border p-7"
           style={{ background: '#0f1218', borderColor: 'rgba(99,102,241,0.3)',
                    animation: 'fadeUp 0.18s ease' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[15px] font-semibold text-zinc-100">Add Transaction</h2>
          <button onClick={onClose}
                  className="text-zinc-500 hover:text-zinc-300 text-xl leading-none transition-colors">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-500 mb-1.5">
              Description
            </label>
            <input
              value={name} onChange={e => { setName(e.target.value); setError('') }}
              placeholder="e.g. Spotify Premium"
              className={inputCls} style={inputStyle}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-500 mb-1.5">
                Amount
              </label>
              <input
                type="number" min="0.01" step="0.01"
                value={amount} onChange={e => { setAmount(e.target.value); setError('') }}
                placeholder="0.00"
                className={inputCls} style={inputStyle}
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-500 mb-1.5">
                Type
              </label>
              <select
                value={type}
                onChange={e => handleTypeChange(e.target.value as 'credit' | 'debit')}
                className={inputCls} style={{ ...inputStyle, appearance: 'none' }}>
                <option value="debit">Expense</option>
                <option value="credit">Income</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-500 mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as Category)}
              className={inputCls} style={{ ...inputStyle, appearance: 'none' }}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {error && (
            <p className="text-[12px] text-red-400 -mt-1">{error}</p>
          )}

          <button type="submit"
                  className="w-full py-3 rounded-xl text-sm font-semibold text-white mt-2
                             transition-all hover:-translate-y-px active:translate-y-0"
                  style={{ background: '#6366f1', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }}>
            Add Transaction
          </button>
        </form>
      </div>
    </div>
  )
}
