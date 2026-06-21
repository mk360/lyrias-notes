import type { Move } from './types'
import { CHARACTERS } from './characters';

export interface CharacterMoveset {
  [group: string]: Move[];
}

const cleanedDataModules = import.meta.glob('@/cleaned_data/*.json', { eager: true }) as {
  [character: string]: {
    default: CharacterMoveset;
  }
};

export const MOVES: {
  [character: string]: {
    [entry: string]: Move[];
  }
} = {};

export const FLATTENED_MOVES: { [moveId: string]: Move } = {};

for (let key in cleanedDataModules) {
  const [characterTitle] = key.split("/").reverse();
  const fileData = cleanedDataModules[key as keyof typeof cleanedDataModules].default;
  MOVES[characterTitle.replace(".json", "")] = fileData;
  for (let group in fileData) {
    for (let move of fileData[group]) {
      FLATTENED_MOVES[move.id] = move;
    }
  }
}

export function getMovesByCharacter(id: string): CharacterMoveset {
  const name = CHARACTERS.find((i) => i.id === id)?.name as keyof typeof cleanedDataModules;
  return MOVES[name];
}

export function getMovesArrayByCharacter(id: string): Move[] {
  return Object.values(getMovesByCharacter(id)).flat();
}

