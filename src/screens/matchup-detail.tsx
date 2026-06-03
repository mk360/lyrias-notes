import { Button } from '@/components/button'
import { FrameDataTable } from '@/components/frame-data-table'
import { NotebookFrame } from '@/components/notebook-frame'
import { Portrait } from '@/components/portrait'
import { RatingStepper } from '@/components/rating-stepper'
import { WashiLabel } from '@/components/washi-label'
import { NotesEditor, NotesEditorHandle } from '@/components/wysiwyg/editor'
import { useApp } from '@/context/AppContext'
import { CHARACTERS } from '@/lib/characters'
import type { Move } from '@/lib/types'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

type DetailTab = 'notes' | 'frames' | 'clips'

export function MatchupDetail({ readOnly = false }: { readOnly?: boolean }) {
  const { playerChar, oppChar, shareId } = useParams<{
    playerChar?: string
    oppChar?: string
    shareId?: string
  }>()
  const navigate = useNavigate()
  const { player, matchups, updateMatchupRating, updateMatchupNotes, generateShareId } = useApp();

  const [mobileTab, setMobileTab] = useState<DetailTab>('notes')
  const [frameTab, setFrameTab] = useState<'opp' | 'self'>('opp')
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const editorRef = useRef<NotesEditorHandle>(null)

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

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

  // Navigation to prev/next opponent
  const pIndex = CHARACTERS.findIndex(c => c.id === oCharId)
  const prevOpp = CHARACTERS[pIndex - 1]
  const nextOpp = CHARACTERS[pIndex + 1]

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
    if (isMobile) setMobileTab('notes')
  }

  function handleShare() {
    if (!matchup) return
    const sid = generateShareId(pCharId, oCharId)
    const url = `${window.location.origin}/share/${sid}`
    navigator.clipboard.writeText(url).then(() => alert(`Share URL copied!\n${url}`))
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

  // ─── Mobile layout ─────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{ background: 'var(--color-paper)', maxWidth: 430, margin: '0 auto' }}
      >
        {/* Mobile binding strip top */}
        <div
          className="flex items-center justify-between px-3 py-2 border-b-2 border-ink"
          style={{ background: 'var(--color-paper3)' }}
        >
          <div className="flex gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="binding-hole" style={{ width: 14, height: 14 }} />
            ))}
          </div>
          <span className="font-elite text-xs text-ink3">
            p.{(pIndex + 1).toString().padStart(2, '0')}
          </span>
        </div>

        {/* Mobile header */}
        <div className="px-4 pt-3 pb-2 border-b-2 border-rule">
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => navigate('/matchups')}
              className="font-fredoka text-sm text-sky700 hover:underline"
            >
              ← Matchups
            </button>
            <span
              className="font-elite text-xs px-2 py-0.5 bg-sky200 border border-sky300 text-sky700"
              style={{ borderRadius: 'var(--radius-sm)' }}
            >
              matchup #{pIndex + 1}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Portrait tag={pChar.tag} tone="warm" size={48} />
            <span className="font-fredoka font-500 text-sm text-ink2">vs</span>
            <Portrait tag={oChar.tag} tone="default" size={48} />
            <RatingStepper
              value={matchup?.rating ?? null}
              onChange={handleRatingChange}
              size="sm"
              className="ml-auto"
            />
          </div>
        </div>

        {/* Mobile tab bar */}
        <div className="flex border-b-2 border-ink">
          {(['notes', 'frames', 'clips'] as DetailTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setMobileTab(tab)}
              className={`flex-1 py-2 font-fredoka font-500 text-sm border-r-2 border-ink last:border-r-0 transition-colors ${mobileTab === tab ? 'bg-ink text-paper' : 'bg-paper2 text-ink hover:bg-paper3'}`}
            >
              {tab === 'clips' ? 'clips · 0' : tab}
            </button>
          ))}
        </div>

        {/* Mobile body */}
        <div className="flex-1 overflow-auto" style={{ minHeight: 0 }}>
          {mobileTab === 'notes' && (
            <NotesEditor
              ref={editorRef}
              content={matchup?.notes ?? {}}
              onChange={handleNotesChange}
              opponentCharId={oCharId}
              playerCharId={pCharId}
              playerId={player.id}
              matchupId={matchup?.id}
              readOnly={readOnly}
              compact
            />
          )}
          {mobileTab === 'frames' && (
            <FrameDataTable
              characterId={oCharId}
              onMoveClick={readOnly ? undefined : handleMoveClick}
            />
          )}
          {mobileTab === 'clips' && (
            <div className="p-4">
              <p className="font-body-sm text-ink3">No clips yet. Add them via "+ clip" in the notes toolbar.</p>
            </div>
          )}
        </div>

        {/* Mobile bottom bar */}
        <div
          className="flex items-center justify-between px-4 py-3 border-t-2 border-ink"
          style={{ background: 'var(--color-paper2)' }}
        >
          <button
            onClick={() => prevOpp && navigate(`/matchups/${pCharId}/${prevOpp.id}`)}
            disabled={!prevOpp}
            className="font-fredoka text-sm text-ink2 disabled:opacity-30"
          >
            ← #{pIndex}
          </button>
          <button
            onClick={handleShare}
            className="font-fredoka text-sm text-sky700"
          >
            ↗ share
          </button>
          <span className="font-fredoka font-600 text-sm text-green">save ✓</span>
          <button
            onClick={() => nextOpp && navigate(`/matchups/${pCharId}/${nextOpp.id}`)}
            disabled={!nextOpp}
            className="font-fredoka text-sm text-ink2 disabled:opacity-30"
          >
            #{pIndex + 2} →
          </button>
        </div>
      </div>
    )
  }

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
              <WashiLabel tone="sky">Opponent · frame data</WashiLabel>
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
