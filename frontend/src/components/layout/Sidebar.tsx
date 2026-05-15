import { NavLink } from 'react-router-dom'
import type { ReactNode } from 'react'

interface NavItem {
  to:        string
  label:     string
  icon:      ReactNode
  pill?:     string
  pillBlue?: boolean
}

interface NavGroup {
  group: string
  items: NavItem[]
}

const NAV: NavGroup[] = [
  {
    group: 'Overview',
    items: [
      {
        to: '/',
        label: 'Dashboard',
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
          </svg>
        ),
      },
      {
        to: '/analytics',
        label: 'Analytics',
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
        ),
        pill: 'Live',
      },
      {
        to: '/transactions',
        label: 'Transactions',
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="1" x2="12" y2="23"/>
            <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
          </svg>
        ),
        pill: '15',
      },
    ],
  },
  {
    group: 'Planning',
    items: [
      {
        to: '/budgets',
        label: 'Budgets',
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        ),
      },
      {
        to: '/goals',
        label: 'Goals',
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
          </svg>
        ),
        pill: '4',
      },
      {
        to: '/investments',
        label: 'Investments',
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
            <polyline points="17 6 23 6 23 12"/>
          </svg>
        ),
      },
    ],
  },
  {
    group: 'AI',
    items: [
      {
        to: '/ai',
        label: 'AI Advisor',
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2a7 7 0 017 7c0 4-3 6-3 9H8c0-3-3-5-3-9a7 7 0 017-7z"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
          </svg>
        ),
        pill: 'New',
        pillBlue: true,
      },
    ],
  },
]

export function Sidebar() {
  return (
    <aside className="w-[220px] flex-shrink-0 flex flex-col border-r"
           style={{ background: '#0a0d12', borderColor: 'rgba(255,255,255,0.07)' }}>

      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5 border-b"
           style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
        <div className="w-8 h-8 rounded-[9px] flex items-center justify-center flex-shrink-0"
             style={{ background: '#6366f1', boxShadow: '0 0 16px rgba(99,102,241,0.4)' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
            <polyline points="16 7 22 7 22 13"/>
          </svg>
        </div>
        <span className="text-[15px] font-semibold tracking-tight text-zinc-100">
          Wealth<span className="text-indigo-400">OS</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-5 overflow-y-auto">
        {NAV.map(({ group, items }) => (
          <div key={group}>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600 px-2.5 mb-1">
              {group}
            </p>
            <div className="space-y-0.5">
              {items.map(({ to, label, icon, pill, pillBlue }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `relative flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] transition-all
                    ${isActive
                      ? 'bg-indigo-500/10 text-indigo-300 font-medium'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-r"
                              style={{ background: '#6366f1', boxShadow: '0 0 6px rgba(99,102,241,0.6)' }} />
                      )}
                      <span className={isActive ? 'text-indigo-400' : 'opacity-60'}>{icon}</span>
                      <span>{label}</span>
                      {pill && (
                        <span className={`ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-full
                          ${pillBlue
                            ? 'bg-sky-500/10 text-sky-400'
                            : 'bg-indigo-500/10 text-indigo-400'}`}>
                          {pill}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="p-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl cursor-pointer
                        hover:bg-white/5 transition-colors">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-[11px]
                          font-semibold text-indigo-300 border"
               style={{ background: 'rgba(99,102,241,0.12)', borderColor: 'rgba(99,102,241,0.25)' }}>
            GS
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12.5px] font-medium text-zinc-200 truncate">Gabriel Santos</p>
            <p className="text-[11px] text-zinc-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              Pro Plan
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
