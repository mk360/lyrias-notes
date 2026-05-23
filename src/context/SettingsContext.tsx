// +++ entire file is new

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { getSettings, saveSettings, applyTheme } from '@/lib/settings'
import type { Settings } from '@/lib/settings'

interface SettingsContextValue {
  settings: Settings
  setTheme: (theme: Settings['theme']) => void
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettingsState] = useState<Settings>(() => {
    const s = getSettings()
    // Apply immediately on init so there's no flash of wrong theme
    applyTheme(s.theme)
    return s
  })

  const setTheme = useCallback((theme: Settings['theme']) => {
    const next = { ...settings, theme }
    saveSettings(next)
    applyTheme(theme)
    setSettingsState(next)
  }, [settings])

  return (
    <SettingsContext.Provider value={{ settings, setTheme }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider')
  return ctx
}