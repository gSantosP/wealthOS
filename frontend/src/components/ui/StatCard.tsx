import type { ReactNode } from 'react'

interface StatCardProps {
  label:    string
  value:    string
  change:   string
  up:       boolean
  icon:     ReactNode
  iconBg:   string
  valueColor?: string
  delay?:   number
}

export function StatCard({ label, value, change, up, icon, iconBg, valueColor, delay = 0 }: StatCardProps) {
  return (
    <div
      className="rounded-2xl border p-4 transition-colors hover:border-white/10"
      style={{
        background:   'rgba(255,255,255,0.03)',
        borderColor:  'rgba(255,255,255,0.07)',
        animation:    `fadeUp 0.4s ease ${delay}s both`,
      }}
    >
      <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3"
           style={{ background: iconBg }}>
        {icon}
      </div>
      <p className="text-[11px] font-medium text-zinc-500 mb-1">{label}</p>
      <p className="font-mono text-[19px] font-semibold tracking-tight"
         style={{ color: valueColor ?? '#eef0f8' }}>
        {value}
      </p>
      <p className={`text-[11.5px] mt-1.5 ${up ? 'text-emerald-400' : 'text-red-400'}`}>
        {change}
      </p>
    </div>
  )
}
