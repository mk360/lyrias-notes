// Core data types for Lyria's Notes

export type Archetype = 'grappler' | 'rushdown' | 'zoner' | 'all-rounder' | 'technical' | 'setplay'

export interface Character {
  id: string
  name: string
  tag: string
  archetypes: Archetype[]
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
  type: string
  input: string
  damage: number
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
  if (rating === null) return { bg: '#DDD0A8', fg: '#7A90A8' }
  if (rating <= 2)  return { bg: '#E8C0B8', fg: '#6A1A10' }   // hellish — deeper red
  if (rating <= 4)  return { bg: '#E8CCA8', fg: '#6A3A10' }   // rough
  if (rating === 5) return { bg: '#E8DCA0', fg: '#4A3A10' }   // mirror
  if (rating <= 7)  return { bg: '#C8DCA8', fg: '#2A5A2A' }   // workable
  return { bg: '#A8D0A0', fg: '#185A20' }         // free
}
