import React from 'react';

interface CharacterCardProps {
  name: string;
  imagePath: string;
  isDisabled: boolean;
  onClick: () => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  name,
  imagePath,
  isDisabled,
  onClick,
}) => {
  return (
    <button
      className={`relative overflow-hidden transition-all duration-200 hover:scale-105 ${
        isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
      }`}
      onClick={onClick}
      disabled={isDisabled}
      style={{ width: '54px', height: '146px' }}
    >
      <img
        src={imagePath}
        alt={name}
        className="w-full h-full object-cover"
      />
      {isDisabled && (
        <div
          className="absolute inset-0 bg-black pointer-events-none"
          style={{ opacity: 0.6 }}
        />
      )}
    </button>
  );
};
