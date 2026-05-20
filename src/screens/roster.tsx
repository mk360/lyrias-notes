import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { NotebookFrame } from '@/components/notebook-frame'
import { Portrait } from '@/components/portrait'
import { WashiLabel } from '@/components/washi-label'
import { StickyNote } from '@/components/sticky-note'
import { Button } from '@/components/button'
import { useApp } from '@/context/AppContext'
import { CHARACTERS } from '@/lib/characters'
import type { Character } from '@/lib/types'

type SortKey = 'a-z' | 'archetype'
type FilterKey = 'all' | 'grappler' | 'rushdown' | 'zoner' | 'all-rounder' | 'technical' | 'setplay'

export function RosterScreen() {
  const navigate = useNavigate()
  const { player, addMain, removeMain, setActiveMain } = useApp()
  const [sort, setSort] = useState<SortKey>('a-z')
  const [filter, setFilter] = useState<FilterKey>('all')
  const [showAddPicker, setShowAddPicker] = useState(false)
  const [pickerQuery, setPickerQuery] = useState('')
  const [pickerHighlight, setPickerHighlight] = useState(0)
  const pickerInputRef = useRef<HTMLInputElement>(null)

  const sorted = [...CHARACTERS].sort((a, b) =>
    sort === 'a-z' ? a.name.localeCompare(b.name) : a.archetype.localeCompare(b.archetype)
  )
  const filtered = filter === 'all' ? sorted : sorted.filter(c => c.archetype === filter)

  const pickerFiltered = CHARACTERS.filter(c =>
    c.name.toLowerCase().includes(pickerQuery.toLowerCase()) ||
    c.tag.toLowerCase().includes(pickerQuery.toLowerCase())
  )

  useEffect(() => {
    if (showAddPicker) {
      setTimeout(() => pickerInputRef.current?.focus(), 50)
    }
  }, [showAddPicker])

  function handleCharClick(char: Character) {
    const dest = player.activeMain || player.mains[0] || char.id
    navigate(`/matchups/${dest}/${char.id}`)
    // if no main, specify that i should add a main first
  }

  function handleStarClick(e: React.MouseEvent, charId: string) {
    e.stopPropagation()
    if (player.mains.includes(charId)) {
      removeMain(charId)
    } else {
      addMain(charId)
    }
  }

  function handlePickerKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setPickerHighlight(h => Math.min(h + 1, Math.min(pickerFiltered.length - 1, 5))) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setPickerHighlight(h => Math.max(h - 1, 0)) }
    if (e.key === 'Enter')     { const c = pickerFiltered[pickerHighlight]; if (c) { addMain(c.id); setShowAddPicker(false); setPickerQuery('') } }
    if (e.key === 'Escape')    { setShowAddPicker(false) }
  }

  return (
    <NotebookFrame activeTab="roster">
      <div className="flex gap-0 h-full min-h-[600px]">
        {/* Main area */}
        <div className="flex-1 p-4 overflow-auto">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <WashiLabel tone="sky">Section 01</WashiLabel>
              <h1 className="font-display-xl font-caveat text-ink" style={{ lineHeight: 1 }}>The Roster</h1>
            </div>
            <div className="flex gap-2 mt-1">
              <select
                className="font-fredoka text-sm bg-paper2 border-2 border-ink px-2 py-1 shadow-stamp-sm cursor-pointer"
                style={{ borderRadius: 'var(--radius-sm)' }}
                value={filter}
                onChange={e => setFilter(e.target.value as FilterKey)}
              >
                <option value="all">filter: all</option>
                <option value="rushdown">rushdown</option>
                <option value="grappler">grappler</option>
                <option value="zoner">zoner</option>
                <option value="all-rounder">all-rounder</option>
                <option value="technical">technical</option>
                <option value="setplay">setplay</option>
              </select>
              <select
                className="font-fredoka text-sm bg-paper2 border-2 border-ink px-2 py-1 shadow-stamp-sm cursor-pointer"
                style={{ borderRadius: 'var(--radius-sm)' }}
                value={sort}
                onChange={e => setSort(e.target.value as SortKey)}
              >
                <option value="a-z">sort: A–Z</option>
                <option value="archetype">sort: archetype</option>
              </select>
            </div>
          </div>

          {/* Subtitle */}
          <p className="font-body-sm text-ink2 mb-4">
            Tap a character to open their matchup page · click the ☆ in the corner to add them as a main · ★ = main · ✎ = has notes
          </p>

          {/* Character grid */}
          <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))' }}>
            {filtered.map(char => {
              const isMain = player.mains.includes(char.id)
              return (
                <div key={char.id} className="relative group">
                  <div
                    onClick={() => handleCharClick(char)}
                    className="flex flex-col items-center gap-1 p-2 border-2 border-ink cursor-pointer transition-all hover:shadow-stamp-lg"
                    style={{
                      borderRadius: 'var(--radius-md)',
                      background: isMain ? 'var(--color-paper2)' : 'var(--color-paper)',
                      boxShadow: 'var(--shadow-stamp)',
                    }}
                  >
                    <Portrait
                      tag={char.tag}
                      tone={isMain ? 'warm' : 'default'}
                      size={48}
                    />
                    <span className="font-fredoka text-xs text-center text-ink leading-tight">{char.name}</span>
                  </div>

                  {/* Star badge / toggle */}
                  <button
                    onClick={e => handleStarClick(e, char.id)}
                    className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center text-sm border-2 border-ink shadow-stamp-sm transition-all hover:scale-110"
                    style={{
                      borderRadius: '50%',
                      background: isMain ? 'var(--color-gold)' : 'var(--color-paper)',
                      color: isMain ? 'var(--color-paper)' : 'var(--color-ink3)',
                    }}
                    title={isMain ? 'Remove as main' : 'Add as main'}
                    aria-label={isMain ? `Remove ${char.name} as main` : `Add ${char.name} as main`}
                  >
                    {isMain ? '★' : '☆'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right rail — My Mains */}
        <div
          className="w-64 shrink-0 border-l-2 border-ink p-4 flex flex-col gap-4 overflow-auto"
          style={{ background: 'var(--color-paper2)' }}
        >
          <div>
            <h2 className="font-display-md font-caveat text-ink mb-1">My mains</h2>
            <p className="font-body-sm text-ink2 mb-3">Active main appears in matchup matrix</p>

            <div className="flex flex-col gap-2">
              {player.mains.length === 0 && (
                <p className="font-body-sm text-ink3">No mains yet — click ☆ on any character</p>
              )}
              {player.mains.map(mainId => {
                const char = CHARACTERS.find(c => c.id === mainId)
                if (!char) return null
                const isActive = player.activeMain === mainId
                return (
                  <button
                    key={mainId}
                    onClick={() => setActiveMain(mainId)}
                    className="flex items-center gap-2 px-3 py-2 border-2 border-ink text-left transition-all hover:shadow-stamp"
                    style={{
                      borderRadius: 'var(--radius-sm)',
                      background: isActive ? 'var(--color-ink)' : 'var(--color-paper)',
                      color: isActive ? 'var(--color-paper)' : 'var(--color-ink)',
                      boxShadow: isActive ? 'none' : 'var(--shadow-stamp-sm)',
                    }}
                  >
                    <span style={{ color: 'var(--color-gold)' }}>★</span>
                    <span className="font-fredoka font-500 text-sm">{char.name}</span>
                    {isActive && (
                      <span
                        className="ml-auto font-elite text-xs px-1"
                        style={{ background: 'var(--color-sky500)', borderRadius: '2px', color: 'var(--color-paper)', fontSize: 10 }}
                      >
                        active
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Add character button */}
            <div className="relative mt-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowAddPicker(v => !v)}
                className="w-full justify-center"
              >
                + add character
              </Button>

              {/* Quick picker popover */}
              {showAddPicker && (
                <div
                  className="absolute top-full left-0 right-0 z-40 bg-paper border-2 border-ink shadow-float mt-1"
                  style={{ borderRadius: 'var(--radius-md)', width: 320, left: '50%', transform: 'translateX(-50%)' }}
                >
                  <div className="p-3 border-b-2 border-ink">
                    <h3 className="font-display-md font-caveat mb-1">Add a main</h3>
                    <p className="font-body-sm text-ink2 mb-2">Pick the character you want to play</p>
                    <input
                      ref={pickerInputRef}
                      value={pickerQuery}
                      onChange={e => { setPickerQuery(e.target.value); setPickerHighlight(0) }}
                      onKeyDown={handlePickerKeyDown}
                      placeholder="search…"
                      className="w-full font-fredoka text-sm bg-paper2 border-2 border-rule px-2 py-1 outline-none focus:border-ink"
                      style={{ borderRadius: 'var(--radius-sm)' }}
                    />
                    <p className="font-elite text-xs text-ink3 mt-1">
                      MATCHES · {pickerFiltered.length}
                    </p>
                  </div>

                  <div style={{ maxHeight: 240, overflowY: 'auto' }}>
                    {pickerFiltered.slice(0, 6).map((char, idx) => {
                      const isAlreadyMain = player.mains.includes(char.id)
                      const isHighlighted = idx === pickerHighlight
                      return (
                        <div
                          key={char.id}
                          className={`flex items-center gap-3 px-3 py-2 cursor-pointer border-b border-rule last:border-0 transition-colors ${isHighlighted ? 'bg-sky100' : 'hover:bg-paper2'}`}
                          onClick={() => {
                            if (!isAlreadyMain) { addMain(char.id); setShowAddPicker(false); setPickerQuery('') }
                          }}
                        >
                          <Portrait tag={char.tag} tone={isAlreadyMain ? 'warm' : 'default'} size={36} />
                          <div className="flex-1">
                            <div className="font-fredoka font-500 text-sm">{char.name}</div>
                            <div className="font-elite text-xs text-ink3">{char.tag}</div>
                          </div>
                          {isAlreadyMain ? (
                            <span className="font-label text-gold text-xs">★ main</span>
                          ) : isHighlighted ? (
                            <span
                              className="font-fredoka font-500 text-xs px-2 py-0.5 bg-ink text-paper border-2 border-ink"
                              style={{ borderRadius: 'var(--radius-sm)' }}
                            >
                              ↵ add
                            </span>
                          ) : (
                            <span
                              className="font-fredoka text-xs px-2 py-0.5 border-2 border-rule text-ink2 hover:border-ink"
                              style={{ borderRadius: 'var(--radius-sm)' }}
                            >
                              + add
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  <div className="px-3 py-2 border-t-2 border-rule bg-paper2">
                    <p className="font-elite text-xs text-ink3">↑↓ nav · ↵ add as main · esc close</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sticky notes */}
          <StickyNote tone="gold" tilt={2}>
            <p className="font-fredoka font-600 text-sm mb-1">Reminder ✦</p>
            <p className="font-body-sm">need to fight Belial 3x this week</p>
          </StickyNote>

          <StickyNote tone="sky" tilt={-3}>
            <p className="font-fredoka font-600 text-sm mb-1">Tip ✶</p>
            <p className="font-body-sm">swap to Ladiva vs zoners</p>
          </StickyNote>
        </div>
      </div>
    </NotebookFrame>
  )
}
