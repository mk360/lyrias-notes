import React from 'react'

export type MoveDisplay = 'input' | 'name'

interface MoveDisplayToggleProps {
  value: MoveDisplay
  onChange: (value: MoveDisplay) => void
  className?: string
}

export function MoveDisplayToggle({ value, onChange, className = '' }: MoveDisplayToggleProps) {
  const isInput = value === 'input'

  return (
    <div
      className={`inline-flex items-center gap-2 p-2 flex items-center ${className}`}
      role="group"
      aria-label="Move display mode"
    >
      {/* "Input" label */}
      <span
        onClick={() => onChange('input')}
        style={{
          fontFamily: 'Special Elite, monospace',
          fontSize: 12,
          color: isInput ? 'var(--color-ink)' : 'var(--color-ink3)',
          fontWeight: isInput ? 700 : 400,
          cursor: 'pointer',
          userSelect: 'none',
          transition: 'color 0.15s',
        }}
      >
        Input
      </span>

      {/* Slider track */}
      <button
        type="button"
        role="switch"
        aria-checked={!isInput}
        onClick={() => onChange(isInput ? 'name' : 'input')}
        style={{
          position: 'relative',
          width: 44,
          height: 24,
          border: '2px solid var(--color-ink)',
          borderRadius: '999px',
          background: isInput ? 'var(--color-ink)' : 'var(--color-paper3)',
          boxShadow: 'var(--shadow-stamp-sm)',
          cursor: 'pointer',
          padding: 0,
          flexShrink: 0,
          transition: 'background 0.2s',
        }}
      >
        {/* Thumb */}
        <span
          style={{
            position: 'absolute',
            top: 2,
            left: isInput ? 2 : 18,
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: isInput ? 'var(--color-goldLt)' : 'var(--color-ink)',
            border: '1.5px solid var(--color-ink)',
            boxShadow: '1px 1px 0 rgba(31,45,62,0.25)',
            transition: 'left 0.18s cubic-bezier(0.4,0,0.2,1), background 0.18s',
            display: 'block',
          }}
        />
      </button>

      {/* "Name" label */}
      <span
        onClick={() => onChange('name')}
        style={{
          fontFamily: 'Fredoka, sans-serif',
          fontSize: 13,
          color: !isInput ? 'var(--color-ink)' : 'var(--color-ink3)',
          fontWeight: !isInput ? 600 : 400,
          cursor: 'pointer',
          userSelect: 'none',
          transition: 'color 0.15s',
        }}
      >
        Name
      </span>
    </div>
  )
}
