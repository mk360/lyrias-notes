import type { Move } from './types'

// NOTE: Frame data values are APPROXIMATE / PLACEHOLDER.
// They are modeled on GBVS:R patterns but have NOT been verified
// against official frame data. Replace with verified data before shipping.

export const MOVES: Move[] = [
  // ─── Gran ───────────────────────────────────────────────────────────────
  { id: 'gran-5l',       characterId: 'gran', name: '5L',       startup: 5,  active: 3, recovery: 9,  onBlock: '-1',  onHit: '+3',  damage: 400,  tag: 'jab' },
  { id: 'gran-5m',       characterId: 'gran', name: '5M',       startup: 8,  active: 4, recovery: 14, onBlock: '-3',  onHit: '+1',  damage: 700,  tag: 'mid' },
  { id: 'gran-5h',       characterId: 'gran', name: '5H',       startup: 11, active: 5, recovery: 18, onBlock: '-6',  onHit: '-1',  damage: 1000, tag: 'range' },
  { id: 'gran-2l',       characterId: 'gran', name: '2L',       startup: 6,  active: 3, recovery: 10, onBlock: '+1',  onHit: '+4',  damage: 380,  tag: 'low' },
  { id: 'gran-2m',       characterId: 'gran', name: '2M',       startup: 9,  active: 5, recovery: 16, onBlock: '-5',  onHit: 'KD',  damage: 750,  tag: 'low' },
  { id: 'gran-2h',       characterId: 'gran', name: '2H',       startup: 13, active: 6, recovery: 20, onBlock: '-12', onHit: 'KD',  damage: 1100, tag: 'AA' },
  { id: 'gran-jl',       characterId: 'gran', name: 'j.L',      startup: 6,  active: 8, recovery: 12, onBlock: '—',   onHit: '—',   damage: 400,  tag: 'jump' },
  { id: 'gran-jm',       characterId: 'gran', name: 'j.M',      startup: 9,  active: 6, recovery: 16, onBlock: '—',   onHit: '—',   damage: 700,  tag: 'jump' },
  { id: 'gran-jh',       characterId: 'gran', name: 'j.H',      startup: 12, active: 5, recovery: 18, onBlock: '—',   onHit: '—',   damage: 1000, tag: 'jump' },
  { id: 'gran-236l',     characterId: 'gran', name: '236L',     startup: 13, active: 4, recovery: 18, onBlock: '-4',  onHit: '+2',  damage: 900,  tag: 'fb' },
  { id: 'gran-236m',     characterId: 'gran', name: '236M',     startup: 16, active: 5, recovery: 22, onBlock: '-6',  onHit: 'KD',  damage: 1100, tag: 'fb' },
  { id: 'gran-236h',     characterId: 'gran', name: '236H',     startup: 20, active: 6, recovery: 28, onBlock: '-10', onHit: 'KD',  damage: 1400, tag: 'fb' },
  { id: 'gran-214l',     characterId: 'gran', name: '214L',     startup: 14, active: 3, recovery: 20, onBlock: '-6',  onHit: '+2',  damage: 950,  tag: 'dp' },
  { id: 'gran-214m',     characterId: 'gran', name: '214M',     startup: 18, active: 4, recovery: 24, onBlock: '-14', onHit: 'KD',  damage: 1200, tag: 'dp' },
  { id: 'gran-214h',     characterId: 'gran', name: '214H',     startup: 22, active: 5, recovery: 30, onBlock: '-18', onHit: 'KD',  damage: 1500, tag: 'dp' },
  { id: 'gran-super',    characterId: 'gran', name: '632146H',  startup: 8,  active: 8, recovery: 30, onBlock: '-22', onHit: 'KD',  damage: 3500, tag: 'super · armor' },

  // ─── Katalina ─────────────────────────────────────────────────────────
  { id: 'kat-5l',        characterId: 'katalina', name: '5L',   startup: 5,  active: 3, recovery: 10, onBlock: '-2',  onHit: '+2',  damage: 380,  tag: 'jab' },
  { id: 'kat-5m',        characterId: 'katalina', name: '5M',   startup: 7,  active: 4, recovery: 13, onBlock: '-2',  onHit: '+3',  damage: 650,  tag: 'mid' },
  { id: 'kat-5h',        characterId: 'katalina', name: '5H',   startup: 9,  active: 5, recovery: 19, onBlock: '-6',  onHit: '-1',  damage: 900,  tag: 'range' },
  { id: 'kat-2l',        characterId: 'katalina', name: '2L',   startup: 6,  active: 3, recovery: 11, onBlock: '+1',  onHit: '+4',  damage: 360,  tag: 'low' },
  { id: 'kat-2m',        characterId: 'katalina', name: '2M',   startup: 8,  active: 5, recovery: 16, onBlock: '-12', onHit: 'KD',  damage: 720,  tag: 'AA' },
  { id: 'kat-2h',        characterId: 'katalina', name: '2H',   startup: 8,  active: 4, recovery: 16, onBlock: '-12', onHit: 'KD',  damage: 720,  tag: 'AA' },
  { id: 'kat-jl',        characterId: 'katalina', name: 'j.L',  startup: 6,  active: 8, recovery: 10, onBlock: '—',   onHit: '—',   damage: 380,  tag: 'jump' },
  { id: 'kat-jm',        characterId: 'katalina', name: 'j.M',  startup: 8,  active: 6, recovery: 14, onBlock: '—',   onHit: '—',   damage: 650,  tag: 'jump' },
  { id: 'kat-jh',        characterId: 'katalina', name: 'j.H',  startup: 11, active: 5, recovery: 16, onBlock: '—',   onHit: '—',   damage: 900,  tag: 'jump' },
  { id: 'kat-js',        characterId: 'katalina', name: 'j.S',  startup: 11, active: 8, recovery: 20, onBlock: '—',   onHit: '—',   damage: 1000, tag: 'jump' },
  { id: 'kat-236l',      characterId: 'katalina', name: '236L', startup: 11, active: 4, recovery: 18, onBlock: '-2',  onHit: '+4',  damage: 850,  tag: 'fb' },
  { id: 'kat-236m',      characterId: 'katalina', name: '236M', startup: 13, active: 5, recovery: 20, onBlock: '-4',  onHit: '-2',  damage: 1050, tag: 'fb' },
  { id: 'kat-236h',      characterId: 'katalina', name: '236H', startup: 17, active: 6, recovery: 26, onBlock: '-8',  onHit: 'KD',  damage: 1300, tag: 'fb' },
  { id: 'kat-214l',      characterId: 'katalina', name: '214L', startup: 14, active: 3, recovery: 22, onBlock: '-8',  onHit: '+2',  damage: 900,  tag: 'rev' },
  { id: 'kat-214m',      characterId: 'katalina', name: '214M', startup: 18, active: 4, recovery: 26, onBlock: '-14', onHit: 'KD',  damage: 1150, tag: 'rev' },
  { id: 'kat-214h',      characterId: 'katalina', name: '214H', startup: 22, active: 5, recovery: 32, onBlock: '-18', onHit: 'KD',  damage: 1400, tag: 'rev' },
  { id: 'kat-623m',      characterId: 'katalina', name: '623M', startup: 8,  active: 5, recovery: 26, onBlock: '-22', onHit: 'KD',  damage: 1100, tag: 'dp' },
  { id: 'kat-super',     characterId: 'katalina', name: '632146H', startup: 6, active: 6, recovery: 28, onBlock: '-24', onHit: 'KD', damage: 3200, tag: 'super' },

  // ─── Yuel ─────────────────────────────────────────────────────────────
  { id: 'yuel-5l',       characterId: 'yuel', name: '5L',       startup: 5,  active: 3, recovery: 9,  onBlock: '-1',  onHit: '+3',  damage: 360,  tag: 'jab' },
  { id: 'yuel-5m',       characterId: 'yuel', name: '5M',       startup: 8,  active: 4, recovery: 14, onBlock: '-2',  onHit: '+2',  damage: 680,  tag: 'mid' },
  { id: 'yuel-5h',       characterId: 'yuel', name: '5H',       startup: 10, active: 5, recovery: 18, onBlock: '-5',  onHit: 'KD',  damage: 950,  tag: 'range' },
  { id: 'yuel-2l',       characterId: 'yuel', name: '2L',       startup: 5,  active: 3, recovery: 10, onBlock: '+2',  onHit: '+5',  damage: 340,  tag: 'low' },
  { id: 'yuel-2m',       characterId: 'yuel', name: '2M',       startup: 8,  active: 5, recovery: 16, onBlock: '-5',  onHit: 'KD',  damage: 700,  tag: 'low' },
  { id: 'yuel-2h',       characterId: 'yuel', name: '2H',       startup: 11, active: 6, recovery: 20, onBlock: '-10', onHit: 'KD',  damage: 1000, tag: 'AA' },
  { id: 'yuel-jh',       characterId: 'yuel', name: 'j.H',      startup: 10, active: 6, recovery: 16, onBlock: '—',   onHit: '—',   damage: 950,  tag: 'jump' },
  { id: 'yuel-js',       characterId: 'yuel', name: 'j.S',      startup: 12, active: 8, recovery: 18, onBlock: '—',   onHit: '—',   damage: 1050, tag: 'jump' },
  { id: 'yuel-236l',     characterId: 'yuel', name: '236L',     startup: 12, active: 4, recovery: 16, onBlock: '-3',  onHit: '+3',  damage: 820,  tag: 'fb' },
  { id: 'yuel-236m',     characterId: 'yuel', name: '236M',     startup: 15, active: 5, recovery: 20, onBlock: '-5',  onHit: 'KD',  damage: 1020, tag: 'fb' },
  { id: 'yuel-214l',     characterId: 'yuel', name: '214L',     startup: 10, active: 3, recovery: 18, onBlock: '-4',  onHit: '+2',  damage: 780,  tag: 'rush' },
  { id: 'yuel-214m',     characterId: 'yuel', name: '214M',     startup: 14, active: 4, recovery: 22, onBlock: '-8',  onHit: 'KD',  damage: 1000, tag: 'rush' },
  { id: 'yuel-super',    characterId: 'yuel', name: '236236H',  startup: 10, active: 10, recovery: 32, onBlock: '-26', onHit: 'KD', damage: 3100, tag: 'super' },

  // ─── Djeeta ───────────────────────────────────────────────────────────
  { id: 'dje-5l',        characterId: 'djeeta', name: '5L',     startup: 5,  active: 3, recovery: 9,  onBlock: '-1',  onHit: '+3',  damage: 400,  tag: 'jab' },
  { id: 'dje-5m',        characterId: 'djeeta', name: '5M',     startup: 8,  active: 4, recovery: 14, onBlock: '-3',  onHit: '+1',  damage: 700,  tag: 'mid' },
  { id: 'dje-5h',        characterId: 'djeeta', name: '5H',     startup: 11, active: 5, recovery: 18, onBlock: '-6',  onHit: '-1',  damage: 1000, tag: 'range' },
  { id: 'dje-2l',        characterId: 'djeeta', name: '2L',     startup: 6,  active: 3, recovery: 10, onBlock: '+1',  onHit: '+4',  damage: 380,  tag: 'low' },
  { id: 'dje-2m',        characterId: 'djeeta', name: '2M',     startup: 9,  active: 5, recovery: 16, onBlock: '-5',  onHit: 'KD',  damage: 750,  tag: 'low' },
  { id: 'dje-2h',        characterId: 'djeeta', name: '2H',     startup: 13, active: 6, recovery: 20, onBlock: '-12', onHit: 'KD',  damage: 1100, tag: 'AA' },
  { id: 'dje-jl',        characterId: 'djeeta', name: 'j.L',    startup: 6,  active: 8, recovery: 12, onBlock: '—',   onHit: '—',   damage: 400,  tag: 'jump' },
  { id: 'dje-jm',        characterId: 'djeeta', name: '5M',     startup: 9,  active: 6, recovery: 16, onBlock: '—',   onHit: '—',   damage: 700,  tag: 'jump' },
  { id: 'dje-jh',        characterId: 'djeeta', name: 'j.H',    startup: 12, active: 5, recovery: 18, onBlock: '—',   onHit: '—',   damage: 1000, tag: 'jump' },
  { id: 'dje-236l',      characterId: 'djeeta', name: '236L',   startup: 13, active: 4, recovery: 18, onBlock: '-4',  onHit: '+2',  damage: 900,  tag: 'fb' },
  { id: 'dje-236m',      characterId: 'djeeta', name: '236M',   startup: 16, active: 5, recovery: 22, onBlock: '-6',  onHit: 'KD',  damage: 1100, tag: 'fb' },
  { id: 'dje-214l',      characterId: 'djeeta', name: '214L',   startup: 14, active: 3, recovery: 20, onBlock: '-6',  onHit: '+2',  damage: 950,  tag: 'dp' },
  { id: 'dje-214m',      characterId: 'djeeta', name: '214M',   startup: 18, active: 4, recovery: 24, onBlock: '-14', onHit: 'KD',  damage: 1200, tag: 'dp' },
  { id: 'dje-super',     characterId: 'djeeta', name: '632146H',startup: 8,  active: 8, recovery: 30, onBlock: '-22', onHit: 'KD',  damage: 3500, tag: 'super · armor' },

  // ─── Siegfried ────────────────────────────────────────────────────────
  { id: 'sie-5l',        characterId: 'siegfried', name: '5L',  startup: 7,  active: 3, recovery: 12, onBlock: '-2',  onHit: '+2',  damage: 450,  tag: 'jab' },
  { id: 'sie-5m',        characterId: 'siegfried', name: '5M',  startup: 10, active: 4, recovery: 17, onBlock: '-3',  onHit: '+1',  damage: 800,  tag: 'mid' },
  { id: 'sie-5h',        characterId: 'siegfried', name: '5H',  startup: 14, active: 6, recovery: 22, onBlock: '-8',  onHit: '-2',  damage: 1200, tag: 'range' },
  { id: 'sie-2l',        characterId: 'siegfried', name: '2L',  startup: 7,  active: 3, recovery: 12, onBlock: '+0',  onHit: '+3',  damage: 420,  tag: 'low' },
  { id: 'sie-2m',        characterId: 'siegfried', name: '2M',  startup: 10, active: 5, recovery: 18, onBlock: '-6',  onHit: 'KD',  damage: 820,  tag: 'low' },
  { id: 'sie-2h',        characterId: 'siegfried', name: '2H',  startup: 16, active: 7, recovery: 24, onBlock: '-14', onHit: 'KD',  damage: 1300, tag: 'AA' },
  { id: 'sie-jh',        characterId: 'siegfried', name: 'j.H', startup: 13, active: 6, recovery: 20, onBlock: '—',   onHit: '—',   damage: 1200, tag: 'jump' },
  { id: 'sie-236l',      characterId: 'siegfried', name: '236L',startup: 16, active: 5, recovery: 22, onBlock: '-6',  onHit: '+0',  damage: 1100, tag: 'fb' },
  { id: 'sie-236m',      characterId: 'siegfried', name: '236M',startup: 20, active: 6, recovery: 28, onBlock: '-8',  onHit: 'KD',  damage: 1400, tag: 'fb' },
  { id: 'sie-236h',      characterId: 'siegfried', name: '236H',startup: 24, active: 7, recovery: 34, onBlock: '-12', onHit: 'KD',  damage: 1700, tag: 'fb · armor' },
  { id: 'sie-214l',      characterId: 'siegfried', name: '214L',startup: 12, active: 4, recovery: 20, onBlock: '-6',  onHit: '+2',  damage: 1050, tag: 'counter' },
  { id: 'sie-214m',      characterId: 'siegfried', name: '214M',startup: 16, active: 5, recovery: 26, onBlock: '-10', onHit: 'KD',  damage: 1300, tag: 'counter' },
  { id: 'sie-214h',      characterId: 'siegfried', name: '214H',startup: 20, active: 6, recovery: 32, onBlock: '-16', onHit: 'KD',  damage: 1600, tag: 'counter · armor' },
  { id: 'sie-super',     characterId: 'siegfried', name: '632146H', startup: 10, active: 12, recovery: 36, onBlock: '-28', onHit: 'KD', damage: 4000, tag: 'super · armor' },
]

export function getMovesByCharacter(characterId: string): Move[] {
  return MOVES.filter(m => m.characterId === characterId)
}

export function getMoveById(id: string): Move | undefined {
  return MOVES.find(m => m.id === id)
}

export function getMovesByCharacterGrouped(characterId: string): {
  normals: Move[]
  jumping: Move[]
  specials: Move[]
  supers: Move[]
} {
  const moves = getMovesByCharacter(characterId)
  return {
    normals:  moves.filter(m => /^[25][lmhLMH]$/.test(m.name.replace('.', '').replace('j', ''))),
    jumping:  moves.filter(m => m.name.startsWith('j.')),
    specials: moves.filter(m => /^[0-9]{3,}[lmhLMH]$/.test(m.name) && !m.tag.includes('super')),
    supers:   moves.filter(m => m.tag.includes('super')),
  }
}
