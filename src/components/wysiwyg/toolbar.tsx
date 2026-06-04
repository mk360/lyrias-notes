import { useApp } from '@/context/AppContext'
import { useDialog } from '@/context/DialogContext'
import { createClipFromFile, getCombosByCharacter } from '@/lib/db'
import { CLIP_MAX_BYTES } from '@/lib/globals'
import { getMovesByCharacter } from '@/lib/moves'
import type { Move } from '@/lib/types'
import type { Editor } from '@tiptap/react'
import React, { useRef, useState } from 'react'

interface WYSIWYGToolbarProps {
  editor: Editor | null
  opponentCharId?: string
  playerCharacterId: string;
  matchupId?: string
  compact?: boolean
}

type OpenedDialog = "" | "clip" | "move" | "combo";

const COLORS = [
  { name: 'ink',    value: '#1F2D3E' },
  { name: 'red',    value: '#B14939' },
  { name: 'green',  value: '#4C8A5A' },
  { name: 'gold',   value: '#C49A3B' },
  { name: 'sky',    value: '#2B638A' },
]

export function WYSIWYGToolbar({ editor, opponentCharId, playerCharacterId, matchupId, compact = false }: WYSIWYGToolbarProps) {
  const [currentDialog, setCurrentDialog] = useState<OpenedDialog>("");
  const [moveQuery, setMoveQuery] = useState('');
  const [comboQuery, setComboQuery] = useState("");
  const [clipTitle, setClipTitle] = useState('')
  const { player } = useApp();
  const { show, close } = useDialog();
  const combos = getCombosByCharacter(player.id, playerCharacterId).filter((c) => {
    const lowercaseQuery = comboQuery.toLowerCase();
    return c.title.toLowerCase().includes(lowercaseQuery) || c.tags.map((t) => t.toLowerCase()).includes(lowercaseQuery);
  });
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
    setCurrentDialog("");
    setMoveQuery('')
  }

  function insertClip(file: File, title: string) {
    if (!editor) return
    createClipFromFile({ progressNoteId: `progress:${player.id}:${playerCharacterId ?? "global"}`}, file, title || "Clip").then((clip) => {
      editor.chain().focus().insertContent({
      type: 'inlineClip',
      attrs: { clipId: clip.id },
      }).run()
      setCurrentDialog("")
      setClipTitle('')
    }).catch((e) => {
      show({
        variant: "danger",
        title: "Error trying to upload clip",
        message: e.message,
        primary: {
          label: "Close",
          onClick: close
        }
      });
    });
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    insertClip(file, file.name)
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
        className="flex flex-wrap items-center gap-1 p-2 border-b-2 border-ink bg-paper">
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
        >
          <svg fill="currentColor" width="16" height="16">
            <use href="#icon-bullet-list" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={btnClass(editor.isActive('orderedList'))}
          style={{ borderRadius: 'var(--radius-sm)' }}
          title="Numbered list"
        >
          <svg fill="currentColor" width="16" height="16">
            <use href="#icon-ordered-list" />
          </svg>
        </button>
        {/* <button type="" */}

        {/* Clip insert button */}
          <button
            type="button"
            onClick={() => setCurrentDialog(currentDialog === "clip" ? "" : "clip")}
            className="font-fredoka font-500 text-sm bg-goldLt border-2 border-gold text-goldDk px-2 h-8 shadow-stamp-sm hover:bg-gold hover:text-ink transition-colors"
            style={{ borderRadius: 'var(--radius-sm)' }}
          >
            + clip
          </button>
          <button
            type="button"
            onClick={() => setCurrentDialog(currentDialog === "combo" ? "" : "combo")}
            className="font-fredoka font-500 text-sm bg-gold border-2 border-goldDk text-goldDk px-2 h-8 shadow-stamp-sm hover:bg-goldDk hover:text-ink transition-colors"
            style={{ borderRadius: 'var(--radius-sm)' }}
          >
            + combo
          </button>

          {/* Move insert button */}
        {!!opponentCharId && (
          <button
            type="button"
            onClick={() => setCurrentDialog(currentDialog === "move" ? "" : "move")}
            className="font-fredoka font-500 text-sm bg-sky200 border-2 border-sky700 text-sky700 px-2 h-8 shadow-stamp-sm hover:bg-sky300 transition-colors"
            style={{ borderRadius: 'var(--radius-sm)' }}
          >
            + move
          </button>
        )}

        {/* Color swatches */}
        <div className="flex gap-1 items-center ml-1">
          {!compact && <span className="font-label text-ink3">color</span>}
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
      </div>

      {/* Move search palette */}
      {currentDialog === "move" && (
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
                className="w-full text-left px-3 py-2 font-elite text-sm hover:bg-sky100 transition-colors border-b border-rule last:border-0 flex items-center justify-between"
              >
                <span>{m.name}</span>
                <span className="text-ink3 text-sm">{m.input}</span>
              </button>
            ))}
            {filteredMoves.length === 0 && (
              <p className="p-3 font-body-sm text-ink3">No moves found</p>
            )}
          </div>
        </div>
      )}

      {/* Clip dialog */}
      {currentDialog === "clip" && (
        <div
          className="absolute top-full left-[0%] z-30 bg-paper border-2 border-ink shadow-stamp-lg p-4"
          style={{ borderRadius: 'var(--radius-md)', width: 320 }}
        >
          <h4 className="font-display-md font-caveat mb-3">Add a clip</h4>
          <p className='font-fredoka text-ink'>Max size of {CLIP_MAX_BYTES / 1024 / 1024} MB allowed.</p>
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

      {/* Combo dialog */}
      {currentDialog === "combo" && (
        <div
          className="absolute top-full left-0 z-30 bg-paper border-2 border-ink shadow-stamp-lg"
          style={{ borderRadius: 'var(--radius-md)', width: 280, maxHeight: 280, overflow: 'auto' }}
        >
          <div className="p-2 border-b-2 border-rule">
            <input
              autoFocus
              value={comboQuery}
              onChange={e => setComboQuery(e.target.value)}
              placeholder="Search for combos"
              className="w-full font-fredoka text-sm bg-paper2 border-2 border-rule px-2 py-1 outline-none"
              style={{ borderRadius: 'var(--radius-sm)' }}
            />
          </div>
          <div>
            {combos.slice(0, 5).map(combo => (
              <button
                key={combo.id}
                type="button"
                onClick={() => {
                  editor.chain().focus().insertContent({
                    type: 'comboBlock',
                    attrs: { comboId: combo.id },
                  }).run();
                  setCurrentDialog("");
                }}
                className="w-full text-left px-3 py-2 font-elite text-xs hover:bg-sky100 transition-colors border-b border-rule last:border-0 flex items-center justify-between"
              >
                <span>{combo.title || "Untitled Combo"}</span>
                <span className="text-ink3 text-xs">{combo.damage} damage - {combo.hits} hits</span>
              </button>
            ))}
            {combos.length === 0 && (
              <p className="p-3 font-body-sm text-ink3">No combo found</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
