import { getMovesArrayByCharacter } from '@/lib/moves'
import type { Move } from '@/lib/types'
import { useState } from 'react'
import { MoveDisplay, MoveDisplayToggle } from './move-display-toggle'

interface FrameDataTableProps {
  characterId: string
  onMoveClick?: (move: Move) => void
  className?: string
}

export function FrameDataTable({ characterId, onMoveClick, className = '' }: FrameDataTableProps) {
  const [query, setQuery] = useState('')
  const moves = getMovesArrayByCharacter(characterId);
  const [displayType, setDisplayType] = useState<MoveDisplay>("input");

  const filtered = query
    ? moves.filter(m =>
        m.name.toLowerCase().includes(query.toLowerCase()) ||
        m.input.toLowerCase().includes(query.toLowerCase())
      )
    : moves

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Filter input */}
      <div className="p-2 border-b-2 border-rule flex">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="filter moves…"
          className="flex-1 font-fredoka text-sm bg-paper border-2 border-rule px-2 py-1 outline-none focus:border-ink3 transition-colors"
          style={{ borderRadius: 'var(--radius-sm)' }}
        />
        <MoveDisplayToggle className='flex_[0.5]' value={displayType} onChange={setDisplayType} />
      </div>

      {/* Table */}
      <div className="overflow-auto flex-1">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-paper2 border-b-2 border-ink">
            <tr>
              {['MOVE', 'STARTUP', 'ON BLOCK', 'ON HIT', 'TYPE'].map((h) => (
                <th
                  key={h}
                  className="font-elite text-xs text-ink2 px-2 py-2 text-left"
                  style={{ borderBottom: '2px solid var(--color-ink)' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((move, idx) => (
              <tr
                key={move.id}
                onClick={() => onMoveClick?.(move)}
                className={`
                  border-b border-rule
                  transition-colors
                  ${onMoveClick ? 'cursor-pointer hover:bg-sky100' : ''}
                  ${idx % 2 === 0 ? 'bg-paper' : 'bg-paper2'}
                `}
                title={onMoveClick ? 'Click to insert chip into notes' : undefined}
              >
                <td title={displayType === "input" && !!move.name ? move.name : move.input} className="font-elite  px-2 py-1.5 font-bold text-ink">{displayType === "input" ? move.input : (move.name || move.input)}</td>
                <td className="font-elite  px-2 py-1.5 text-ink2">{move.startup}f</td>
                <td
                  className="font-elite  px-2 py-1.5"
                  style={{
                    color: move.onBlock.startsWith('-')
                      ? (parseInt(move.onBlock) <= -8 ? '#B14939' : '#7A4A28')
                      : '#4C8A5A',
                  }}
                >
                  {move.onBlock}
                </td>
                <td
                  className="font-elite text-xs px-2 py-1.5"
                  style={{
                    color: move.onHit === 'KD'
                      ? '#4C8A5A'
                      : move.onHit === '—' ? '#8C9CAD' : '#1F2D3E',
                  }}
                >
                  {move.onHit}
                </td>
                <td className="font-elite text-xs px-2 py-1.5 text-ink3">{move.type}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 font-body-sm text-ink3 text-center">
                  No moves match "{query}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {onMoveClick && (
        <div className="px-2 py-1 border-t border-rule bg-paper">
          <p className="font-label text-ink3" style={{ fontSize: 10 }}>
            Tap any move to drop a chip into your notes →
          </p>
        </div>
      )}
    </div>
  )
}
