import React, { useEffect, useRef } from 'react'
import type { DialogOptions, DialogVariant } from '@/context/DialogContext'

// ── Per-variant design tokens ─────────────────────────────────────────────────
const VARIANTS: Record<
  DialogVariant,
  { stripe: string; iconBg: string; icon: string; primaryBg: string; primaryFg: string }
> = {
  info: {
    stripe:    'var(--color-sky500)',
    iconBg:    'var(--color-sky200)',
    icon:      'ℹ',
    primaryBg: 'var(--color-sky700)',
    primaryFg: 'var(--color-paper)',
  },
  warning: {
    stripe:    'var(--color-gold)',
    iconBg:    'var(--color-goldLt)',
    icon:      '⚠',
    primaryBg: 'var(--color-gold)',
    primaryFg: 'var(--color-ink)',
  },
  danger: {
    stripe:    'var(--color-red)',
    iconBg:    '#F5D0C8',
    icon:      '✕',
    primaryBg: 'var(--color-red)',
    primaryFg: 'var(--color-paper)',
  },
  confirm: {
    stripe:    'var(--color-ink)',
    iconBg:    'var(--color-paper3)',
    icon:      '?',
    primaryBg: 'var(--color-ink)',
    primaryFg: 'var(--color-paper)',
  },
  success: {
    stripe:    'var(--color-green)',
    iconBg:    '#C8E8D0',
    icon:      '✓',
    primaryBg: 'var(--color-green)',
    primaryFg: 'var(--color-paper)',
  },
}

interface AppDialogProps {
  options: DialogOptions
  onClose: () => void
}

export function AppDialog({ options, onClose }: AppDialogProps) {
  const { variant, title, message, primary, secondary } = options
  const v = VARIANTS[variant]
  const dialogRef = useRef<HTMLDialogElement>(null)

  // Open the native <dialog> on mount and wire up close-on-backdrop-click
  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    el.showModal()

    function handleBackdropClick(e: MouseEvent) {
      // clicks on the ::backdrop land on the <dialog> element itself
      const rect = el!.getBoundingClientRect()
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      if (!inside) onClose()
    }

    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') { e.preventDefault(); onClose() }
    }

    el.addEventListener('click', handleBackdropClick)
    window.addEventListener('keydown', handleEsc)
    return () => {
      el.removeEventListener('click', handleBackdropClick)
      window.removeEventListener('keydown', handleEsc)
    }
  }, [onClose])

  function handlePrimary() {
    primary.onClick()
    onClose()
  }

  function handleSecondary() {
    secondary?.onClick()
    onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      style={{
        // Reset browser dialog defaults
        border: 'none',
        padding: 0,
        background: 'transparent',
        maxWidth: '100vw',
        width: '100%',
      }}
    >
      {/* Backdrop style injected via global CSS in globals.css — see below */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '16px',
          // Pointer events pass through to the <dialog> for backdrop detection
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            pointerEvents: 'auto',
            background: 'var(--color-paper)',
            border: '2.5px solid var(--color-ink)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-float)',
            width: '100%',
            maxWidth: 440,
            overflow: 'hidden',
            // Slight tilt — hand-crafted feel
            transform: 'rotate(-0.4deg)',
          }}
        >
          {/* Accent stripe */}
          <div style={{ height: 5, background: v.stripe }} />

          {/* Body */}
          <div style={{ padding: '24px 24px 20px' }}>

            {/* Icon + title row */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: v.iconBg,
                  border: '2px solid var(--color-ink)',
                  borderRadius: 'var(--radius-sm)',
                  boxShadow: 'var(--shadow-stamp-sm)',
                  fontFamily: 'Caveat, cursive',
                  fontSize: 20,
                  fontWeight: 700,
                  color: 'var(--color-ink)',
                  userSelect: 'none',
                }}
              >
                {v.icon}
              </div>
              <h2
                style={{
                  fontFamily: 'Caveat, cursive',
                  fontSize: 26,
                  fontWeight: 700,
                  lineHeight: 1.1,
                  color: 'var(--color-ink)',
                  margin: 0,
                  paddingTop: 2,
                }}
              >
                {title}
              </h2>
            </div>

            {/* Message */}
            <p
              style={{
                fontFamily: 'Fredoka, sans-serif',
                fontSize: 15,
                lineHeight: 1.6,
                color: 'var(--color-ink2)',
                margin: '0 0 24px',
                paddingLeft: 54, // aligns under title, past icon
              }}
            >
              {message}
            </p>

            {/* Actions */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 10,
                paddingTop: 16,
                borderTop: '1.5px dashed var(--color-rule)',
              }}
            >
              {secondary && (
                <button
                  onClick={handleSecondary}
                  style={{
                    fontFamily: 'Fredoka, sans-serif',
                    fontSize: 14,
                    fontWeight: 500,
                    padding: '8px 18px',
                    background: 'var(--color-paper)',
                    color: 'var(--color-ink)',
                    border: '2px solid var(--color-ink)',
                    borderRadius: 'var(--radius-sm)',
                    boxShadow: 'var(--shadow-stamp-sm)',
                    cursor: 'pointer',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-paper2)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-paper)')}
                >
                  {secondary.label}
                </button>
              )}

              <button
                onClick={handlePrimary}
                style={{
                  fontFamily: 'Fredoka, sans-serif',
                  fontSize: 14,
                  fontWeight: 500,
                  padding: '8px 20px',
                  background: v.primaryBg,
                  color: v.primaryFg,
                  border: '2px solid var(--color-ink)',
                  borderRadius: 'var(--radius-sm)',
                  boxShadow: 'var(--shadow-stamp)',
                  cursor: 'pointer',
                  transition: 'opacity 0.1s, transform 0.08s',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                onMouseDown={e => (e.currentTarget.style.transform = 'translateY(1px)')}
                onMouseUp={e => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                {primary.label}
              </button>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  )
}
