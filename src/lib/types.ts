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
  matchupId: string | null;
  noteId: string | null;
  url: string
  thumbnailUrl: string
  duration: string
  title: string
  caption: string
}

export type ConnectorType = 'cancel' | 'delay' | 'link' | "stance switch" | "microdash";

export interface NotationEntry {
  moveId: string
  characterId: string
  hits?: number          // for multihit cancels e.g. move(1)
  holdGuard?: boolean    // renders [G] token before the chip
  connector?: ConnectorType  // transition after this move — absent on last entry
}

export interface Combo {
  id: string
  playerId: string
  characterId: string
  title: string
  notation: NotationEntry[];
  counterhit: boolean;
  damage: number
  hits: number
  bp?: -3 | -2 | -1 | 0 | 1
  meter: 0 | 25 | 50 | 75 | 100
  difficulty: 1 | 2 | 3 | 4 | 5
  situation: 'any' | 'midscreen' | 'corner' | 'standing' | 'aerial' | 'counterhit'
  tags: string[]
  description: string
  clipId: string | null
  updatedAt: string
  createdAt: string
  worksAgainst: "everyone" | "bigBodiesOnly" | "noBigBodies"
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
  const s = getComputedStyle(document.documentElement)
  const v = (name: string) => s.getPropertyValue(name).trim()

  if (rating === null) return { bg: v('--rb-u-bg'), fg: v('--rb-u-fg') }
  if (rating <= 2)     return { bg: v('--rb-0-bg'), fg: v('--rb-0-fg') }
  if (rating <= 4)     return { bg: v('--rb-3-bg'), fg: v('--rb-3-fg') }
  if (rating === 5)    return { bg: v('--rb-5-bg'), fg: v('--rb-5-fg') }
  if (rating <= 7)     return { bg: v('--rb-6-bg'), fg: v('--rb-6-fg') }
  return               { bg: v('--rb-8-bg'), fg: v('--rb-8-fg') }
}
