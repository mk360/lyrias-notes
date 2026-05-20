import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { toPng } from 'html-to-image'
import { NotebookFrame } from '@/components/notebook-frame'
import { RatingCell } from '@/components/rating-cell'
import { WashiLabel } from '@/components/washi-label'
import { Button } from '@/components/button'
import { useApp } from '@/context/AppContext'
import { CHARACTERS } from '@/lib/characters'

export function MatchupMatrix() {
  const navigate = useNavigate()
  const { player, matchups } = useApp()
  const matrixRef = useRef<HTMLDivElement>(null)

  const displayMains = player.mains.length > 0 ? player.mains : []

  function getMatchup(playerCharId: string, oppCharId: string) {
    return matchups.find(
      m => m.playerCharacterId === playerCharId &&
           m.opponentCharacterId === oppCharId &&
           m.playerId === player.id
    )
  }

  async function handleExport() {
    if (!matrixRef.current) return
    const dataUrl = await toPng(matrixRef.current, { cacheBust: true })
    const link = document.createElement('a')
    link.download = 'matchup-matrix.png'
    link.href = dataUrl
    link.click()
  }

  return (
    <NotebookFrame activeTab="matchups">
      <div className="p-4 overflow-auto h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <WashiLabel tone="sky">Section 02</WashiLabel>
          <h1 className="font-display-xl font-caveat text-ink">Matchup Matrix</h1>
          <div className="ml-auto flex gap-2 items-center">
            <span className="font-body-sm text-ink2">playing as</span>
            <select
              className="font-fredoka font-500 text-sm bg-ink text-paper border-2 border-ink px-3 py-1.5 cursor-pointer shadow-stamp"
              style={{ borderRadius: 'var(--radius-sm)' }}
              value={player.activeMain}
              onChange={e => {/* setActiveMain handled by player context */}}
            >
              {player.mains.map(m => {
                const c = CHARACTERS.find(ch => ch.id === m)
                return <option key={m} value={m}>★ {c?.name ?? m}</option>
              })}
            </select>
            <Button variant="secondary" size="sm" onClick={handleExport}>↗ export</Button>
          </div>
        </div>

        <p className="font-body-sm text-ink2 mb-4">
          Rows are your character · columns are the opponent · each cell is your rating from 0 (suffering) to 10 (free win). Click any cell to open the matchup page.
        </p>

        {/* Lined paper wrapper */}
        <div
          ref={matrixRef}
          className="overflow-auto flex-1"
          style={{
            background: 'repeating-linear-gradient(to bottom, transparent, transparent calc(2rem - 1px), var(--color-rule) calc(2rem - 1px), var(--color-rule) 2rem)',
            backgroundOrigin: 'content-box',
          }}
        >
          {displayMains.length === 0 ? (
            <div className="p-8 text-center">
              <p className="font-display-md font-caveat text-ink2 mb-2">No mains yet</p>
              <p className="font-body-sm text-ink3">Go to the Roster tab and star some characters to get started.</p>
            </div>
          ) : (
            <table className="border-collapse w-full" style={{ minWidth: 'max-content' }}>
              <thead>
                <tr>
                  {/* Row header spacer */}
                  <th className="w-24 shrink-0" />
                  {CHARACTERS.map(opp => (
                    <th
                      key={opp.id}
                      className="font-elite text-sm text-ink2 text-center pb-1"
                      style={{
                        writingMode: 'vertical-rl',
                        transform: 'rotate(180deg)',
                        height: 80,
                        width: 32,
                        padding: '4px 0',
                        verticalAlign: 'bottom',
                      }}
                    >
                      {opp.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayMains.map(mainId => {
                  const mainChar = CHARACTERS.find(c => c.id === mainId)
                  const isActive = mainId === player.activeMain
                  return (
                    <tr key={mainId}>
                      <td
                        className="font-fredoka font-500 text-xl pr-3 whitespace-nowrap"
                        style={{ color: isActive ? 'var(--color-gold)' : 'var(--color-ink)' }}
                      >
                        {isActive && <span className="mr-1">★</span>}
                        {mainChar?.name ?? mainId}
                      </td>
                      {CHARACTERS.map(opp => {
                        const mu = getMatchup(mainId, opp.id)
                        return (
                          <td key={opp.id} className="p-0.5">
                            <RatingCell
                              value={mu?.rating ?? null}
                              size={28}
                              onClick={() => navigate(`/matchups/${mainId}/${opp.id}`)}
                            />
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}

                {/* + add character row */}
                <tr>
                  <td
                    className="font-fredoka text-sm text-ink3 pr-3 cursor-pointer hover:text-sky700 transition-colors pt-1"
                    onClick={() => navigate('/roster')}
                  >
                    + add character
                  </td>
                  {CHARACTERS.map(opp => (
                    <td key={opp.id} className="p-0.5">
                      <div
                        className="flex items-center justify-center border-2 border-dashed border-rule"
                        style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)' }}
                      />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          )}
        </div>

        {/* Legend */}
        <div
          className="mt-4 p-3 flex flex-wrap items-center gap-4 border-2 border-ink shadow-stamp"
          style={{ borderRadius: 'var(--radius-md)', background: 'var(--color-paper2)' }}
        >
          <span className="font-label text-ink2">Scale</span>
          {[
            { v: 0, label: 'suffering' },
            { v: 3, label: 'rough' },
            { v: 5, label: 'mirror' },
            { v: 7, label: 'workable' },
            { v: 9, label: 'free win' },
          ].map(({ v, label }) => (
            <div key={v} className="flex items-center gap-1.5">
              <RatingCell value={v} size={24} />
              <span className="font-body-sm text-ink2">{label}</span>
            </div>
          ))}
          <span className="font-body-sm text-ink3">· · · = unrated</span>

          <Button
            variant="primary"
            size="sm"
            className="ml-auto"
            onClick={handleExport}
          >
            export → tier list PNG
          </Button>
        </div>
      </div>
    </NotebookFrame>
  )
}
