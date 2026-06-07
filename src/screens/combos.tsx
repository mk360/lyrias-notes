import { Button } from '@/components/button'
import { COMBO_CHAIN_OPTIONS, ConnectorPicker, ConnectorToken } from '@/components/connector-picker'
import { MoveChip } from '@/components/move-chip'
import { MoveDisplay, MoveDisplayToggle } from '@/components/move-display-toggle'
import { NotebookFrame } from '@/components/notebook-frame'
import { Portrait } from '@/components/portrait'
import { WashiLabel } from '@/components/washi-label'
import { useApp } from '@/context/AppContext'
import { useDialog } from '@/context/DialogContext'
import { CHARACTERS } from '@/lib/characters'
import {
  deleteCombo,
  getCombosByCharacter,
  saveCombo
} from '@/lib/db'
import { getMoveById, getMovesByCharacterGrouped, MOVES } from '@/lib/moves'
import type { Combo, ConnectorType } from '@/lib/types'
import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

// ─── DifficultyPips ──────────────────────────────────────────────────────────
function DifficultyPips({ value, onChange }: { value: 1|2|3|4|5; onChange?: (v: 1|2|3|4|5) => void }) {
  const labels = ['easy', 'medium', 'hard', 'very hard', 'tournament']
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange?.(n as 1|2|3|4|5)}
          className={`w-5 h-5 border-2 border-ink flex items-center justify-center font-elite text-xs transition-colors ${n <= value ? 'bg-gold text-ink' : 'bg-paper text-ink3'}`}
          style={{ borderRadius: '50%', boxShadow: '1px 1px 0 var(--color-ink)' }}
          title={labels[n-1]}
          aria-label={`Difficulty ${n}`}
        >
          {n}
        </button>
      ))}
    </div>
  )
}

// ─── Tag color helper ────────────────────────────────────────────────────────
function tagBg(tag: string): string {
  if (tag === 'corner')   return 'var(--color-goldLt)'
  if (tag === 'meter' || tag === 'round-ender') return 'var(--color-sky200)'
  if (tag === 'whiff' || tag === 'punish') return 'var(--color-paper3)'
  return 'var(--color-paper2)'
}

// ─── NotationChain ───────────────────────────────────────────────────────────
function NotationChain({ notation, counterhit }: { notation: Combo['notation'], counterhit: boolean }) {
  return (
    <div
      className="flex flex-wrap items-center gap-1 p-2 border-2 bg-paper"
      style={{ borderRadius: 'var(--radius-sm)', borderStyle: 'dashed', borderColor: 'var(--color-rule)' }}
    >
      {counterhit && <span>CH</span>}
      {notation.map((n, i) => {
        const move = getMoveById(n.moveId)
        const displayedConnector = i === 0 ? "" : COMBO_CHAIN_OPTIONS.find((option, j) => option.value === notation[i - 1].connector)?.display;
        return (
          <React.Fragment key={i}>
            {i > 0 && <span className="font-caveat font-bold text-ink2">{displayedConnector}</span>}
            <MoveChip label={move.input} />
          </React.Fragment>
        )
      })}
      {notation.length === 0 && (
        <span className="font-body-sm text-ink3">No notation yet</span>
      )}
    </div>
  )
}

// ─── ComboCard ───────────────────────────────────────────────────────────────
interface ComboCardProps {
  combo: Combo
  onEdit: () => void
  onDuplicate: () => void
  onExport: () => void;
}

