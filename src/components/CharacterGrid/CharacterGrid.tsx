import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { CharacterCard } from './CharacterCard';

const CHARACTERS = {
  row1: ['Zeta', 'Vaseraga', 'Beatrix', 'Eustace', 'Anre', 'Seox', 'Lancelot', 'Vane', 'Percival', 'Siegfried'],
  row2: ['Versusia', 'Zooey', 'Ladiva', 'Narmaya', 'Gran', 'Djeeta', 'Charlotta', 'Ferry', 'Anila', 'Vikala'],
  row3: ['Galleon', 'Grimnir', 'Metera', 'Lowain', 'Katalina', 'Vira', 'Yuel', 'Soriz', 'Cagliostro', 'Wilnas'],
  row4: ['Ilsa', 'Sandalphon', 'Nier', 'Belial', 'Beelzebub', 'Lucilius', 'Avatar Belial', '2B', 'Meg'],
};

const EX_CHARACTERS = ['Narmaya', 'Gran', 'Djeeta'];

export const CharacterGrid: React.FC = () => {
  const { exModeEnabled, toggleExMode } = useAppContext();
  const navigate = useNavigate();

  const handleCharacterClick = (character: string) => {
    const charName = exModeEnabled && EX_CHARACTERS.includes(character) 
      ? `${character}_ex` 
      : character;
    navigate(`character/${charName}`);
  };

  const isCharacterDisabled = (character: string) => {
    return exModeEnabled && !EX_CHARACTERS.includes(character);
  };

  const getCharacterImage = (character: string) => {
    const charName = exModeEnabled && EX_CHARACTERS.includes(character)
      ? `${character}_ex`
      : character;
    return `/lyrias-notes/img/character_select/${character}.webp`;
  };

  const getExToggleImage = () => {
    return exModeEnabled 
      ? '/lyrias-notes/ex-on.png' 
      : '/lyrias-notes/ex-off.png';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-8">
      <h1>Lyria's Notes</h1>
      <h3>Click on a character card to start adding your notes</h3>
      {/* EX Toggle Button */}
      <button
        onClick={toggleExMode}
        className="mb-4 transition-opacity hover:opacity-80 flex justify-center"
        style={{ width: '216px' }}
      >
        <img src={getExToggleImage()} alt="EX Mode Toggle" style={{
          height: 27,
          width: 44
        }} />
      </button>

      {/* Character Grid */}
      <div className="flex flex-col gap-2">
        {/* Rows 1-3 (10 characters each) */}
        {[CHARACTERS.row1, CHARACTERS.row2, CHARACTERS.row3].map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-2">
            {row.map((character) => (
              <CharacterCard
                key={character}
                name={character}
                imagePath={getCharacterImage(character)}
                isDisabled={isCharacterDisabled(character)}
                onClick={() => handleCharacterClick(character)}
              />
            ))}
          </div>
        ))}

        {/* Row 4 (9 characters, centered) */}
        <div className="flex gap-1 justify-center" style={{ marginLeft: '54px', marginRight: '54px' }}>
          {CHARACTERS.row4.map((character) => (
            <CharacterCard
              key={character}
              name={character}
              imagePath={getCharacterImage(character)}
              isDisabled={isCharacterDisabled(character)}
              onClick={() => handleCharacterClick(character)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
