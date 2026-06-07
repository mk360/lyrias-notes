import { FrameDataTable } from '@/components/frame-data-table'
import { NotebookFrame } from '@/components/notebook-frame'
import { Portrait } from '@/components/portrait'
import { RatingStepper } from '@/components/rating-stepper'
import { WashiLabel } from '@/components/washi-label'
import { NotesEditor, NotesEditorHandle } from '@/components/wysiwyg/editor'
import { useApp } from '@/context/AppContext'
import { CHARACTERS } from '@/lib/characters'
import type { Move } from '@/lib/types'
import { useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

export function MatchupDetail({ readOnly = false }: { readOnly?: boolean }) {
  const { playerChar, oppChar } = useParams<{
    playerChar?: string
    oppChar?: string
  }>()
  const { player, matchups, updateMatchupRating, updateMatchupNotes } = useApp();

  const [frameTab, setFrameTab] = useState<'opp' | 'self'>('opp')
  const editorRef = useRef<NotesEditorHandle>(null)


  // Resolve characters
  const pCharId = playerChar ?? player.activeMain
  const oCharId = oppChar ?? ''
  const pChar = CHARACTERS.find(c => c.id === pCharId)
  const oChar = CHARACTERS.find(c => c.id === oCharId)

  const matchup = matchups.find(
    m => m.playerCharacterId === pCharId &&
         m.opponentCharacterId === oCharId &&
         m.playerId === player.id
  )

  function handleRatingChange(rating: number | null) {
    updateMatchupRating(pCharId, oCharId, rating)
  }

  function handleNotesChange(notes: object) {
    updateMatchupNotes(pCharId, oCharId, notes)
  }

  function handleMoveClick(move: Move) {
    if (editorRef.current?.insertMoveChipAtCursor) {
      editorRef.current.insertMoveChipAtCursor(move.characterId, move.input)
    }
  }

  if (!pChar || !oChar) {
    return (
      <NotebookFrame activeTab="matchups">
        <div className="p-8">
          <p className="font-display-md font-caveat text-ink2">Character not found</p>
        </div>
      </NotebookFrame>
    )
  }

  const title = `${pChar.name} vs ${oChar.name}`

  // ─── Desktop two-page spread ─────────────────────────────────────────────
  return (
    <NotebookFrame activeTab="matchups" spreadMode>
      <div className="flex h-full min-h-[600px]">
        {/* Left page — notes */}
        <div className="flex-1 flex flex-col border-r-0 overflow-hidden" style={{ minWidth: 0 }}>
          {/* Left header */}
          <div className="flex items-center gap-3 px-4 pt-4 pb-3 border-b-2 border-rule flex-wrap">
            <Portrait imgSrc={`${import.meta.env.BASE_URL}thumbnails/${pChar.name}.webp`} tag={pChar.tag} tone="warm" size={48} />
            <span className="font-fredoka font-500 text-ink2">vs</span>
            <Portrait imgSrc={`${import.meta.env.BASE_URL}thumbnails/${oChar.name}.webp`} tag={oChar.tag} tone="default" size={48} />
            <div className="flex flex-col">
              <h2 className="font-display-lg font-caveat text-ink">{title}</h2>
            </div>
            <div className='flex flex-col'>
              <h3 className='font-display-xs font-500 text-ink2'>Matchup Rating</h3>
              <RatingStepper
                value={matchup?.rating ?? null}
                onChange={handleRatingChange}
                size="md"
                className="ml-auto"
              />
            </div>
          </div>

          {/* Notes editor */}
          <div className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
            <NotesEditor
              ref={editorRef}
              content={matchup?.notes ?? {}}
              onChange={handleNotesChange}
              opponentCharId={oCharId}
              playerCharId={pCharId}
              playerId={player.id}
              matchupId={matchup?.id}
              readOnly={readOnly}
            />
          </div>
        </div>

        {/* Right page — frame data + meta */}
        <div
          className="flex flex-col border-l-2 border-ink overflow-hidden"
          style={{ width: '42%', minWidth: 300, background: 'var(--color-paper2)' }}
        >
          {/* Right header */}
          <div className="px-4 pt-4 pb-2 border-b-2 border-rule">
            <div className="flex items-center gap-2 mb-1">
              <WashiLabel tone="sky">Movelist · Frame Data</WashiLabel>
            </div>
            <p className="font-body-sm text-ink2 mb-2">Tap any move to drop a chip into your notes →</p>

            {/* Frame tab selector */}
            <div className="flex gap-1">
              <button
                onClick={() => setFrameTab('opp')}
                className={`font-fredoka font-500 text-sm px-3 py-1.5 border-2 border-ink transition-colors ${frameTab === 'opp' ? 'bg-ink text-paper' : 'bg-paper text-ink hover:bg-paper3'}`}
                style={{ borderRadius: 'var(--radius-sm)' }}
              >
                {oChar.name}
              </button>
              <button
                onClick={() => setFrameTab('self')}
                className={`font-fredoka font-500 text-sm px-3 py-1.5 border-2 border-ink transition-colors ${frameTab === 'self' ? 'bg-ink text-paper' : 'bg-paper text-ink hover:bg-paper3'}`}
                style={{ borderRadius: 'var(--radius-sm)' }}
              >
                ↔ {pChar.name}
              </button>
            </div>
          </div>

          {/* Frame data table */}
          <div className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
            <FrameDataTable
              characterId={frameTab === 'opp' ? oCharId : pCharId}
              onMoveClick={readOnly ? undefined : handleMoveClick}
            />
          </div>
        </div>
      </div>
    </NotebookFrame>
  )
}
