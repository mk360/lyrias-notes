import React, { useState } from 'react'

interface CoverAnimationProps {
  /** Called once the flip animation fully completes and the cover is removed */
  onDone?: () => void
  /** Use the full-viewport variant instead of the card-shaped one */
  fullscreen?: boolean
}

export function CoverAnimation({ onDone, fullscreen = false }: CoverAnimationProps) {
  const [gone, setGone] = useState(false)

  if (gone) return null

  function handleAnimationEnd() {
    setGone(true)
    onDone?.()
  }

  return (
    // Outer wrapper matches the NotebookFrame card's positioning context
    <div
      className={fullscreen ? 'notebook-cover-fullscreen' : 'notebook-cover'}
      onAnimationEnd={handleAnimationEnd}
      aria-hidden="true"
      style={{
        // Gold-to-parchment gradient — same palette as the app
        background: `
          linear-gradient(
            160deg,
            var(--color-paper2)  0%,
            var(--color-paper3)  55%,
            var(--color-paper2) 100%
          )
        `,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
      }}
    >
      {/* Decorative top rule */}
      <div style={{
        width: '55%',
        height: 2,
        background: `linear-gradient(90deg, transparent, var(--color-gold), transparent)`,
        marginBottom: 8,
      }} />

      {/* Main title */}
      <span className="notebook-cover-title">
        Lyria's Notebook
      </span>

      {/* Subtitle */}
      <span style={{
        fontFamily: 'Special Elite, monospace',
        fontSize: 13,
        color: 'var(--color-goldDk)',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        opacity: 0.8,
      }}>
        GBVSR Training Journal
      </span>

      {/* Decorative bottom rule */}
      <div style={{
        width: '55%',
        height: 2,
        background: `linear-gradient(90deg, transparent, var(--color-gold), transparent)`,
        marginTop: 8,
      }} />

      {/* Binding strip on the left edge — mirrors the real one */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: 36,
        height: '100%',
        background: 'var(--color-paper3)',
        borderRight: '2px solid var(--color-ink)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 16,
        gap: 0,
      }}>
        {/* Brand text — same as the real binding strip */}
        <div style={{
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          fontFamily: 'Caveat, cursive',
          fontWeight: 700,
          fontSize: 13,
          color: 'var(--color-ink)',
          letterSpacing: '0.08em',
          opacity: 0.55,
          marginBottom: 12,
          userSelect: 'none',
          whiteSpace: 'nowrap',
        }}>
          Lyria's Notebook
        </div>

        {/* Binding holes */}
        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: 'var(--color-paper)',
              border: '1.5px solid var(--color-ink)',
              boxShadow: 'inset 1px 1px 2px rgba(31,45,62,0.18)',
              margin: '4px 0',
              flexShrink: 0,
            }}
          />
        ))}
      </div>
    </div>
  )
}
