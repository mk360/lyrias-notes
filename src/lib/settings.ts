// +++ entire file is new

export interface Settings {
  theme: 'light' | 'dark'
}

const SETTINGS_KEY = 'lyria:settings'

const DEFAULTS: Settings = {
  theme: 'light',
}

export function getSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return { ...DEFAULTS }
    return { ...DEFAULTS, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULTS }
  }
}

export function saveSettings(settings: Settings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

export function applyTheme(theme: Settings['theme']): void {
  document.documentElement.setAttribute('data-theme', theme)
}