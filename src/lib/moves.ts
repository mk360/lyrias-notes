import type { Move } from './types'
import { CHARACTERS } from './characters';

const cleanedDataModules = import.meta.glob('@/cleaned_data/*.json', { eager: true }) as Record<string, { default: Move[] }>

export const MOVES: Move[] = [];

for (let key in cleanedDataModules) {
  MOVES.push(...cleanedDataModules[key].default);
}

export function getMovesByCharacter(id: string): Move[] {
  const name = CHARACTERS.find((i) => i.id === id)?.name;
  return cleanedDataModules[`/src/cleaned_data/${name}.json`].default;
}

export function getMoveById(id: string): Move {
  return MOVES.find(m => m.id === id)!;
}

export function getMovesByCharacterGrouped(characterId: string): {
  normals: Move[]
  jumping: Move[]
  specials: Move[]
  supers: Move[]
  unique: Move[]
  system: Move[]
} {
  const moves = getMovesByCharacter(characterId)
  return {
    normals:  moves.filter((i) => i.type.includes("normal") && !i.input.startsWith("j.")),
    jumping:  moves.filter(m => m.type.includes("normal") && m.input.startsWith('j.')),
    specials: moves.filter((m) => m.type.includes("special")),
    supers:   moves.filter(m => m.type.includes('super')),
    unique: moves.filter((m) => m.input === "5U"),
    system: moves.filter((m) => m.type === "other")
  }
}
