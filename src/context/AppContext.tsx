import { getAllMatchups, getPlayer, saveMatchup, savePlayer } from '@/lib/db'
import type { Matchup, Player } from '@/lib/types'
import React, { createContext, useCallback, useContext, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

interface AppContextValue {
  player: Player
  setActiveMain: (characterId: string) => void
  addMain: (characterId: string) => void
  removeMain: (characterId: string) => void
  matchups: Matchup[]
  updateMatchupRating: (playerCharId: string, oppCharId: string, rating: number | null) => void
  updateMatchupNotes: (playerCharId: string, oppCharId: string, notes: object) => void
  generateShareId: (playerCharId: string, oppCharId: string) => string
  reloadMatchups: () => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [player, setPlayerState] = useState<Player>(() => getPlayer())
  const [matchups, setMatchups] = useState<Matchup[]>(() => getAllMatchups())

  const reloadMatchups = useCallback(() => {
    setMatchups(getAllMatchups())
  }, [])

  const saveAndSetPlayer = useCallback((p: Player) => {
    savePlayer(p)
    setPlayerState(p)
  }, [])

  const setActiveMain = useCallback((characterId: string) => {
    saveAndSetPlayer({ ...player, activeMain: characterId })
  }, [player, saveAndSetPlayer])

  const addMain = useCallback((characterId: string) => {
    if (player.mains.includes(characterId)) return
    const updated = {
      ...player,
      mains: [...player.mains, characterId],
      activeMain: player.activeMain || characterId,
    }
    saveAndSetPlayer(updated)
  }, [player, saveAndSetPlayer])

  const removeMain = useCallback((characterId: string) => {
    const mains = player.mains.filter(m => m !== characterId)
    const activeMain = player.activeMain === characterId
      ? (mains[0] ?? '')
      : player.activeMain
    saveAndSetPlayer({ ...player, mains, activeMain })
  }, [player, saveAndSetPlayer])

  const updateMatchupRating = useCallback((playerCharId: string, oppCharId: string, rating: number | null) => {
    const existing = matchups.find(
      m => m.playerCharacterId === playerCharId &&
           m.opponentCharacterId === oppCharId &&
           m.playerId === player.id
    )
    const now = new Date().toISOString()
    const updated: Matchup = existing
      ? { ...existing, rating, updatedAt: now }
      : {
          id: uuidv4(),
          playerId: player.id,
          playerCharacterId: playerCharId,
          opponentCharacterId: oppCharId,
          rating,
          notes: { type: 'doc', content: [] },
          shareId: null,
          updatedAt: now,
          createdAt: now,
        }
    saveMatchup(updated)
    setMatchups(prev => {
      const idx = prev.findIndex(m => m.id === updated.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = updated
        return next
      }
      return [...prev, updated]
    })
  }, [matchups, player.id])

  const updateMatchupNotes = useCallback((playerCharId: string, oppCharId: string, notes: object) => {
    const existing = matchups.find(
      m => m.playerCharacterId === playerCharId &&
           m.opponentCharacterId === oppCharId &&
           m.playerId === player.id
    )
    const now = new Date().toISOString()
    const updated: Matchup = existing
      ? { ...existing, notes, updatedAt: now }
      : {
          id: uuidv4(),
          playerId: player.id,
          playerCharacterId: playerCharId,
          opponentCharacterId: oppCharId,
          rating: null,
          notes,
          shareId: null,
          updatedAt: now,
          createdAt: now,
        }
    saveMatchup(updated)
    setMatchups(prev => {
      const idx = prev.findIndex(m => m.id === updated.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = updated
        return next
      }
      return [...prev, updated]
    })
  }, [matchups, player.id])

  const generateShareId = useCallback((playerCharId: string, oppCharId: string): string => {
    const existing = matchups.find(
      m => m.playerCharacterId === playerCharId &&
           m.opponentCharacterId === oppCharId &&
           m.playerId === player.id
    )
    if (existing?.shareId) return existing.shareId
    const shareId = uuidv4()
    if (existing) {
      const updated = { ...existing, shareId }
      saveMatchup(updated)
      setMatchups(prev => prev.map(m => m.id === updated.id ? updated : m))
    }
    return shareId
  }, [matchups, player.id])

  return (
    <AppContext.Provider value={{
      player,
      setActiveMain,
      addMain,
      removeMain,
      matchups,
      updateMatchupRating,
      updateMatchupNotes,
      generateShareId,
      reloadMatchups,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
