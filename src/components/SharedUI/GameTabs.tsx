import React from 'react';

interface GameTabsProps {
  selected: string;
  onSelect: (game: string) => void;
  games: string[];
}

const GameTabs: React.FC<GameTabsProps> = ({ selected, onSelect, games }) => {
  return (
    <div className="flex gap-2 bg-gray-100 p-2 rounded-lg">
      {games.map((game) => (
        <button
          key={game}
          className={`px-4 py-2 rounded-lg font-medium ${
            selected === game ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 border'
          }`}
          onClick={() => onSelect(game)}
        >
          {game}
        </button>
      ))}
    </div>
  );
};

export default GameTabs;
