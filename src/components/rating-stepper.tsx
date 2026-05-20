import React from 'react'
import { Rating } from './rating'

interface RatingStepperProps {
  value: number | null
  onChange: (value: number | null) => void
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function RatingStepper({ value, onChange, size = 'md', className = '' }: RatingStepperProps) {
  const canDecrement = value !== null && value > 0
  const canIncrement = value === null || value < 10

  const decrement = () => {
    if (value === null) return
    if (value === 0) onChange(null)
    else onChange(value - 1)
  }

  const increment = () => {
    if (value === null) onChange(0)
    else if (value < 10) onChange(value + 1)
  }

  const btnBase = `
    inline-flex items-center justify-center 
    w-8 h-8 
    font-caveat font-bold text-lg
    bg-paper border-2 border-ink
    shadow-stamp
    cursor-pointer select-none
    transition-transform active:translate-y-px
  `

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={decrement}
        disabled={!canDecrement}
        className={`${btnBase} ${!canDecrement ? 'opacity-40 cursor-not-allowed' : 'hover:bg-paper2'}`}
        style={{ borderRadius: 'var(--radius-sm)' }}
        aria-label="Decrease rating"
      >
        −
      </button>

      <Rating value={value} size={size} />

      <button
        type="button"
        onClick={increment}
        disabled={!canIncrement}
        className={`${btnBase} ${!canIncrement ? 'opacity-40 cursor-not-allowed' : 'hover:bg-paper2'}`}
        style={{ borderRadius: 'var(--radius-sm)' }}
        aria-label="Increase rating"
      >
        +
      </button>
    </div>
  )
}
