// Core data types for Lyria's Notes

export interface Character {
  id: string
  name: string
  tag: string
  archetype: 'grappler' | 'rushdown' | 'zoner' | 'all-rounder' | 'technical' | 'setplay'
}

export interface Move {
  id: string
  characterId: string
  name: string
  startup: number
  active: number
  recovery: number
  onBlock: string
  onHit: string
  damage: number
  tag: string
}

export interface Player {
  id: string
  username: string
  mains: string[]    // character ids — ordered, first is active by default
  activeMain: string
}

export interface Matchup {
  id: string
  playerId: string
  playerCharacterId: string
  opponentCharacterId: string
  rating: number | null
  notes: object       // TipTap/ProseMirror JSON doc
  shareId: string | null
  updatedAt: string
  createdAt: string
}

export interface Clip {
  id: string
  matchupId: string
  url: string
  thumbnailUrl: string
  duration: string
  title: string
  caption: string
}

export interface Combo {
  id: string
  playerId: string
  characterId: string
  title: string
  notation: { characterId: string; moveId: string }[]
  damage: number
  hits: number
  meter: 0 | 25 | 50 | 75 | 100
  difficulty: 1 | 2 | 3 | 4 | 5
  situation: 'any' | 'midscreen' | 'corner' | 'standing' | 'aerial' | 'counterhit'
  tags: string[]
  description: string
  clipId: string | null
  updatedAt: string
  createdAt: string
}

export type RatingTier = 'hellish' | 'rough' | 'mirror' | 'workable' | 'free' | 'unrated'

export function getRatingTier(rating: number | null): RatingTier {
  if (rating === null) return 'unrated'
  if (rating <= 2) return 'hellish'
  if (rating <= 4) return 'rough'
  if (rating === 5) return 'mirror'
  if (rating <= 7) return 'workable'
  return 'free'
}

export function getRatingBucket(rating: number | null): { bg: string; fg: string } {
  if (rating === null) return { bg: '#EEE6CC', fg: '#8C9CAD' }
  if (rating <= 2)  return { bg: '#E8C8C0', fg: '#7A2A1F' }
  if (rating <= 4)  return { bg: '#EBD0BD', fg: '#7A4A28' }
  if (rating === 5) return { bg: '#EFE4C2', fg: '#5A4A20' }
  if (rating <= 7)  return { bg: '#D9E5C8', fg: '#3F6A3F' }
  return { bg: '#C3DCBA', fg: '#2C5E36' }
}
