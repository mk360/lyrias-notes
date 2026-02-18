import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { CharacterCard } from './CharacterCard';

const CHARACTERS = {
  row1: ['zeta', 'vaseraga', 'beatrix', 'eustace', 'anre', 'seox', 'lancelot', 'vane', 'percival', 'siegfried'],
  row2: ['versusia', 'zooey', 'ladiva', 'narmaya', 'gran', 'djeeta', 'charlotta', 'ferry', 'anila', 'vikala'],
  row3: ['galleon', 'grimnir', 'metera', 'lowain', 'katalina', 'vira', 'yuel', 'soriz', 'cagliostro', 'wilnas'],
  row4: ['ilsa', 'sandalphon', 'nier', 'belial', 'beelzebub', 'lucilius', 'avatar belial', '2B', 'meg'],
};

const EX_CHARACTERS = ['narmaya', 'gran', 'djeeta'];

export const CharacterGrid: React.FC = () => {
  const { exModeEnabled, toggleExMode } = useAppContext();
  const navigate = useNavigate();

  const handleCharacterClick = (character: string) => {
    const charName = exModeEnabled && EX_CHARACTERS.includes(character) 
      ? `${character}_ex` 
      : character;
    navigate(`/character/${charName}`);
  };

  const isCharacterDisabled = (character: string) => {
    return exModeEnabled && !EX_CHARACTERS.includes(character);
  };

  const getCharacterImage = (character: string) => {
    return `/src/assets/character_select/${character}.png`;
  };

  const getExToggleImage = () => {
    return exModeEnabled 
      ? '/src/assets/ex_toggle_on.png' 
      : '/src/assets/ex_toggle_off.png';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-8">
      {/* EX Toggle Button */}
      <button
        onClick={toggleExMode}
        className="mb-8 transition-opacity hover:opacity-80"
        style={{ width: '216px' }}
      >
        <img src={getExToggleImage()} alt="EX Mode Toggle" className="w-full h-auto" />
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
        <div className="flex gap-2 justify-center" style={{ marginLeft: '54px', marginRight: '54px' }}>
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
