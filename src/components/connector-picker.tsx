import type { ConnectorType } from '@/lib/types'
import { useEffect, useRef } from 'react'

interface ConnectorPickerProps {
  value: ConnectorType
  onChange: (value: ConnectorType) => void
  onClose: () => void
}

export const COMBO_CHAIN_OPTIONS: { [k in ConnectorType]: {
  label: string;
  display: string;
} } = {
  "cancel": {
    label: "Cancel",
    display: ">"
  },
  "delay": {
    label: "Delay",
    display: "dl."
  },
  "link": {
    label: "Link",
    display: ","
  },
  "microdash": {
    label: "Microdash",
    display: "md."
  },
  "stance switch": {
    label: "Stance Switch",
    display: "~"
  }
}

export function ConnectorPicker({ value, onChange, onClose }: ConnectorPickerProps) {
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        zIndex: 50,
        background: 'var(--color-paper)',
        border: '2px solid var(--color-ink)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-stamp-lg)',
        padding: '4px',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        minWidth: 100,
      }}
    >
      {(Object.keys(COMBO_CHAIN_OPTIONS) as ConnectorType[]).map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => { onChange(opt); onClose() }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            padding: '6px 10px',
            background: opt === value ? 'var(--color-sky100)' : 'transparent',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontFamily: 'Fredoka, sans-serif',
            fontSize: 13,
            color: 'var(--color-ink)',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-paper2)')}
          onMouseLeave={e => (e.currentTarget.style.background = opt === value ? 'var(--color-sky100)' : 'transparent')}
        >
          <span>{COMBO_CHAIN_OPTIONS[opt].label}</span>
          <span style={{
            fontFamily: 'Special Elite, monospace',
            fontSize: 12,
            color: 'var(--color-ink2)',
          }}>
            {COMBO_CHAIN_OPTIONS[opt].display}
          </span>
        </button>
      ))}
    </div>
  )
}

const display: Record<ConnectorType, string> = {
  cancel: '>',
  delay:  'dl.',
  link:   ',',
  "stance switch": "~",
  "microdash": "md."
}

// Helper to render a connector token
export function ConnectorToken({
  value,
  onClick,
}: {
  value: ConnectorType
  onClick?: () => void
}) {

  return (
    <button
      type="button"
      onClick={onClick}
      title="Click to change connector"
      style={{
        fontFamily: 'Special Elite, monospace',
        fontSize: 13,
        color: 'var(--color-ink2)',
        background: 'transparent',
        border: '1px dashed var(--color-ink)',
        borderRadius: '4px',
        padding: '0 4px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'border-color 0.1s, color 0.1s',
      }}
      onMouseEnter={e => {
        if (!onClick) return
        e.currentTarget.style.borderColor = 'var(--color-rule)'
        e.currentTarget.style.color = 'var(--color-ink)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'transparent'
        e.currentTarget.style.color = 'var(--color-ink2)'
      }}
    >
      {display[value]}
    </button>
  )
}