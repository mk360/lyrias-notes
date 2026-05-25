import { v4 as uuidv4 } from 'uuid'
import { openDB, type IDBPDatabase } from 'idb'
import type { Player, Matchup, Clip, Combo } from './types'

// ── Key namespaces ────────────────────────────────────────────────────────────
const KEYS = {
  // Player
  PLAYER:        'lyria:player',

  // Matchup
  MATCHUP:       (id: string)                           => `lyria:matchup:${id}`,
  MATCHUPS:      'lyria:matchup-index',

  // Combo
  COMBO:         (id: string)                           => `lyria:combo:${id}`,
  COMBOS:        'lyria:combo-index',

  // Progress notes
  NOTES_GLOBAL:  (playerId: string)                     => `lyria:notes:global:${playerId}`,
  NOTES_CHAR:    (playerId: string, charId: string)     => `lyria:notes:char:${playerId}:${charId}`,
}

// ── localStorage helpers ──────────────────────────────────────────────────────
function lsGet<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function lsSet<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}

function lsRemove(key: string): void {
  localStorage.removeItem(key)
}

// ── IndexedDB setup (clips only) ─────────────────────────────────────────────
const DB_NAME    = 'lyria-clips'
const DB_VERSION = 1
const META_STORE = 'clip-meta'   // Clip records (no blob)
const BLOB_STORE = 'clip-blobs'  // raw Blob keyed by clip id

let _db: IDBPDatabase | null = null

async function getDB(): Promise<IDBPDatabase> {
  if (_db) return _db
  _db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(META_STORE)) db.createObjectStore(META_STORE)
      if (!db.objectStoreNames.contains(BLOB_STORE)) db.createObjectStore(BLOB_STORE)
    },
  })
  return _db
}

// ── Player ────────────────────────────────────────────────────────────────────
export function getPlayer(): Player {
  const existing = lsGet<Player>(KEYS.PLAYER)
  if (existing) return existing
  const fresh: Player = {
    id: uuidv4(),
    username: 'Skyfarer',
    mains: [],
    activeMain: '',
  }
  lsSet(KEYS.PLAYER, fresh)
  return fresh
}

export function savePlayer(player: Player): void {
  lsSet(KEYS.PLAYER, player)
}

// ── Matchup ───────────────────────────────────────────────────────────────────
function getMatchupIndex(): string[] {
  return lsGet<string[]>(KEYS.MATCHUPS) ?? []
}

export function getAllMatchups(): Matchup[] {
  return getMatchupIndex()
    .map(id => lsGet<Matchup>(KEYS.MATCHUP(id)))
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
  return lsGet<Matchup>(KEYS.MATCHUP(id))
}

export function getMatchupByShareId(shareId: string): Matchup | null {
  return getAllMatchups().find(m => m.shareId === shareId) ?? null
}

export function saveMatchup(matchup: Matchup): void {
  const index = getMatchupIndex()
  if (!index.includes(matchup.id)) {
    lsSet(KEYS.MATCHUPS, [...index, matchup.id])
  }
  lsSet(KEYS.MATCHUP(matchup.id), { ...matchup, updatedAt: new Date().toISOString() })
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

// ── Clip (IndexedDB) ──────────────────────────────────────────────────────────
export const CLIP_MAX_BYTES = 50 * 1024 * 1024 // 50 MB

export async function getClipById(id: string): Promise<Clip | null> {
  const db = await getDB()
  return (await db.get(META_STORE, id)) ?? null
}

export async function getClipsByMatchup(matchupId: string): Promise<Clip[]> {
  const db = await getDB()
  const all: Clip[] = await db.getAll(META_STORE)
  return all.filter(c => c.matchupId === matchupId)
}

export async function saveClip(clip: Clip, blob?: Blob): Promise<void> {
  const db = await getDB()
  await db.put(META_STORE, { ...clip, url: '' }, clip.id)
  if (blob) await db.put(BLOB_STORE, blob, clip.id)
}

interface MatchupOrNote {
  matchupId?: string;
  progressNoteId?: string;
}

export async function createClipFromFile(id: MatchupOrNote, file: File, title?: string): Promise<Clip> {
  if (file.size > CLIP_MAX_BYTES) {
    throw new Error(`File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum allowed size is 50 MB.`)
  }
  const clip: Clip = {
    id: uuidv4(),
    matchupId: id.matchupId || null,
    url: '',
    noteId: id.progressNoteId || null,
    thumbnailUrl: '',
    duration: '0:00',
    title: title || file.name,
    caption: '',
  }
  await saveClip(clip, file)
  return clip
}

export async function getBlobUrl(clipId: string): Promise<string | null> {
  const db = await getDB()
  const blob: Blob | undefined = await db.get(BLOB_STORE, clipId)
  if (!blob) return null
  return URL.createObjectURL(blob)
}

export async function deleteClip(id: string): Promise<void> {
  const db = await getDB()
  await db.delete(META_STORE, id)
  await db.delete(BLOB_STORE, id)
}

// ── Combo ─────────────────────────────────────────────────────────────────────
function getComboIndex(): string[] {
  return lsGet<string[]>(KEYS.COMBOS) ?? []
}

export function getAllCombos(): Combo[] {
  return getComboIndex()
    .map(id => lsGet<Combo>(KEYS.COMBO(id)))
    .filter((c): c is Combo => c !== null)
}

export function getCombosByCharacter(playerId: string, characterId: string): Combo[] {
  return getAllCombos().filter(c => c.playerId === playerId && c.characterId === characterId)
}

export function getComboById(id: string): Combo | null {
  return lsGet<Combo>(KEYS.COMBO(id))
}

export function saveCombo(combo: Combo): void {
  const index = getComboIndex()
  if (!index.includes(combo.id)) {
    lsSet(KEYS.COMBOS, [...index, combo.id])
  }
  lsSet(KEYS.COMBO(combo.id), { ...combo, updatedAt: new Date().toISOString() })
}

export function createCombo(data: Omit<Combo, 'id' | 'createdAt' | 'updatedAt'>): Combo {
  const now = new Date().toISOString()
  const combo: Combo = { id: uuidv4(), ...data, createdAt: now, updatedAt: now }
  saveCombo(combo)
  return combo
}

export function deleteCombo(id: string): void {
  const index = getComboIndex().filter(i => i !== id)
  lsSet(KEYS.COMBOS, index)
  lsRemove(KEYS.COMBO(id))
}

// ── Progress notes ────────────────────────────────────────────────────────────
export function getGlobalNotes(playerId: string): object {
  return lsGet<object>(KEYS.NOTES_GLOBAL(playerId)) ?? {}
}

export function saveGlobalNotes(playerId: string, doc: object): void {
  lsSet(KEYS.NOTES_GLOBAL(playerId), doc)
}

export function getCharacterNotes(playerId: string, characterId: string): object {
  return lsGet<object>(KEYS.NOTES_CHAR(playerId, characterId)) ?? {}
}

export function saveCharacterNotes(playerId: string, characterId: string, doc: object): void {
  lsSet(KEYS.NOTES_CHAR(playerId, characterId), doc)
}
