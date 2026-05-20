import React, { createContext, useContext, useState, useCallback } from 'react'
import { AppDialog } from '@/components/dialog'

export type DialogVariant = 'info' | 'warning' | 'danger' | 'confirm' | 'success'

export interface DialogAction {
  label: string
  onClick: () => void
}

export interface DialogOptions {
  variant: DialogVariant
  title: string
  message: string
  primary: DialogAction
  secondary?: DialogAction
}

interface DialogContextValue {
  show: (options: DialogOptions) => void
  close: () => void
}

const DialogContext = createContext<DialogContextValue | null>(null)

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [current, setCurrent] = useState<DialogOptions | null>(null)

  const show = useCallback((options: DialogOptions) => {
    setCurrent(options)
  }, [])

  const close = useCallback(() => {
    setCurrent(null)
  }, [])

  return (
    <DialogContext.Provider value={{ show, close }}>
      {children}
      {current && <AppDialog options={current} onClose={close} />}
    </DialogContext.Provider>
  )
}

export function useDialog(): DialogContextValue {
  const ctx = useContext(DialogContext)
  if (!ctx) throw new Error('useDialog must be used inside DialogProvider')
  return ctx
}

// ── Dialog renderer (lives here to keep the import surface clean) ────────────
