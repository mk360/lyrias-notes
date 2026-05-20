import React from 'react'

type PortraitTone = 'default' | 'warm' | 'dim'
type PortraitSize = 28 | 36 | 48 | 56 | 120

interface PortraitProps {
  tag: string
  tone?: PortraitTone
  size?: PortraitSize
  imgSrc?: string
  className?: string
  onClick?: () => void
}

const toneStyles: Record<PortraitTone, { bg: string; text: string }> = {
  default: { bg: 'linear-gradient(135deg, #C3DEEE 0%, #5390B5 100%)', text: '#1F2D3E' },
  warm:    { bg: 'linear-gradient(135deg, #E8C97A 0%, #C49A3B 100%)', text: '#1F2D3E' },
  dim:     { bg: 'linear-gradient(135deg, #F2E9CF 0%, #E8DEBA 100%)', text: '#8C9CAD' },
}

const fontSizes: Record<PortraitSize, string> = {
  28:  '10px',
  36:  '12px',
  48:  '14px',
  56:  '16px',
  120: '28px',
}

export function Portrait({ tag, tone = 'default', size = 48, imgSrc, className = '', onClick }: PortraitProps) {
  const { bg, text } = toneStyles[tone]
  const fontSize = fontSizes[size]

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center justify-center shrink-0 overflow-hidden border-2 border-ink shadow-stamp ${className} ${onClick ? 'cursor-pointer' : ''}`}
      style={{
        width: size,
        height: size,
        background: imgSrc ? undefined : bg,
        borderRadius: 'var(--radius-md)',
      }}
    >
      {imgSrc ? (
        <img src={imgSrc} alt={tag} className="w-full h-full object-cover" />
      ) : (
        <span
          className="font-caveat font-bold select-none"
          style={{ fontSize, color: text, lineHeight: 1 }}
        >
          {tag}
        </span>
      )}
    </div>
  )
}
