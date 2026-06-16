import { COMBO_CHAIN_OPTIONS } from '@/components/connector-picker'
import { getComboById } from './db'
import { NOTES_FILE_EXTENSION } from './globals'
import { getMoveById } from './moves'
import { JSONContent } from '@tiptap/react'
import { ConnectorType } from './types'

export interface LNBKFile {
  lyria: true
  version: 1
  type: 'matchup-note'
  exportedAt: string
  playerCharacterId: string
  opponentCharacterId?: string
  rating: number | null
  notes: object
}

// ── Node transformation ───────────────────────────────────────────────────────

function transformNodeForExport(node: any): any {
  if (!node) return node

  // inlineClip → plain text placeholder
  if (node.type === 'inlineClip') {
    return {
      type: 'text',
      text: `(clip: ${node.attrs?.title ?? 'untitled'})`,
    }
  }

  // comboBlock → plain text notation string
  if (node.type === 'comboBlock') {
    const combo = getComboById(node.attrs?.comboId)
    if (!combo) return { type: 'text', text: '(combo: not found)' }
    let comboString = combo.counterhit ? "CH " : "";
    for (let move of combo.notation) {
      const foundMove = getMoveById(move.moveId);
      comboString += (move.holdGuard ? "[G]" : "") + (foundMove.input ?? foundMove.id);
      const foundConnector = COMBO_CHAIN_OPTIONS[move.connector!];
      if (foundConnector) {
        if (move.connector === "link")
          comboString += foundConnector.display + " ";
        else {
          comboString += " " + foundConnector.display + " ";
        }
      }
    }
    const notation = combo.notation
      .map((n) => {
        const move = getMoveById(n.moveId)
        return move?.input ?? move?.id
      })
      .join(' > ')
    return {
      type: 'text',
      text: `(combo: ${combo.title} — ${notation} — ${combo.damage} DMG)`,
    }
  }

  // Recursively transform content array
  if (node.content) {
    return { ...node, content: node.content.map(transformNodeForExport) }
  }

  return node
}

function hasClipNodes(doc: any): boolean {
  if (!doc || typeof doc !== 'object') return false
  if (doc.type === 'inlineClip') return true
  if (Array.isArray(doc.content)) {
    return doc.content.some(hasClipNodes)
  }
  return false
}

// ── Export ────────────────────────────────────────────────────────────────────

export function exportMatchupNote(
  playerCharacterId: string,
  opponentCharacterId: string | undefined,
  rating: number | null,
  notes: object
): void {
  const transformed = transformNodeForExport(notes)

  const file: LNBKFile = {
    lyria: true,
    version: 1,
    type: 'matchup-note',
    exportedAt: new Date().toISOString(),
    playerCharacterId,
    rating,
    notes: transformed,
  }

  const blob = new Blob([JSON.stringify(file, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  if (playerCharacterId) {
      if (opponentCharacterId) {
      link.download = `${playerCharacterId}-vs-${opponentCharacterId}.${NOTES_FILE_EXTENSION}`
    } else {
      link.download = `${playerCharacterId}.${NOTES_FILE_EXTENSION}`
    }
  } else {
    link.download = `personal-notes.${NOTES_FILE_EXTENSION}`
  }
  link.click()
  URL.revokeObjectURL(url)
}

export function checkHasClips(notes: JSONContent): boolean {
  return hasClipNodes(notes)
}

// ── Validation ────────────────────────────────────────────────────────────────

export function isValidLNBKFile(data: unknown): data is LNBKFile {
  if (typeof data !== 'object' || data === null) return false
  const d = data as Record<string, unknown>
  return (
    d.lyria === true &&
    d.version === 1 &&
    d.type === 'matchup-note' &&
    typeof d.playerCharacterId === 'string' &&
    ("opponentCharacterId" in d ? typeof d.opponentCharacterId === 'string' : true) &&
    typeof d.notes === 'object'
  )
}

// ── Import ────────────────────────────────────────────────────────────────────

export function parseLNBKFile(file: File): Promise<LNBKFile> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => {
      try {
        const data = JSON.parse(e.target?.result as string)
        if (!isValidLNBKFile(data)) {
          reject(new Error('Invalid .lnbk file. This file was not exported from Lyria\'s Notebook.'))
          return
        }
        resolve(data)
      } catch {
        reject(new Error('Could not read file. Make sure it\'s a valid .lnbk file.'))
      }
    }
    reader.onerror = () => reject(new Error('File read failed.'))
    reader.readAsText(file)
  })
}