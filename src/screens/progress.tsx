import { NotebookFrame } from '@/components/notebook-frame'
import { Portrait } from '@/components/portrait'
import { StickyNote } from '@/components/sticky-note'
import { WashiLabel } from '@/components/washi-label'
import type { NotesEditorHandle } from '@/components/wysiwyg/editor'
import { NotesEditor } from '@/components/wysiwyg/editor'
import { useApp } from '@/context/AppContext'
import { CHARACTERS } from '@/lib/characters'
import {
  getCharacterNotes,
  getGlobalNotes,
  saveCharacterNotes,
  saveGlobalNotes,
} from '@/lib/db'
import React, { useRef, useState } from 'react'

type Section = 'global' | 'character'

export function ProgressScreen() {
  const { player, setActiveMain } = useApp()
  const [activeSection, setActiveSection] = useState<Section>('global')

  const activeChar = CHARACTERS.find(c => c.id === player.activeMain)

  // We keep the editor content in state so switching sections
  // doesn't discard unsaved changes before the autosave fires.
  const [globalDoc,  setGlobalDoc]  = useState<object>(() => getGlobalNotes(player.id))
  const [charDoc,    setCharDoc]    = useState<object>(() =>
    player.activeMain ? getCharacterNotes(player.id, player.activeMain) : {}
  )

  const globalEditorRef = useRef<NotesEditorHandle>(null)
  const charEditorRef   = useRef<NotesEditorHandle>(null)

  // Reload character doc when active main changes
  function handleMainSwitch(characterId: string) {
    setActiveMain(characterId)
    setCharDoc(getCharacterNotes(player.id, characterId))
  }

  function handleGlobalChange(doc: object) {
    setGlobalDoc(doc)
    saveGlobalNotes(player.id, doc)
  }

  function handleCharChange(doc: object) {
    setCharDoc(doc)
    if (player.activeMain) {
      saveCharacterNotes(player.id, player.activeMain, doc)
    }
  }

  const sectionBtnBase = (active: boolean) => ({
    fontFamily: 'Fredoka, sans-serif',
    fontWeight: 500,
    fontSize: 14,
    padding: '8px 18px',
    border: '2px solid var(--color-ink)',
    cursor: 'pointer',
    transition: 'background 0.1s, color 0.1s',
    background: active ? 'var(--color-ink)' : 'var(--color-paper2)',
    color:      active ? 'var(--color-paper)' : 'var(--color-ink)',
    boxShadow:  active ? 'none' : 'var(--shadow-stamp-sm)',
  } as React.CSSProperties)

  return (
    <NotebookFrame activeTab="progress">
      <div className="flex h-full min-h-[600px]">

        {/* ── Main area ────────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col overflow-hidden" style={{ minWidth: 0 }}>

          {/* Header */}
          <div
            className="flex items-center gap-3 px-4 pt-4 pb-3 flex-wrap"
            style={{ borderBottom: '2px solid var(--color-rule)' }}
          >
            <WashiLabel tone="gold">Section 04</WashiLabel>
            <h1 className="font-display-xl font-caveat" style={{ color: 'var(--color-ink)', lineHeight: 1 }}>
              My Progress
            </h1>
          </div>

          {/* Section switcher */}
          <div
            className="flex items-center overflow-x-auto gap-2 px-4 py-3"
            style={{ borderBottom: '2px solid var(--color-rule)', background: 'var(--color-paper2)' }}
          >
            <button
              style={{ ...sectionBtnBase(activeSection === 'global'), borderRadius: 'var(--radius-sm)' }}
              onClick={() => setActiveSection('global')}
            >
              General Goals
            </button>
            {activeChar ?
                <select
                  value={player.activeMain}
                  onClick={() => {
                    setActiveSection("character");
                  }}
                  onChange={e => {
                    handleMainSwitch(e.target.value)
                    if (activeSection !== 'character') setActiveSection('character')
                  }}
                  style={{ ...sectionBtnBase(activeSection === 'character'), borderRadius: 'var(--radius-sm)' }}
                >
                {player.mains.map(mainId => {
                  const char = CHARACTERS.find(c => c.id === mainId)
                  return (
                    <option key={mainId} value={mainId}>
                      {char?.name ?? mainId}
                    </option>
                  )
                })}
              </select>
            : null}
          </div>

          {/* Editor area */}
          <div className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
            {activeSection === 'global' && (
              <NotesEditor
                ref={globalEditorRef}
                key="global"
                content={globalDoc}
                onChange={handleGlobalChange}
                playerCharId={player.activeMain}
                playerId={player.id}
              />
            )}
            {activeSection === 'character' && player.activeMain && (
              <NotesEditor
                ref={charEditorRef}
                key={`char-${player.activeMain}`}
                content={charDoc}
                onChange={handleCharChange}
                opponentCharId={player.activeMain}
                playerCharId={player.activeMain}
                playerId={player.id}
              />
            )}
            {activeSection === 'character' && !player.activeMain && (
              <div
                className="flex flex-col items-center justify-center h-full gap-3"
                style={{ color: 'var(--color-ink3)' }}
              >
                <span style={{ fontSize: 40 }}>☆</span>
                <p className="font-display-md font-caveat">No active main</p>
                <p className="font-body-sm">Star a character in the Roster to get started.</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Right rail ───────────────────────────────────────────────── */}
        <div
          className="flex flex-col gap-4 p-4 shrink-0 overflow-auto"
          style={{
            width: 240,
            borderLeft: '2px solid var(--color-ink)',
            background: 'var(--color-paper2)',
          }}
        >
          {/* Active character card */}
          {activeChar && (
            <div
              className="flex flex-col items-center gap-2 p-3 border-2 border-ink shadow-stamp"
              style={{ borderRadius: 'var(--radius-md)', background: 'var(--color-paper)' }}
            >
              <Portrait imgSrc={`${import.meta.env.BASE_URL}thumbnails/${activeChar.name}.webp`} tag={activeChar.tag} tone="warm" size={56} />
              <div className="text-center">
                <div className="font-caveat font-bold text-xl" style={{ color: 'var(--color-ink)' }}>
                  {activeChar.name}
                </div>
              </div>
              <div
                className="font-elite text-xs px-2 py-0.5"
                style={{
                  background: 'var(--color-goldLt)',
                  border: '1px solid var(--color-gold)',
                  borderRadius: '3px',
                  color: 'var(--color-goldDk)',
                }}
              >
                ★ active main
              </div>
            </div>
          )}

          <div
            className="p-3 border-2 border-rule"
            style={{ borderRadius: 'var(--radius-md)', background: 'var(--color-paper)' }}
          >
            <p className="font-fredoka font-600 mb-1">General Goals</p>
            <p className="font-body-sm">Write your next progress item here</p>
          </div>
          
          <StickyNote tone="sky" tilt={-2}>
            <p className="font-fredoka font-600 text-sm mb-2" style={{ color: 'var(--color-ink)' }}>
              💡 Tips
            </p>
            <ul className="font-body-sm flex flex-col gap-1.5" style={{ color: 'var(--color-ink2)', paddingLeft: 14 }}>
              <li>General Goals apply across all characters</li>
            </ul>
          </StickyNote>
          {!activeChar ? (
            <StickyNote tone="gold" tilt={2}>
              <p className='font-fredoka font-600 text-sm mb-1'>Set a character as your main to use more features!</p>
            </StickyNote>
          ) : null}
        </div>
      </div>
    </NotebookFrame>
  )
}
