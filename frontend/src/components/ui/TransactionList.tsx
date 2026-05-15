import type { Transaction } from '../../types'
import { useWealthStore } from '../../hooks/useWealthStore'

interface TransactionListProps {
  transactions: Transaction[]
  limit?: number
}

export function TransactionList({ transactions, limit = 6 }: TransactionListProps) {
  const removeTransaction = useWealthStore(s => s.removeTransaction)

  return (
    <div className="col-span-2 rounded-2xl border p-6"
         style={{ background: 'rgba(255,255,255,0.035)', borderColor: 'rgba(255,255,255,0.07)' }}>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-zinc-100">Recent Transactions</h3>
        <button className="text-xs text-indigo-400 hover:opacity-70 transition-opacity">
          View all →
        </button>
      </div>

      <div className="space-y-1">
        {transactions.slice(0, limit).map(tx => (
          <div key={tx.id}
               className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer group
                          transition-colors hover:bg-white/5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                 style={{ background: tx.type === 'credit'
                   ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.05)' }}>
              {tx.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-100 truncate">{tx.name}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{tx.date}</p>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full border border-white/10 text-zinc-400
                             hidden group-hover:inline-block mr-2">
              {tx.category}
            </span>
            <button
              onClick={() => removeTransaction(tx.id)}
              className="text-zinc-600 hover:text-red-400 transition-colors opacity-0
                         group-hover:opacity-100 mr-2 text-xs">
              ✕
            </button>
            <span className={`font-mono text-sm font-semibold min-w-[72px] text-right ${
              tx.type === 'credit' ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {tx.type === 'credit' ? '+' : '-'}${tx.amount.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
