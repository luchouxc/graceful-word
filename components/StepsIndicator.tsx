const STEPS = ['Plan', 'Pago', 'Confirmación', 'Agendar']

export default function StepsIndicator({ current }: { current: 1 | 2 | 3 | 4 }) {
  return (
    <div className="steps-wrap">
      {STEPS.map((label, i) => {
        const num    = i + 1
        const done   = num < current
        const active = num === current

        const circleStyle = {
          border:     done   ? '1px solid var(--success)'
                     : active ? '1px solid var(--violet)'
                     :          '1px solid rgba(195,164,232,0.25)',
          color:      done   ? 'var(--success)'
                     : active ? 'var(--white)'
                     :          'var(--text-soft)',
          background: done   ? 'rgba(110,221,176,0.12)'
                     : active ? 'var(--violet)'
                     :          'rgba(61,31,107,0.2)',
          boxShadow:  active ? '0 0 14px rgba(155,109,212,0.4)' : 'none',
        }

        const labelColor = done ? 'var(--success)' : active ? 'var(--lavender)' : 'var(--text-soft)'
        const lineColor  = done ? 'rgba(110,221,176,0.35)' : 'rgba(195,164,232,0.15)'

        return (
          <div key={label} style={{ display: 'flex', alignItems: 'center' }}>
            <div className="step-dot">
              <div className="step-circle" style={circleStyle}>
                {done ? '✓' : num}
              </div>
              <div className="step-label" style={{ color: labelColor }}>{label}</div>
            </div>
            {i < STEPS.length - 1 && (
              <div className="step-line" style={{ width: 52, background: lineColor }} />
            )}
          </div>
        )
      })}
    </div>
  )
}
