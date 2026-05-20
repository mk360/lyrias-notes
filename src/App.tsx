import { AppProvider } from '@/context/AppContext'
import { ComboNotebook } from '@/screens/combos'
import { MatchupDetail } from '@/screens/matchup-detail'
import { MatchupMatrix } from '@/screens/matchup-matrix'
import { RosterScreen } from '@/screens/roster'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { DialogProvider } from './context/DialogContext'

export function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppProvider>
          <DialogProvider>
            <Routes>
              <Route path="/" element={<RosterScreen />} />
              <Route path="/matchups" element={<MatchupMatrix />} />
              <Route path="/matchups/:playerChar/:oppChar" element={<MatchupDetail />} />
              <Route path="/combos" element={<ComboNotebook />} />
            </Routes>
          </DialogProvider>
      </AppProvider>
    </BrowserRouter>
  )
}
