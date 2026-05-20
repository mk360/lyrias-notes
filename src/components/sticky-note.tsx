import React from 'react'

type StickyTone = 'gold' | 'sky'

interface StickyNoteProps {
  children: React.ReactNode
  tone?: StickyTone
  tilt?: number
  className?: string
}

const toneStyles: Record<StickyTone, string> = {
  gold: 'bg-goldLt border-gold',
  sky:  'bg-sky200 border-sky300',
}

export function StickyNote({ children, tone = 'gold', tilt = 2.5, className = '' }: StickyNoteProps) {
  return (
    <div
      className={`
        p-3
        border border-ink
        font-body-sm text-ink
        ${toneStyles[tone]}
        ${className}
      `}
      style={{
        borderRadius: 'var(--radius-md)',
        transform: `rotate(${tilt}deg)`,
        boxShadow: '2px 3px 0 rgba(31,45,62,0.18)',
        borderWidth: 0.6,
      }}
    >
      {children}
    </div>
  )
}
