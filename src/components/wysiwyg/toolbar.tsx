import React, { useRef, useState } from 'react'
import type { Editor } from '@tiptap/react'
import type { Move } from '@/lib/types'
import { getMovesByCharacter } from '@/lib/moves'
import { createClipFromUrl } from '@/lib/db'

interface WYSIWYGToolbarProps {
  editor: Editor | null
  opponentCharId?: string
  matchupId?: string
  compact?: boolean
}

const COLORS = [
  { name: 'ink',    value: '#1F2D3E' },
  { name: 'red',    value: '#B14939' },
  { name: 'green',  value: '#4C8A5A' },
  { name: 'gold',   value: '#C49A3B' },
  { name: 'sky',    value: '#2B638A' },
]

export function WYSIWYGToolbar({ editor, opponentCharId, matchupId, compact = false }: WYSIWYGToolbarProps) {
  const [showMoveSearch, setShowMoveSearch] = useState(false)
  const [moveQuery, setMoveQuery] = useState('')
  const [showClipDialog, setShowClipDialog] = useState(false)
  const [clipUrl, setClipUrl] = useState('')
  const [clipTitle, setClipTitle] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!editor) return null

  const moves: Move[] = opponentCharId ? getMovesByCharacter(opponentCharId) : []
  const filteredMoves = moveQuery
    ? moves.filter(m => m.name.toLowerCase().includes(moveQuery.toLowerCase()) || m.type.toLowerCase().includes(moveQuery.toLowerCase()) || m.input.toLowerCase().includes(moveQuery.toLowerCase()))
    : moves

  function insertMoveChip(move: Move) {
    if (!editor) return
    editor.chain().focus().insertContent({
      type: 'moveChip',
      attrs: { characterId: move.characterId, moveId: move.id },
    }).run()
    setShowMoveSearch(false)
    setMoveQuery('')
  }

  function insertClip(url: string, title: string) {
    if (!editor || !matchupId) return
    createClipFromUrl(matchupId, url, title || "Clip").then((clip) => {
      editor.chain().focus().insertContent({
      type: 'inlineClip',
      attrs: { clipId: clip.id },
      }).run()
      setShowClipDialog(false)
      setClipUrl('')
      setClipTitle('')
    });
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !matchupId) return
    const url = URL.createObjectURL(file)
    insertClip(url, file.name)
  }

  const btnClass = (active = false) => `
    inline-flex items-center justify-center
    w-8 h-8 font-fredoka font-600 text-sm
    border-2 border-ink
    cursor-pointer select-none
    transition-all
    ${active
      ? 'bg-ink text-paper shadow-none'
      : 'bg-paper text-ink shadow-stamp-sm hover:bg-paper2'
    }
  `

  return (
    <div className="relative">
      <div
        className="flex flex-wrap items-center gap-1 p-2 border-b-2 border-ink bg-paper"
      >
        {/* Text formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={btnClass(editor.isActive('bold'))}
          style={{ borderRadius: 'var(--radius-sm)', fontWeight: 700 }}
          title="Bold"
        >B</button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={btnClass(editor.isActive('italic'))}
          style={{ borderRadius: 'var(--radius-sm)', fontStyle: 'italic' }}
          title="Italic"
        >I</button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={btnClass(editor.isActive('underline'))}
          style={{ borderRadius: 'var(--radius-sm)', textDecoration: 'underline' }}
          title="Underline"
        >U</button>

        {/* Heading select */}
        {!compact && (
          <select
            className="font-fredoka text-sm bg-paper border-2 border-ink px-2 h-8 cursor-pointer shadow-stamp-sm"
            style={{ borderRadius: 'var(--radius-sm)' }}
            value={
              editor.isActive('heading', { level: 1 }) ? '1' :
              editor.isActive('heading', { level: 2 }) ? '2' :
              editor.isActive('heading', { level: 3 }) ? '3' : '0'
            }
            onChange={e => {
              const v = e.target.value
              if (v === '0') editor.chain().focus().setParagraph().run()
              else editor.chain().focus().toggleHeading({ level: parseInt(v) as 1|2|3 }).run()
            }}
          >
            <option value="0">Normal text size</option>
            <option value="1">Heading</option>
            <option value="2">Mid sized Heading</option>
            <option value="3">Small Heading</option>
          </select>
        )}

        {/* Bullet list */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={btnClass(editor.isActive('bulletList')) + " flex-1"}
          style={{ borderRadius: 'var(--radius-sm)', fontSize: 16 }}
          title="Bullet list"
        >Bullet list</button>

        {/* Color swatches */}
        <div className="flex gap-1 items-center ml-1">
          {!compact && <span className="font-label text-ink3 text-xs">color</span>}
          {COLORS.map(c => (
            <button
              key={c.name}
              type="button"
              onClick={() => editor.chain().focus().setColor(c.value).run()}
              className="w-4 h-4 border-2 border-ink cursor-pointer hover:scale-110 transition-transform"
              style={{ background: c.value, borderRadius: '50%', boxShadow: '1px 1px 0 var(--color-ink)' }}
              title={c.name}
            />
          ))}
        </div>

        {/* Move insert button */}
        {opponentCharId && (
          <button
            type="button"
            onClick={() => setShowMoveSearch(v => !v)}
            className="font-fredoka font-500 text-xs bg-sky200 border-2 border-sky700 text-sky700 px-2 h-8 shadow-stamp-sm hover:bg-sky300 transition-colors"
            style={{ borderRadius: 'var(--radius-sm)' }}
          >
            + move
          </button>
        )}

        {/* Clip insert button */}
          <button
            type="button"
            onClick={() => setShowClipDialog(v => !v)}
            className="font-fredoka font-500 text-xs bg-goldLt border-2 border-gold text-goldDk px-2 h-8 shadow-stamp-sm hover:bg-gold hover:text-ink transition-colors"
            style={{ borderRadius: 'var(--radius-sm)' }}
          >
            + clip
          </button>
      </div>

      {/* Move search palette */}
      {showMoveSearch && (
        <div
          className="absolute top-full left-0 z-30 bg-paper border-2 border-ink shadow-stamp-lg"
          style={{ borderRadius: 'var(--radius-md)', width: 280, maxHeight: 280, overflow: 'auto' }}
        >
          <div className="p-2 border-b-2 border-rule">
            <input
              autoFocus
              value={moveQuery}
              onChange={e => setMoveQuery(e.target.value)}
              placeholder="Search moves…"
              className="w-full font-fredoka text-sm bg-paper2 border-2 border-rule px-2 py-1 outline-none"
              style={{ borderRadius: 'var(--radius-sm)' }}
            />
          </div>
          <div>
            {filteredMoves.slice(0, 20).map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => insertMoveChip(m)}
                className="w-full text-left px-3 py-2 font-elite text-xs hover:bg-sky100 transition-colors border-b border-rule last:border-0 flex items-center justify-between"
              >
                <span>{m.name}</span>
                <span className="text-ink3 text-xs">{m.input}</span>
              </button>
            ))}
            {filteredMoves.length === 0 && (
              <p className="p-3 font-body-sm text-ink3">No moves found</p>
            )}
          </div>
        </div>
      )}

      {/* Clip dialog */}
      {showClipDialog && (
        <div
          className="absolute top-full left-0 z-30 bg-paper border-2 border-ink shadow-stamp-lg p-4"
          style={{ borderRadius: 'var(--radius-md)', width: 320 }}
        >
          <h4 className="font-display-md font-caveat mb-3">Add a clip</h4>
          <div className="flex flex-col gap-2">
            <input
              value={clipTitle}
              onChange={e => setClipTitle(e.target.value)}
              placeholder="Title (optional)"
              className="font-fredoka text-sm bg-paper2 border-2 border-rule px-2 py-1 outline-none"
              style={{ borderRadius: 'var(--radius-sm)' }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="font-fredoka font-500 text-sm bg-paper2 text-ink border-2 border-ink px-3 py-1.5 shadow-stamp hover:bg-paper3"
              style={{ borderRadius: 'var(--radius-sm)' }}
            >
              Upload file
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>
      )}
    </div>
  )
}
