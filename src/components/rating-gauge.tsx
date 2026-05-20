import React from 'react'
import { getRatingBucket } from '@/lib/types'

interface RatingGaugeProps {
  value: number | null
  className?: string
}

export function RatingGauge({ value, className = '' }: RatingGaugeProps) {
  return (
    <div className={`inline-flex gap-px ${className}`} aria-label={value !== null ? `Rating ${value}/10` : 'Unrated'}>
      {Array.from({ length: 10 }, (_, i) => {
        const filled = value !== null && i < value
        const bucket = getRatingBucket(i + 1)
        return (
          <div
            key={i}
            className="w-3 h-4 border border-ink"
            style={{
              borderRadius: '2px 1px 2px 1px / 1px 2px 1px 2px',
              background: filled ? bucket.bg : 'var(--color-paper)',
            }}
          />
        )
      })}
    </div>
  )
}
