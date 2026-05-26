import { getRatingBucket } from '@/lib/types'

interface RatingCellProps {
  value: number | null
  onClick?: () => void
  size?: number
  className?: string
}

export function RatingCell({ value, onClick, size = 32, className = '' }: RatingCellProps) {
  const bucket = getRatingBucket(value)

  return (
    <div
      onClick={onClick}
      title={value !== null ? `Rating: ${value}` : 'Unrated — click to add notes'}
      className={`
        inline-flex items-center justify-center shrink-0
        border-2 border-ink shadow-stamp
        font-caveat font-bold
        ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
        ${className}
      `}
      style={{
        width: size,
        height: size,
        background: bucket.bg,
        color: bucket.fg,
        borderRadius: 'var(--radius-sm)',
        fontSize: size < 28 ? 16 : 20,
      }}
    >
      {value !== null ? value : '·'}
    </div>
  )
}
