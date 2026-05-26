import React from 'react'

interface MoveChipProps {
  label: string
  onClick?: () => void
  onRemove?: () => void
  className?: string
}

export function MoveChip({ label, onClick, onRemove, className = '' }: MoveChipProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1
        font-elite text-sm
        bg-paper2 border-2 border-ink
        shadow-stamp-sm
        px-2 py-px
        ${onClick ? 'cursor-pointer hover:bg-paper3' : ''}
        ${className}
      `}
      style={{ borderRadius: 'var(--radius-sm)' }}
      onClick={onClick}
    >
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={e => { e.stopPropagation(); onRemove() }}
          className="ml-px text-ink3 hover:text-red leading-none"
          aria-label="Remove chip"
        >
          ✕
        </button>
      )}
    </span>
  )
}
