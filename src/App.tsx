import { AppProvider } from '@/context/AppContext'
import { ComboNotebook } from '@/screens/combos'
import { MatchupDetail } from '@/screens/matchup-detail'
import { MatchupMatrix } from '@/screens/matchup-matrix'
import { RosterScreen } from '@/screens/roster'
import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { DialogProvider } from './context/DialogContext'
import { CoverAnimation } from './components/cover-animation'
import { ProgressScreen } from './screens/progress'

export function App() {
  const [coverDone, setCoverDone] = useState(false);
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppProvider>
          <DialogProvider>
              {!coverDone && (
                <div style={{
                  position: 'fixed',
                  inset: 0,
                  zIndex: 200,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 16,
                  pointerEvents: 'none',
                }}>
                  {/* This inner div mirrors the max-w-7xl card from NotebookFrame
                      so the cover aligns pixel-perfectly with the notebook card */}
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '80rem', /* max-w-7xl */
                    minHeight: 640,
                    height: "100%",
                    alignSelf: 'stretch',
                  }}>
                    <CoverAnimation onDone={() => setCoverDone(true)} />
                  </div>
                </div>
              )}
              <Routes>
                <Route path="/" element={<RosterScreen />} />
                <Route path="/matchups" element={<MatchupMatrix />} />
                <Route path="/matchups/:playerChar/:oppChar" element={<MatchupDetail />} />
                <Route path="/combos" element={<ComboNotebook />} />
                <Route path="/progress" element={<ProgressScreen />} />
              </Routes>
          </DialogProvider>
      </AppProvider>
    </BrowserRouter>
  )
}
