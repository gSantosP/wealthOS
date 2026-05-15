import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { DashboardData, Transaction, SavingsGoal, Budget } from '../types'
import { getDashboard, createTransaction, deleteTransaction } from '../services/api'
import { MOCK_DASHBOARD } from '../data/mock'

interface WealthStore {
  dashboard:    DashboardData | null
  loading:      boolean
  error:        string | null
  activePeriod: '1W' | '1M' | '6M' | '1Y'

  fetchDashboard:    () => Promise<void>
  addTransaction:    (tx: Omit<Transaction, 'id'>) => Promise<void>
  removeTransaction: (id: string) => Promise<void>
  setActivePeriod:   (p: WealthStore['activePeriod']) => void

  addGoal:    (g: Omit<SavingsGoal, 'id'>) => void
  removeGoal: (id: string) => void
  updateGoal: (id: string, update: Partial<Pick<SavingsGoal, 'current' | 'target' | 'name'>>) => void

  updateBudget: (id: string, update: Partial<Pick<Budget, 'limit' | 'spent'>>) => void
}

export const useWealthStore = create<WealthStore>()(
  persist(
    (set) => ({
      dashboard:    null,
      loading:      false,
      error:        null,
      activePeriod: '6M',

      fetchDashboard: async () => {
        set({ loading: true, error: null })
        try {
          const dashboard = await getDashboard()
          set({ dashboard, loading: false })
        } catch {
          // Keep any existing persisted state; only seed mock on very first load
          set(state => ({
            dashboard: state.dashboard ?? MOCK_DASHBOARD,
            loading: false,
          }))
        }
      },

      addTransaction: async (tx) => {
        const created: Transaction = { ...tx, id: Date.now().toString() }
        set(state => ({
          dashboard: state.dashboard
            ? { ...state.dashboard, transactions: [created, ...state.dashboard.transactions] }
            : null,
        }))
        try { await createTransaction(tx) } catch { /* mock mode */ }
      },

      removeTransaction: async (id) => {
        set(state => ({
          dashboard: state.dashboard
            ? {
                ...state.dashboard,
                transactions: state.dashboard.transactions.filter(t => t.id !== id),
              }
            : null,
        }))
        try { await deleteTransaction(id) } catch { /* mock mode */ }
      },

      setActivePeriod: (activePeriod) => set({ activePeriod }),

      addGoal: (g) => {
        const newGoal: SavingsGoal = { ...g, id: Date.now().toString() }
        set(state => ({
          dashboard: state.dashboard
            ? { ...state.dashboard, goals: [...state.dashboard.goals, newGoal] }
            : null,
        }))
      },

      removeGoal: (id) => {
        set(state => ({
          dashboard: state.dashboard
            ? { ...state.dashboard, goals: state.dashboard.goals.filter(g => g.id !== id) }
            : null,
        }))
      },

      updateGoal: (id, update) => {
        set(state => ({
          dashboard: state.dashboard
            ? {
                ...state.dashboard,
                goals: state.dashboard.goals.map(g =>
                  g.id === id ? { ...g, ...update } : g
                ),
              }
            : null,
        }))
      },

      updateBudget: (id, update) => {
        set(state => ({
          dashboard: state.dashboard
            ? {
                ...state.dashboard,
                budgets: state.dashboard.budgets.map(b =>
                  b.id === id ? { ...b, ...update } : b
                ),
              }
            : null,
        }))
      },
    }),
    {
      name: 'wealthos-dashboard',
      // Persist only the dashboard data; loading/error are transient
      partialize: (state) => ({ dashboard: state.dashboard }),
    }
  )
)