function ComboCard({ combo, onEdit, onDuplicate, onExport }: ComboCardProps) {
  return (
    <div
      className="p-4 border-2 border-ink shadow-stamp mb-4"
      style={{ borderRadius: 'var(--radius-md)', background: 'var(--color-paper)' }}
    >
      {/* Row 1: title + difficulty */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-caveat font-bold text-2xl text-ink leading-tight">{combo.title}</h3>
        <DifficultyPips value={combo.difficulty} />
      </div>

      {/* Row 2: tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {combo.tags.map(tag => (
          <span
            key={tag}
            className="font-fredoka text-xs px-2 py-0.5 border-2 border-ink shadow-stamp-sm"
            style={{ borderRadius: 'var(--radius-sm)', background: tagBg(tag), color: 'var(--color-ink)' }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Row 3: notation chain */}
      <div className="mb-3">
        <NotationChain counterhit={combo.counterhit} notation={combo.notation} />
      </div>

      {/* Row 4: stats */}
      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-baseline gap-1">
          <span className="font-caveat font-bold text-red" style={{ fontSize: 28 }}>
            {combo.damage.toLocaleString()}
          </span>
          <span className="font-elite text-xs text-ink2">DMG</span>
        </div>
        <span className="font-elite text-xs text-ink2">{combo.hits} hits · {combo.situation}</span>
        <div className="flex items-center gap-1.5">
          <div className="flex gap-0.5">
            {[0,1,2,3].map(i => (
              <div
                key={i}
                className="w-4 h-2.5 border border-ink"
                style={{
                  background: i < (combo.meter / 25) ? 'var(--color-sky500)' : 'var(--color-paper)',
                  borderRadius: '1px',
                }}
              />
            ))}
          </div>
          <span className="font-elite text-xs text-ink2">{combo.meter}% meter</span>
        </div>
        {combo.bp !== undefined && combo.bp !== 0 && (
          <span
            className="font-elite text-xs"
            style={{ color: combo.bp > 0 ? 'var(--color-green)' : 'var(--color-red)' }}
          >
            {combo.bp > 0 ? `${combo.bp} BP gained` : `${Math.abs(combo.bp)} BP spent`}
          </span>
        )}
        {combo.description && (
          <span className="font-body-sm text-ink2 italic ml-2 truncate max-w-xs">{combo.description}</span>
        )}
      </div>

      {/* Row 5: actions */}
      <div
        className="flex items-center justify-between pt-3"
        style={{ borderTop: '1px dashed var(--color-rule)' }}
      >
        <div />
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="font-fredoka text-sm text-ink2 border-2 border-rule px-3 py-1 hover:border-ink hover:bg-paper2 transition-colors"
            style={{ borderRadius: 'var(--radius-sm)' }}
          >
            edit
          </button>
          <button
            onClick={onDuplicate}
            className="font-fredoka text-sm text-ink2 border-2 border-rule px-3 py-1 hover:border-ink hover:bg-paper2 transition-colors"
            style={{ borderRadius: 'var(--radius-sm)' }}>
            duplicate
          </button>
          <button
            onClick={onExport}
            className="font-fredoka text-sm text-ink2 border-2 border-rule px-3 py-1 hover:border-ink hover:bg-paper2 transition-colors"
            style={{ borderRadius: 'var(--radius-sm)' }}>
            copy to clipboard
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Combo Editor Modal ───────────────────────────────────────────────────────
interface ComboEditorProps {
  combo: Partial<Combo>
  characterId: string
  playerId: string
  onSave: (c: Combo) => void
  onDelete?: () => void
  onClose: () => void
}

function ComboEditor({ combo, characterId, playerId, onSave, onDelete, onClose }: ComboEditorProps) {
  const [openConnectorAt, setOpenConnectorAt] = useState<number | null>(null);
  const isNew = !combo.id;
  const [moveDisplay, setMoveDisplay] = useState<MoveDisplay>("name");
  const [form, setForm] = useState<Partial<Combo>>({
    title: '',
    notation: [],
    damage: 0,
    worksAgainst: "everyone",
    hits: 0,
    counterhit: false,
    meter: 0,
    difficulty: 1,
    situation: 'any',
    tags: [],
    description: '',
    clipId: null,
    ...combo,
  })
  const [tagInput, setTagInput] = useState('');
  const [customMoveInput, setCustomMoveInput] = useState("");

  const grouped = getMovesByCharacterGrouped(characterId)

  function set<K extends keyof Combo>(key: K, val: Combo[K]) {
    setForm(f => ({ ...f, [key]: val }))
  }

  function addTag(tag: string) {
    if (!tag.trim()) return
    set('tags', [...(form.tags ?? []), tag.trim()])
    setTagInput('')
  }

  function removeTag(tag: string) {
    set('tags', (form.tags ?? []).filter(t => t !== tag))
  }

  function addMoveToNotation(moveId: string, guardButton = false) {
    const prev = form.notation ?? []
    const updated = prev.length > 0
      ? prev.map((e, i) => i === prev.length - 1 ? { ...e, connector: (e.connector ?? 'link') as ConnectorType } : e)
      : prev
    set('notation', [...updated, { characterId, moveId, holdGuard: guardButton }])
  }

  function removeMoveFromNotation(idx: number) {
    set('notation', (form.notation ?? []).filter((_, i) => i !== idx))
  }

  function handleSave() {
    const now = new Date().toISOString()
    const saved: Combo = {
      id: combo.id ?? uuidv4(),
      worksAgainst: form.worksAgainst!,
      playerId,
      characterId,
      counterhit: form.counterhit!,
      title: form.title ?? 'Untitled combo',
      notation: form.notation ?? [],
      damage: form.damage ?? 0,
      hits: form.hits ?? 0,
      meter: (form.meter ?? 0) as Combo['meter'],
      difficulty: (form.difficulty ?? 1) as Combo['difficulty'],
      situation: (form.situation ?? 'any') as Combo['situation'],
      tags: form.tags ?? [],
      bp: form.bp ?? 0,
      description: form.description ?? '',
      clipId: form.clipId ?? null,
      createdAt: combo.createdAt ?? now,
      updatedAt: now,
    }
    onSave(saved)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(31,45,62,0.4)' }}
      onClick={onClose}
    >
      <div
        className="relative bg-paper border-[2.5px] border-ink overflow-auto"
        style={{
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-float)',
          maxWidth: 820,
          width: '100%',
          maxHeight: '90vh',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b-2 border-ink sticky top-0 bg-paper z-10">
          <WashiLabel tone={isNew ? 'gold' : 'sky'}>
            {isNew ? 'New combo' : 'Editing combo'}
          </WashiLabel>
          <span className="font-display-md font-caveat text-ink">
            {form.title || 'Untitled combo'}
          </span>
          <span className="font-elite text-xs text-ink3 ml-auto"></span>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center border-2 border-ink shadow-stamp-sm bg-paper font-caveat font-bold hover:bg-paper2"
            style={{ borderRadius: 'var(--radius-sm)' }}
          >✕</button>
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col gap-5">
          {/* Title */}
          <div>
            <label className="font-label block mb-1">Title</label>
            <input
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="e.g. Midscreen BnB · meterless"
              className="w-full font-fredoka text-sm bg-paper border-2 border-ink px-3 py-2 outline-none focus:border-sky700 transition-colors"
              style={{ borderRadius: 'var(--radius-sm)', boxShadow: '1.2px 1.5px 0 rgba(31,45,62,0.33)' }}
            />
          </div>

          <div className='flex flex-col gap-2'>
            <label className='font-label block'>Starter</label>
            <div className='flex gap-2 items-center'>
              <div
                onClick={() => setForm((f) => ({
                  ...f,
                  counterhit: !f.counterhit
                }))}
                style={{
                  width: 20,
                  height: 20,
                  flexShrink: 0,
                  background: form.counterhit ? 'var(--color-ink)' : 'var(--color-paper)',
                  border: '2px solid var(--color-ink)',
                  borderRadius: 'var(--radius-sm)',
                  boxShadow: 'var(--shadow-stamp-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background 0.1s',
                }}
              >
                {form.counterhit && (
                  <span style={{
                    fontFamily: 'Caveat, cursive',
                    fontSize: 14,
                    fontWeight: 700,
                    color: 'var(--color-paper)',
                    lineHeight: 1,
                  }}>
                    ✓
                  </span>
                )}
              </div>
               <label
                  onClick={() => setForm((f) => {
                    return {
                      ...f,
                      counterhit: !f.counterhit
                    }
                  })}
                  style={{
                    fontFamily: 'Fredoka',
                    fontSize: 15,
                    color: 'var(--color-ink)',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                >
                  Counterhit starter
                </label>
            </div>
            <label className='font-label block'>Interaction with big bodies</label>
            <div className='flex gap-2 items-center'>              
              <div
                onClick={() => setForm((f) => ({
                  ...f,
                  worksAgainst: "everyone"
                }))}
                style={{
                  width: 20,
                  height: 20,
                  flexShrink: 0,
                  backgroundColor: form.worksAgainst === "everyone" ? 'var(--color-ink)' : 'var(--color-paper)',
                  border: '2px solid var(--color-ink)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-stamp-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background 0.1s',
                }}
              >
                {form.worksAgainst === "everyone" && (
                  <span style={{
                    fontFamily: 'Caveat, cursive',
                    fontSize: 14,
                    fontWeight: 700,
                    color: 'var(--color-paper)',
                    lineHeight: 1,
                  }}>
                    ✓
                  </span>
                )}
              </div>
               <label
                  onClick={() => setForm((f) => {
                    return {
                      ...f,
                      worksAgainst: "everyone"
                    }
                  })}
                  style={{
                    fontFamily: 'Fredoka',
                    fontSize: 15,
                    color: 'var(--color-ink)',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                >
                  Not specified (works against the whole roster).
                </label>
            </div>
            <div className='flex gap-2 items-center'>              
              <div
                onClick={() => setForm((f) => ({
                  ...f,
                  worksAgainst: "bigBodiesOnly",
                }))}
                style={{
                  width: 20,
                  height: 20,
                  flexShrink: 0,
                  background: form.worksAgainst === "bigBodiesOnly" ? 'var(--color-ink)' : 'var(--color-paper)',
                  border: '2px solid var(--color-ink)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-stamp-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background 0.1s',
                }}
              >
                {form.worksAgainst === "bigBodiesOnly" && (
                  <span style={{
                    fontFamily: 'Caveat, cursive',
                    fontSize: 14,
                    fontWeight: 700,
                    color: 'var(--color-paper)',
                    lineHeight: 1,
                  }}>
                    ✓
                  </span>
                )}
              </div>
               <label
                  onClick={() => setForm((f) => {
                    return {
                      ...f,
                      worksAgainst: "bigBodiesOnly",
                    }
                  })}
                  style={{
                    fontFamily: 'Fredoka',
                    fontSize: 15,
                    color: 'var(--color-ink)',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                >
                  Only works against Ladiva and Vaseraga.
                </label>
            </div>
            <div className='flex gap-2 items-center'>              
              <div
                onClick={() => setForm((f) => ({
                  ...f,
                  worksAgainst: "noBigBodies",
                }))}
                style={{
                  width: 20,
                  height: 20,
                  flexShrink: 0,
                  background: form.worksAgainst === "noBigBodies" ? 'var(--color-ink)' : 'var(--color-paper)',
                  border: '2px solid var(--color-ink)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-stamp-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background 0.1s',
                }}
              >
                {form.worksAgainst === "noBigBodies" && (
                  <span style={{
                    fontFamily: 'Caveat, cursive',
                    fontSize: 14,
                    fontWeight: 700,
                    color: 'var(--color-paper)',
                    lineHeight: 1,
                  }}>
                    ✓
                  </span>
                )}
              </div>
               <label
                  onClick={() => setForm((f) => {
                    return {
                      ...f,
                      worksAgainst: "noBigBodies"
                    }
                  })}
                  style={{
                    fontFamily: 'Fredoka',
                    fontSize: 15,
                    color: 'var(--color-ink)',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                >
                  Drops against Ladiva and Vaseraga, works on the rest of the cast.
                </label>
            </div>
            
          </div>

          {/* Notation builder */}
          <div>
            <label className="font-label block mb-1">Notation</label>
            <span className="font-body-sm text-ink3 italic">click on the item between moves to specify a link, a cancel, a delay..</span>
            <div
              className="flex flex-[3] flex-wrap items-center gap-1 p-3 border-2 border-ink mb-3"
              style={{ borderRadius: 'var(--radius-sm)', background: 'var(--color-paper2)', borderStyle: 'dashed' }}>
              {form.counterhit && <span>CH</span>}
              {(form.notation ?? []).map((n, i) => {
                const move = getMoveById(n.moveId);
                const isLast = i === form.notation!.length - 1;
                return (
                  <React.Fragment key={i}>
                    <MoveChip
                      label={move ? `${n.holdGuard ? "[G]": ""} ${move?.input}`.trim() : n.moveId}
                      onRemove={() => removeMoveFromNotation(i)}
                    />
                    {!isLast &&
                     <div style={{ position: 'relative' }}>
                      <ConnectorToken
                        value={n.connector ?? 'link'}
                        onClick={() => setOpenConnectorAt(openConnectorAt === i ? null : i)}
                      />
                      {openConnectorAt === i && (
                        <ConnectorPicker
                          value={n.connector ?? 'link'}
                          onChange={connector => {
                            const next = [...(form.notation ?? [])]
                            next[i] = { ...next[i], connector }
                            set('notation', next)
                          }}
                          onClose={() => setOpenConnectorAt(null)}
                        />
                      )}
                    </div>}
                  </React.Fragment>
                )
              })}
            </div>
            <div className='flex justify-between items-center'><span className="font-body-sm text-ink3 italic">↓ pick from palette</span>
            <MoveDisplayToggle value={moveDisplay} onChange={setMoveDisplay} />
            </div>

            {/* Move palette */}
            <div
              className="p-3 border-2 border-rule"
              style={{ borderRadius: 'var(--radius-sm)', background: 'var(--color-paper2)' }}
            >
              <div className="font-label text-ink2 mb-2 uppercase">
                {CHARACTERS.find(c => c.id === characterId)?.name} · Moves
              </div>
              {[
                { label: 'Normals', moves: grouped.normals },
                { label: 'Jumping', moves: grouped.jumping },
                { label: 'Specials', moves: grouped.specials },
                { label: 'Super', moves: grouped.supers },
                { label: 'Unique', moves: grouped.unique },
                { label: "System", moves: grouped.system }
              ].map(({ label, moves }) => (
                <div key={label} className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="font-label text-ink3 w-16">{label}</span>
                  {moves.map(m => (
                    <div key={m.id}>
                      <button type="button"
                        onClick={() => {
                          addMoveToNotation(m.id, true);
                        }}
                        className='font-elite text-sm bg-paper border-2 border-ink px-1 py-px hover:bg-sky100 shadow-stamp-sm rounded-tl-lg rounded-bl-lg transition-colors'
                        title={`${moveDisplay === "name" ? m.name : m.input} while holding Guard button`}
                      >
                        [G]
                      </button> 
                      <button
                        type="button"
                        onClick={() => addMoveToNotation(m.id)}
                        className="font-elite text-sm bg-paper border-2 border-l-0 border-ink px-1 py-px hover:bg-sky100 transition-colors shadow-stamp-sm rounded-tr-lg rounded-br-lg"
                        title={moveDisplay === "name" ? m.input : m.name}
                      >
                      {moveDisplay === "name" ? m.name || m.input : m.input}
                      </button>
                    </div>
                  ))}
                </div>
              ))}
              <div className='flex gap-2 items-center'>
                <label htmlFor='free-input' className='font-label text-ink3'>Or add your input here</label>
                <input value={customMoveInput} onChange={(e) => {
                  setCustomMoveInput(e.target.value.trim());
                }} id="free-input" className="font-elite text-sm bg-paper border-2 border-ink px-2 py-2 outline-none focus:border-sky700 transition-colors" />
                <Button onClick={() => {
                  const startsWithGuard = customMoveInput.toLowerCase().startsWith("[g]");
                  const rawInput = customMoveInput.replace(/\[g\]/i, "");
                  const move = MOVES.find((m) => m.input === rawInput && m.characterId === characterId);
                  if (move) {
                    addMoveToNotation(move.id, startsWithGuard);
                  } else {
                    addMoveToNotation(rawInput);
                  }
                }} variant="secondary" size='sm'>Add</Button>
              </div>
            </div>
          </div>

          {/* Damage / Hits / Meter */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Damage', key: 'damage' as const, placeholder: '2,400' },
              { label: 'Hits',   key: 'hits'   as const, placeholder: '4' },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label className="font-label block mb-1">{label}</label>
                <input
                  type="number"
                  value={form[key] || ''}
                  onChange={e => set(key, parseInt(e.target.value) || 0)}
                  placeholder={placeholder}
                  className="w-full font-elite text-sm bg-paper border-2 border-ink px-3 py-2 outline-none focus:border-sky700"
                  style={{ borderRadius: 'var(--radius-sm)', boxShadow: '1.2px 1.5px 0 rgba(31,45,62,0.33)' }}
                />
              </div>
            ))}
            <div>
              <label className="font-label block mb-1">Meter Cost</label>
              <select
                value={form.meter}
                onChange={e => set('meter', parseInt(e.target.value) as Combo['meter'])}
                className="w-full font-fredoka text-sm bg-paper border-2 border-ink px-3 py-2 cursor-pointer"
                style={{ borderRadius: 'var(--radius-sm)', boxShadow: '1.2px 1.5px 0 rgba(31,45,62,0.33)' }}
              >
                {[0, 25, 50, 75, 100].map(v => (
                  <option key={v} value={v}>{v}% meter</option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-label block mb-1">Bravery Points Spent / Gained</label>
              <select
                value={form.bp ?? 0}
                onChange={e => set('bp', parseInt(e.target.value) as Combo['bp'])}
                className="w-full font-fredoka text-sm bg-paper border-2 border-ink px-3 py-2 cursor-pointer"
                style={{ borderRadius: 'var(--radius-sm)', boxShadow: '1.2px 1.5px 0 rgba(31,45,62,0.33)' }}
              >
                <option value={0}>0 BP</option>
                <option value={1}>+1 BP</option>
                <option value={-1}>-1 BP</option>
                <option value={-2}>-2 BP</option>
                <option value={-3}>-3 BP</option>
              </select>
            </div>
            <div>
              <label className="font-label block mb-1">Situation</label>
              <select
                value={form.situation}
                onChange={e => set('situation', e.target.value as Combo['situation'])}
                className="w-full font-fredoka text-sm bg-paper border-2 border-ink px-3 py-2 cursor-pointer"
                style={{ borderRadius: 'var(--radius-sm)', boxShadow: '1.2px 1.5px 0 rgba(31,45,62,0.33)' }}
              >
                {['any', 'midscreen', 'corner', 'standing', 'aerial'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="font-label block mb-1">Difficulty</label>
            <DifficultyPips
              value={(form.difficulty ?? 1) as 1|2|3|4|5}
              onChange={v => set('difficulty', v)}
            />
          </div>
          <div>
            <label className="font-label block mb-1">Tags</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {(form.tags ?? []).map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 font-fredoka text-xs px-2 py-0.5 border-2 border-ink shadow-stamp-sm"
                  style={{ borderRadius: 'var(--radius-sm)', background: tagBg(tag) }}
                >
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="text-ink3 hover:text-red" style={{ fontSize: 10 }}>✕</button>
                </span>
              ))}
              <input
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(tagInput) } }}
                placeholder="+ add tag"
                className="font-fredoka text-xs bg-transparent border-2 border-dashed border-rule px-2 py-0.5 outline-none focus:border-ink w-24"
                style={{ borderRadius: 'var(--radius-sm)' }}
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              <span className="font-label text-ink3">Suggested:</span>
              {['midscreen', 'corner', 'no meter', 'low confirm', 'punish'].filter(s => !(form.tags ?? []).includes(s)).map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => addTag(s)}
                  className="font-fredoka text-xs border-2 border-dashed border-rule px-2 py-px hover:border-ink text-ink2"
                  style={{ borderRadius: 'var(--radius-sm)' }}
                >
                  + {s}
                </button>
              ))}
            </div>
            <p className="font-body-sm text-ink3 mt-1">Used to filter the combo list and surface combos in matchup notes.</p>
          </div>

          {/* Description */}
          <div>
            <label className="font-label block mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Write a quick note about this combo…"
              rows={3}
              className="w-full font-fredoka text-sm bg-paper border-2 border-ink px-3 py-2 outline-none focus:border-sky700 resize-none"
              style={{ borderRadius: 'var(--radius-sm)', boxShadow: '1.2px 1.5px 0 rgba(31,45,62,0.33)' }}
            />
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-6 py-4 border-t-2 border-ink sticky bottom-0 bg-paper"
        >
          <div className="flex items-center gap-3">
            {!isNew && onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="font-fredoka text-sm text-red border-2 border-red px-3 py-1.5 hover:bg-red hover:text-paper transition-colors"
                style={{ borderRadius: 'var(--radius-sm)' }}
              >
                🗑 delete combo
              </button>
            )}
            <span className="font-elite text-sm text-ink3 italic">
              autosaves as you type
            </span>
            <Button variant="secondary"
              type="button"
              onClick={onClose}
              className="font-fredoka text-sm text-ink border-2 border-rule px-4 py-2 hover:bg-paper2 transition-colors"
              style={{ borderRadius: 'var(--radius-sm)' }}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              {isNew ? 'Create' : 'Save'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Combo Notebook Screen ───────────────────────────────────────────────
export function ComboNotebook() {
  const { player } = useApp()
  const [activeChar, setActiveChar] = useState<string>(player.activeMain || player.mains[0] || '');
  const [editingCombo, setEditingCombo] = useState<Partial<Combo> | null>(null)
  const [refresh, setRefresh] = useState(0)
  const { show, close } = useDialog();

  const combos = activeChar
    ? getCombosByCharacter(player.id, activeChar)
    : []

  const activeCharData = CHARACTERS.find(c => c.id === activeChar)

  function handleSave(combo: Combo) {
    saveCombo(combo)
    setEditingCombo(null)
    setRefresh(r => r + 1)
  }

  function handleDuplicate(combo: Combo) {
    const now = new Date().toISOString()
    const dup: Combo = {
      ...combo,
      id: uuidv4(),
      title: combo.title + ' (copy)',
      createdAt: now,
      updatedAt: now,
    }
    saveCombo(dup)
    setRefresh(r => r + 1)
  }

  function handleExport(combo: Combo) {
    const counterHitStarter = combo.counterhit ? "CH " : "";
    const notation = counterHitStarter + " " + combo.notation.map((entry, j) => {
      const move = getMoveById(entry.moveId);
      const previousEntry = combo.notation[j - 1]
      if (previousEntry) {
        const connector = COMBO_CHAIN_OPTIONS.find((i) => i.value === previousEntry.connector);
        return `${connector?.display} ${move.input}`.trim();
      } else {
        return move.input;
      }
    }).join("");
    const finalCopiedString = `${combo.title}
${notation}
${combo.description}`;
    navigator.clipboard.writeText(finalCopiedString).then(() => {
      show({
        variant: "confirm",
        title: "Success",
        message: "Combo was copied to the clipboard.",
        primary: {
          label: "Close",
          onClick: close
        }
      });
    });
  }

  function handleDelete(id: string) {
    show({
      variant: "success",
      title: "",
      message: "Are you sure you want to delete this combo?",
      primary: {
        label: "Yes",
        onClick() {
          deleteCombo(id)
          setEditingCombo(null)
          setRefresh(r => r + 1)
        }
      },
      secondary: {
        label: "No",
        onClick() {
          close();
        }
      }
    })
  }

  // Stats
  const topDamage = combos.reduce((max, c) => Math.max(max, c.damage), 0)
  const charaname = CHARACTERS.find((i) => i.id === activeChar);

  return (
    <NotebookFrame activeTab="combos">
      <div className="flex h-full min-h-[600px]">
        {/* Main area */}
        <div className="flex-1 p-4 overflow-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <WashiLabel tone="sky">Section 03</WashiLabel>
            {!!charaname ? <Portrait tag='' imgSrc={`${import.meta.env.BASE_URL}thumbnails/${charaname?.name}.webp`} /> : null}
            <h1 className="font-display-xl font-caveat text-ink">Combo Notebook</h1>
            {!!charaname ? (<>
              <div className="ml-auto flex gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setEditingCombo({})}
              >
                + new combo
              </Button>
            </div>
            </>
            ) : null}
          </div>
          <p className="font-body-md text-ink2 mb-4">
            Combos you actually use. Pin one to "paste in notes" and it drops into the current matchup note in one click.
          </p>

          {/* Character switcher */}
          <div
            className="flex items-center gap-3 p-3 border-2 border-ink shadow-stamp mb-4 flex-wrap"
            style={{ borderRadius: 'var(--radius-md)', background: 'var(--color-paper2)' }}
          >
            <span className="font-label text-ink3">character</span>
            <div className="flex gap-2 flex-wrap">
              {player.mains.length > 0 ? player.mains.map(mainId => {
                const char = CHARACTERS.find(c => c.id === mainId)
                const count = getCombosByCharacter(player.id, mainId).length
                const isActive = mainId === activeChar
                return (
                  <button
                    key={mainId}
                    onClick={() => setActiveChar(mainId)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 border-2 border-ink font-fredoka font-500 text-sm transition-all ${isActive ? 'bg-ink text-paper' : 'bg-paper text-ink hover:bg-paper3'}`}
                    style={{ borderRadius: 'var(--radius-sm)', boxShadow: isActive ? 'none' : 'var(--shadow-stamp-sm)' }}
                  >
                    <span style={{ color: isActive ? 'var(--color-goldLt)' : 'var(--color-gold)' }}>★</span>
                    {char?.name ?? mainId}
                    <span
                      className="font-elite text-sm px-1"
                      style={{
                        background: isActive ? 'var(--color-sky500)' : 'var(--color-paper2)',
                        borderRadius: '3px',
                        color: isActive ? 'var(--color-paper)' : 'var(--color-ink3)',
                      }}
                    >
                      {count}
                    </span>
                  </button>
                )
              }) : (
                <div className='flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-rule'>
                  <p className='font-display-md font-caveat text-ink3'>Start by adding a main in the Roster tab.</p>
                </div>
              )}
            </div>
          </div>

          {/* Combo list */}
          {player.mains.length > 0 && combos.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-rule"
              style={{ borderRadius: 'var(--radius-md)' }}
            >
              <p className="font-display-md font-caveat text-ink3">No combos yet</p>
              <Button variant="secondary" onClick={() => setEditingCombo({})}>
                + add a combo
              </Button>
            </div>
          ) : (
            combos.map(combo => (
              <ComboCard
                key={combo.id}
                combo={combo}
                onEdit={() => setEditingCombo(combo)}
                onDuplicate={() => handleDuplicate(combo)}
                onExport={() => handleExport(combo)}
              />
            ))
          )}
        </div>

        {/* Right rail */}
        <div
          className="w-64 shrink-0 border-l-2 border-ink p-4 flex flex-col gap-4 overflow-auto"
          style={{ background: 'var(--color-paper2)' }}
        >
          {/* Stats card */}
          {activeCharData && (
            <div
              className="p-3 border-2 border-ink shadow-stamp"
              style={{ borderRadius: 'var(--radius-md)', background: 'var(--color-paper)' }}
            >
              <h3 className="font-caveat font-bold text-lg mb-2">{activeCharData.name} · stats</h3>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between font-body-sm">
                  <span className="text-ink2">combos</span>
                  <span className="font-fredoka font-600">{combos.length}</span>
                </div>
                <div className="flex justify-between font-body-sm">
                  <span className="text-ink2">top damage</span>
                  <span className="font-fredoka font-600 text-red">{topDamage.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-body-sm">
                  <span className="text-ink2">last edited</span>
                  <span className="font-elite text-xs text-ink3">
                    {combos[0] ? new Date(combos[0].updatedAt).toLocaleDateString() : '—'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Slash command hint */}
          <div
            className="p-3 border-2 border-rule"
            style={{ borderRadius: 'var(--radius-md)', background: 'var(--color-paper)' }}
          >
            <p className="font-fredoka font-600 text-sm mb-1">💡 use combos in notes</p>
            <p className="font-body-sm text-ink2">
              You can add a combo from this list in your matchup notes, or in your Progress section.
            </p>
          </div>

          {/* <StickyNote tone="sky" tilt={-2}>
            <p className="font-fredoka font-600 text-sm mb-1">Lab queue ✶</p>
            <p className="font-body-sm">still need to grind:<br />- corner meterless<br />- AA confirm</p>
          </StickyNote> */}
        </div>
      </div>

      {/* Combo editor modal */}
      {editingCombo !== null && activeChar && (
        <ComboEditor
          combo={editingCombo}
          characterId={activeChar}
          playerId={player.id}
          onSave={handleSave}
          onDelete={editingCombo.id ? () => handleDelete(editingCombo.id!) : undefined}
          onClose={() => setEditingCombo(null)}
        />
      )}
    </NotebookFrame>
  )
}
