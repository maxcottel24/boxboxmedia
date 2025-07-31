import React from 'react';
import { Season } from '../App';

interface SeasonSelectorProps {
  currentSeason: Season;
  onSeasonChange: (season: Season) => void;
  disabled?: boolean;
}

const SeasonSelector: React.FC<SeasonSelectorProps> = ({ 
  currentSeason, 
  onSeasonChange, 
  disabled = false 
}) => {
  const seasons: { value: Season; label: string; status: string }[] = [
    { value: '2025', label: '2025 Season', status: 'Completed' },
    { value: '2026', label: '2026 Season', status: 'Completed' },
    { value: '2027', label: '2027 Season', status: 'In Progress' },
  ];

  if (disabled) {
    return (
      <div className="text-center">
        <h3 className="text-xl font-bold text-white mb-2">All-Time Records</h3>
        <p className="text-gray-400 text-sm">Hall of Fame encompasses all seasons</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Select Season</h3>
      <div className="space-y-2">
        {seasons.map((season) => (
          <button
            key={season.value}
            onClick={() => onSeasonChange(season.value)}
            className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
              currentSeason === season.value
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/25'
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <div className="font-medium">{season.label}</div>
            <div className="text-sm opacity-75">{season.status}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SeasonSelector;