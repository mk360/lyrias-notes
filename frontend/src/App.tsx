import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { CharacterGrid } from './components/CharacterGrid/CharacterGrid';
import { AboutDialog } from './components/AboutDialog/AboutDialog';
import CharacterView from './components/CharacterView';
import './App.css';

const CharacterRoute: React.FC = () => {
  const { characterName } = useParams<{ characterName: string }>();
  return <CharacterView characterName={characterName || ''} />;
};

function App() {
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  return (
    <AppProvider>
      <BrowserRouter>
        <div className="relative">
          {/* Menu button (top-right) */}
          <button
            onClick={() => setIsAboutOpen(true)}
            className="fixed top-4 right-4 z-40 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded shadow-lg"
          >
            About
          </button>

          {/* Routes */}
          <Routes>
            <Route path="/" element={<CharacterGrid />} />
            <Route path="/character/:characterName" element={<CharacterRoute />} />
          </Routes>

          {/* About Dialog */}
          <AboutDialog isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;