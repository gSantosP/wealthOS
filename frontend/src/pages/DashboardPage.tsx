import { useEffect, useState, useRef } from 'react'
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  ArcElement, Filler, Tooltip, Legend
} from 'chart.js'
import { Line, Doughnut } from 'react-chartjs-2'
import axios from 'axios'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Filler, Tooltip, Legend)

const api = axios.create({ baseURL: '/api' })

function fmt(n: number) { return '$' + Math.round(n).toLocaleString() }
function pct(a: number, b: number) { return b > 0 ? Math.round((a / b) * 100) : 0 }

export function DashboardPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiText, setAiText] = useState('')
  const [form, setForm] = useState({ name: '', amount: '', type: 'debit', category: 'Food' })
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    api.get('/dashboard').then(r => { setData(r.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!data || !heroRef.current) return
    const el = heroRef.current
    const target = Math.round(data.netWorth)
    const t0 = Date.now()
    const dur = 1300
    ;(function tick() {
      const p = Math.min((Date.now() - t0) / dur, 1)
      const e = 1 - Math.pow(1 - p, 3)
      el.textContent = '$' + Math.round(target * e).toLocaleString()
      if (p < 1) requestAnimationFrame(tick)
    })()
  }, [data])

  async function handleAddTx() {
    const amt = parseFloat(form.amount)
    if (!form.name.trim() || isNaN(amt) || amt <= 0) return
    const emojis: Record<string, string> = { Food:'🍽️', Housing:'🏠', Transport:'🚗', Entertainment:'🎮', Health:'💊', Shopping:'🛍️', Other:'📌' }
    await api.post('/transactions', {
      name: form.name, emoji: emojis[form.category] || '💳',
      amount: amt, type: form.type, category: form.category,
    })
    const r = await api.get('/dashboard')
    setData(r.data)
    setShowModal(false)
    setForm({ name: '', amount: '', type: 'debit', category: 'Food' })
  }

  async function handleAi() {
    if (!data) return
    setAiLoading(true)
    setAiText('')
    try {
      const r = await api.post('/ai/analyze', {
        netWorth: data.netWorth, monthlyIncome: data.monthlyIncome,
        monthlyExpenses: data.monthlyExpenses, savingsRate: data.savingsRate,
        budgets: data.budgets, goals: data.goals, topCategories: data.byCategory,
      })
      setAiText(r.data.insight || 'No insight returned.')
    } catch {
      setAiText('⚠ AI service unavailable. Set ANTHROPIC_API_KEY in .env and restart.')
    }
    setAiLoading(false)
  }

  if (loading) return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-zinc-500">Loading dashboard...</p>
      </div>
    </div>
  )
  if (!data) return <div className="flex-1 flex items-center justify-center text-zinc-500">Failed to load. Is the backend running?</div>

  const totalExpenses = data.monthlyExpenses || 0
  const savingsRate = data.savingsRate || 0

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Topbar */}
      <header className="h-14 flex-shrink-0 flex items-center gap-4 px-7"
              style={{ background: 'rgba(8,12,10,0.85)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <h1 className="text-[15px] font-semibold mr-auto">Dashboard</h1>
        <button onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-emerald-500/20"
                style={{ background:'rgba(16,185,129,0.12)', border:'1px solid rgba(16,185,129,0.25)', color:'#34d399' }}>
          + Add Transaction
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Net Worth', val: fmt(data.netWorth), change: `+${fmt(data.netWorthChange)}`, color: '#10b981' },
            { label: 'Monthly Income', val: fmt(data.monthlyIncome), change: `+${fmt(data.incomeChange)}`, color: '#34d399' },
            { label: 'Monthly Expenses', val: fmt(data.monthlyExpenses), change: `${fmt(data.expensesChange)}`, color: '#ef4444', red: true },
            { label: 'Savings Rate', val: `${savingsRate}%`, change: 'Target: 20%', color: '#f59e0b' },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-4 transition-colors hover:border-white/20"
                 style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center mb-3"
                   style={{ background: s.color + '1a' }}>
                <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
              </div>
              <p className="text-xs text-zinc-500 mb-1">{s.label}</p>
              <p className="font-mono text-lg font-medium" style={{ color: ('red' in s) ? '#ef4444' : 'inherit' }}>{s.val}</p>
              <p className="text-xs text-emerald-400 mt-1">↑ {s.change}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {/* Hero card */}
          <div className="col-span-2 rounded-xl p-6 relative overflow-hidden"
               style={{ background:'linear-gradient(145deg,rgba(16,185,129,0.08),rgba(6,182,212,0.03))',
                        border:'1px solid rgba(16,185,129,0.22)' }}>
            <p className="text-xs font-semibold tracking-widest uppercase text-emerald-400 mb-2">Total Net Worth</p>
            <div ref={heroRef} className="font-mono text-4xl font-semibold mb-3">$0</div>
            <div className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full mb-4"
                 style={{ background:'rgba(16,185,129,0.12)', color:'#34d399' }}>
              ▲ +{fmt(data.netWorthChange)} this month
            </div>
            <div className="flex gap-6">
              {[
                { label:'Liquid', val: fmt(data.liquidAssets) },
                { label:'Investments', val: fmt(data.investments) },
                { label:'Cash Flow', val: fmt(data.cashFlow), green: true },
              ].map(m => (
                <div key={m.label}>
                  <p className="text-[10px] text-zinc-500 mb-1">{m.label}</p>
                  <p className={`font-mono text-sm font-medium ${m.green ? 'text-emerald-400' : ''}`}>{m.val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Goals */}
          <div className="rounded-xl p-5" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
            <h3 className="text-sm font-semibold mb-3">Savings Goals</h3>
            <div className="grid grid-cols-2 gap-2">
              {(data.goals || []).map((g: any) => {
                const p = pct(g.current, g.target)
                return (
                  <div key={g.id} className="rounded-lg p-3" style={{ background:'rgba(0,0,0,0.2)', border:'1px solid rgba(255,255,255,0.07)' }}>
                    <div className="text-lg mb-1">{g.emoji}</div>
                    <p className="text-[11px] text-zinc-400">{g.name}</p>
                    <p className="font-mono text-base font-semibold text-emerald-400">{p}%</p>
                    <div className="h-0.5 rounded-full mt-2 overflow-hidden" style={{ background:'rgba(255,255,255,0.07)' }}>
                      <div className="h-full rounded-full bg-emerald-500 transition-all duration-1000" style={{ width: `${Math.min(p,100)}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Income chart */}
          <div className="col-span-2 rounded-xl p-5" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold mb-0.5">Income vs Expenses</h3>
                <p className="text-xs text-zinc-500">Last 6 months</p>
              </div>
              <div className="flex gap-4">
                <span className="flex items-center gap-1.5 text-[11px] text-zinc-400"><span className="w-3 h-0.5 rounded bg-emerald-500 inline-block"></span>Income</span>
                <span className="flex items-center gap-1.5 text-[11px] text-zinc-400"><span className="w-3 h-0.5 rounded bg-red-500 inline-block"></span>Expenses</span>
              </div>
            </div>
            {data.history?.length > 0 && (
              <Line data={{
                labels: data.history.map((h: any) => h.month),
                datasets: [
                  { label:'Income',   data: data.history.map((h: any) => h.income),   borderColor:'#10b981', backgroundColor:'rgba(16,185,129,0.12)', fill:true, tension:0.4, pointRadius:3, pointBackgroundColor:'#10b981', pointBorderColor:'#080c0a', pointBorderWidth:2, borderWidth:2 },
                  { label:'Expenses', data: data.history.map((h: any) => h.expenses), borderColor:'#ef4444', backgroundColor:'rgba(239,68,68,0.08)',  fill:true, tension:0.4, pointRadius:3, pointBackgroundColor:'#ef4444', pointBorderColor:'#080c0a', pointBorderWidth:2, borderWidth:2 },
                ]
              }} options={{
                responsive:true, maintainAspectRatio:false,
                plugins:{ legend:{ display:false }, tooltip:{ backgroundColor:'#101916', borderColor:'rgba(255,255,255,0.1)', borderWidth:1, padding:10, callbacks:{ label: ctx => `  ${ctx.dataset.label}: $${(ctx.parsed.y ?? 0).toLocaleString()}` } } },
                scales:{ x:{ grid:{ color:'rgba(255,255,255,0.04)' }, ticks:{ color:'#4d5e50', font:{ size:11 } } }, y:{ grid:{ color:'rgba(255,255,255,0.04)' }, ticks:{ color:'#4d5e50', font:{ size:11 }, callback: v => `$${(Number(v)/1000).toFixed(0)}k` } } },
                animation:{ duration: 900 }
              }} style={{ maxHeight: 200 }} />
            )}
          </div>

          {/* Donut */}
          <div className="rounded-xl p-5" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
            <h3 className="text-sm font-semibold mb-0.5">Spending</h3>
            <p className="text-xs text-zinc-500 mb-3">By category</p>
            {data.byCategory?.length > 0 && (
              <div className="relative flex items-center justify-center" style={{ height: 170 }}>
                <Doughnut data={{
                  labels: data.byCategory.map((c: any) => c.category),
                  datasets: [{ data: data.byCategory.map((c: any) => c.amount), backgroundColor: data.byCategory.map((c: any) => c.color), borderColor:'#080c0a', borderWidth:3, hoverOffset:5 }]
                }} options={{ cutout:'72%', plugins:{ legend:{ display:false }, tooltip:{ backgroundColor:'#101916', borderColor:'rgba(255,255,255,0.1)', borderWidth:1 } }, animation:{ animateRotate:true, duration:900 } }} />
                <div className="absolute text-center pointer-events-none">
                  <p className="font-mono text-lg font-semibold">{fmt(totalExpenses)}</p>
                  <p className="text-[10px] text-zinc-500">total</p>
                </div>
              </div>
            )}
            <div className="mt-3 space-y-2">
              {(data.byCategory || []).map((c: any) => (
                <div key={c.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: c.color }} />
                    <span className="text-[11px] text-zinc-400">{c.category}</span>
                  </div>
                  <span className="font-mono text-[11px] text-zinc-200">{fmt(c.amount)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Transactions */}
          <div className="col-span-2 rounded-xl p-5" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Recent Transactions</h3>
              <span className="text-xs text-emerald-400 cursor-pointer hover:opacity-70">View all →</span>
            </div>
            <div className="space-y-0.5">
              {(data.transactions || []).slice(0, 8).map((t: any) => (
                <div key={t.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 cursor-pointer transition-colors">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                       style={{ background: t.type === 'credit' ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.05)' }}>
                    {t.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{t.name}</p>
                    <p className="text-[11px] text-zinc-500">{t.date}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full border border-white/10 text-zinc-400 hidden sm:inline">{t.category}</span>
                  <span className={`font-mono text-sm font-medium min-w-[65px] text-right ${t.type === 'credit' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {t.type === 'credit' ? '+' : '-'}{fmt(t.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Budgets */}
          <div className="rounded-xl p-5" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Budget Tracker</h3>
              <span className="text-xs text-emerald-400 cursor-pointer hover:opacity-70">Edit →</span>
            </div>
            <div className="space-y-3.5">
              {(data.budgets || []).map((b: any) => {
                const p = pct(b.spent, b.limit)
                const over = b.spent > b.limit
                return (
                  <div key={b.id}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[12px]">{b.emoji} {b.category}</span>
                      <span className={`font-mono text-[11px] ${over ? 'text-red-400' : 'text-zinc-400'}`}>
                        {fmt(b.spent)}/{fmt(b.limit)}
                      </span>
                    </div>
                    <div className="h-1 rounded-full overflow-hidden" style={{ background:'rgba(255,255,255,0.07)' }}>
                      <div className="h-full rounded-full transition-all duration-700"
                           style={{ width: `${Math.min(p,100)}%`, background: over ? '#ef4444' : p > 85 ? '#f59e0b' : '#10b981' }} />
                    </div>
                    <p className="text-[10px] mt-1" style={{ color: over ? '#ef4444' : '#4d5e50' }}>
                      {over ? `Over by ${fmt(b.spent - b.limit)}` : `${fmt(b.limit - b.spent)} remaining`}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* AI Advisor */}
          <div className="col-span-3 rounded-xl p-5" style={{ background:'linear-gradient(135deg,rgba(16,185,129,0.06),rgba(6,182,212,0.03))', border:'1px solid rgba(16,185,129,0.22)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0"
                   style={{ boxShadow:'0 0 14px rgba(16,185,129,0.35)' }}>
                <span className="text-white text-sm">🧠</span>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold">AI Financial Advisor</h3>
                <p className="text-[11px] text-zinc-500">Powered by Claude · reads your real data</p>
              </div>
              <button onClick={handleAi} disabled={aiLoading}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50 transition-all hover:-translate-y-0.5"
                      style={{ background:'#10b981', boxShadow:'0 3px 12px rgba(16,185,129,0.35)' }}>
                {aiLoading ? '⏳ Analyzing...' : aiText ? '🔄 Re-analyze' : '▶ Analyze My Finances'}
              </button>
            </div>
            <div className="rounded-lg p-4 text-sm leading-relaxed whitespace-pre-wrap"
                 style={{ background:'rgba(0,0,0,0.2)', border:'1px solid rgba(255,255,255,0.07)',
                          color: aiText ? '#e8ede9' : '#4d5e50' }}>
              {aiText || 'Click "Analyze My Finances" to get personalized AI insights based on your real spending data.'}
            </div>
          </div>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background:'rgba(0,0,0,0.65)', backdropFilter:'blur(4px)' }}>
          <div className="rounded-2xl p-6 w-[360px]" style={{ background:'#0f1a14', border:'1px solid rgba(16,185,129,0.22)' }}>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-[15px] font-semibold">Add Transaction</h2>
              <button onClick={() => setShowModal(false)} className="text-zinc-400 hover:text-white text-xl transition-colors">×</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] text-zinc-500 uppercase tracking-wider mb-1.5">Description</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                       className="w-full px-3 py-2.5 rounded-lg text-sm outline-none focus:ring-1 focus:ring-emerald-500"
                       style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.12)', color:'#e8ede9' }}
                       placeholder="e.g. Spotify Premium" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-zinc-500 uppercase tracking-wider mb-1.5">Amount</label>
                  <input value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                         type="number" className="w-full px-3 py-2.5 rounded-lg text-sm outline-none font-mono focus:ring-1 focus:ring-emerald-500"
                         style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.12)', color:'#e8ede9' }}
                         placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-500 uppercase tracking-wider mb-1.5">Type</label>
                  <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                          className="w-full px-3 py-2.5 rounded-lg text-sm outline-none appearance-none"
                          style={{ background:'#0c1110', border:'1px solid rgba(255,255,255,0.12)', color:'#e8ede9' }}>
                    <option value="debit">Expense</option>
                    <option value="credit">Income</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] text-zinc-500 uppercase tracking-wider mb-1.5">Category</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                        className="w-full px-3 py-2.5 rounded-lg text-sm outline-none appearance-none"
                        style={{ background:'#0c1110', border:'1px solid rgba(255,255,255,0.12)', color:'#e8ede9' }}>
                  {['Food','Housing','Transport','Entertainment','Health','Shopping','Other'].map(c =>
                    <option key={c} value={c}>{c}</option>
                  )}
                </select>
              </div>
              <button onClick={handleAddTx}
                      className="w-full py-3 rounded-lg text-white text-sm font-semibold mt-2 transition-all hover:-translate-y-0.5 active:translate-y-0"
                      style={{ background:'#10b981', boxShadow:'0 4px 14px rgba(16,185,129,0.35)' }}>
                Add Transaction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
