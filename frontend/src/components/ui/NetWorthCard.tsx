import { useEffect, useRef } from 'react'

interface NetWorthCardProps {
  value:      number
  change:     number
  liquid:     number
  investments: number
  realEstate: number
  cashFlow:   number
  history:    number[]
}

function animateCount(
  el: HTMLElement,
  target: number,
  duration = 1400
) {
  const start = Date.now()
  function tick() {
    const elapsed  = Date.now() - start
    const progress = Math.min(elapsed / duration, 1)
    const ease     = 1 - Math.pow(1 - progress, 3)
    const current  = Math.round(target * ease)
    el.textContent = '$' + current.toLocaleString('en-US')
    if (progress < 1) requestAnimationFrame(tick)
    else el.textContent = '$' + target.toLocaleString('en-US')
  }
  requestAnimationFrame(tick)
}

export function NetWorthCard({
  value, change, liquid, investments, realEstate, cashFlow, history,
}: NetWorthCardProps) {
  const valueRef   = useRef<HTMLDivElement>(null)
  const canvasRef  = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (valueRef.current) animateCount(valueRef.current, value)
  }, [value])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !history.length) return
    const ctx = canvas.getContext('2d')!
    const w = canvas.width, h = canvas.height
    const min = Math.min(...history), max = Math.max(...history)
    const range = max - min || 1

    const grad = ctx.createLinearGradient(0, 0, 0, h)
    grad.addColorStop(0, 'rgba(99,102,241,0.35)')
    grad.addColorStop(1, 'rgba(99,102,241,0)')

    ctx.clearRect(0, 0, w, h)
    ctx.beginPath()
    history.forEach((v, i) => {
      const x = (i / (history.length - 1)) * w
      const y = h - ((v - min) / range) * (h - 8) - 4
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    })
    const last = history[history.length - 1]
    const lastX = w
    const lastY = h - ((last - min) / range) * (h - 8) - 4
    ctx.lineTo(lastX, lastY)
    ctx.lineTo(lastX, h)
    ctx.lineTo(0, h)
    ctx.closePath()
    ctx.fillStyle = grad
    ctx.fill()

    ctx.beginPath()
    history.forEach((v, i) => {
      const x = (i / (history.length - 1)) * w
      const y = h - ((v - min) / range) * (h - 8) - 4
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    })
    ctx.strokeStyle = '#6366f1'
    ctx.lineWidth   = 2
    ctx.stroke()
  }, [history])

  const positive = change >= 0

  return (
    <div className="relative col-span-2 rounded-2xl p-6 overflow-hidden border"
         style={{ background: 'linear-gradient(145deg,rgba(99,102,241,0.1),rgba(6,182,212,0.05))',
                  borderColor: 'rgba(99,102,241,0.22)' }}>
      <div className="relative z-10">
        <p className="text-xs font-semibold tracking-widest uppercase text-indigo-400 mb-1">
          Total Net Worth
        </p>
        <div className="flex items-center gap-3 mb-4">
          <div ref={valueRef}
               className="font-display text-5xl font-extrabold tracking-tight"
               style={{ background: 'linear-gradient(135deg,#eef0f8 40%,#818cf8)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            $0
          </div>
          <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
            positive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
          }`}>
            {positive ? '▲' : '▼'} ${Math.abs(change).toLocaleString()} this month
          </span>
        </div>
        <div className="flex gap-6">
          {[
            { label: 'Liquid Assets',    val: liquid      },
            { label: 'Investments',      val: investments  },
            { label: 'Real Estate',      val: realEstate   },
            { label: 'Monthly Cash Flow', val: cashFlow, color: 'text-emerald-400' },
          ].map(({ label, val, color }) => (
            <div key={label}>
              <p className="text-xs text-zinc-500 mb-1">{label}</p>
              <p className={`font-mono text-sm font-medium ${color ?? 'text-zinc-200'}`}>
                {val >= 0 ? '+' : ''}${val.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
      <canvas ref={canvasRef} width={220} height={120}
              className="absolute right-0 bottom-0 top-0 opacity-40 pointer-events-none" />
    </div>
  )
}
