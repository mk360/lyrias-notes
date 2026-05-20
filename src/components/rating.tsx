import React, { useMemo } from 'react'
import { getRatingBucket } from '@/lib/types'

type RatingSize = 'sm' | 'md' | 'lg'

interface RatingProps {
  value: number | null
  size?: RatingSize
  className?: string
}

const sizeMap: Record<RatingSize, number> = { sm: 32, md: 44, lg: 56 }

// Deterministic rotation wobble based on value
function getRotation(value: number | null): number {
  if (value === null) return 0
  // Map 0-10 to -7..+7 degrees
  return ((value * 1.618) % 14) - 7
}

export function Rating({ value, size = 'md', className = '' }: RatingProps) {
  const px = sizeMap[size]
  const bucket = getRatingBucket(value)
  const rotation = useMemo(() => getRotation(value), [value])
  const fontSize = size === 'sm' ? 14 : size === 'md' ? 20 : 26
  const filterId = `stamp-${size}-${value ?? 'u'}`

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: px, height: px, transform: `rotate(${rotation}deg)` }}
    >
      <svg
        width={px}
        height={px}
        viewBox={`0 0 ${px} ${px}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label={value !== null ? `Rating: ${value}` : 'Unrated'}
      >
        <defs>
          <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" seed={value ?? 99} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.8" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>

        {/* Background circle */}
        <circle
          cx={px / 2}
          cy={px / 2}
          r={px / 2 - 3}
          fill={bucket.bg}
        />

        {/* Stamp ring with displacement filter */}
        <circle
          cx={px / 2}
          cy={px / 2}
          r={px / 2 - 3}
          stroke={bucket.fg}
          strokeWidth="2"
          fill="none"
          filter={`url(#${filterId})`}
        />

        {/* Numeral */}
        <text
          x={px / 2}
          y={px / 2 + fontSize * 0.36}
          textAnchor="middle"
          fontFamily="Caveat, cursive"
          fontSize={fontSize}
          fontWeight="700"
          fill={bucket.fg}
        >
          {value !== null ? value : '·'}
        </text>
      </svg>
    </div>
  )
}
