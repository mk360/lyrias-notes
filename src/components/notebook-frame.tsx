import { useSettings } from '@/context/SettingsContext'
import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

type NavTab = 'roster' | 'matchups' | 'combos' | 'you' | "progress" | "about" 

interface NotebookFrameProps {
  children: React.ReactNode
  spreadMode?: boolean
  activeTab?: NavTab
}

const TABS: { id: NavTab; label: string; path: string }[] = [
  { id: 'roster',   label: 'Roster',   path: '/' },
  { id: 'matchups', label: 'Matchups', path: '/matchups' },
  { id: 'combos',   label: 'Combos',   path: '/combos' },
  { id: 'progress', label: 'My Progress', path: '/progress' },
  // { id: "about", label: "About", path: "/about" }
]

const HOLE_COUNT = 18

export function NotebookFrame({ children, spreadMode = false, activeTab }: NotebookFrameProps) {
  const navigate = useNavigate()
  const location = useLocation()

  // Determine active tab from current path if not provided
  const currentTab = activeTab ?? (
    TABS.find(t => location.pathname.startsWith(t.path))?.id ?? 'roster'
  )

  return (
    <>
    <div
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{
        background: `
          radial-gradient(ellipse at top left, rgba(195,222,238,0.35) 0%, transparent 55%),
          radial-gradient(ellipse at bottom right, rgba(196,154,59,0.18) 0%, transparent 55%),
          var(--color-paper)
        `,
      }}
    >
      {/* Main notebook card */}
      <div
        className="relative flex w-full max-w-7xl min-h-[640px] max-h-[660px]"
        style={{
          border: '2px solid var(--color-ink)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-stamp-lg)',
          background: 'var(--color-paper)',
        }}
      >
        {/* Binding strip (left edge) */}
        <div
          className="flex flex-col items-center py-4 gap-0 shrink-0"
          style={{
            width: 36,
            background: 'var(--color-paper3)',
            borderRight: '2px solid var(--color-ink)',
          }}
        >
          {/* Brand mark — rotated vertically, sits above the holes */}
          <div
            style={{
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
            }}
          >
            Lyria's Notebook
          </div>

          {Array.from({ length: HOLE_COUNT }).map((_, i) => (
            <div
              key={i}
              className="binding-hole my-1 shrink-0"
            />
          ))}
        </div>

        {/* Page content area ; monkey-patch frame to adjust for roster grid scrollable behavior */}
        <div className={`flex-1 relative ${activeTab !== "roster" ? "overflow-auto" : null}`}>
          {/* Center fold line for spread mode */}
          {spreadMode && (
            <div
              className="absolute inset-y-0 left-1/2 w-px pointer-events-none z-10"
              style={{
                borderLeft: '1.5px dashed var(--color-rule)',
                transform: 'translateX(-50%)',
              }}
            />
          )}
          {children}
        </div>

        {/* Nav tabs (right edge) */}
        <div
          className="flex flex-col shrink-0"
          style={{
            width: 100,
            borderLeft: '2px solid var(--color-ink)',
          }}
        >
          {TABS.map(tab => {
            const isActive = tab.id === currentTab
            return (
              <button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className="
                  relative font-fredoka font-500
                  py-3 text-center
                  border-b-2 border-ink
                  transition-all cursor-pointer
                  select-none
                "
                style={{
                  background: isActive ? 'var(--color-ink)' : 'var(--color-paper2)',
                  color: isActive ? 'var(--color-paper)' : 'var(--color-ink)',
                  transform: isActive ? 'translateX(-4px)' : undefined,
                  zIndex: isActive ? 1 : 0,
                }}
              >
                {tab.label}
              </button>
            )
          })}
          <div className='p-2'><ThemeToggle /></div>
        </div>
      </div>
    </div>
    </>
  )
}


function ThemeToggle({ className = '' }: { className?: string }) {
  const { settings, setTheme } = useSettings()
  const isDark = settings.theme === 'dark'

  return (
    <div
      className={`inline-flex items-center gap-2 ${className}`}
      role="group"
      aria-label="Theme"
    >
      {/* Sun */}
      <span
        onClick={() => setTheme('light')}
        style={{
          fontSize: 16,
          cursor: 'pointer',
          opacity: isDark ? 0.4 : 1,
          transition: 'opacity 0.15s',
          userSelect: 'none',
        }}
        title="Light mode"
      >
        ☀
      </span>

      {/* Track */}
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        style={{
          position: 'relative',
          width: 44,
          height: 24,
          border: '2px solid var(--color-ink)',
          borderRadius: '999px',
          background: isDark ? 'var(--color-ink)' : 'var(--color-paper3)',
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
            left: isDark ? 18 : 2,
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: isDark ? 'var(--color-goldLt)' : 'var(--color-ink)',
            border: '1.5px solid var(--color-ink)',
            boxShadow: '1px 1px 0 rgba(31,45,62,0.25)',
            transition: 'left 0.18s cubic-bezier(0.4,0,0.2,1), background 0.18s',
            display: 'block',
          }}
        />
      </button>

      {/* Moon */}
      <span
        onClick={() => setTheme('dark')}
        style={{
          fontSize: 16,
          cursor: 'pointer',
          opacity: isDark ? 1 : 0.4,
          transition: 'opacity 0.15s',
          userSelect: 'none',
        }}
        title="Dark mode"
      >
        ☽
      </span>
    </div>
  )
}
