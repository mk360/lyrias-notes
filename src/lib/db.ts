import { v4 as uuidv4 } from 'uuid'
import type { Player, Matchup, Clip, Combo } from './types'

// ── Key namespaces ──────────────────────────────────────────────────────────
const KEYS = {
  PLAYER:   'lyria:player',
  MATCHUP:  (id: string) => `lyria:matchup:${id}`,
  MATCHUPS: 'lyria:matchup-index',   // stores array of matchup ids
  CLIP:     (id: string) => `lyria:clip:${id}`,
  CLIPS:    'lyria:clip-index',
  COMBO:    (id: string) => `lyria:combo:${id}`,
  COMBOS:   'lyria:combo-index',
}

function get<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function set<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}

function remove(key: string): void {
  localStorage.removeItem(key)
}

// ── Player ──────────────────────────────────────────────────────────────────
export function getPlayer(): Player {
  const existing = get<Player>(KEYS.PLAYER)
  if (existing) return existing
  const fresh: Player = {
    id: uuidv4(),
    username: 'Skyfarer',
    mains: [],
    activeMain: '',
  }
  set(KEYS.PLAYER, fresh)
  return fresh
}

export function savePlayer(player: Player): void {
  set(KEYS.PLAYER, player)
}

// ── Matchup ─────────────────────────────────────────────────────────────────
function getMatchupIndex(): string[] {
  return get<string[]>(KEYS.MATCHUPS) ?? []
}

export function getAllMatchups(): Matchup[] {
  return getMatchupIndex()
    .map(id => get<Matchup>(KEYS.MATCHUP(id)))
    .filter((m): m is Matchup => m !== null)
}

export function getMatchup(playerCharId: string, oppCharId: string, playerId: string): Matchup | null {
  return getAllMatchups().find(
    m => m.playerCharacterId === playerCharId &&
         m.opponentCharacterId === oppCharId &&
         m.playerId === playerId
  ) ?? null
}

export function getMatchupById(id: string): Matchup | null {
  return get<Matchup>(KEYS.MATCHUP(id))
}

export function getMatchupByShareId(shareId: string): Matchup | null {
  return getAllMatchups().find(m => m.shareId === shareId) ?? null
}

export function saveMatchup(matchup: Matchup): void {
  const index = getMatchupIndex()
  if (!index.includes(matchup.id)) {
    set(KEYS.MATCHUPS, [...index, matchup.id])
  }
  set(KEYS.MATCHUP(matchup.id), { ...matchup, updatedAt: new Date().toISOString() })
}

export function upsertMatchup(
  playerId: string,
  playerCharId: string,
  oppCharId: string,
  patch: Partial<Omit<Matchup, 'id' | 'playerId' | 'playerCharacterId' | 'opponentCharacterId'>>
): Matchup {
  const existing = getMatchup(playerCharId, oppCharId, playerId)
  if (existing) {
    const updated = { ...existing, ...patch, updatedAt: new Date().toISOString() }
    saveMatchup(updated)
    return updated
  }
  const now = new Date().toISOString()
  const fresh: Matchup = {
    id: uuidv4(),
    playerId,
    playerCharacterId: playerCharId,
    opponentCharacterId: oppCharId,
    rating: null,
    notes: { type: 'doc', content: [] },
    shareId: null,
    updatedAt: now,
    createdAt: now,
    ...patch,
  }
  saveMatchup(fresh)
  return fresh
}

// ── Clip ─────────────────────────────────────────────────────────────────────
function getClipIndex(): string[] {
  return get<string[]>(KEYS.CLIPS) ?? []
}

export function getClipsByMatchup(matchupId: string): Clip[] {
  return getClipIndex()
    .map(id => get<Clip>(KEYS.CLIP(id)))
    .filter((c): c is Clip => c !== null && c.matchupId === matchupId)
}

export function getClipById(id: string): Clip | null {
  return get<Clip>(KEYS.CLIP(id))
}

export function saveClip(clip: Clip): void {
  const index = getClipIndex()
  if (!index.includes(clip.id)) {
    set(KEYS.CLIPS, [...index, clip.id])
  }
  set(KEYS.CLIP(clip.id), clip)
}

export function createClip(matchupId: string, data: Omit<Clip, 'id' | 'matchupId'>): Clip {
  const clip: Clip = { id: uuidv4(), matchupId, ...data }
  saveClip(clip)
  return clip
}

export function deleteClip(id: string): void {
  const index = getClipIndex().filter(i => i !== id)
  set(KEYS.CLIPS, index)
  remove(KEYS.CLIP(id))
}

// ── Combo ─────────────────────────────────────────────────────────────────
function getComboIndex(): string[] {
  return get<string[]>(KEYS.COMBOS) ?? []
}

export function getAllCombos(): Combo[] {
  return getComboIndex()
    .map(id => get<Combo>(KEYS.COMBO(id)))
    .filter((c): c is Combo => c !== null)
}

export function getCombosByCharacter(playerId: string, characterId: string): Combo[] {
  return getAllCombos().filter(c => c.playerId === playerId && c.characterId === characterId)
}

export function getComboById(id: string): Combo | null {
  return get<Combo>(KEYS.COMBO(id))
}

export function saveCombo(combo: Combo): void {
  const index = getComboIndex()
  if (!index.includes(combo.id)) {
    set(KEYS.COMBOS, [...index, combo.id])
  }
  set(KEYS.COMBO(combo.id), { ...combo, updatedAt: new Date().toISOString() })
}

export function createCombo(data: Omit<Combo, 'id' | 'createdAt' | 'updatedAt'>): Combo {
  const now = new Date().toISOString()
  const combo: Combo = { id: uuidv4(), ...data, createdAt: now, updatedAt: now }
  saveCombo(combo)
  return combo
}

export function deleteCombo(id: string): void {
  const index = getComboIndex().filter(i => i !== id)
  set(KEYS.COMBOS, index)
  remove(KEYS.COMBO(id))
}
