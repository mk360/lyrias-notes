import React from 'react'
import { useParams } from 'react-router-dom'
import { MatchupDetail } from './matchup-detail'
import { getMatchupByShareId } from '@/lib/db'
import { NotebookFrame } from '@/components/notebook-frame'

export function ShareScreen() {
  const { shareId } = useParams<{ shareId: string }>()
  const matchup = shareId ? getMatchupByShareId(shareId) : null

  if (!matchup) {
    return (
      <NotebookFrame>
        <div className="p-8 text-center">
          <p className="font-display-md font-caveat text-ink2 mb-2">Matchup not found</p>
          <p className="font-body-sm text-ink3">This shared matchup doesn't exist or the link may have expired.</p>
        </div>
      </NotebookFrame>
    )
  }

  // Override URL params by rendering MatchupDetail directly with the matchup's chars
  // We'll pass them via query param pattern using the existing route
  return (
    <div>
      {/* Render detail in read-only mode */}
      <MatchupDetail readOnly />
    </div>
  )
}
