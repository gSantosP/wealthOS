import { useState } from 'react'
import { useWealthStore } from '../hooks/useWealthStore'
import { NetWorthCard }        from '../components/ui/NetWorthCard'
import { StatCard }            from '../components/ui/StatCard'
import { GoalsGrid }           from '../components/ui/GoalsGrid'
import { TransactionList }     from '../components/ui/TransactionList'
import { BudgetTracker }       from '../components/ui/BudgetTracker'
import { AiAdvisor }           from '../components/ui/AiAdvisor'
import { IncomeChart }         from '../components/charts/IncomeChart'
import { SpendingDonut }       from '../components/charts/SpendingDonut'
import { AddTransactionModal } from '../components/ui/AddTransactionModal'

const PERIODS = ['1W', '1M', '6M', '1Y'] as const

export function Dashboard() {
  const { dashboard, activePeriod, setActivePeriod } = useWealthStore()
  const [modalOpen, setModalOpen] = useState(false)

  if (!dashboard) return null

  const totalSpent = dashboard.byCategory.reduce((s, c) => s + c.amount, 0)

  return (
    <div className="flex flex-col h-full">
      {/* Topbar */}
      <header className="h-[55px] flex-shrink-0 flex items-center gap-3 px-6 border-b"
              style={{ background: 'rgba(7,8,13,0.85)', backdropFilter: 'blur(10px)',
                       borderColor: 'rgba(255,255,255,0.07)' }}>
        <span className="text-[15px] font-semibold text-zinc-100 tracking-tight mr-auto">
          Dashboard
        </span>

        {/* Period selector */}
        <div className="flex gap-0.5 rounded-xl p-1 border"
             style={{ background: '#0f1218', borderColor: 'rgba(255,255,255,0.08)' }}>
          {PERIODS.map(p => (
            <button
              key={p}
              onClick={() => setActivePeriod(p)}
              className={`px-3 py-1 rounded-lg text-[12px] font-medium transition-all ${
                activePeriod === p
                  ? 'text-white'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
              style={activePeriod === p
                ? { background: '#6366f1', boxShadow: '0 2px 8px rgba(99,102,241,0.4)' }
                : {}}
            >
              {p}
            </button>
          ))}
        </div>

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

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-3">
        {/* Stat row */}
        <div className="grid grid-cols-4 gap-2.5">
          <StatCard
            label="Net Worth" value={`$${dashboard.netWorth.toLocaleString()}`}
            change={`+${dashboard.netWorthChange.toLocaleString()} this month`} up
            iconBg="rgba(99,102,241,0.12)"
            icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>}
            delay={0}
          />
          <StatCard
            label="Monthly Income" value={`$${dashboard.monthlyIncome.toLocaleString()}`}
            change={`+$${dashboard.incomeChange} vs last month`} up
            valueColor="#10b981"
            iconBg="rgba(16,185,129,0.12)"
            icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>}
            delay={0.05}
          />
          <StatCard
            label="Monthly Expenses" value={`$${dashboard.monthlyExpenses.toLocaleString()}`}
            change={`${dashboard.expensesChange < 0 ? '' : '+'}$${dashboard.expensesChange} vs last month`}
            up={dashboard.expensesChange < 0}
            valueColor="#f43f5e"
            iconBg="rgba(244,63,94,0.1)"
            icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>}
            delay={0.1}
          />
          <StatCard
            label="Savings Rate" value={`${dashboard.savingsRate}%`}
            change="Above 20% target"
            up
            valueColor="#f59e0b"
            iconBg="rgba(245,158,11,0.1)"
            icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
            delay={0.15}
          />
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-3 gap-3">
          {/* Net Worth hero (2 cols) */}
          <NetWorthCard
            value={dashboard.netWorth}
            change={dashboard.netWorthChange}
            liquid={dashboard.liquidAssets}
            investments={dashboard.investments}
            realEstate={dashboard.realEstate}
            cashFlow={dashboard.cashFlow}
            history={dashboard.history.map(h => h.income - h.expenses)}
          />

          {/* Goals (1 col) */}
          <GoalsGrid goals={dashboard.goals} />

          {/* Income chart (2 cols — col-span-2 defined inside the component) */}
          <IncomeChart data={dashboard.history} />

          {/* Spending donut (1 col) */}
          <SpendingDonut data={dashboard.byCategory} total={totalSpent} />

          {/* Transactions (2 cols) */}
          <TransactionList transactions={dashboard.transactions} limit={6} />

          {/* Budgets (1 col) */}
          <BudgetTracker budgets={dashboard.budgets} />

          {/* AI Advisor (3 cols) */}
          <AiAdvisor dashboard={dashboard} />
        </div>
      </div>

      <AddTransactionModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
