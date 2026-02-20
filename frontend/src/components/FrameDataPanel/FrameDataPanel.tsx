import React, { useEffect, useState } from 'react';
import { FrameData } from '../../types';

interface FrameDataPanelProps {
  characterName: string;
}

interface Move {
  name: string;
  imageUrl: string;
  frameData: {
    startup?: string;
    active?: string;
    recovery?: string;
    onBlock?: string;
    onHit?: string;
    invuln?: string;
    damage?: string;
    guard?: string;
    [key: string]: string | undefined;
  };
}

const FrameDataPanel: React.FC<FrameDataPanelProps> = ({ characterName }) => {
  const [characterPortrait, setCharacterPortrait] = useState<string>('');
  const [moves, setMoves] = useState<Move[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFrameData();
  }, [characterName]);

  const loadFrameData = async () => {
    setLoading(true);
    setError(null);

    try {
      // TODO: Implement actual frame data fetching from backend
      // For now, using mock data
      
      // Set character portrait
      const portraitPath = `/img/characters/${characterName}.png`;
      setCharacterPortrait(portraitPath);

      // Mock move data - will be replaced with actual Dustloop scraping
      const mockMoves: Move[] = [
        {
          name: '5L',
          imageUrl: `/src/assets/moves/${characterName}/5L.png`,
          frameData: {
            startup: '5',
            active: '3',
            recovery: '8',
            onBlock: '-2',
            onHit: '+1',
            damage: '400',
            guard: 'All',
          },
        },
        {
          name: '5M',
          imageUrl: `/src/assets/moves/${characterName}/5M.png`,
          frameData: {
            startup: '7',
            active: '4',
            recovery: '12',
            onBlock: '-4',
            onHit: '+2',
            damage: '700',
            guard: 'All',
          },
        },
        {
          name: '5H',
          imageUrl: `/src/assets/moves/${characterName}/5H.png`,
          frameData: {
            startup: '12',
            active: '5',
            recovery: '18',
            onBlock: '-8',
            onHit: 'KD',
            damage: '1200',
            guard: 'All',
          },
        },
        {
          name: '236L',
          imageUrl: `/src/assets/moves/${characterName}/236L.png`,
          frameData: {
            startup: '15',
            active: '6',
            recovery: '22',
            onBlock: '-12',
            onHit: 'KD',
            damage: '1500',
            guard: 'All',
            invuln: '1-5 Strike',
          },
        },
      ];

      setMoves(mockMoves);
    } catch (err) {
      setError('Failed to load frame data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadFrameData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading frame data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white overflow-y-auto">
      {/* Header with character name and refresh button */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold capitalize">{characterName} Frame Data</h2>
          <button
            onClick={handleRefresh}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded flex items-center gap-1"
            title="Refresh frame data from Dustloop"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Character Portrait */}
      {characterPortrait && (
        <div className="p-4 border-b border-gray-200">
          <img
            src={characterPortrait}
            alt={characterName}
            className="w-full max-w-xs mx-auto rounded shadow-md"
            onError={(e) => {
              // Hide image if it fails to load
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Moves List */}
      <div className="p-4 space-y-6">
        {moves.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No frame data available for this character.</p>
            <p className="text-sm mt-2">Frame data will be scraped from Dustloop Wiki.</p>
          </div>
        ) : (
          moves.map((move, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              {/* Move Name */}
              <h3 className="text-lg font-bold mb-3">{move.name}</h3>

              {/* Move Image */}
              {move.imageUrl && (
                <div className="mb-3">
                  <img
                    src={move.imageUrl}
                    alt={move.name}
                    className="w-full rounded border border-gray-300"
                    onError={(e) => {
                      // Hide image if it fails to load
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Frame Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-3 py-2 text-left font-semibold">Property</th>
                      <th className="px-3 py-2 text-left font-semibold">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(move.frameData).map(([key, value]) => {
                      if (!value) return null;
                      return (
                        <tr key={key} className="border-t border-gray-200">
                          <td className="px-3 py-2 capitalize font-medium text-gray-700">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </td>
                          <td className="px-3 py-2 font-mono">
                            {value}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Note */}
      <div className="p-4 text-xs text-gray-500 border-t border-gray-200">
        <p>Frame data sourced from Dustloop Wiki</p>
        <p className="mt-1">
          Visit{' '}
          <a
            href={`https://dustloop.com/w/GBVSR/${characterName}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            dustloop.com
          </a>
          {' '}for complete information
        </p>
      </div>
    </div>
  );
};

export default FrameDataPanel;
