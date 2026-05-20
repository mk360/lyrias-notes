import React from 'react'

type WashiTone = 'gold' | 'sky'

interface WashiLabelProps {
  children: React.ReactNode
  tone?: WashiTone
  className?: string
}

const toneStyles: Record<WashiTone, string> = {
  gold: 'bg-goldLt text-ink border-gold',
  sky:  'bg-sky200 text-sky700 border-sky300',
}

export function WashiLabel({ children, tone = 'sky', className = '' }: WashiLabelProps) {
  return (
    <span
      className={`
        inline-block
        font-fredoka font-600 text-xs uppercase tracking-widest
        border-2 px-3 py-1
        ${toneStyles[tone]}
        ${className}
      `}
      style={{
        borderRadius: 'var(--radius-sm)',
        transform: 'rotate(-1.2deg)',
        display: 'inline-block',
        boxShadow: '1.5px 1.5px 0 rgba(31,45,62,0.25)',
      }}
    >
      {children}
    </span>
  )
}
