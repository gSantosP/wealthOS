import { useState } from 'react'
import { analyzeFinances } from '../../services/api'
import type { DashboardData } from '../../types'

interface AiAdvisorProps {
  dashboard: DashboardData
}

export function AiAdvisor({ dashboard }: AiAdvisorProps) {
  const [loading, setLoading]   = useState(false)
  const [insight, setInsight]   = useState<string | null>(null)
  const [error,   setError]     = useState<string | null>(null)

  async function handleAnalyze() {
    setLoading(true)
    setError(null)
    setInsight(null)

    try {
      const result = await analyzeFinances({
        netWorth:        dashboard.netWorth,
        monthlyIncome:   dashboard.monthlyIncome,
        monthlyExpenses: dashboard.monthlyExpenses,
        savingsRate:     dashboard.savingsRate,
        budgets:         dashboard.budgets,
        goals:           dashboard.goals,
        topCategories:   dashboard.byCategory,
      })
      setInsight(result)
    } catch {
      setError('Could not reach AI service. Check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="col-span-3 rounded-2xl border p-6"
         style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.07),rgba(6,182,212,0.03))',
                  borderColor: 'rgba(99,102,241,0.22)' }}>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
             style={{ background: 'linear-gradient(135deg,#6366f1,#818cf8)',
                      boxShadow: '0 0 18px rgba(99,102,241,0.4)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
               stroke="white" strokeWidth="2">
            <path d="M12 2a7 7 0 017 7c0 4-3 6-3 9H8c0-3-3-5-3-9a7 7 0 017-7z"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
            <line x1="9" y1="23" x2="15" y2="23"/>
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-zinc-100">AI Financial Advisor</h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Powered by Claude · analyzes your real data, not generic templates
          </p>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium
                     disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          style={{ background: loading ? 'rgba(99,102,241,0.5)' : '#6366f1',
                   boxShadow: loading ? 'none' : '0 4px 14px rgba(99,102,241,0.4)' }}
        >
          {loading ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2.5">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              {insight ? 'Re-analyze' : 'Analyze My Finances'}
            </>
          )}
        </button>
      </div>

      <div className="rounded-xl border p-4 min-h-12 text-sm leading-relaxed transition-all"
           style={{ background: 'rgba(0,0,0,0.22)', borderColor: 'rgba(255,255,255,0.07)',
                    color: insight ? '#e4e8f0' : '#5a6278' }}>
        {error   && <span className="text-amber-400">{error}</span>}
        {!insight && !error && !loading &&
          'Click "Analyze My Finances" to get personalized AI insights based on your real spending patterns, savings rate, and goals.'}
        {loading  && <span className="text-zinc-400">Reading your financial data...</span>}
        {insight  && (
          <div dangerouslySetInnerHTML={{
            __html: insight.replace(/\n/g, '<br/>')
          }} />
        )}
      </div>
    </div>
  )
}
