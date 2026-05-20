import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from '@/context/AppContext'
import { RosterScreen } from '@/screens/roster'
import { MatchupMatrix } from '@/screens/matchup-matrix'
import { MatchupDetail } from '@/screens/matchup-detail'
import { ComboNotebook } from '@/screens/combos'
import { ShareScreen } from '@/screens/share'
import { DialogProvider } from './context/DialogContext'

interface ImportMeta {
  env: {
    BASE_URL: string
  }
}

export function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppProvider>
          <DialogProvider>
            <Routes>
              <Route path="/" element={<Navigate to="/matchups" replace />} />
              <Route path="/roster" element={<RosterScreen />} />
              <Route path="/matchups" element={<MatchupMatrix />} />
              <Route path="/matchups/:playerChar/:oppChar" element={<MatchupDetail />} />
              <Route path="/share/:shareId/:playerChar/:oppChar" element={<ShareScreen />} />
              <Route path="/combos" element={<ComboNotebook />} />
            </Routes>
          </DialogProvider>
      </AppProvider>
    </BrowserRouter>
  )
}
