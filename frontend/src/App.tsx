import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Sidebar }        from './components/layout/Sidebar'
import { Dashboard }      from './pages/Dashboard'
import { Analytics }      from './pages/Analytics'
import { Transactions }   from './pages/Transactions'
import { Goals }          from './pages/Goals'
import { Budgets }        from './pages/Budgets'
import { useWealthStore } from './hooks/useWealthStore'

function AppLayout() {
  const { fetchDashboard, loading } = useWealthStore()

  useEffect(() => { fetchDashboard() }, [fetchDashboard])

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#07080d' }}>
      {/* Dot-grid ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0"
           style={{
             backgroundImage: 'radial-gradient(rgba(99,102,241,0.06) 1px, transparent 1px)',
             backgroundSize:  '28px 28px',
           }} />
      {/* Ambient glow */}
      <div className="fixed pointer-events-none z-0"
           style={{
             bottom: -180, left: -120,
             width: 520, height: 520,
             borderRadius: '50%',
             background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)',
           }} />

      <div className="relative z-10 flex w-full h-full">
        <Sidebar />
        <main className="flex-1 min-w-0 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-8 h-8 border-2 rounded-full animate-spin"
                   style={{ borderColor: 'rgba(99,102,241,0.2)', borderTopColor: '#6366f1' }} />
            </div>
          ) : (
            <Routes>
              <Route path="/"             element={<Dashboard />} />
              <Route path="/analytics"    element={<Analytics />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/goals"        element={<Goals />} />
              <Route path="/budgets"      element={<Budgets />} />
              <Route path="/investments"  element={<Navigate to="/" replace />} />
              <Route path="/ai"           element={<Navigate to="/" replace />} />
              <Route path="*"             element={<Navigate to="/" replace />} />
            </Routes>
          )}
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}
