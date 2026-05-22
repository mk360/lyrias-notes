import React, { useState, useRef } from 'react'
import { NotebookFrame } from '@/components/notebook-frame'
import { WashiLabel } from '@/components/washi-label'
import { StickyNote } from '@/components/sticky-note'
import { Portrait } from '@/components/portrait'
import { NotesEditor } from '@/components/wysiwyg/editor'
import type { NotesEditorHandle } from '@/components/wysiwyg/editor'
import { useApp } from '@/context/AppContext'
import { CHARACTERS } from '@/lib/characters'
import {
  getGlobalNotes,
  saveGlobalNotes,
  getCharacterNotes,
  saveCharacterNotes,
} from '@/lib/db'

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
            <WashiLabel tone="gold">Section 05</WashiLabel>
            <h1 className="font-display-xl font-caveat" style={{ color: 'var(--color-ink)', lineHeight: 1 }}>
              My Progress
            </h1>
          </div>

          {/* Section switcher */}
          <div
            className="flex items-center gap-2 px-4 py-3"
            style={{ borderBottom: '2px solid var(--color-rule)', background: 'var(--color-paper2)' }}
          >
            <button
              style={{ ...sectionBtnBase(activeSection === 'global'), borderRadius: 'var(--radius-sm)' }}
              onClick={() => setActiveSection('global')}
            >
              General Goals
            </button>
            <button
              style={{ ...sectionBtnBase(activeSection === 'character'), borderRadius: 'var(--radius-sm)' }}
              onClick={() => setActiveSection('character')}
              disabled={!player.activeMain}
              title={!player.activeMain ? 'Pick a main first' : undefined}
            >
              {activeChar
                ? `Goals with ${activeChar.name}`
                : 'Goals with character'}
            </button>

            {/* Active main switcher — only shown on character section */}
            {activeSection === 'character' && player.mains.length > 1 && (
              <div className="flex items-center gap-2 ml-auto">
                <span className="font-label" style={{ color: 'var(--color-ink3)' }}>switch</span>
                <div className="flex gap-1">
                  {player.mains.map(mainId => {
                    const char = CHARACTERS.find(c => c.id === mainId)
                    const isActive = mainId === player.activeMain
                    return (
                      <button
                        key={mainId}
                        onClick={() => handleMainSwitch(mainId)}
                        title={char?.name}
                        style={{
                          padding: 2,
                          border: `2px solid ${isActive ? 'var(--color-gold)' : 'var(--color-ink)'}`,
                          borderRadius: 'var(--radius-sm)',
                          background: 'transparent',
                          cursor: 'pointer',
                          boxShadow: isActive ? 'var(--shadow-stamp-sm)' : 'none',
                        }}
                      >
                        <Portrait tag={char?.tag ?? '?'} tone={isActive ? 'warm' : 'dim'} size={28} />
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
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

          {/* Tips */}
          <div
            className="p-3 border-2 border-rule"
            style={{ borderRadius: 'var(--radius-md)', background: 'var(--color-paper)' }}
          >
            <p className="font-fredoka font-600 text-sm mb-2" style={{ color: 'var(--color-ink)' }}>
              💡 Tips
            </p>
            <ul className="font-body-sm flex flex-col gap-1.5" style={{ color: 'var(--color-ink2)', paddingLeft: 14 }}>
              <li>Type <span className="font-elite text-xs px-1" style={{ background: 'var(--color-paper2)', border: '1px solid var(--color-rule)', borderRadius: 3 }}>/combo</span> to reference a combo</li>
              <li>Click any move in the frame data table to drop a chip</li>
              <li>General Goals apply across all characters</li>
            </ul>
          </div>

          <StickyNote tone="sky" tilt={-2}>
            <p className="font-fredoka font-600 text-sm mb-1">Session focus ✶</p>
            <p className="font-body-sm">write your goals for today's session here</p>
          </StickyNote>
        </div>
      </div>
    </NotebookFrame>
  )
}
